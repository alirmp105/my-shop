// components/app-breadcrumb.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// دیکشنری اختیاری برای ترجمه نام مسیرها به فارسی
const ROUTE_LABELS = {
  dashboard: "داشبورد",
  products: "محصولات",
  users: "کاربران",
  settings: "تنظیمات",
  profile: "پروفایل",
  orders: "سفارش‌ها",
  cart : "سبد خرید",
  
};

export default function AppBreadcrumb() {
  const pathname = usePathname();

  // تبدیل مسیر URL به آرایه (مثال: /dashboard/products تبدیل می‌شود به ['dashboard', 'products'])
  const segments = pathname.split("/").filter(Boolean);

  // اگر در صفحه اصلی (/) بودیم، چیزی نمایش ندهد (اختیاری)
  if (segments.length === 0) return null;

  return (
    <Breadcrumb className="my-3 mx-5" >
      <BreadcrumbList>
        {/* لینک برگشت به صفحه اصلی */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">خانه</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          
          // دریافت عنوان از جدول ترجمه یا استفاده از خود سگمنت
          const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

          return (
            <React.Fragment key={href}>
              {/* در صفحات فارسی و راست‌چین، آیکون فلش را برعکس می‌کنیم */}
              <BreadcrumbSeparator  />
              
              <BreadcrumbItem>
                {isLast ? (
                  // بخش آخر (صفحه فعلی) فقط متن است و نباید لینک باشد
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
