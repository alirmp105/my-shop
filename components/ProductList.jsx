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
import GeneralError from "@/components/GeneralError";
import Link from "next/link";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatToman } from "@/lib/utils";

const ProductList = ({ products }) => {
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  console.log(products);

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
            <TableHead>دسته بندی</TableHead>
            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.id.slice(20, 24)}
              </TableCell>
              <TableCell className="line-clamp-1">{product.name}</TableCell>
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
                />
                {/* {product.image.length > 1 && (
                  <Button>
                    نمایش دیگر تصاویر
                  </Button>
                )} */}

                {/* {product.name} */}
              </TableCell>
              <TableCell>{product.category}</TableCell>

              <TableCell className="text-right">
                <Button asChild variant="outline">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <PencilIcon />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer mx-3"
                  onClick={() => handleDelete(product.id)}
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
  );
};

export default ProductList;
