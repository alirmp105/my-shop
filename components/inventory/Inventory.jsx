"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import GeneralError from "@/components/shared/GeneralError";



import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StockStatus from "@/components/inventory/StockStatus";
import InventoryEditDialog from "@/components/inventory/InventoryDialog";

const Inventory = ({ products }) => {
  const [error, setError] = useState(null);


  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "all";

  const handleStatusChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
  
    router.push(`
    /admin/inventory?${params.toString()}`
  );
  };
  
  

  return (
    <div>
      {error && <GeneralError error={error} />}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger >
          <SelectValue placeholder="وضعیت موجودی" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">همه محصولات</SelectItem>

          <SelectItem value="available">موجود</SelectItem>

          <SelectItem value="out">ناموجود</SelectItem>
        </SelectContent>
      </Select>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام محصول</TableHead>
            
            <TableHead>تعداد </TableHead>
            <TableHead>دسته بندی</TableHead>
            <TableHead>ویرایش موجودی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product._id}  >
              <TableCell className="font-medium">
                {product._id.slice(20, 24)}
              </TableCell>
              <TableCell className="truncate max-w-1">{product.name}</TableCell>
             
             
              <TableCell>
                <StockStatus stock={product.stock} />
              </TableCell>

              <TableCell>{product.category}</TableCell>

              <TableCell>
                <InventoryEditDialog product={product}  />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Inventory;
