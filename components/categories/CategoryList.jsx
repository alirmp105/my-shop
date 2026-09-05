"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GeneralError from "@/components/shared/GeneralError";

function CategoryCard({ category, onDelete, deletingId }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Image
          className="size-14 shrink-0 rounded-lg border object-cover"
          src={category.image}
          alt={category.nameFa}
          width={56}
          height={56}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold">{category.nameFa}</h3>
          <p dir="ltr" className="mt-1 truncate text-xs text-muted-foreground">
            {category.nameEn || category.slug || "—"}
          </p>
          <p className={`mt-1 text-xs ${category.isActive ? "text-green-500" : "text-red-500"}`}>
            {category.isActive ? "فعال" : "غیرفعال"}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">شناسه</span>
            <span className="font-mono text-xs">{category._id.slice(20, 24)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Slug</span>
            <span dir="ltr" className="truncate">{category.slug}</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary"
        >
          {showDetails ? "بستن جزئیات" : "نمایش جزئیات بیشتر"}
          {showDetails ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
        </button>
        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="outline">
            <Link href={`/admin/categories/${category._id}/edit`}>
              <PencilIcon className="size-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(category._id)}
            disabled={deletingId === category._id}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const CategoryList = ({ categories }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);
    try {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "دسته بندی حذف نشد");
      toast.success("دسته بندی حذف شد", { position: "top-center" });
      router.refresh();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h4 className="text-4xl">دسته بندی ها</h4>
      {error && <GeneralError error={error} />}
      <Button className="my-3.5" asChild>
        <Link href="/admin/categories/add">
          دسته بندی جدید
          <Plus />
        </Link>
      </Button>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {categories?.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[980px] table-auto">
        <TableHeader>
          <TableRow >
            <TableHead >شناسه</TableHead>
            <TableHead >نام فارسی</TableHead>
            <TableHead>نام انگلیسی</TableHead>
            <TableHead >Slug</TableHead>
            <TableHead  >تصویر</TableHead>
            <TableHead  >وضعیت</TableHead>
            <TableHead >عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell className="font-medium">{category._id.slice(20, 24)}</TableCell>
              <TableCell className="max-w-[220px] truncate text-center" >{category.nameFa}</TableCell>
              <TableCell dir="ltr" className="max-w-[220px] truncate" >{category.nameEn || "—"}</TableCell>
              <TableCell dir="ltr" className="max-w-[220px] truncate" >{category.slug}</TableCell>
              <TableCell >
                <Image className="mx-auto" src={category.image} alt={category.nameFa} width={40} height={40} />
              </TableCell>
              <TableCell>{category.isActive ? "فعال" : "غیرفعال"}</TableCell>
              <TableCell>
                <Button asChild variant="outline">
                  <Link href={`/admin/categories/${category._id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer mx-3"
                  onClick={() => handleDelete(category._id)}
                  disabled={deletingId === category._id}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default CategoryList;
