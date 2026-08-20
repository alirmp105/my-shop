import React from 'react';
import  { Table,TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from '../ui/skeleton';
const ProductTableSkeleton = () => {
    return (
        <div>
           <Table>
            <TableBody>
                <TableCell>
                    <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-16" />
                </TableCell>
            </TableBody>
            </Table>        
        </div>
    );
};

export default ProductTableSkeleton;