import { z } from "zod";

export interface RegisterCompanyDto {
  companyName: string;
  companyEmail: string;
  phone: string;
  industry: string;
  companySize: string;
  country: string;
  state: string;
  city: string;
  address: string;

  adminName: string;
  adminEmail: string;
  password: string;
}

export const registerCompanySchema = z.object({
  companyName: z.string().min(3),
  companyEmail: z.string().email(),
  phone: z.string(),
  industry: z.string(),
  companySize: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),

  adminName: z.string().min(3),
  adminEmail: z.string().email(),
  password: z.string().min(8),
});

export interface LoginDto {
  email: string;
  password: string;
}