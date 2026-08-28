"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Save, ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { brandCreateSchema, brandUpdateSchema } from "@/schemas/brandSchema";

const createSlug = (text) => {
  return text.trim().replace(/\s+/g, "-");
};

const BrandForm = ({ mode = "create", brand }) => {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreview, setImagePreview] = useState(brand?.image || "");

  const schema = isEdit ? brandUpdateSchema : brandCreateSchema;
  const form = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      nameFa: brand?.nameFa ?? "",
      nameEn: brand?.nameEn ?? "",
      slug: brand?.slug ?? "",
      image: undefined,
    },
  });

  const nameEn = form.watch("nameEn");
  // watch :
  // این یعنی فیلد نام را بخوان

  useEffect(() => {
    if (!isEdit) {
      form.setValue("slug", createSlug(nameEn));
      //setValue("slug", createSlug(name))
      // بر اساس اسناد دو ورودی میگیرد که ورودی اول اسم فیلد مد نظر است
    }
  }, [nameEn, isEdit, form]);
  //[name, isEdit, form]
  // why ont obly name?

  const handleImageChange = (file, onChange) => {
    if (!file) return;

    onChange(file);

    const previewUrl = URL.createObjectURL(file);
    // ??

    setImagePreview(previewUrl);
  };

  // حذف preview
  const removeImage = (onChange) => {
    onChange(undefined);
    setImagePreview("");
  };

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("nameFa", data.nameFa);
      formData.append("nameEn", data.nameEn);
      formData.append("slug", data.slug);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const url = isEdit ? `/api/brands/${brand._id}` : "/api/brands";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });
      console.log("res", res);

      const result = await res.json();

      if (!res.ok) {
        setServerError(
          result.message || "خطایی رخ داد، لطفاً دوباره تلاش کنید",
        );

        return;
      }

      if (res.status === 201) {
        toast.success("دسته بندی ایجاد شد", {
          position: "top-center",
        });
      }

      if (res.status === 200) {
        toast.success("دسته بندی ویرایش شد", {
          position: "top-center",
        });
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      console.error(error);

      setServerError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="w-full sm:max-w-md mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-center">
            {isEdit ? "ویرایش برتد" : "برند جدید"}
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
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="nameEn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>نام به انگلیسی</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="نام به انگلیسی"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* slug */}

              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Slug :</FieldLabel>

                    <Input
                      {...field}
                      readOnly
                      dir="ltr"
                      className="text-left"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* img */}

              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>تصویر برند :</FieldLabel>

                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        // const file = event.target.files?.[0]; ??
                        handleImageChange(file, field.onChange);
                      }}
                    />

                    {imagePreview && (
                      <div className="relative mt-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md"
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(field.onChange)}
                        >
                          <X />
                        </Button>
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
                        <ImagePlus className="mr-2" />
                        <span>تصویری انتخاب نشده</span>
                      </div>
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* SERVER ERROR */}

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
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
              Reset
            </Button>

            <Button type="submit" form="category-form" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}

              {isEdit ? "ذخیره تغییرات" : "ایجاد دسته بندی"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BrandForm;
