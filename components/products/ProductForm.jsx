"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Loader2, Plus, Save, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { productSchema } from "@/schemas/ProductSchema";

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
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createSlug = (text) => {
  return text.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
};

const ProductForm = ({ mode, product, categories = [], brands = [] }) => {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // تصاویر
  // ==========================================

  const [images, setImages] = useState([]);

  // ==========================================
  // React Hook Form
  // ==========================================

  const form = useForm({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      category: product?.category?._id || "",
      brand: product?.brand?._id || "",
      specifications: product?.specifications ?? [],
    },
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  // ==========================================
  // Edit → تصاویر قبلی
  // ==========================================

  useEffect(() => {
    if (!isEdit || !product?.images) {
      return;
    }

    const existingImages = product.images.map((image, index) => ({
      id: `existing-${index}-${image.url}`,

      type: "existing",

      url: image.url,

      preview: image.url,

      isPrimary: image.isPrimary,

      file: null,
    }));

    setImages(existingImages);
  }, [isEdit, product]);

  // ==========================================
  // Create → Slug خودکار
  // Edit → slug حفظ می‌شود
  // ==========================================

  const productName = form.watch("name");

  useEffect(() => {
    if (!isEdit) {
      form.setValue("slug", createSlug(productName || ""));
    }
  }, [productName, isEdit, form]);

  // ==========================================
  // انتخاب تصویر
  // ==========================================

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),

      type: "new",

      file,

      url: null,

      preview: URL.createObjectURL(file),

      isPrimary: false,
    }));

    setImages((prev) => {
      const combined = [...prev, ...newImages];

      // اگر هیچ Primary وجود ندارد
      // اولین تصویر Primary شود

      if (!combined.some((image) => image.isPrimary)) {
        combined[0] = {
          ...combined[0],
          isPrimary: true,
        };
      }

      return combined;
    });

    // اجازه انتخاب مجدد همان فایل
    event.target.value = "";
  };

  // ==========================================
  // حذف تصویر
  // ==========================================

  const removeImage = (id) => {
    setImages((prev) => {
      const removedImage = prev.find((image) => image.id === id);

      const remaining = prev.filter((image) => image.id !== id);

      // اگر Primary حذف شد
      // اولین تصویر باقی‌مانده Primary شود

      if (removedImage?.isPrimary && remaining.length > 0) {
        remaining[0] = {
          ...remaining[0],
          isPrimary: true,
        };
      }

      return remaining;
    });
  };

  // ==========================================
  // انتخاب Primary
  // ==========================================

  const setPrimaryImage = (id) => {
    setImages((prev) =>
      prev.map((image) => ({
        ...image,

        isPrimary: image.id === id,
      })),
    );
  };

  // ==========================================
  // Submit
  // ==========================================

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      // --------------------------------------
      // بررسی تصاویر
      // --------------------------------------

      if (images.length === 0) {
        setServerError("حداقل یک تصویر برای محصول انتخاب کنید.");

        setIsSubmitting(false);
        return;
      }

      const primaryCount = images.filter((image) => image.isPrimary).length;

      if (primaryCount !== 1) {
        setServerError("محصول باید دقیقاً یک تصویر اصلی داشته باشد.");

        setIsSubmitting(false);
        return;
      }

      // ======================================
      // FormData
      // ======================================

      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("slug", data.slug);

      formData.append("description", data.description || "");

      formData.append("price", data.price);

      formData.append("stock", data.stock);

      formData.append("category", data.category);

      if (data.brand) {
        formData.append("brand", data.brand);
      }
      formData.append(
        "specifications",
        JSON.stringify(data.specifications ?? []),
      );

      // ======================================
      // Manifest تصاویر
      // ======================================

      const imageManifest = [];

      let fileIndex = 0;

      for (const image of images) {
        // ------------------------------------
        // تصویر قبلی
        // ------------------------------------

        if (image.type === "existing") {
          imageManifest.push({
            id: image.id,

            type: "existing",

            url: image.url,

            isPrimary: image.isPrimary,
          });

          continue;
        }

        // ------------------------------------
        // تصویر جدید
        // ------------------------------------

        if (image.type === "new" && image.file) {
          formData.append("images", image.file);

          imageManifest.push({
            id: image.id,

            type: "new",

            fileIndex,

            isPrimary: image.isPrimary,
          });

          fileIndex++;
        }
      }

      formData.append("imageManifest", JSON.stringify(imageManifest));

      // ======================================
      // Request
      // ======================================

      const url = isEdit ? `/api/products/${product._id}` : "/api/products";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,

        // مهم:
        // Content-Type را دستی قرار نده
        body: formData,
      });

      const result = await res.json();

      // ======================================
      // Success
      // ======================================

      if (res.ok) {
        toast.success(
          isEdit ? "محصول با موفقیت ویرایش شد" : "محصول با موفقیت ایجاد شد",
          {
            position: "top-center",
          },
        );

        router.push("/admin/products");

        return;
      }

      // ======================================
      // Error
      // ======================================

      setServerError(result.message || "خطایی رخ داد.");
    } catch (error) {
      console.error(error);

      setServerError("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center">
          {isEdit ? "ویرایش محصول" : "محصول جدید"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ============================= */}
            {/* Name */}
            {/* ============================= */}

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>نام محصول :</FieldLabel>

                  <Input {...field} placeholder="نام محصول" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Slug */}
            {/* ============================= */}

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Slug :</FieldLabel>

                  <Input {...field} dir="rtl" />

                  <p className="text-xs text-muted-foreground">
                    {isEdit
                      ? "Slug قبلی حفظ شده و در صورت نیاز قابل تغییر است."
                      : "Slug به صورت خودکار ساخته می‌شود."}
                  </p>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Description */}
            {/* ============================= */}

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>توضیحات :</FieldLabel>

                  <Textarea {...field} rows={5} placeholder="توضیحات محصول" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Price */}
            {/* ============================= */}

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>قیمت :</FieldLabel>

                  <Input {...field} type="number" min="1" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Stock */}
            {/* ============================= */}

            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>موجودی :</FieldLabel>

                  <Input {...field} type="number" min="0" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Category */}
            {/* ============================= */}

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>دسته‌بندی :</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.nameFa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Brand */}
            {/* ============================= */}

            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>برند :</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="انتخاب برند (اختیاری)" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="">بدون برند</SelectItem>

                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.nameFa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ============================= */}
            {/* Images */}
            {/* ============================= */}

            <Field>
              <FieldLabel>تصاویر محصول :</FieldLabel>

              <Input
                id="product-images-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImagesChange}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  document.getElementById("product-images-input")?.click()
                }
              >
                <Plus size={18} />
                افزودن تصاویر
              </Button>

              <p className="text-xs text-muted-foreground">
                JPG، PNG و WebP — حداکثر 5MB
              </p>

              {/* =========================== */}
              {/* Preview */}
              {/* =========================== */}

              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`
                          border
                          rounded-lg
                          p-3
                          ${image.isPrimary ? "border-primary" : ""}
                        `}
                    >
                      <img
                        src={image.preview}
                        alt="تصویر محصول"
                        className="
                            w-full
                            h-40
                            object-cover
                            rounded-md
                          "
                      />

                      <div className="flex gap-2 mt-3">
                        <Button
                          type="button"
                          variant={image.isPrimary ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setPrimaryImage(image.id)}
                        >
                          <Star
                            size={16}
                            className={image.isPrimary ? "fill-current" : ""}
                          />

                          {image.isPrimary ? "تصویر اصلی" : "تصویر اصلی شود"}
                        </Button>

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 size={17} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Field>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">مشخصات محصول</h3>
                  <p className="text-sm text-muted-foreground">
                    مشخصات فنی محصول را اضافه کنید.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendSpecification({
                      key: "",
                      value: "",
                    })
                  }
                >
                  <Plus className="size-4" />
                  افزودن مشخصات
                </Button>
              </div>

              {specificationFields.length > 0 && (
                <div className="space-y-3">
                  {specificationFields.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Controller
                        control={form.control}
                        name={`specifications.${index}.key`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>نام مشخصه</FieldLabel>

                            <Input {...field} placeholder="مثلاً حافظه داخلی" />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name={`specifications.${index}.value`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>مقدار</FieldLabel>

                            <Input
                              {...field}
                              placeholder="مثلاً 256 گیگابایت"
                            />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeSpecification(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ============================= */}
            {/* Server Error */}
            {/* ============================= */}

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => form.reset()}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}

            {isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
