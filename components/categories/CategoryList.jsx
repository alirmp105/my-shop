"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GeneralError from "@/components/shared/GeneralError";

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
      <Table className="table-fixed">
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
              <TableCell className="truncate max-w-1 text-center" >{category.nameFa}</TableCell>
              <TableCell  dir="ltr" className="truncate max-w-1" >{category.nameEn || "—"}</TableCell>
              <TableCell dir="ltr" className="truncate max-w-1" >{category.slug}</TableCell>
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
  );
};

export default CategoryList;
