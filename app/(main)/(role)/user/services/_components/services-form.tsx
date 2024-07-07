"use client";

import React, { ElementRef, useRef, useTransition } from "react";
import { requestDocument } from "@/action/user/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DocumentType } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { UserType } from "@/lib/user";

interface ServicesFormProp {
  documentTypes: DocumentType[] | undefined;
  user: UserType | null;
}

export default function ServicesForm({
  documentTypes,
  user,
}: ServicesFormProp) {
  const [pending, setTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);

  function handleMyRequest(formData: FormData) {
    setTransition(async () => {
      await requestDocument(formData)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }
          toast.success("Requested successfully");
          formRef.current?.reset();
        })
        .catch(() => toast.error("Somthing went wrong"));
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
    <>
      <form ref={formRef} action={handleMyRequest} className="mt-4 space-y-4">
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
                to a request document.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label htmlFor="document" className="text-sm">
            Document
          </label>
          <select
            id="document"
            name="document"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Choose Document</option>
            {documentTypes?.map((doc) => (
              <option key={doc.id} value={doc?.document} className="capitalize">
                {doc?.document}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="Purposes" className="text-sm">
            Purposes
          </label>
          <Textarea
            rows={10}
            required
            placeholder="Enter purposes"
            name="purposes"
          />
        </div>

        <Button
          disabled={pending || missingProfileInfo}
          className="w-full uppercase"
        >
          {pending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </>
  );
}
