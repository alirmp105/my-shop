"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { categoryCreateSchema, categoryUpdateSchema } from "@/schemas/categorySchema";

const createSlug = (text) => text.trim().replace(/\s+/g, "-");

const CategoryForm = ({ mode = "create", category }) => {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(category?.image || "");

  const form = useForm({
    resolver: zodResolver(isEdit ? categoryUpdateSchema : categoryCreateSchema),
    defaultValues: {
      nameFa: category?.nameFa ?? "",
      nameEn: category?.nameEn ?? "",
      slug: category?.slug ?? "",
      image: undefined,
      isActive: category?.isActive ?? true,
    },
  });

  const nameEn = form.watch("nameEn");

  useEffect(() => {
    if (!isEdit) {
      form.setValue("slug", createSlug(nameEn || ""));
    }
  }, [form, isEdit, nameEn]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nameFa", data.nameFa);
      formData.append("nameEn", data.nameEn);
      formData.append("isActive", String(data.isActive));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const url = isEdit ? `/api/categories/${category._id}` : "/api/categories";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "خطایی رخ داد، لطفاً دوباره تلاش کنید");
        return;
      }

      toast.success(isEdit ? "دسته بندی ویرایش شد" : "دسته بندی ایجاد شد", {
        position: "top-center",
      });
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error(error);
      setServerError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full sm:max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center">
          {isEdit ? "ویرایش دسته بندی" : "دسته بندی جدید"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="nameFa"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>نام به فارسی</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="nameEn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>نام به انگلیسی</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} dir="ltr" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...field} readOnly dir="ltr" className="text-left" />
                </Field>
              )}
            />
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <FieldLabel>فعال</FieldLabel>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>تصویر دسته بندی</FieldLabel>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      field.onChange(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                  {imagePreview ? (
                    <div className="relative mt-3">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          field.onChange(undefined);
                          setImagePreview(isEdit ? category?.image || "" : "");
                        }}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
                      <ImagePlus className="mr-2" />
                      <span>تصویری انتخاب نشده</span>
                    </div>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setImagePreview(category?.image || "");
              setServerError("");
            }}
          >
            بازنشانی
          </Button>
          <Button type="submit" form="category-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit ? "ذخیره تغییرات" : "ایجاد دسته بندی"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default CategoryForm;
