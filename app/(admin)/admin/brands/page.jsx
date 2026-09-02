import BrandList from '@/components/brands/BrandList';
import { getBrands } from '@/lib/data/brands';
import React from 'react';

const Brands = async() => {
const brands = await getBrands();
    return (
        <div>
            
            <BrandList brands={brands} />
            
        </div>
    );
};

export default Brands;