"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export function SwiperOfficials() {
  const officials = [
    {
      name: "Rolando A. Dinglasan",
      status: "Punong Barangay",
    },
    {
      name: "Cheryl R. Fernandez",
      status: "Brgy. Kagawad",
    },
    {
      name: "Helen C. Tubo",
      status: "Brgy. Kagawad",
    },
    {
      name: "Arvijune R. Villamore",
      status: "Brgy. Kagawad",
    },
    {
      name: "Kevin Ray H. Blanco",
      status: "Brgy Kagawad",
    },
    {
      name: "Reymark M. Castillo",
      status: "Brgy Kagawad",
    },
  ];

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
      {officials.map((item, index) => (
        <SwiperSlide
          key={index}
          className="relative aspect-[8/5] rounded-md overflow-hidden"
        >
          <div className="h-full w-full bg-gray-500/20"></div>
          <div className="absolute bottom-2 left-3">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="italic text-xs text-gray-600">{item.status}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
