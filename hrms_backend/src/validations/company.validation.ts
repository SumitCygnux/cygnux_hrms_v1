import { z } from "zod";

export const registerCompanySchema =
  z.object({
    companyName: z
      .string()
      .min(3),

    companyEmail: z
      .string()
      .email(),

 phone: z
  .string()
   .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    industry: z
      .string(),

    companySize: z
      .string(),

    country: z
      .string(),

    state: z
      .string(),

    city: z
      .string(),

    address: z
      .string(),

    adminName: z
      .string()
      .min(3),

    adminEmail: z
      .string()
      .email(),

    password: z
      .string()
        .min(3, "Password must be at least 3 characters"),

  });