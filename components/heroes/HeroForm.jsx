"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { heroCreateSchema, heroUpdateSchema } from "@/schemas/heroSchema";

const localDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function HeroForm({ mode = "create", hero }) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [preview, setPreview] = useState(hero?.image?.url || "");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(isEdit ? heroUpdateSchema : heroCreateSchema),
    defaultValues: {
      title: hero?.title || "", subtitle: hero?.subtitle || "",
      buttonText: hero?.button?.text || "", buttonHref: hero?.button?.href || "",
      order: hero?.order ?? 0, isActive: hero?.isActive ?? true,
      startAt: localDate(hero?.startAt), endAt: localDate(hero?.endAt), image: undefined,
    },
  });

  async function onSubmit(data) {
    setSubmitting(true); setServerError("");
    try {
      const body = new FormData();
      ["title", "subtitle", "buttonText", "buttonHref", "order"].forEach((key) => body.append(key, String(data[key] ?? "")));
      body.append("startAt", data.startAt ? new Date(data.startAt).toISOString() : "");
      body.append("endAt", data.endAt ? new Date(data.endAt).toISOString() : "");
      body.append("isActive", String(data.isActive));
      if (data.image instanceof File) body.append("image", data.image);
      const response = await fetch(isEdit ? `/api/heroes/${hero._id}` : "/api/heroes", { method: isEdit ? "PUT" : "POST", body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setServerError(result.message || "ذخیره‌سازی انجام نشد"); return; }
      toast.success(isEdit ? "اسلاید ویرایش شد" : "اسلاید ایجاد شد", { position: "top-center" });
      router.push("/admin/heroes"); router.refresh();
    } catch (error) { console.error(error); setServerError("ارتباط با سرور برقرار نشد"); }
    finally { setSubmitting(false); }
  }

  return <Card className="mx-auto mt-4 w-full max-w-2xl"><CardHeader><CardTitle className="text-center">{isEdit ? "ویرایش اسلاید" : "اسلاید جدید"}</CardTitle></CardHeader><CardContent>
    <form id="hero-form" onSubmit={form.handleSubmit(onSubmit)}><FieldGroup>
      {[["title", "عنوان"], ["subtitle", "زیرعنوان"], ["buttonText", "متن دکمه"], ["buttonHref", "لینک دکمه"]].map(([name, label]) => <Controller key={name} name={name} control={form.control} render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel>{label}</FieldLabel>{name === "subtitle" ? <Textarea {...field} rows={3} /> : <Input {...field} dir={name === "buttonHref" ? "ltr" : undefined} />}{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</Field>} />)}
      <div className="grid gap-4 sm:grid-cols-3"><Controller name="order" control={form.control} render={({ field, fieldState }) => <Field><FieldLabel>ترتیب</FieldLabel><Input type="number" min="0" {...field} />{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</Field>} /><Controller name="startAt" control={form.control} render={({ field }) => <Field><FieldLabel>شروع نمایش</FieldLabel><Input type="datetime-local" {...field} /></Field>} /><Controller name="endAt" control={form.control} render={({ field }) => <Field><FieldLabel>پایان نمایش</FieldLabel><Input type="datetime-local" {...field} /></Field>} /></div>
      <Controller name="isActive" control={form.control} render={({ field }) => <Field orientation="horizontal"><FieldLabel>فعال</FieldLabel><Switch checked={field.value} onCheckedChange={field.onChange} /></Field>} />
      <Controller name="image" control={form.control} render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel>تصویر Hero</FieldLabel><Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file) { field.onChange(file); setPreview(URL.createObjectURL(file)); } }} />{preview ? <div className="relative mt-3"><img src={preview} alt="Preview" className="h-56 w-full rounded-md object-cover" /><Button type="button" size="icon" variant="destructive" className="absolute right-2 top-2" onClick={() => { field.onChange(undefined); setPreview(""); }}><X /></Button></div> : <div className="flex h-32 items-center justify-center rounded-md border border-dashed"><ImagePlus className="mr-2" />تصویری انتخاب نشده</div>}{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</Field>} />
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
    </FieldGroup></form>
  </CardContent><CardFooter className="justify-end"><Button type="submit" form="hero-form" disabled={submitting}>{submitting ? <Loader2 className="animate-spin" /> : <Save />}{isEdit ? "ذخیره تغییرات" : "ایجاد اسلاید"}</Button></CardFooter></Card>;
}
