// // BrandListSkeleton.tsx
// import { Skeleton } from '@/components/ui/skeleton';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// const BrandListSkeleton = () => {
//   return (
//     <div>
//      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
//       {items.map((_, i) => (
//         <div
//           key={i}
//           className="rounded-xl border bg-card p-4 shadow-sm"
//         >
//           {/* بخش بالا: لوگوی برند و اسامی */}
//           <div className="flex items-start gap-3">
//             {/* لوگوی ۵۶ در ۵۶ پیکسل (size-14) */}
//             <Skeleton className="size-14 shrink-0 rounded-lg" />

//             <div className="min-w-0 flex-1 space-y-2 pt-0.5">
//               {/* نام فارسی برند */}
//               <Skeleton className="h-4 w-3/4 rounded" />
//               {/* نام انگلیسی یا اسلاگ */}
//               <Skeleton className="h-3 w-1/2 rounded" />
//             </div>
//           </div>

//           {/* بخش پایین: دکمه جزییات و اکشن‌ها */}
//           <div className="mt-3 flex items-center justify-between border-t pt-3">
//             {/* دکمه متن نمایش جزئیات */}
//             <Skeleton className="h-4 w-28 rounded" />

//             {/* دکمه‌های آیکونی استاندارد size="icon" (معادل size-9 در شادسن) */}
//             <div className="flex items-center gap-2">
//               <Skeleton className="size-9 rounded-md" />
//               <Skeleton className="size-9 rounded-md" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
    // <div className="space-y-4 md:block">
    //   {/* Skeleton برای جدول */}
    //   <div className="rounded-md border">
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead>شناسه</TableHead>
    //           <TableHead>نام برند</TableHead>
    //           <TableHead>تصویر</TableHead>
    //           <TableHead>عملیات</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {[...Array(5)].map((_, index) => (
    //           <TableRow key={index}>
    //             <TableCell>
    //               <Skeleton className="h-4 w-16" />
    //             </TableCell>
    //             <TableCell>
    //               <Skeleton className="h-4 w-24" />
    //             </TableCell>
    //             <TableCell>
    //               <Skeleton className="h-10 w-10 rounded-full mx-auto" />
    //             </TableCell>
    //             <TableCell>
    //               <div className="flex gap-3">
    //                 <Skeleton className="h-8 w-8 rounded-md" />
    //                 <Skeleton className="h-8 w-8 rounded-md" />
    //               </div>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
      

//     </div>
//     </div>
//   );
// };

// export default BrandListSkeleton;

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BrandSkeleton({ count = 6 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {/* 📱 ساختار موبایل و تبلت (منطبق بر BrandCard) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            {/* بخش بالا: لوگوی برند و اسامی */}
            <div className="flex items-start gap-3">
              {/* لوگوی ۵۶ در ۵۶ پیکسل (size-14) */}
              <Skeleton className="size-14 shrink-0 rounded-lg" />

              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                {/* نام فارسی برند */}
                <Skeleton className="h-4 w-3/4 rounded" />
                {/* نام انگلیسی یا اسلاگ */}
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>

            {/* بخش پایین: دکمه جزییات و اکشن‌ها */}
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              {/* دکمه متن نمایش جزئیات */}
              <Skeleton className="h-4 w-28 rounded" />

              {/* دکمه‌های آیکونی استاندارد */}
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 ساختار دسکتاپ (منطبق بر Table) */}
      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[980px] table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">شناسه</TableHead>
              <TableHead>نام فارسی</TableHead>
              <TableHead>نام انگلیسی</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">تصویر</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((_, i) => (
              <TableRow key={i}>
                {/* شناسه */}
                <TableCell>
                  <Skeleton className="h-4 w-10" />
                </TableCell>

                {/* نام فارسی */}
                <TableCell>
                  <Skeleton className="h-4 w-28 mx-auto" />
                </TableCell>

                {/* نام انگلیسی */}
                <TableCell dir="ltr">
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                {/* Slug */}
                <TableCell dir="ltr">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* تصویر */}
                <TableCell>
                  <Skeleton className="size-10 rounded-md mx-auto" />
                </TableCell>

                {/* عملیات */}
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <Skeleton className="size-9 rounded-md" />
                    <Skeleton className="size-9 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default BrandSkeleton;
