'use client';

import { useState, useTransition } from 'react';
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { ITodo } from '@/models/Todo';

interface TodoItemProps {
  todo: ITodo;
  readOnly?: boolean;
}

/**
 * TodoItem Component
 *
 * Displays a single todo with edit, toggle, and delete functionality
 * Includes optimistic UI updates for better UX
 */
export default function TodoItem({ todo, readOnly = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const handleToggleComplete = () => {
    if (readOnly) return;

    startTransition(async () => {
      try {
        const todoId = typeof todo._id === 'string' ? todo._id : todo._id.toString();
        await updateMutation.mutateAsync({ id: todoId, updates: { completed: !todo.completed } });
      } catch (err: any) {
        setError(err?.message || 'Failed to update todo');
      }
    });
  };

  const handleEdit = () => {
    if (readOnly) return;

    setIsEditing(true);
    setEditTitle(todo.title);
    setError(null);
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      setError('Todo title cannot be empty');
      return;
    }

    if (editTitle.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        const todoId = typeof todo._id === 'string' ? todo._id : todo._id.toString();
        await updateMutation.mutateAsync({ id: todoId, updates: { title: editTitle.trim() } });
        setIsEditing(false);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to update todo');
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setError(null);
  };

  const handleDelete = () => {
    if (readOnly) return;

    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    startTransition(async () => {
      try {
        const todoId = typeof todo._id === 'string' ? todo._id : todo._id.toString();
        await deleteMutation.mutateAsync(todoId);
      } catch (err: any) {
        setError(err?.message || 'Failed to delete todo');
      }
    });
  };

  const handleToggleVisibleOnFront = () => {
    if (readOnly) return;

    startTransition(async () => {
      try {
        const todoId = typeof todo._id === 'string' ? todo._id : todo._id.toString();
        await updateMutation.mutateAsync({
          id: todoId,
          updates: { showOnFront: !todo.showOnFront },
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to update visibility');
      }
    });
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={readOnly ? undefined : handleToggleComplete}
        disabled={isPending || readOnly}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {readOnly ? (
        <span
          className={`flex-1 ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          {todo.title}
        </span>
      ) : isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            disabled={isPending}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            autoFocus
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={isPending}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={handleToggleVisibleOnFront}
              disabled={isPending}
              className="text-xs px-2 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {todo.showOnFront ? 'Visible on front page' : 'Hidden from front page'}
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
