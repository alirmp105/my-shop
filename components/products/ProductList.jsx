"use client";
import React, { useState } from "react";
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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GeneralError from "@/components/shared/GeneralError";
import Link from "next/link";
import { toast } from "sonner";
import { PlusIcon ,ChevronDownIcon,ChevronUpIcon} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatToman } from "@/lib/utils";

function ProductCard({ product, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Image
          width={56}
          height={56}
          src={product.primaryImage}
          alt={product.name}
          className="size-14 shrink-0 rounded-lg border object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold">{product.name}</h3>
          <p className="mt-0.5 text-sm font-semibold text-primary">
            {formatToman(product.price)} تومان
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>موجودی: {product.stock}</span>
            <span>دسته: {product.category.nameFa}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">شناسه</span>
            <span className="font-mono text-xs">{product._id.slice(20, 24)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">برند</span>
            <span>{product.brand?.nameFa ?? "بدون برند"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">توضیحات</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">نمایش ...</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>توضیحات</DialogTitle>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                  <p>{product.description}</p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">بستن</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <Link href={`/admin/products/${product._id}/edit`}>
              <PencilIcon className="size-4" />
            </Link>
          </Button>
          <Button size="icon" variant="destructive" onClick={() => onDelete(product._id)}>
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const ProductList = ({ products }) => {
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();


  const handleDelete = async (id) => {
    // const confirmed = window.confirm('are you sure ? ')
    // const confirmed = {}

    //  if (!confirmed) return;

    setError("");
    setDeletingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "محصول حذف نشد !");
      }

      router.refresh();
      toast.success("محصول با موفقیت حذف شد", { position: "top-center" });
    } catch (error) {
      setError(error.message);                                  
    } finally {
      setDeletingId(null);
    }
  };

  const primaryImage = () => {
    products;
  };

  return (
    <div>
      {error && <GeneralError error={error} />}
      
    
      

      <Button className="my-4">
        <Link href="/admin/products/add">افزودن محصول</Link>
        <PlusIcon />
      </Button>

       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} onDelete={handleDelete} />
      ))}
    </div>
      
    <div className="hidden overflow-x-auto md:block">

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>توضیحات</TableHead>
            {/* <TableHead>slug</TableHead> */}

            <TableHead>قیمت</TableHead>
            <TableHead>موجودی</TableHead>
            <TableHead>
              عکس اصلی
            </TableHead>
            <TableHead >دسته بندی</TableHead>
            <TableHead>برند</TableHead>
            <TableHead >عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product, index) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium">
                {product._id.slice(20, 24)}
              </TableCell>
              <TableCell className="truncate max-w-3">{product.name}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">نمایش ...</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>توضیحات</DialogTitle>
                    </DialogHeader>
                    <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                      <p>{product.description}</p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">بستن</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              {/* <TableCell>{product.slug}</TableCell> */}
              <TableCell>{formatToman(product.price)} تومان</TableCell>
              <TableCell>{product.stock}</TableCell>

              <TableCell>
                <Image
                  width={50}
                  height={50}
                  src={product.primaryImage}
                  alt={product.name}
                  className="mx-auto"
                />
                {/* {product.image.length > 1 && (
                  <Button>
                    نمایش دیگر تصاویر
                  </Button>
                )} */}

                {/* {product.nameFa} */}
              </TableCell>
              <TableCell >{product.category.nameFa}</TableCell>
              <TableCell>{product.brand?.nameFa ?? "بدون برند"}</TableCell>

              <TableCell>
                <Button asChild variant="outline">
                  <Link href={`/admin/products/${product._id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer mx-3"
                  onClick={() => handleDelete(product._id)}
                  // disabled={deletingId === (product._id || product.id)}
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

export default ProductList;
