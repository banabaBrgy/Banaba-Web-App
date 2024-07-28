"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import nodemailer from "nodemailer";

interface ActionRegisterType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function actionRegister(data: ActionRegisterType) {
  const { firstName, lastName, email, password } = data;

  const emailExist = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExist) return { error: "Email is already exist" };

  const hashPassword = await bcrypt.hash(password, 10);

  const fullName = `${firstName} ${lastName}`;

  await db.user.create({
    data: {
      fullName: fullName,
      firstName,
      lastName,
      email,
      password: hashPassword,
    },
  });

  await generateVerificationToken(email);
}

export async function actionLogIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.email) {
    return { error: "Email doesn't exist" };
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) return { error: "Email or password is incorrect!" };

  if (!user.isEmailVerified) {
    return await generateVerificationToken(email);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 100000000000000,
  });

  redirect(user.role === "Admin" ? "/admin" : "/user");
}

export async function verifyEmail(jwtEmail: string, verificationCode: string) {
  try {
    const verify = jwt.verify(jwtEmail, process.env.JWT_SECRET!) as {
      email: string;
    };

    if (!verify.email) return { error: "Token has expired!" };

    const user = await db.user.findUnique({
      where: {
        email: verify.email,
      },
    });

    const codeHasExpired =
      new Date(parseInt(user?.expiresAt as any)) < new Date();

    if (codeHasExpired) return { error: "Verification code has expired!" };

    if (verificationCode !== user?.verificationCode) {
      return { error: "Invalid verification code" };
    }

    await db.user.update({
      where: {
        email: verify.email,
      },
      data: {
        isEmailVerified: new Date(),
        verificationCode: null,
        expiresAt: null,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    cookies().set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000000000000,
    });

    return { data: user.role };
  } catch (error: any) {
    throw new Error("Verify email error" + error.message);
  }
}

async function generateVerificationToken(email: string) {
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date().getTime() + 3600 * 1000;

  await sendEmailVerificationCode(email, verificationCode);

  await db.user.update({
    where: {
      email,
    },
    data: {
      verificationCode,
      expiresAt,
    },
  });

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  redirect(`/verification?token=${token}`);
}

async function sendEmailVerificationCode(
  email: string,
  verificationCode: string
) {
  try {
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
      html: `<h1>Your verification code is ${verificationCode} please don't share it to anyone</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error: any) {
    throw new Error("Error sending email verification code", error.message);
  }
}

export async function logout() {
  cookies().delete("token");
}

// fortgot password

export async function sendEmailForgotPassword(email: string) {
  try {
    const jwtEmail = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
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
      subject: "Forgot password",
      html: `<a href=${`${process.env.MAIN_BASE_URL}/forgot-password?token=${jwtEmail}`}>Forgot password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error: any) {
    throw new Error("Error sending email forgot password", error.message);
  }
}

interface ChangePasswordType {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  data: ChangePasswordType,
  jwtEmail: string
) {
  try {
    const verify = jwt.verify(jwtEmail, process.env.JWT_SECRET!) as {
      email: string;
    };

    if (!verify.email) return { error: "Token has expired!" };

    const user = await db.user.findUnique({
      where: {
        email: verify.email,
      },
    });

    const passwordCompare = await bcrypt.compare(
      data.currentPassword,
      user?.password as string
    );

    if (!passwordCompare) return { error: "Invalid current password" };

    const hashPassword = await bcrypt.hash(data.newPassword, 10);

    await db.user.update({
      where: {
        email: verify.email,
      },
      data: {
        password: hashPassword,
      },
    });

    return { data: "Changed password successfully!" };
  } catch (error: any) {
    throw new Error("Change password error" + error.message);
  }
}
