"use client";

import { useState } from "react";
import { ITodo } from "@/models/Todo";
import { useTodos, useAddTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { useTransition } from "react";

function formatDate(value: Date | string | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function AdminTodoRow({ todo }: { todo: ITodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const id = typeof todo._id === "string" ? (todo._id as unknown as string) : todo._id.toString();

  const handleToggleStatus = () => {
    startTransition(async () => {
      try {
        await updateMutation.mutateAsync({ id, updates: { completed: !todo.completed } });
      } catch (err: any) {
        setError(err?.message || "Failed to update status");
      }
    });
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      setError("Todo title cannot be empty");
      return;
    }

    if (editTitle.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        await updateMutation.mutateAsync({ id, updates: { title: editTitle.trim() } });
        setIsEditing(false);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Failed to update todo");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    startTransition(async () => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        setError(err?.message || "Failed to delete todo");
      }
    });
  };

  const handleToggleFront = () => {
    startTransition(async () => {
      try {
        await updateMutation.mutateAsync({
          id,
          updates: { showOnFront: !todo.showOnFront },
        });
      } catch (err: any) {
        setError(err?.message || "Failed to update visibility");
      }
    });
  };

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3 align-middle">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditTitle(todo.title);
              }
            }}
            disabled={isPending}
            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            autoFocus
          />
        ) : (
          <span className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
            {todo.title}
          </span>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="px-4 py-3 align-middle">
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={isPending}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            todo.completed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {todo.completed ? "Completed" : "Pending"}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 align-middle">
        {formatDate(todo.createdAt)}
      </td>
      <td className="px-4 py-3 align-middle">
        <button
          type="button"
          onClick={handleToggleFront}
          disabled={isPending}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            todo.showOnFront
              ? "border-blue-200 text-blue-700 bg-blue-50"
              : "border-gray-200 text-gray-600 bg-gray-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {todo.showOnFront ? "Shown on front" : "Hidden from front"}
        </button>
      </td>
      <td className="px-4 py-3 align-middle text-right space-x-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(todo.title);
                setError(null);
              }}
              disabled={isPending}
              className="inline-flex items-center px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-xs font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setEditTitle(todo.title);
                setError(null);
              }}
              disabled={isPending}
              className="inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function AdminTodoManager() {
  const { data, isLoading, error } = useTodos();
  const addTodo = useAddTodo();

  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const todos = (data as ITodo[]) || [];
  const completedCount = todos.filter((t) => t.completed).length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError("Todo title cannot be empty");
      return;
    }

    setFormError(null);
    const currentTitle = title;

    try {
      await addTodo.mutateAsync(currentTitle);
      setTitle("");
    } catch (err: any) {
      setFormError(err?.message || "Failed to create todo");
      setTitle(currentTitle);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {todos.length} records · {completedCount} completed
        </span>
      </div>

      {/* Add new todo */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add new todo
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFormError(null);
            }}
            disabled={addTodo.isPending}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={addTodo.isPending || !title.trim()}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addTodo.isPending ? "Adding..." : "Add todo"}
          </button>
        </div>
        {formError && <p className="text-xs text-red-600">{formError}</p>}
      </form>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Front</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading todos...
                </td>
              </tr>
            )}
            {error && !isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                  Failed to load todos
                </td>
              </tr>
            )}
            {!isLoading && !error && todos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No todos yet.
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              todos.length > 0 &&
              todos.map((todo) => <AdminTodoRow key={todo._id.toString()} todo={todo} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

