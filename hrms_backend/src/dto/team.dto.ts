import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters"),

  departmentId: z
    .string()
    .uuid("Invalid Department ID"),

  status: z
    .enum(["Active", "Inactive"])
    .optional(),
});

export const updateTeamSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(2, "Team name must be at least 2 characters")
    .optional(),

  departmentId: z
    .string()
    .uuid("Invalid Department ID")
    .optional(),

  status: z
    .enum(["Active", "Inactive"])
    .optional(),
});