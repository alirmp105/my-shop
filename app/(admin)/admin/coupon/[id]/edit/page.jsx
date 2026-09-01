import CouponForm from '@/components/coupons/CouponForm';
import { getCoupon } from '@/lib/data/coupon';

import React from 'react';

const EditCoupon = async({params}) => {
    const {id} = await params;
    
    const coupon = await getCoupon(id)
    
    return (
        <div>
          <CouponForm  mode="edit" coupon={coupon} />
        </div>
    );
};

export default EditCoupon;