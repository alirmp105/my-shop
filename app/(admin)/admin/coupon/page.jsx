import CouponList from '@/components/coupons/CouponList';
import { getCoupons} from '@/lib/data/coupon';

import React from 'react';



const CouponPage =async () => {
    const coupons = await getCoupons();
    return (
        <div>
            <h1 className='text-3xl font-bold'>
                مدیریت تخفیف ها
            </h1>

            <CouponList coupons={coupons} />
        </div>
    );
};

export default CouponPage;