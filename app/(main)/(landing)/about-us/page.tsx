import React from "react";
import { SwiperOfficials } from "./_components/swiper-officials";
import Image from "next/image";

export default function AboutUsPage() {
  const physicalDemographicCharacteristics = [
    {
      title: "Land Area (has)",
      text: "117.7255",
    },
    {
      title: "Projected Population 2022",
      text: "2,511",
    },
    {
      title: "Classification",
      text: "RURAL",
    },
    {
      title: "Number of Purok/Sitios",
      text: "2",
    },
    {
      title: "Boundaries",
      text: [
        "North - Balete",
        "South - Banaba Center",
        "West - Kaingin San Pascual",
        "East - Bulihan Balete",
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="flex justify-center items-center bg-green-700 pt-24 pb-9 mb-5">
        <h1 className="title_outline text-2xl font-extrabold text-white uppercase">
          Barangay Officials
        </h1>
      </div>

      <div className="slide-up mx-3 mb-10">
        <SwiperOfficials />
      </div>

      <div className="slide-up flex lg:flex-row flex-col justify-center lg:items-stretch items-center gap-5 mx-3">
        <div className="flex flex-col flex-1 max-w-[28rem] rounded-md shadow-md bg-white border border-gray-300">
          <h1 className="text-center uppercase mb-8 pt-5 px-5">
            Physical & Demographic Characteristics
          </h1>

          <ul className="text-[12.8px] mb-8 px-5">
            {physicalDemographicCharacteristics.map((item, index) => (
              <li key={index} className="flex">
                <p className="w-[11.5rem] shrink-0">{item.title}</p>
                <span className="font-extrabold ml-1 mr-5">:</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="border-red-500 flex-1">
            <iframe
              // This is not image this is a google map location for Barangay Banaba
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443.3895555919666!2d121.06663250231648!3d13.813154321376269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd0fcd69c6b5a5%3A0x336c8e16b2e275ee!2sBANABA%20EAST%2C%20BARANGAY%20HALL!5e1!3m2!1sen!2sph!4v1715939574766!5m2!1sen!2sph"
              className="w-full h-full rounded-b-md"
              style={{ border: "0" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="p-10 flex-1 max-w-[43rem] rounded-md shadow-md bg-white border border-gray-300">
          <div className="flex justify-center mb-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={500}
              height={399}
              priority
              className="w-[6rem] h-[6rem] rounded-full"
            />
          </div>

          <h1 className="text-center font-semibold uppercase mb-2">Mission</h1>
          <p className="text-center text-sm mb-10">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias,
            debitis eveniet provident, corrupti labore blanditiis eaque dolores
            natus vero aspernatur exercitationem nulla veritatis maiores
            deserunt repellat amet voluptatum? Eos, distinctio. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Reiciendis eius,
            consequatur deleniti mollitia tempora dolorum voluptate qui hic eum
            optio ullam itaque quae voluptas delectus recusandae suscipit cumque
            tenetur perspiciatis.
          </p>

          <h1 className="text-center font-semibold uppercase mb-2">Vision</h1>
          <p className="text-center text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias,
            debitis eveniet provident, corrupti labore blanditiis eaque dolores
            natus vero aspernatur exercitationem nulla veritatis maiores
            deserunt repellat amet voluptatum? Eos, distinctio. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Reiciendis eius,
            consequatur deleniti mollitia tempora dolorum voluptate qui hic eum
            optio ullam itaque quae voluptas delectus recusandae suscipit cumque
            tenetur perspiciatis.
          </p>
        </div>
      </div>

      <div className="slide-up flex justify-center bg-white border border-gray-300 mt-8 p-3 shadow-md">
        <div className="flex md:flex-row flex-col gap-10 flex-1 max-w-[55rem]">
          <div className="flex md:flex-col md:items-stretch sm:flex-row flex-col items-center justify-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={500}
              height={200}
              priority
              className="w-52 h-52"
            />

            <Image
              src="/brgy-bg-2.png"
              alt="Logo"
              width={500}
              height={200}
              priority
              className="md:w-full w-[20rem] sm:h-[18rem] h-[13rem] rounded-md border border-gray-300 shadow-md"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-center text-3xl font-medium uppercase mb-6">
              Other Information
            </h1>

            <p className="font-semibold uppercase text-center text-lg mb-3">
              Barangay History
            </p>

            <div className="space-y-3 text-sm">
              <p>
                <span className="ml-16">Originally</span>, all the existing
                barrio of Banaba were taken as one, and was named Banaba. The
                only distinction among the four geographical division were as
                follows: the western areas as “Kanlurang Pook”; the Southern
                part as “Magbabanig”; the Northern side as “Kaingin”; and the
                Eastern most part as “Pook ng Mestiza”; which is at present
                officially known as Banaba Silangan.
              </p>

              <p>
                <span className="ml-16">It was</span> during the Commonwealth
                period that Banaba was divided and each geographical division
                was registered and given the official name: Pook ni Mestiza,
                being the eastern most side and part of Kaingin was named and
                registered as Banaba Silangan. This barrio is approximately six
                kilometers from the poblacion (Batangas City) and has an area of
                about 135.5 hectares
              </p>

              <p>
                <span className="ml-16">Tracing</span> back the generation of
                families, it was found out that Cabezang Pablo, a family of
                macatangay, was the first settlers in the eastern area. It was
                said that the natives of this place paid their taxes to this man
                who was appointed head of the barangay during that time.
              </p>

              <p>
                <span className="ml-16">In</span> the early days, courtship and
                marriage in this place could exist even without the knowledge
                and consent of the persons concerned. But marriage can only be
                planned and realized after granting valuable things or piece of
                land as dowry on the part of the male. With the influence of the
                different races who had settled in this place, and with the
                drastic changes of the times, these folkways and practices, were
                modified and changed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
