import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CartCountSkeleton = () => {
    return (
        <div>
            <Skeleton className="h-7 w-8" />
        </div>
    );
};

export default CartCountSkeleton;