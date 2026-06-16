import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  manager: z.string().min(2),
  budget: z.number(),
  openPositions: z.number(),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;