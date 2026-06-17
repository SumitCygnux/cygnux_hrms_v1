import { z } from "zod";

export const createStaffSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  gender: z.enum(["Male", "Female", "Other"]),
 
  departmentId: z.string(),
  designationId: z.string(),  
  salary: z.coerce.number(),
  dob: z.string(),
  joiningDate: z.string(),
  address: z.string().min(2),
});