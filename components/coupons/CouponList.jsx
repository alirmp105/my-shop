import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pen, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns-jalali";
const CouponList = ({ coupons }) => {
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
  return (
    <div>
      <Link
        href="/admin/coupon/add"
        className="inline-flex gap-1 items-center rounded-md bg-black text-white py-1  px-2 my-4 text-sm"
      >
        افزودن کد
        <PlusIcon size="20" />
      </Link>

      <Table>
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
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
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
                <Button asChild className="mx-2">
                  <Link href={`/admin/coupon/${coupon.id}/edit`}>
                    <Pen />
                  </Link>
                </Button>
                <Button variant="destructive">
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponList;
