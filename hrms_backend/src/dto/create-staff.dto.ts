import { z } from "zod";

export const createStaffSchema = z.object({
  fullName: z.string().min(3),
 lastName: z.string().min(1),
  email: z.string().email(),

  phone: z.string().min(10),

  gender: z.enum(["Male", "Female", "Other"]),

  password: z.string().min(1).optional(),

  departmentId: z.string().uuid(),

  designationId: z.string().uuid(),

  salary: z.coerce.number(),

  dob: z.string(),

  joiningDate: z.string(),

  address: z.string().min(2),

  role: z.string().optional(),

  accessRoleId: z.string().uuid().optional(),

  teamId: z.string().uuid().nullable().optional(),


  employmentType: z.string().optional(),

reportingManagerId: z.coerce.number().nullable().optional(),
  status: z.string().optional(),

});