// BrandListSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BrandListSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Skeleton برای جدول */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شناسه</TableHead>
              <TableHead>نام برند</TableHead>
              <TableHead>تصویر</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      

    </div>
  );
};

export default BrandListSkeleton;