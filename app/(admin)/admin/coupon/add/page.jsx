import CouponForm from '@/components/coupons/CouponForm';
import React from 'react';

const AddCoupon = () => {
    return (
        <div>
            <h1>
                ایجاد کد تخفیف
            </h1>
            <CouponForm mode="create"/>
        </div>
    );
};

export default AddCoupon;