"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Map } from "./map";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "align",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export default function BlotterForm() {
  const [value, setValue] = useState("");

  return (
    <div>
      <form action="" className="mt-4">
        <InputAndLabel
          label="Barangay/purok/sitio"
          type="text"
          id="barangay-purok-sitio"
          name="barangay-purok-sitio"
          placeholder="Enter your Barangay/Purok/Sitio"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <InputAndLabel
            label="Incident"
            type="text"
            id="incident"
            name="incident"
            placeholder="Enter Incident"
          />
          <InputAndLabel
            label="Place of Incident"
            type="text"
            id="place-of-incident"
            name="place-of-incident"
            placeholder="Enter Place of Incident"
          />
          <InputAndLabel
            label="Longitude"
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Enter longitude"
          />
          <InputAndLabel
            label="Latitude"
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Enter latitude"
          />
        </div>

        <Map />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <InputAndLabel
            label="Date/Time"
            type="datetime-local"
            id="date-time"
            name="date-time"
          />
          <InputAndLabel
            label="Narrator/Complainant"
            type="text"
            id="narrator-complainant"
            name="narrator-complainant"
            placeholder="Enter Narrator/Complainant"
          />
        </div>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          bounds={".app"}
          placeholder="Write here"
          className="mt-4 border border-gray-100 "
        />
        {/* <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: value }}
        /> */}

        <Button className="mt-10 w-full bg-gradient-to-tr from-green-600 via-green-500 to-green-400">
          Submit
        </Button>
      </form>
    </div>
  );
}

function InputAndLabel({
  label,
  type,
  id,
  name,
  placeholder,
}: {
  label: string;
  type: string;
  id: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-md"
      />
    </div>
  );
}
