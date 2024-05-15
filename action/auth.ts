"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  redirect("/log-in");
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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

  cookies().set("token", token, { httpOnly: true, secure: true });

  redirect("/");
}
