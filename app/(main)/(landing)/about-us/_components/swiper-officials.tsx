"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
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
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Rolando A. Dinglasan</p>
          <p className="italic text-xs text-gray-600">Punong Barangay</p>
        </div>
      </SwiperSlide>
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Cheryl R. Fernandez</p>
          <p className="italic text-xs text-gray-600">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Helen C. Tubo</p>
          <p className="italic text-xs text-gray-600">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Arvijune R. Villamore</p>
          <p className="italic text-xs text-gray-600">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Kevin Ray H. Blanco</p>
          <p className="italic text-xs text-gray-600">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
      <SwiperSlide className="relative aspect-[8/5] rounded-md overflow-hidden">
        <div className="h-full w-full bg-gray-500/20"></div>
        <div className="absolute bottom-2 left-3">
          <p className="font-medium text-sm">Reymark M. Castillo</p>
          <p className="italic text-xs text-gray-600">Brgy. Kagawad</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
