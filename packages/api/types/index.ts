import { z } from "zod";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
import type { AppRouter } from "../src/router";
import { type } from "os";

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

type allTodosOutput = RouterOutput["todo"]["all"];

export type Todo = RouterOutput["todo"]["all"][0];

export const todoInputSchema = z.object({
  text: z
    .string({
      required_error: "Text is required",
    })
    .min(1, "Text must be at least 1 character")
    .max(50, "Text must be less than 50 characters"),
});
