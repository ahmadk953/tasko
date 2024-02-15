import { z } from "zod";

export const CreateList = z.object({
  title: z.string({
    required_error: "List title is required",
    invalid_type_error: "List title must be a string",
  }).min(2, {
    message: "List title must be at least 2 characters",
  }),
  boardId: z.string(),
})