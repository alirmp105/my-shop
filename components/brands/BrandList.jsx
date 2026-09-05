"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, Plus, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GeneralError from "@/components/shared/GeneralError";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";

function BrandCard({ brand, onDelete, deletingId }) {
  const [showDetails, setShowDetails] = useState(false);
  const id = brand._id;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Image
          src={brand.image}
          alt={brand.nameFa}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-lg border object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold">{brand.nameFa}</h3>
          <p dir="ltr" className="mt-1 truncate text-xs text-muted-foreground">
            {brand.nameEn || brand.slug || "—"}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">شناسه</span>
            <span className="font-mono text-xs">{id.slice(20, 24)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Slug</span>
            <span dir="ltr" className="truncate">{brand.slug || "—"}</span>
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
            <Link href={`/admin/brands/${id}/edit`}>
              <PencilIcon className="size-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(id)}
            disabled={deletingId === id}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const BrandList = ({ brands }) => {
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
      router.refresh();
    } catch (error) {
      setError("error from clirent ", error.message);
    } finally {
      setDeletingId(null);
    }
  };


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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {brands?.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[720px] table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام برند</TableHead>
            <TableHead>تصویر</TableHead>

            <TableHead >عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand) => (
            <TableRow key={brand._id || brand._id}>
              <TableCell className="font-medium">
                {brand._id.slice(20, 24)}
              </TableCell>
              <TableCell className="max-w-[240px] truncate">{brand.nameFa}</TableCell>
              <TableCell>
                <Image
                  src={brand.image}
                  alt={brand.nameFa}
                  width={40}
                  height={40}
                  className="mx-auto"
                />
              
              </TableCell>
              <TableCell>
                <Button asChild variant="outline">
                  <Link href={`/admin/brands/${brand._id || brand._id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer mx-3"
                  onClick={() => handleDelete(brand._id || brand._id)}
                  disabled={deletingId === (brand._id || brand._id)}
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

export default BrandList;
