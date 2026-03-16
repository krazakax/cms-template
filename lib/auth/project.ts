import { ProjectMembership } from "@/types";

export function getCurrentProject(memberships: ProjectMembership[]) {
  return memberships[0] ?? null;
}
