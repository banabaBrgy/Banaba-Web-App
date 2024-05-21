import z from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, { message: "first name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().min(1, { message: "Email address is required" }),
  password: z.string().min(6, { message: "Password must 6 characters long" }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must have minimum length of 6" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must have minimum length of 6" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password doesn't match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Please provide a unique and stronger password",
  });
