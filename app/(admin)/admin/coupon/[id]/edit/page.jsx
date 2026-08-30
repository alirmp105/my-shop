import CouponForm from '@/components/coupons/CouponForm';
import { getCoupon } from '@/lib/data/coupon';

import React from 'react';

const EditCoupon = async({params}) => {
    const {id} = await params;
    console.log("coupon id :" , id);
    
    const coupon = await getCoupon(id)
    console.log("coupon for edit" , coupon);
    
    return (
        <div>
          <CouponForm  mode="edit" coupon={coupon} />
        </div>
    );
};

export default EditCoupon;