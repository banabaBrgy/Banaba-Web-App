"use server";

import { getUser } from "@/lib/user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

export async function validateEmail(email: string) {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const existed = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existed && existed.email) {
      return { error: "Email is already exist" };
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
      new Date(Number(user?.expiresAt)) < new Date();

    if (expiredVerificationCode) {
      return { error: "Verification code has expired" };
    }

    if (otp !== user?.verificationCode) {
      return { error: "Invalid verification code" };
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

export const validatePhoneNumber = async (mobile: string) => {
  const isPhoneNumberExisted = await db.user.findUnique({
    where: {
      mobile,
    },
  });

  if (isPhoneNumberExisted && isPhoneNumberExisted.mobile) {
    return true;
  }

  return false;
};

export const changePhoneNumber = async (mobile: string) => {
  const user = await getUser();

  await db.user.update({
    where: {
      id: user?.id,
    },
    data: {
      mobile,
      verificationCode: null,
      expiresAt: null,
      isMobileVerified: new Date(),
    },
  });

  revalidatePath("/");
};

export async function validateChangePassword(formData: FormData) {
  try {
    const user = await getUser();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!user) {
      return { error: "Anauthorized user" };
    }

    const myAccount = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (newPassword !== confirmPassword) {
      return { error: "New password and Confirm password didn't match" };
    }

    if (newPassword === currentPassword) {
      return { error: "Please provide a stronger password" };
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      myAccount?.password as string
    );

    if (!isPasswordMatch) {
      return { error: "Invalid current password" };
    }

    await sendEmailVerificationCode(user.email);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function changePassword(newPassword: string, otp: string) {
  try {
    const user = await getUser();

    if (!user || !user.id) {
      return { error: "Anauthorized user" };
    }

    if (!newPassword || !otp) {
      return { error: "newPassword and otp is required" };
    }

    const isVerificationCodeExpired =
      new Date(parseInt(user.expiresAt as any)) < new Date();

    if (isVerificationCodeExpired) {
      return { error: "Verification code has expired" };
    }

    if (otp !== user.verificationCode) {
      return { error: "Invalid verification code" };
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
