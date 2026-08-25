import Image from "next/image";
import React from "react";
import img from "@/public/images/hero1.jpg";
const AdsSection = () => {
  return (
    <section className="">
      
        <section className="columns-1 my-5 gap-3 sm:columns-2">
          <section className="">
            {/* <img className="d-block rounded-2 w-100"
                            src="assets/images/ads/two-col-1.jpg" alt=""> */}
            <Image src="/images/be4c33eb65a7d08e5a4f5e641d673d7b404a5d0b_1786447811.jpg" alt="img" className="" width={700} height={120} />
          </section>
          <section className="">
            {/* <img className="d-block rounded-2 w-100"
                            src="assets/images/ads/two-col-2.jpg" alt=""> */}
            <Image src="/images/0e7f903b0848694e6b6b7641b1ad731eb027837a_1786797271.jpg" alt="img" width={700} height={120} className=""/>
        
        </section>
      </section>
    </section>
    
  );
};

export default AdsSection;
