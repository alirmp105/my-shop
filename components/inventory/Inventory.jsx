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
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function InventoryCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">دسته‌بندی: {product.category}</p>
        </div>
        <StockStatus stock={product.stock} />
      </div>

      {showDetails && (
        <div className="mt-3 border-t pt-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">شناسه</span>
            <span className="font-mono text-xs">{product._id.slice(20, 24)}</span>
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
        <InventoryEditDialog product={product} />
      </div>
    </div>
  );
}

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {products?.map((product) => (
          <InventoryCard key={product._id} product={product} />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[760px] table-auto">
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
              <TableCell className="max-w-[280px] truncate">{product.name}</TableCell>
             
             
              <TableCell>
                <StockStatus stock={product.stock} />
              </TableCell>

              <TableCell className="max-w-[220px] truncate">{product.category}</TableCell>

              <TableCell>
                <InventoryEditDialog product={product}  />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default Inventory;
