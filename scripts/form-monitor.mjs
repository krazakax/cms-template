import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

const requiredEnv = ['FORM_CHECK_CRON', 'FORM_CHECK_EMAIL_FROM', 'FORM_CHECK_EMAIL_TO'];

const cwd = process.cwd();
const sitesConfigPath = process.env.FORM_CHECK_SITES_PATH
  ? path.resolve(cwd, process.env.FORM_CHECK_SITES_PATH)
  : path.resolve(cwd, 'scripts/form-sites.json');

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  const hasSmtpUrl = Boolean(process.env.FORM_CHECK_SMTP_URL);
  const hasSmtpParts =
    Boolean(process.env.FORM_CHECK_SMTP_HOST) &&
    Boolean(process.env.FORM_CHECK_SMTP_PORT) &&
    Boolean(process.env.FORM_CHECK_SMTP_USER) &&
    Boolean(process.env.FORM_CHECK_SMTP_PASS);

  if (!hasSmtpUrl && !hasSmtpParts) {
    missing.push(
      'FORM_CHECK_SMTP_URL or FORM_CHECK_SMTP_HOST/FORM_CHECK_SMTP_PORT/FORM_CHECK_SMTP_USER/FORM_CHECK_SMTP_PASS'
    );
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function loadSitesConfig() {
  const raw = await fs.readFile(sitesConfigPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.sites) || parsed.sites.length === 0) {
    throw new Error(`No sites found in config: ${sitesConfigPath}`);
  }

  return parsed.sites;
}

function createTransporter() {
  if (process.env.FORM_CHECK_SMTP_URL) {
    return nodemailer.createTransport(process.env.FORM_CHECK_SMTP_URL);
  }

  return nodemailer.createTransport({
    host: process.env.FORM_CHECK_SMTP_HOST,
    port: Number(process.env.FORM_CHECK_SMTP_PORT),
    secure: String(process.env.FORM_CHECK_SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.FORM_CHECK_SMTP_USER,
      pass: process.env.FORM_CHECK_SMTP_PASS,
    },
  });
}

function buildHtmlReport(results, startedAt, finishedAt) {
  const rows = results
    .map((result) => {
      const status = result.ok ? 'PASS ✅' : 'FAIL ❌';
      const error = result.error ? `<pre>${result.error}</pre>` : '';
      return `<tr>
        <td>${result.name}</td>
        <td>${result.url}</td>
        <td>${status}</td>
        <td>${result.durationMs}ms</td>
        <td>${error}</td>
      </tr>`;
    })
    .join('');

  return `
    <h2>Automated Form Check Report</h2>
    <p><strong>Started:</strong> ${startedAt.toISOString()}</p>
    <p><strong>Finished:</strong> ${finishedAt.toISOString()}</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Site</th>
          <th>URL</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function runSiteCheck(browser, site) {
  const started = Date.now();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(site.url, {
      waitUntil: site.waitUntil || 'networkidle',
      timeout: site.navigationTimeoutMs ?? 45_000,
    });

    for (const step of site.steps || []) {
      if (!step.action || !step.selector) {
        throw new Error(`Each step requires action + selector for site '${site.name}'`);
      }

      if (step.action === 'fill') {
        await page.fill(step.selector, step.value ?? '');
      } else if (step.action === 'click') {
        await page.click(step.selector);
      } else if (step.action === 'check') {
        await page.check(step.selector);
      } else if (step.action === 'waitForSelector') {
        await page.waitForSelector(step.selector, { timeout: step.timeoutMs ?? 15_000 });
      } else {
        throw new Error(`Unsupported action '${step.action}' for site '${site.name}'`);
      }
    }

    if (!site.successSelector) {
      throw new Error(`Missing successSelector for site '${site.name}'`);
    }

    await page.waitForSelector(site.successSelector, {
      timeout: site.successTimeoutMs ?? 20_000,
    });

    await context.close();
    return {
      ok: true,
      name: site.name,
      url: site.url,
      durationMs: Date.now() - started,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await context.close();
    return {
      ok: false,
      name: site.name,
      url: site.url,
      durationMs: Date.now() - started,
      error: message,
    };
  }
}

async function runChecksOnce() {
  const startedAt = new Date();
  const sites = await loadSitesConfig();
  const browser = await chromium.launch({ headless: true });

  try {
    const results = [];
    for (const site of sites) {
      const result = await runSiteCheck(browser, site);
      results.push(result);
    }

    const finishedAt = new Date();
    const hasFailures = results.some((result) => !result.ok);
    const transporter = createTransporter();

    const subjectPrefix = hasFailures ? 'FAIL' : 'PASS';
    const subject = `[${subjectPrefix}] Form checks (${finishedAt.toISOString()})`;

    await transporter.sendMail({
      from: process.env.FORM_CHECK_EMAIL_FROM,
      to: process.env.FORM_CHECK_EMAIL_TO,
      subject,
      html: buildHtmlReport(results, startedAt, finishedAt),
      text: results
        .map((result) => {
          const status = result.ok ? 'PASS' : 'FAIL';
          const err = result.error ? ` | error: ${result.error}` : '';
          return `${status} | ${result.name} | ${result.url} | ${result.durationMs}ms${err}`;
        })
        .join('\n'),
    });

    console.log(subject);
    for (const result of results) {
      console.log(`${result.ok ? 'PASS' : 'FAIL'}: ${result.name} (${result.url})`);
    }
  } finally {
    await browser.close();
  }
}

async function start() {
  validateEnv();

  const cronExpr = process.env.FORM_CHECK_CRON;
  if (!cron.validate(cronExpr)) {
    throw new Error(`Invalid cron expression: ${cronExpr}`);
  }

  if (String(process.env.FORM_CHECK_RUN_ON_START).toLowerCase() === 'true') {
    await runChecksOnce();
  }

  cron.schedule(cronExpr, async () => {
    try {
      await runChecksOnce();
    } catch (error) {
      console.error('Scheduled form check failed to execute:', error);
    }
  });

  console.log(`Form monitor scheduled with cron: ${cronExpr}`);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
