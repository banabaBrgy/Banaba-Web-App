"use client";

import React, { ElementRef, useRef, useState, useTransition } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/user";
import { MdVerifiedUser } from "react-icons/md";
import {
  changeEmail,
  changePassword,
  validateChangePassword,
  validateEmail,
  validatePhoneNumber,
} from "@/action/profile";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSendOtpPopup } from "@/utils/zustand";
import { Switch } from "./ui/switch";
import { CircleAlert } from "lucide-react";

interface SecurityFormProp {
  user: UserType | null;
}

export default function SecurityForm({ user }: SecurityFormProp) {
  const sendOtpPopup = useSendOtpPopup();
  const changePasswordFormRef = useRef<ElementRef<"form">>(null);
  const [pending, setTransition] = useTransition();
  const [change, setChange] = useState("");
  const [sendTo, setSendTo] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: user?.email || "",
    mobile: user?.mobile || "",
    newPassword: "",
  });

  function onValidateEmail() {
    setTransition(async () => {
      await validateEmail(inputValue.email)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }

          setChange("email");
          sendOtpPopup.setOpen();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onValidatePhoneNumber() {
    setTransition(async () => {
      await validatePhoneNumber(inputValue.mobile)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }

          setChange("phone number");
          sendOtpPopup.setOpen();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  function onValidateChangePassword(formData: FormData) {
    setTransition(async () => {
      await validateChangePassword(formData, sendTo)
        .then((data) => {
          if (data?.error) {
            return toast.error(data.error);
          }

          setChange("changePassword");
          sendOtpPopup.setOpen();
          changePasswordFormRef.current?.reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  }

  return (
    <TabsContent value="security" className="space-y-3">
      <SendOtpPopup inputValue={inputValue} change={change} />

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>

        <form action={onValidateEmail}>
          <CardContent className="space-y-2">
            {user?.email && (
              <p className="text-xs flex items-center gap-1 text-green-500">
                Verified <MdVerifiedUser />
              </p>
            )}
            <Input
              type="email"
              onChange={(e) =>
                setInputValue((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              value={inputValue.email}
              placeholder="Enter your email"
            />
          </CardContent>

          <CardFooter>
            <Button
              disabled={
                user?.email === inputValue.email || !inputValue.email || pending
              }
            >
              Save email
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone number</CardTitle>
          {!user?.mobile && (
            <CardDescription className="flex items-center gap-1 text-red-500">
              Please input your valid phone number{" "}
              <CircleAlert className="text-red-500" size={17} />
            </CardDescription>
          )}
        </CardHeader>

        <form action={onValidatePhoneNumber}>
          <CardContent className="space-y-2">
            {user?.mobile && (
              <p className="text-xs flex items-center gap-1 text-green-500">
                Verified <MdVerifiedUser />
              </p>
            )}
            <Input
              type="tel"
              onChange={(e) =>
                setInputValue((prev) => ({ ...prev, mobile: e.target.value }))
              }
              pattern="[0-9]{4}[0-9]{3}[0-9]{4}"
              required
              value={inputValue?.mobile}
              placeholder="Enter your phone number ex: 09123456789"
            />
          </CardContent>

          <CardFooter>
            <Button
              disabled={
                inputValue.mobile === user?.mobile ||
                !inputValue.mobile ||
                pending
              }
            >
              Save phone number
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>

        <form action={onValidateChangePassword} ref={changePasswordFormRef}>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm">
                Current password
              </label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm">
                New password
              </label>
              <Input
                type="password"
                onChange={(e) =>
                  setInputValue((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                id="newPassword"
                name="newPassword"
                required
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm">
                Confirm password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Enter confirm password"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center gap-3">
            <Button disabled={pending}>Change password</Button>

            <div className="flex items-center gap-2">
              <Switch
                id="switch"
                checked={sendTo}
                disabled={pending}
                onCheckedChange={(e) => setSendTo(e)}
              />
              <label htmlFor="switch" className="text-sm">
                Verification code will send to your{" "}
                {sendTo ? "phone number" : "email"}
              </label>
            </div>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}

function SendOtpPopup({
  inputValue,
  change,
}: {
  inputValue: { email: string; mobile: string; newPassword: string };
  change: string;
}) {
  const [pending, setTransition] = useTransition();
  const sendOtpPopup = useSendOtpPopup();
  const [otp, setOtp] = useState("");

  function onVerifyOtp() {
    switch (change) {
      case "email":
        setTransition(async () => {
          await changeEmail(inputValue.email, otp)
            .then((data) => {
              if (data?.error) {
                return toast.error(data.error);
              }
              toast.success("Changed email successfully");
              sendOtpPopup.setClose();
              setOtp("");
            })
            .catch(() => toast.error("Something went wrong"));
        });
        break;
      case "phone number":
        alert("phone number");
        break;
      case "changePassword":
        setTransition(async () => {
          await changePassword(inputValue.newPassword, otp)
            .then((data) => {
              if (data?.error) {
                return toast.error(data.error);
              }
              toast.success("Changed password successfully");
              sendOtpPopup.setClose();
              setOtp("");
            })
            .catch(() => toast.error("Something went wrong"));
        });
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/80 z-[1013] flex items-center justify-center duration-200",
        sendOtpPopup.isOpen ? "opacity-100 visible" : "invisible opacity-0"
      )}
    >
      <Card
        className={cn(
          "relative flex-1 max-w-[32rem] mx-3 duration-200",
          sendOtpPopup.isOpen ? "scale-1" : "scale-0"
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg mb-2">Verification code</CardTitle>
          <CardDescription>
            Please enter the 6-digit verification code we sent to your {change}{" "}
            to continue.
          </CardDescription>
        </CardHeader>
        <form action={onVerifyOtp}>
          <CardContent className="flex justify-center">
            <InputOTP value={otp} onChange={(n) => setOtp(n)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="border-gray-300 text-lg p-5"
                />
                <InputOTPSlot
                  index={1}
                  className="border-gray-300 text-lg p-5"
                />
                <InputOTPSlot
                  index={2}
                  className="border-gray-300 text-lg p-5"
                />
                <InputOTPSlot
                  index={3}
                  className="border-gray-300 text-lg p-5"
                />
                <InputOTPSlot
                  index={4}
                  className="border-gray-300 text-lg p-5"
                />
                <InputOTPSlot
                  index={5}
                  className="border-gray-300 text-lg p-5"
                />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
          <CardFooter className="flex sm:flex-row flex-col-reverse gap-2">
            <Button
              disabled={pending}
              type="button"
              onClick={() => {
                sendOtpPopup.setClose();
                setOtp("");
              }}
              className="w-full"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={pending} className="w-full">
              Send
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
