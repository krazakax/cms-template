"use client";

import { UseFormRegister, FieldValues, UseFormWatch } from "react-hook-form";
import { TemplateField } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SchemaFieldRenderer({ fields, register, parentKey = "", watch }: { fields: TemplateField[]; register: UseFormRegister<FieldValues>; parentKey?: string; watch: UseFormWatch<FieldValues>; }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const key = parentKey ? `${parentKey}.${field.key}` : field.key;
        if (field.type === "object" && field.fields) {
          return <div key={key} className="rounded border p-3"><h4 className="mb-2 font-medium">{field.label}</h4><SchemaFieldRenderer fields={field.fields} register={register} parentKey={key} watch={watch} /></div>;
        }
        if (field.type === "repeater" && field.fields) {
          return <div key={key} className="rounded border p-3 text-sm text-muted-foreground">Repeater editing is structured. Add/remove rows with future enhancement controls for safer content operations.</div>;
        }
        return (
          <label key={key} className="block space-y-1">
            <span className="text-sm font-medium">{field.label}</span>
            {field.type === "textarea" ? <Textarea {...register(key)} /> : field.type === "boolean" ? <input type="checkbox" {...register(key)} className="h-4 w-4" /> : <Input type={field.type === "number" ? "number" : "text"} {...register(key)} />}
          </label>
        );
      })}
    </div>
  );
}
