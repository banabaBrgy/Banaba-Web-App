import z from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, { message: "first name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().min(1, { message: "Email address is required" }),
  password: z.string().min(6, { message: "Password must 6 characters long" }),
});
