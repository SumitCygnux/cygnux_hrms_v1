import {z} from "zod";

export const createLeavePolicySchema  = z.object({ 
    leaveType: z.string().min(1, "Leave type is required"),
    annualLimit: z.coerce
    .number()
    .min(0, "Annual Limit must be 0 or greater")
    .optional(),

  isUnlimited: z.boolean(),

  carryForward: z.boolean(),

  accrualCycle: z.enum(["Monthly", "Quarterly", "Yearly"]),

  status: z.boolean(),
  
});
export const updateLeavePolicySchema = createLeavePolicySchema.partial();
