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
import { useRouter } from "next/navigation";

const BrandList = ({brands}) => {

    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const router = useRouter();


  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);

    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete brand");
      }

      toast.success("برند حذف شد", { position: "top-center" });
      router.refresh()
    } catch (error) {
      setError("error from clirent ",error.message);
    } finally {
      setDeletingId(null);
    }
  };

  console.log("brands :", brands);

  return (
    <div>
      <h4 className="text-4xl">برند ها</h4>

      {/* {error && <GeneralError error={error} />} */}

      <Button className="my-3.5" asChild>
        <Link href="/admin/brands/add">
          برند جدید
          <Plus />
        </Link>
      </Button>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام برند</TableHead>
            <TableHead>تصویر</TableHead>

            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand) => (
            <TableRow key={brand._id || brand.id}>
              <TableCell className="font-medium">
                {brand.id.slice(20, 24)}
              </TableCell>
              <TableCell>{brand.nameFa}</TableCell>
              <TableCell>
                <Image
                  src={brand.image}
                  alt={brand.nameFa}
                  width={40}
                  height={40}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline">
                  <Link href={`/admin/brands/${brand._id || brand.id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer mx-3"
                  onClick={() => handleDelete(brand._id || brand.id)}
                  disabled={deletingId === (brand._id || brand.id)}
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

export default BrandList;
