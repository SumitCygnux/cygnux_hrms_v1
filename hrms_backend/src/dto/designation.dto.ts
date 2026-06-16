import { z } from "zod";

export const createDesignationSchema =z.object({
  title:z.string().min(2),
  department_id:z.string()
});

export type CreateDesignationDto =z.infer<typeof createDesignationSchema>;