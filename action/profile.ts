"use server";

import { getUser } from "@/lib/user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import axios from "axios";

export async function editProfile(
  formData: FormData,
  profile: string | null | undefined
) {
  const user = await getUser();

  const {
    firstName,
    lastName,
    birthDate,
    age,
    gender,
    civilStatus,
    placeOfBirth,
    sitioPurok,
  } = Object.fromEntries(formData.entries()) as any;

  try {
    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        birthDate,
        age: parseInt(age),
        gender,
        civilStatus,
        placeOfBirth,
        sitioPurok,
        profile,
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error("Error editing profile " + error.message);
  }
}

async function sendEmailVerificationCode(email: string) {
  try {
    const user = await getUser();
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date().getTime() + 3600 * 1000;

    if (!user || !user.id) {
      throw new Error("Unauthorized user");
    }

    if (!verificationCode || !expiresAt) {
      throw new Error("Something went wrong");
    }

    await db.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        verificationCode,
        expiresAt,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Verification code",
      html: `<h1>${verificationCode} this will expired in 1hour</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function sendPhoneVerificationCode(phoneNumber: string) {
  try {
    const user = await getUser();

    const res = await axios.post("https://textbelt.com/otp/generate", {
      phone: phoneNumber,
      userid: user?.id,
      key: process.env.TEXT_BELT_API_KEY,
      message: "Your verification code is $OTP this will expired in 3 minutes",
    });

    if (res.data.success === false) {
      throw new Error("Something went wrong");
    }

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        verificationCode: res.data.otp,
        expiresAt: new Date().getTime() + 3 * 60 * 1000,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function validateEmail(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const existed = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existed && existed.email) {
      throw new Error("Email is already exist");
    }

    await sendEmailVerificationCode(email);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function changeEmail(email: string, otp: string) {
  try {
    const user = await getUser();

    const expiredVerificationCode =
      new Date(parseInt(user?.expiresAt as any)) < new Date();

    if (expiredVerificationCode) {
      throw new Error("Verification code has expired");
    }

    if (otp !== user?.verificationCode) {
      throw new Error("Invalid verification code");
    }

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        email,
        verificationCode: null,
        expiresAt: null,
        isEmailVerified: new Date(),
      },
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function validatePhoneNumber(phoneNumber: string) {
  try {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const existed = await db.user.findUnique({
      where: {
        mobile: phoneNumber,
      },
    });

    if (existed && existed.email) {
      throw new Error("Phone number is already exist");
    }

    const changeFormat = `+63${phoneNumber.slice(1)}`;

    await sendPhoneVerificationCode(changeFormat);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function validateChangePassword(
  formData: FormData,
  sendTo: boolean
) {
  try {
    const user = await getUser();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!user) {
      throw new Error("Anauthorized user");
    }

    const myAccount = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (newPassword !== confirmPassword) {
      throw new Error("New password and Confirm password didn't match");
    }

    if (newPassword === currentPassword) {
      throw new Error("Please provide a stronger password");
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      myAccount?.password as string
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid current password");
    }

    if (sendTo === false) {
      await sendEmailVerificationCode(user.email);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function changePassword(newPassword: string, otp: string) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Anauthorized user");
    }

    if (!newPassword || !otp) {
      throw new Error("newPassword and otp is required");
    }

    const isVerificationCodeExpired =
      new Date(parseInt(user.expiresAt as any)) < new Date();

    if (isVerificationCodeExpired) {
      throw new Error("Verification code has expired");
    }

    if (otp !== user.verificationCode) {
      throw new Error("Invalid verification code");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        password: hashPassword,
        verificationCode: null,
        expiresAt: null,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
