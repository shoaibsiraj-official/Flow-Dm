import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Enter your full name"),

    workspace: z
      .string()
      .min(2, "Workspace name is required"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscores are allowed"
      ),


    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),

    confirmPassword: z.string(),

    agree: z.boolean().refine((v) => v === true, {
      message: "You need to accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "Enter the full 6-digit code"),
});