"use client";

import React, { useState, useRef, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { todoInputSchema } from "@acme/api/types";
import { ZodError } from "zod";

export function CreateTodo() {
  const [todo, setTodo] = useState("");
  const createPost = trpc.todo.createTodo.useMutation();
  const utils = trpc.useContext();

  const inputRef = useRef(null);

  // Function to automatically focus on the input element
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Use useEffect to automatically focus when the component mounts
  useEffect(() => {
    focusInput();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the input data using Zod schema
      const validatedData = todoInputSchema.parse({ text: todo });
      console.log("Input is valid:", validatedData);

      // Trigger the createTodo mutation
      await createPost.mutate(
        { text: todo },
        {
          onSettled: () => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            utils.todo.all.cancel();

            // Snapshot the previous value
            const previousTodos: any = utils.todo.all.getData();

            // Optimistically update to the new value
            const newTodo = { id: "1", text: todo, done: false };
            const updatedTodos: any = [...previousTodos, newTodo];
            utils.todo.all.setData(undefined, updatedTodos);
            setTodo(""); // Clear the input field on success

            return { ...previousTodos, newTodo };
          },
          onError: (error, newTodo, context) => {
            console.log("Input is invalid:", error.message);
            setTodo("");
            // utils.todo.all.setData(undefined, () => context.previousTodos);
          },
          onSuccess() {
            utils.todo.all.invalidate();
            setTodo(""); // Clear the input field on success
          },
        },
      );
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        console.error("Input is invalid:", error.message);
        focusInput(); // Focus the input field after an error
      }
    } finally {
      focusInput();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        ref={inputRef} // Assign the ref to the input element
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
