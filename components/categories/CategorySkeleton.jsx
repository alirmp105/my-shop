// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// export function CategorySkeleton({ rows = 5 }) {
//   const items = Array.from({ length: rows });

//   return (
//     <>
//       {/* 📱 حالت موبایل (Card Skeleton) */}
//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
//         {items.map((_, i) => (
//           <Card key={i} className="p-4 space-y-3">
//             <CardHeader className="p-0 flex flex-row items-center gap-3 space-y-0">
//               <Skeleton className="h-12 w-12 rounded-md shrink-0" />
//               <div className="space-y-1.5 flex-1">
//                 <Skeleton className="h-4 w-3/4" />
//                 <Skeleton className="h-3 w-1/2" />
//               </div>
//             </CardHeader>
//             <CardContent className="p-0 space-y-2">
//               <div className="flex justify-between items-center">
//                 <Skeleton className="h-3 w-16" />
//                 <Skeleton className="h-5 w-12 rounded-full" />
//               </div>
//             </CardContent>
//             <CardFooter className="p-0 flex justify-end gap-2 pt-2">
//               <Skeleton className="h-8 w-8 rounded-md" />
//               <Skeleton className="h-8 w-8 rounded-md" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {/* 💻 حالت دسکتاپ (Table Skeleton) */}
//       <div className="hidden overflow-x-auto md:block">
//         <Table className="min-w-[980px] table-auto">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[80px]">شناسه</TableHead>
//               <TableHead>نام فارسی</TableHead>
//               <TableHead>نام انگلیسی</TableHead>
//               <TableHead>Slug</TableHead>
//               <TableHead className="text-center">تصویر</TableHead>
//               <TableHead className="text-center">وضعیت</TableHead>
//               <TableHead className="text-center">عملیات</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {items.map((_, i) => (
//               <TableRow key={i}>
//                 {/* شناسه */}
//                 <TableCell>
//                   <Skeleton className="h-4 w-10" />
//                 </TableCell>

//                 {/* نام فارسی */}
//                 <TableCell>
//                   <Skeleton className="h-4 w-28 mx-auto" />
//                 </TableCell>

//                 {/* نام انگلیسی */}
//                 <TableCell dir="ltr">
//                   <Skeleton className="h-4 w-24" />
//                 </TableCell>

//                 {/* Slug */}
//                 <TableCell dir="ltr">
//                   <Skeleton className="h-4 w-20" />
//                 </TableCell>

//                 {/* تصویر */}
//                 <TableCell>
//                   <Skeleton className="h-10 w-10 rounded-md mx-auto" />
//                 </TableCell>

//                 {/* وضعیت */}
//                 <TableCell>
//                   <Skeleton className="h-5 w-14 rounded-full mx-auto" />
//                 </TableCell>

//                 {/* دکمه‌های عملیات */}
//                 <TableCell>
//                   <div className="flex items-center justify-center gap-2">
//                     <Skeleton className="h-8 w-8 rounded-md" />
//                     <Skeleton className="h-8 w-8 rounded-md" />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </>
//   );
// }

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CategorySkeleton({ count = 5 }) {
  const items = Array.from({ length: count });

  return (
    <>
    {/* mobile / tablet */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
          >
            {/* بخش بالا: عکس و مشخصات */}
            <div className="flex items-start gap-3">
              {/* عکس سایز 56px (size-14) */}
              <Skeleton className="size-14 shrink-0 rounded-lg" />

              <div className="min-w-0 flex-1 space-y-2">
                {/* نام فارسی */}
                <Skeleton className="h-4 w-3/4 rounded" />
                {/* نام انگلیسی یا اسلاگ */}
                <Skeleton className="h-3 w-1/2 rounded" />
                {/* برچسب وضعیت */}
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>

            {/* بخش پایین: دکمه جزییات و اکشن‌ها */}
            <div className="flex items-center justify-between border-t pt-3">
              {/* متن نمایش جزئیات */}
              <Skeleton className="h-4 w-28 rounded" />

              {/* دکمه‌های آیکونی سایز استاندارد Button size="icon" */}
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* desktop */}
      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[980px] table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">شناسه</TableHead>
              <TableHead>نام فارسی</TableHead>
              <TableHead>نام انگلیسی</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">تصویر</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
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

                {/* تصویر 40px */}
                <TableCell>
                  <Skeleton className="size-10 rounded-md mx-auto" />
                </TableCell>

                {/* وضعیت */}
                <TableCell>
                  <Skeleton className="h-5 w-14 rounded-full mx-auto" />
                </TableCell>

                {/* دکمه‌های عملیات */}
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

