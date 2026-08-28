import CouponForm from '@/components/coupons/CouponForm';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import React from 'react';
export const getCoupon = async (id)=>{
    await connectDB();

    const coupon = await Coupon.findById(id);

    return ({
        id : coupon._id.toString(),
        code : coupon.code,
        type : coupon.type,
        minPurchase : coupon.minPurchase,
        maxDiscount : coupon.maxDiscount,
        usedCount : coupon.usedCount,
        expiresAt : coupon.expiresAt,
        isActive : coupon.isActive

    })

}
const EditCoupon = async({params}) => {
    const {id} = await params
    const coupon = await getCoupon(id)
    console.log("coupon for edit" , coupon);
    
    return (
        <div>
          <CouponForm  mode="edit" coupon={coupon} />
        </div>
    );
};

export default EditCoupon;