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
      icon: <FileText size={35} className="text-gray-400" />,
      title: "Business Clearance",
      text: "Application / Renewal / Closure",
    },
    {
      icon: <GrCertificate size={35} className="text-gray-400" />,
      title: "Barangay Clearance / Certificates",
      text: "Clearance for personal use",
    },
    {
      icon: <HiOutlineIdentification size={35} className="text-gray-400" />,
      title: "Barangay ID",
      text: "Barangay ID for president of Barangay Banaba East",
    },
    {
      icon: <BriefcaseBusiness size={35} className="text-gray-400" />,
      title: "First Time Job Seeker",
      text: "Job Requirements",
    },
    {
      icon: <FolderSync size={35} className="text-gray-400" />,
      title: "Transfer for Residency",
      text: "For Transferring of Residency",
    },
    {
      icon: <FaHouseUser size={35} className="text-gray-400" />,
      title: "Residency",
      text: "Certificate of residency",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center bg-green-700 pt-24 pb-9">
        <h1 className="title_outline text-2xl font-extrabold text-white uppercase">
          Our Services
        </h1>
      </div>

      <div className="space-y-2 max-w-[65rem] mx-auto hidden">
        <p>To request a document from the barangay, follow these steps:</p>

        <p>
          1. Determine the specific document you need. Common documents include
          barangay clearance, certificates of residency, or permits for various
          activities.
        </p>

        <p>
          2. Visit our service page. On our service page you can choose the
          document you want to request.
        </p>

        <p>
          3. Before requesting a document, you will need to create an account.
          This step is essential to initiate the document request process
          efficiently.
        </p>

        <p>
          4. Please ensure that you are a current resident of the Barangay
          Banaba East in order to proceed. It&apos;s important that your
          residency status within the community is verified for the approval of
          request.
        </p>

        <p>
          5. Complete your profile information to proceed with the document
          request.
        </p>

        <p>
          6. Provide the necessary information such as, document needed and
          purpose. Complete all information accurately.
        </p>

        <p>
          7. Submit your application and wait for the approval. Please ensure
          that the email address associated with your login is active, as the
          approval notification will be sent via email.
        </p>

        <p>
          8. Once your request is approved, you may claim the document from the
          Barangay hall.
        </p>

        <p>9. Pay any applicable fees.</p>

        <p>10. Review the document request history on services page.</p>
      </div>

      <div className="flex flex-col gap-y-8 max-w-[80rem] mx-auto px-3 mt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-10">
          {ourServices.map((item, index) => (
            <div
              key={index}
              className="slide-up flex flex-col items-center gap-2"
            >
              <div className="flex flex-col items-center gap-2">
                <div>{item.icon}</div>
                <h1 className="md:text-lg font-extrabold text-gray-700 text-center">
                  {item.title}
                </h1>
              </div>

              <p className="text-sm text-gray-600 text-center max-w-[20rem]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="slide-up py-6 px-20 uppercase">Apply now</Button>
        </div>
      </div>

      <div className="mt-20">
        <Image
          src="/hand-shake-service.jpg"
          alt="Hand Shake"
          width={1010}
          height={990}
          priority
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
