"use client";

import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleAlert, Loader2, X } from "lucide-react";
import { createBlotter } from "@/action/user/blotter";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { UserType } from "@/lib/user";

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

interface BlotterFormProp {
  user: UserType | null;
}

export default function BlotterForm({ user }: BlotterFormProp) {
  const [pending, setTransition] = useTransition();
  const [value, setValue] = useState({
    incident: "",
    placeOfIncident: "",
    dateTime: "",
    witnesses: [""],
    narrative: "",
  });

  function onChangeWitnesses(e: ChangeEvent<HTMLInputElement>, idx: number) {
    const { value } = e.target;

    setValue((prev) => ({
      ...prev,
      witnesses: prev.witnesses.map((w, i) => (i === idx ? value : w)),
    }));
  }

  function onAddWitnesses() {
    setValue((prev) => ({
      ...prev,
      witnesses: [...prev.witnesses, ""],
    }));
  }

  function onCreateBlotter() {
    if (!value.narrative) {
      toast.error("Narrative is required");
    }

    setTransition(async () => {
      await createBlotter(value)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }

          toast.success("Blotter created successfully");
          setValue((prev) => ({
            ...prev,
            barangayPurokSitio: "",
            incident: "",
            placeOfIncident: "",
            dateTime: "",
            witnesses: [""],
            narrative: "",
          }));
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  const missingProfileInfo =
    !user?.birthDate ||
    !user?.age ||
    !user?.gender ||
    !user?.civilStatus ||
    !user?.placeOfBirth ||
    !user?.sitioPurok ||
    !user?.mobile;

  return (
    <div>
      {missingProfileInfo && (
        <Alert
          className="mb-5 px-4 py-2 bg-destructive/10"
          variant="destructive"
        >
          <AlertDescription className="flex items-center gap-3">
            <CircleAlert className="h-4 w-4 shrink-0" />
            <p>
              Complete your{" "}
              <Link href="/user/profile" className="underline">
                profile
              </Link>{" "}
              to create blotter.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <form action={onCreateBlotter} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="incident" className="text-sm">
              Incident
            </label>
            <Input
              type="text"
              onChange={({ target }) =>
                setValue((prev) => ({ ...prev, incident: target.value }))
              }
              required
              value={value.incident}
              id="incident"
              placeholder="Enter incident"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="placeOfIncident" className="text-sm">
              Place of incident
            </label>
            <Input
              type="text"
              onChange={({ target }) =>
                setValue((prev) => ({ ...prev, placeOfIncident: target.value }))
              }
              required
              value={value.placeOfIncident}
              id="placeOfIncident"
              placeholder="Enter place of incident"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="dateTime" className="text-sm">
            Date/Time
          </label>
          <Input
            type="datetime-local"
            onChange={({ target }) =>
              setValue((prev) => ({ ...prev, dateTime: target.value }))
            }
            required
            value={value.dateTime}
            id="dateTime"
            placeholder="Enter date/time"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="witnesses" className="text-sm">
            Witnesses <span className="text-xs text-zinc-500">(optional)</span>
          </label>
          {value.witnesses.map((item, idx) => (
            <div key={idx} className="flex items-center relative">
              <Input
                type="text"
                onChange={(e) => onChangeWitnesses(e, idx)}
                value={item}
                id="witnesses"
                className="pr-11"
                placeholder="Enter witnesses"
              />

              {idx !== 0 && (
                <X
                  onClick={() =>
                    setValue((prev) => ({
                      ...prev,
                      witnesses: prev.witnesses.filter((_, i) => i !== idx),
                    }))
                  }
                  className="absolute right-2 rounded-full cursor-pointer scale-[.90] text-zinc-500"
                />
              )}
            </div>
          ))}
          <Button
            disabled={pending}
            onClick={onAddWitnesses}
            type="button"
            variant="secondary"
            className="w-full text-xs uppercase"
          >
            Add witnesses
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="narrative" className="text-sm">
            Narrative
          </label>
          <ReactQuill
            theme="snow"
            id="narrative"
            value={value.narrative}
            onChange={(e) => setValue((prev) => ({ ...prev, narrative: e }))}
            modules={modules}
            formats={formats}
            bounds={".app"}
            placeholder="Say something about the incident.."
            className="border border-gray-100 rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-2 mt-4">
          <Button
            disabled={pending || missingProfileInfo}
            type="submit"
            className="w-full bg-green-500 hover:bg-green-500/80 uppercase text-xs"
          >
            {pending ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
