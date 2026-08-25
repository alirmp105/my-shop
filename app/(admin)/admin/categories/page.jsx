
"use client";
import React, { useEffect, useState } from "react";
import { PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GeneralError from "@/components/GeneralError";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getCategories();
  }, [refreshKey]);

  const getCategories = async () => {
    setLoading(true); // ✅ true
    setError(null);
    
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("خطا در دریافت دسته بندی ها");
      }

      const data = await response.json();
      setCategories(data);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);

    try {
      // ✅ بک‌تیک درست
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete category");
      }

      toast.success("دسته بندی حذف شد", { position: "top-center" });
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      setError(error.message);
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

      {loading ? (
      <div className="flex justify-center ">
         درحال بارگذاری...
         <Spinner  className="size-7" />
        
      </div>
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>شناسه</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>
                تصویر
              </TableHead>
              
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((Category) => (
              <TableRow key={Category._id || Category.id}>
                <TableCell className="font-medium">
                  {Category.id.slice(20,24)}
                </TableCell>
                <TableCell>{Category.name}</TableCell>
                <TableCell>
                  <Image src={Category.image} alt={Category.name} width={40} height={40} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline">
                    <Link href={`/admin/categories/${Category._id || Category.id}/edit`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="cursor-pointer mx-3"
                    onClick={() => handleDelete(Category._id || Category.id)}
                    disabled={deletingId === (Category._id || Category.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Category;