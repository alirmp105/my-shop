"use client"
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronUpIcon, Pencil, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CouponCard({ coupon, formatExpireDate, onDelete, deletingId }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 dir="ltr" className="truncate text-sm font-bold">{coupon.code}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {coupon.type === "percentage" ? "درصدی" : "مبلغ ثابت"} · {coupon.value}
          </p>
        </div>
        <span className={`shrink-0 text-xs ${coupon.isActive ? "text-green-500" : "text-red-500"}`}>
          {coupon.isActive ? "فعال" : "غیرفعال"}
        </span>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">حداقل خرید</span><span>{coupon.minPurchase}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">حداکثر تخفیف</span><span>{coupon.maxDiscount}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">دفعات استفاده</span><span>{coupon.usedCount}</span></div>
          <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">تاریخ انقضا</span><span>{formatExpireDate(coupon.expiresAt)}</span></div>
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
            <Link href={`/admin/coupon/${coupon._id}/edit`}><Pencil className="size-4" /></Link>
          </Button>
          <Button size="icon" variant="destructive" onClick={() => onDelete(coupon._id)} disabled={deletingId === coupon._id}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const CouponList = ({ coupons }) => {


  const[error,setError] = useState(null)
  const[deletingId,setDeletingId] = useState(null)
  const router = useRouter()
  const formatExpireDate = (date) => {
    if (!date) return "بدون انقضا";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "تاریخ نامعتبر";
    }

    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(parsedDate);
  };

    const handleDelete = async (id) => {
      setError("");
      setDeletingId(id);
  
      try {
        const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
  
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to delete coupon");
        }
  
        toast.success("کد تخفیف حذف شد", { position: "top-center" });
        router.refresh();
      } catch (error) {
        setError("error from client ", error.message);
      } finally {
        setDeletingId(null);
      }
    };
  
  return (
    <div>
      <Link
        href="/admin/coupon/add"
        className="inline-flex gap-1 items-center rounded-md bg-black text-white py-1  px-2 my-4 text-sm"
      >
        افزودن کد
        <PlusIcon size="20" />
      </Link>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {coupons?.map((coupon) => (
          <CouponCard
            key={coupon._id}
            coupon={coupon}
            formatExpireDate={formatExpireDate}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[1100px] table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>کد تخفیف</TableHead>
            <TableHead>نوع تخفیف</TableHead>
            <TableHead>درصد / مبلغ</TableHead>

            <TableHead>حداقل</TableHead>
            <TableHead>حداکثر تخفیف</TableHead>
            <TableHead> دفعات استفاده </TableHead>
            <TableHead>تاریخ انقضا</TableHead>

            <TableHead>وضعیت</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons?.map((coupon) => (
            <TableRow key={coupon._id}>
              <TableCell dir="ltr" className="max-w-[180px] truncate">{coupon.code}</TableCell>
              <TableCell>
                {` ${coupon.type === "percentage" ? "درصدی" : "مبلغ ثابت"}`}
              </TableCell>

              <TableCell>{coupon.value}</TableCell>
              <TableCell>{coupon.minPurchase}</TableCell>
              <TableCell>{coupon.maxDiscount}</TableCell>
              <TableCell>{coupon.usedCount}</TableCell>
              <TableCell>{formatExpireDate(coupon.expiresAt)}</TableCell>
              <TableCell>{`${coupon.isActive ? "فعال" : "غیرفعال"}`}</TableCell>
              <TableCell>
                <Button asChild className="mx-2 border" variant="outline">
                  <Link href={`/admin/coupon/${coupon._id}/edit`}>
                    <Pencil  />
                  </Link>
                </Button>
                <Button variant="destructive" 
              onClick={() => handleDelete(coupon._id)}
                  disabled={deletingId === (coupon._id)}
                >
                  <Trash2 />
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

export default CouponList;
