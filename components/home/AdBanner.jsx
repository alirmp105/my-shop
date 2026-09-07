// import Image from "next/image";
// import React from "react";
// import img from "@/public/images/hero1.jpg";
// const AdsSection = () => {
//   return (
//     <section className="">
      
//         <section className="columns-1 my-5 gap-3 sm:columns-2">
//           <section className="">
//             {/* <img className="d-block rounded-2 w-100"
//                             src="assets/images/ads/two-col-1.jpg" alt=""> */}
//             <Image src="/images/be4c33eb65a7d08e5a4f5e641d673d7b404a5d0b_1786447811.jpg" alt="img" className="" width={700} height={120} />
//           </section>
//           <section className="">
//             {/* <img className="d-block rounded-2 w-100"
//                             src="assets/images/ads/two-col-2.jpg" alt=""> */}
//             <Image src="/images/0e7f903b0848694e6b6b7641b1ad731eb027837a_1786797271.jpg" alt="img" width={700} height={120} className=""/>
        
//         </section>
//       </section>
//     </section>
    
//   );
// };

// export default AdsSection;

import React from "react";
import Image from "next/image";
import Link from "next/link";

// داده‌های دمو (در آینده از دیتابیس یا Fetch داده خواهد شد)
const DEMO_BANNERS_PAIR = [
  {
    id: "1",
    title: "تخفیف ویژه لوازم جانبی",
    imageUrl: "/images/banner1.jpg",
    link: "/category/accessories",
  },
  {
    id: "2",
    title: "جشنواره محصولات دیجیتال",
    imageUrl: "/images/banner2.jpg",
    link: "/category/digital",
  },
];

const DEMO_BANNERS_QUAD = [
  {
    id: "3",
    title: "موبایل و تبلت",
    imageUrl: "/images/banner1.jpg",
    link: "/category/mobile",
  },
  {
    id: "4",
    title: "مد و پوشاک",
    imageUrl: "/images/banner1.jpg",
    link: "/category/fashion",
  },
  {
    id: "5",
    title: "خانه و آشپزخانه",
    imageUrl: "/images/banner1.jpg",
    link: "/category/home",
  },
  {
    id: "6",
    title: "ابزار و تجهیزات",
    imageUrl: "/images/banner1.jpg",
    link: "/category/tools",
  },
];

export default function AdBanners({ banners = [], variant = "pair" }) {
  // انتخاب بنرها: اگر پروپس داده نشد، از داده دمو استفاده می‌شود
  const items = banners.length > 0 
    ? banners 
    : (variant === "pair" ? DEMO_BANNERS_PAIR : DEMO_BANNERS_QUAD);

  const gridColsClass = variant === "pair" 
    ? "grid-cols-2" 
    : "grid-cols-2 md:grid-cols-4";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-4" dir="rtl">
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
        {items.map((banner) => (
          <Link
            key={banner.id || banner._id}
            href={banner.link || "#"}
            className="group relative overflow-hidden rounded-2xl bg-muted/40 aspect-[2/1] sm:aspect-[2.4/1] shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Image
              src={banner.imageUrl || banner.image}
              alt={banner.title || "بنر تبلیغاتی"}
              fill
              sizes={variant === "pair" ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority={false}
            />
            {/* افکت شاین/هاور مدرن */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
