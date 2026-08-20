import React from 'react';
import UserTableSkeleton from '@/components/skeletons/UserTableSkeleton';
const loading = () => {
    return (
        <div>
          <UserTableSkeleton />  
        </div>
    );
};

export default loading;