"use client";

import { UseFormRegister, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { TemplateField } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MediaOption = { id: string; file_url: string; alt_text: string | null };

export function SchemaFieldRenderer({
  fields,
  register,
  setValue,
  parentKey = "",
  watch,
  mediaOptions = [],
}: {
  fields: TemplateField[];
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  parentKey?: string;
  watch: UseFormWatch<FieldValues>;
  mediaOptions?: MediaOption[];
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const key = parentKey ? `${parentKey}.${field.key}` : field.key;
        if (field.type === "object" && field.fields) {
          return <div key={key} className="rounded border p-3"><h4 className="mb-2 font-medium">{field.label}</h4><SchemaFieldRenderer fields={field.fields} register={register} setValue={setValue} parentKey={key} watch={watch} mediaOptions={mediaOptions} /></div>;
        }
        if (field.type === "repeater" && field.fields) {
          return <div key={key} className="rounded border p-3 text-sm text-muted-foreground">Repeater editing is simplified in MVP. Use JSON text areas in template schema for list data.</div>;
        }

        const currentValue = watch(key);

        return (
          <label key={key} className="block space-y-1">
            <span className="text-sm font-medium">{field.label}</span>
            {field.type === "textarea" ? (
              <Textarea {...register(key)} />
            ) : field.type === "boolean" ? (
              <input type="checkbox" {...register(key)} className="h-4 w-4" />
            ) : field.type === "image" ? (
              <div className="space-y-2">
                <select
                  className="w-full rounded border px-2 py-2 text-sm"
                  value={String(currentValue ?? "")}
                  onChange={(e) => setValue(key, e.target.value)}
                >
                  <option value="">Select from media library</option>
                  {mediaOptions.map((media) => (
                    <option key={media.id} value={media.file_url}>{media.alt_text || media.file_url}</option>
                  ))}
                </select>
                <Input
                  placeholder="Or paste image URL"
                  value={String(currentValue ?? "")}
                  onChange={(e) => setValue(key, e.target.value)}
                />
                {currentValue ? <img src={String(currentValue)} alt={field.label} className="h-20 rounded border object-cover" /> : null}
              </div>
            ) : (
              <Input type={field.type === "number" ? "number" : "text"} {...register(key)} />
            )}
          </label>
        );
      })}
    </div>
  );
}
