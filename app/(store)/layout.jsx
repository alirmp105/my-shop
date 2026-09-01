import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import React from 'react';

const layout = ({children}) => {
    return (
        <div className='w-full min-w-0' >
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default layout;