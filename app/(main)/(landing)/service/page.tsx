import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { HiOutlineIdentification } from "react-icons/hi2";
import { BriefcaseBusiness, FileText, FolderSync } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ServicePage() {
  const ourServices = [
    {
      icon: <FileText size={35} color="#616161" />,
      title: "Business Clearance",
      text: "Application / Renewal / Closure",
    },
    {
      icon: <GrCertificate size={35} color="#616161" />,
      title: "Barangay Clearance / Certificates",
      text: "Clearance for personal use",
    },
    {
      icon: <HiOutlineIdentification size={35} color="#616161" />,
      title: "Barangay ID",
      text: "Barangay ID for president of Barangay Banaba East",
    },
    {
      icon: <BriefcaseBusiness size={35} color="#616161" />,
      title: "First Time Job Seeker",
      text: "Job Requirements",
    },
    {
      icon: <FolderSync size={35} color="#616161" />,
      title: "Transfer for Residency",
      text: "For Transferring of Residency",
    },
    {
      icon: <FaHouseUser size={35} color="#616161" />,
      title: "Residency",
      text: "Certificate of residency",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#D9D9D9] to-white">
      <div className="flex justify-center items-center bg-green-700 pt-24 pb-9">
        <h1 className="title_outline text-2xl font-extrabold text-white uppercase tracking-widest">
          Our Services
        </h1>
      </div>

      <div className="flex flex-col gap-y-8 max-w-[80rem] mx-auto px-3">
        <h1 className="text-center pt-4 text-xl font-medium">
          Here&apos;s our services
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-10">
          {ourServices.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div>{item.icon}</div>
                <h1 className="md:text-lg font-medium text-center">
                  {item.title}
                </h1>
              </div>

              <p className="text-sm text-gray-900 text-center max-w-[20rem]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="py-6 px-10 uppercase">Apply now</Button>
        </div>
      </div>

      <div className="shadow-2xl mt-20">
        <Image
          src="/hand-shake-service.jpg"
          alt="Hand-shake"
          width={1010}
          height={990}
          priority
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
