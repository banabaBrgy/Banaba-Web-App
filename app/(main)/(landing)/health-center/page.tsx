import { Mail, MoveRight, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function HealthCenterPage() {
  const barangayHealthResponseTeam = [
    {
      name: "Raymark M. Castillo",
      status: "Comittee On Health",
      phoneNumber: "09055719397",
    },
    {
      name: "Jovito B. Clemeno",
      status: "Chief Tanod",
      phoneNumber: "09771429093",
    },
    {
      name: "Amieriza A. Noriego",
      status: "BHW",
      phoneNumber: "09165860248",
    },
    {
      name: "Irene D. Remirez",
      status: "BNS",
      phoneNumber: "09618422230",
    },
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="flex justify-center items-center bg-green-700 pt-24 pb-9">
        <h1 className="title_outline md:text-2xl text-xl font-extrabold text-white uppercase">
          Barangay Health Center
        </h1>
      </div>

      <div className="slide-up flex lg:flex-row lg:items-stretch items-center flex-col gap-4 mt-10 px-3 max-w-[72.5rem] mx-auto">
        <div className="shrink-0 rounded-md overflow-hidden shadow-md border border-gray-300">
          <Image
            src="/health-center.jpg"
            alt="Health Center Image"
            width={550}
            height={300}
            priority
            className="w-auto h-auto object-contain"
          />
        </div>

        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-center text-3xl font-extrabold text-black">
            “Healthy citizens are the greatest asset any country can have.”
          </h1>
          <p className="text-center text-[14.5px]">
            Welcome to Banaba East Health Center, your trusted destination for
            comprehensive healthcare services in Banaba East Batangas City. At
            Barangay Healt Center, we are committed to providing high-quality,
            compassionate care to individuals and families in our community.
          </p>
        </div>
      </div>

      <div className="flex justify-center lg:flex-row lg:items-start items-center flex-col gap-5 mt-12 mx-3 ">
        <div className="h-[36rem]">
          <Image
            src="/pertussis.jpg"
            alt="Pertussis"
            width={500}
            height={500}
            className="border border-gray-300 rounded-md shadow-md w-full h-full"
          />
        </div>

        <div className="h-[36rem]">
          <Image
            src="/nutrition-council.png"
            alt="Nutrition council"
            width={500}
            height={500}
            className="border border-gray-300 rounded-md shadow-md w-full h-full"
          />
        </div>

        <div className="slide-up bg-white px-4 py-5 max-w-[22rem] shrink-0 rounded-md shadow-md border border-gray-300">
          <div className="flex justify-center gap-3 mb-2">
            <Image
              src="/DOH-logo.png"
              alt="DOH Logo"
              width={300}
              height={100}
              priority
              className="w-14 h-14"
            />
            <Image
              src="/logo.png"
              alt="Barangay Banaba Logo"
              width={300}
              height={100}
              priority
              className="w-14 h-14"
            />
            <Image
              src="/health-office-logo.png"
              alt="Health Center Logo"
              width={300}
              height={100}
              priority
              className="w-14 h-14 bg-blend-color-burn"
            />
          </div>

          <div className=" gap-y-1">
            <div className="mb-2">
              <h1 className="text-center uppercase font-semibold text-lg">
                Contacts
              </h1>
              <div className="flex items-center justify-center gap-3 text-sm">
                <Phone size={20} />
                <p className="font-medium">(043 ) 741 0009</p>
              </div>

              <div className="flex items-center justify-center gap-3 text-sm">
                <Mail size={20} />
                <p className="font-medium">banabaest178@gmail.com</p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-semibold text-lg text-center mb-2">
                BARANGAY HEALTH EMERGENCY RESPONSE TEAM (BHERT)
              </h1>

              <ul className="flex flex-col gap-y-5 items-center text-sm">
                {barangayHealthResponseTeam.map((item, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-3 place-items-center"
                  >
                    <div className="text-center">
                      <h1 className="font-bold">{item.name}</h1>
                      <p>({item.status})</p>
                    </div>
                    <MoveRight size={20} />
                    <p className="font-semibold text-sm">{item.phoneNumber}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
