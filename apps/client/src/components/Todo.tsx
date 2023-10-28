"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { Todo } from "@acme/api/types";

interface TodoProps {
  todo: Todo;
}

const Todo: React.FC<TodoProps> = ({ todo }) => {
  const { id, text, done } = todo;
  const utils = trpc.useContext(); // Access the context at the component level
  const deleteTodoApi = trpc.todo.deleteTodo.useMutation()
  const toggleTodoApi = trpc.todo.toggleTodo.useMutation()

  // Use useState to manage checkbox state
  const [isChecked, setIsChecked] = useState(done);

  // Function to toggle the checkbox state
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    toggleTodoApi.mutate({ id, done: isChecked }, {
      onSuccess: (err, { done }) => {
        if (!done) alert("Todo was done 🎉")
      }
    });
    utils.todo.all.invalidate();
  };

  const deleteTodo = async () => {
    try {
      await toggleTodoApi.mutate({ id, done: false });
      utils.todo.all.invalidate();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="my-2 flex items-center justify-between rounded border border-gray-300 p-4 shadow-md">
      <label className="flex-1 cursor-pointer">
        <input
          type="checkbox"
          name="done"
          id="done"
          checked={isChecked} // Use 'checked' instead of 'defaultChecked'
          onChange={toggleCheckbox} // Handle checkbox change
          className="mr-2 cursor-pointer"
        />
        <span className={isChecked ? "line-through" : ""}>{text}</span>
      </label>
      <button
        onClick={deleteTodo}
        className="rounded bg-red-500 px-4 py-2 text-white hover-bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default Todo;
