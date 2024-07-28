"use client";

import React, {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  changePhoneNumber,
  validateChangePassword,
  validateEmail,
} from "@/action/profile";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSendOtpPopup } from "@/utils/zustand";
import { CircleAlert } from "lucide-react";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/firebase";

interface SecurityFormProp {
  user: UserType | null;
}

export default function SecurityForm({ user }: SecurityFormProp) {
  const sendOtpPopup = useSendOtpPopup();
  const changePasswordFormRef = useRef<ElementRef<"form">>(null);
  const [pending, setTransition] = useTransition();
  const [change, setChange] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [inputValue, setInputValue] = useState({
    email: user?.email || "",
    mobile: user?.mobile || "",
    newPassword: "",
  });

  useEffect(() => {
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    setRecaptchaVerifier(recaptcha);

    return () => recaptcha.clear();
  }, []);

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
    if (!recaptchaVerifier) {
      return toast.error("Recaptcha is required");
    }

    setTransition(async () => {
      try {
        const E164FORMAT = `+63${inputValue.mobile.slice(1)}`;
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          E164FORMAT,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        setChange("phone number");
        sendOtpPopup.setOpen();
      } catch (error: any) {
        if (error.code === "auth/invalid-phone-number") {
          toast.error("Invalid phone number");
        } else if (error.code === "auth/too-many-requests") {
          toast.error("Too many requests. Please try again later");
        } else {
          toast.error("Something went wrong.");
        }
      }
    });
  }

  function onValidateChangePassword(formData: FormData) {
    setTransition(async () => {
      await validateChangePassword(formData)
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
    <>
      <div id="recaptcha-container"></div>

      <TabsContent value="security" className="space-y-3">
        <SendOtpPopup
          inputValue={inputValue}
          change={change}
          confirmationResult={confirmationResult}
        />

        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>

          <form action={onValidateEmail}>
            <CardContent className="space-y-2">
              {user?.isEmailVerified && (
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
                  user?.email === inputValue.email ||
                  !inputValue.email ||
                  pending
                }
                className="bg-green-500 hover:bg-green-500/80 uppercase text-xs"
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
              {user?.isMobileVerified && (
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
                className="bg-green-500 hover:bg-green-500/80 uppercase text-xs"
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
              <Button
                disabled={pending}
                className="bg-green-500 hover:bg-green-500/80 uppercase text-xs"
              >
                Change password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </>
  );
}

function SendOtpPopup({
  inputValue,
  change,
  confirmationResult,
}: {
  inputValue: { email: string; mobile: string; newPassword: string };
  change: string;
  confirmationResult: ConfirmationResult | null;
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
              toast.success("Email saved successfully");
              sendOtpPopup.setClose();
              setOtp("");
            })
            .catch(() => toast.error("Something went wrong"));
        });
        break;
      case "phone number":
        setTransition(async () => {
          try {
            const res = await confirmationResult?.confirm(otp);
            console.log(res);
            if (res?.user) {
              await changePhoneNumber(inputValue.mobile)
                .then(() => {
                  toast.success("Phone number saved successfully");
                  sendOtpPopup.setClose();
                  setOtp("");
                })
                .catch(() => toast.error("Something went wrong"));
            }
          } catch (error: any) {
            console.log(error.code);
            if (error.code === "auth/invalid-verification-code") {
              toast.error("Invalid verification code");
            } else if (error.code === "auth/code-expired") {
              toast.error("Verification has expired");
            } else {
              toast.error("Something went wrong");
            }
          }
        });
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
