import BrandList from '@/components/brands/BrandList';
import BrandListSkeleton from '@/components/skeletons/BrandListSkeleton';
import { getAdminBrands, getBrands } from '@/lib/data/brands';
import React, { Suspense } from 'react';

const Brands = async() => {
const brands = await getAdminBrands();
    return (
        <div>
            
            <Suspense fallback={<BrandListSkeleton/>} >
            <BrandList brands={brands} />
            </Suspense>
        </div>
    );
};

export default Brands;