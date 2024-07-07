"use client";

import { Input } from "@/components/ui/input";
import React, {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { MdOutlineSearch } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { BsFillPinAngleFill } from "react-icons/bs";
import { Inquiries } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { answerInquiries, pinInquiries } from "@/action/admin/inquiries";
import { toast } from "sonner";

interface InquiriesRowProp {
  inquiries:
    | (Inquiries & {
        user: {
          email: string;
          fullName: string;
          mobile: string | null;
        };
      })[]
    | null;
  id: string;
}

export default function InquiriesRow({ inquiries, id }: InquiriesRowProp) {
  const [answer, setAnswer] = useState<Inquiries | null>(null);
  const [search, setSearch] = useState("");
  const [pending, setTransition] = useTransition();
  const inquiriesFormRef = useRef<ElementRef<"form">>(null);
  const refs = useRef<{ [keys: string]: ElementRef<"tr"> | null }>({});

  const tableHead = [
    "No.",
    "Fullname",
    "Email address",
    "Mobile",
    "Subject",
    "Message",
    "Answer",
    "Date registered",
    "Option",
  ];

  useEffect(() => {
    if (answer?.id) {
      document.body.style.overflow = "clip";
    }

    function handleClick(e: MouseEvent) {
      if (
        inquiriesFormRef.current &&
        !inquiriesFormRef.current.contains(e.target as any)
      ) {
        setAnswer(null);
      }
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      document.body.style.overflow = "";
    };
  }, [answer?.id]);

  useEffect(() => {
    if (id && refs.current[id]) {
      refs?.current[id]?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [id]);

  function onAnswer(formData: FormData) {
    setTransition(async () => {
      await answerInquiries(formData, answer?.id)
        .then(() => {
          toast.success("Answered");
          setAnswer(null);
          inquiriesFormRef.current?.reset();
        })
        .catch((error) => toast.error(error.message));
    });
  }

  function onPinInquiries(inquirieId: string, isPinned: boolean) {
    setTransition(async () => {
      await pinInquiries(inquirieId, isPinned ? false : true)
        .then(() =>
          toast.success(
            isPinned ? "Unpinned successfully" : "Pinned successfully"
          )
        )
        .catch((err) => toast.error(err.message));
    });
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/80 flex justify-center z-[1001] duration-150 overflow-auto py-10",
          answer ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <form
          action={onAnswer}
          ref={inquiriesFormRef}
          className={cn(
            "bg-white p-6 md:rounded-lg max-w-[40rem] w-full space-y-4 my-auto",
            answer ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
        >
          <div className="flex flex-col gap-y-3">
            <h1 className="font-semibold text-lg">Message</h1>
            <p className="text-sm">{answer?.message}</p>

            <h1 className="font-semibold text-lg">Answer</h1>
            <Textarea
              rows={5}
              placeholder="Write answer"
              name="answer"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button disabled={pending} type="submit">
              Answer
            </Button>
            <Button
              disabled={pending}
              type="button"
              onClick={() => {
                setAnswer(null);
                inquiriesFormRef.current?.reset();
              }}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold uppercase">Inquiries</h1>

        <div className="relative flex items-center flex-1 max-w-[20rem]">
          <MdOutlineSearch className="absolute right-3 scale-[1.4] text-zinc-400" />
          <Input
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Search"
            className="pr-10"
          />
        </div>
      </div>

      <div className="overflow-auto mt-4">
        <table className="border-collapse bg-white w-full">
          <thead>
            <tr>
              {tableHead.map((th, idx) => (
                <th
                  className="border border-green-500 bg-green-500 text-white font-normal p-2 whitespace-nowrap uppercase text-sm"
                  key={idx}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {inquiries
              ?.filter(
                (inquirie) =>
                  inquirie.user.fullName.toLowerCase().includes(search) ||
                  inquirie.user.email.toLowerCase().includes(search) ||
                  inquirie.user.mobile?.toLowerCase().includes(search)
              )
              ?.map((inquirie, idx) => (
                <tr
                  key={inquirie.id}
                  ref={(el) => {
                    refs.current[inquirie.id] = el;
                  }}
                  className={cn(
                    "text-center text-sm hover:bg-zinc-50",
                    inquirie.id === id && "bg-green-100"
                  )}
                >
                  <td className="p-2 border border-[#dddddd]">{idx + 1}.</td>
                  <td className="p-2 border border-[#dddddd]">
                    {inquirie.user.fullName}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {inquirie.user.email}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {inquirie.user.mobile}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {inquirie.subject}
                  </td>
                  <td className="p-2 border border-[#dddddd] whitespace-pre-wrap">
                    {inquirie.message}
                  </td>
                  <td className="p-2 border border-[#dddddd] whitespace-pre-wrap">
                    {inquirie.answer}
                  </td>
                  <td className="p-2 border border-[#dddddd]">
                    {new Date(inquirie.createdAt).toLocaleDateString([], {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="space-y-1 space-x-1 p-2 w-28 border border-[#dddddd]">
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnswer((prev) =>
                          prev?.id === inquirie.id ? null : inquirie
                        );
                      }}
                    >
                      <RiQuestionAnswerFill className="scale-[1.2]" />
                    </Button>
                    <Button
                      onClick={() =>
                        onPinInquiries(inquirie.id, inquirie.isPinned)
                      }
                      disabled={pending}
                      size="sm"
                      variant="outline"
                      className={cn(
                        "shadow-md",
                        inquirie.isPinned ? "bg-green-100" : ""
                      )}
                    >
                      <BsFillPinAngleFill
                        className={cn(
                          "scale-[1.2] duration-200",
                          inquirie.isPinned
                            ? "rotate-[-45deg] text-green-500"
                            : "rotate-0"
                        )}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
