"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";

export function SwiperOfficials() {
  return (
    <Swiper
      breakpoints={{
        0: {
          slidesPerView: 2,
        },
        660: {
          slidesPerView: 3,
        },
        920: {
          slidesPerView: 4,
        },
        1270: {
          slidesPerView: 5,
        },
      }}
      spaceBetween={15}
    >
      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/kapitan.png"
          alt="Rolando A. Dinglasan"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Rolando A. Dinglasan</p>
          <p className="text-xs">Punong Barangay</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal1.png"
          alt="Cheryl R. Fernandez"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Cheryl R. Fernandez</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal2.png"
          alt="Helen C. Tubo"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Helen C. Tubo</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal3.png"
          alt="Reymark M. Castillo"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Reymark M. Castillo</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal4.png"
          alt="Kevin Ray H. Blanco"
          width={500}
          height={500}
          className="w-full h-full object-contain mt-2"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Kevin Ray H. Blanco</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal5.png"
          alt="Joshua D. Macatangay"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Joshua D. Macatangay</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal6.png"
          alt="Arvijune R. Villamor"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Arvijune R. Villamor</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>

      <SwiperSlide className="relative aspect-[8/7] rounded overflow-hidden border border-zinc-200 shadow-md">
        <Image
          src="/konsehal7.png"
          alt="Isaac C. Blanco"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
        <div className="text- absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-500/80 text-white backdrop-blur-sm space-y-1">
          <p className="font-medium text-sm">Isaac C. Blanco</p>
          <p className="text-xs">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
