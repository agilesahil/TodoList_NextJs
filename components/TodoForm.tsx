"use client";

import { useState } from 'react';
import { useAddTodo } from '@/hooks/useTodos';

/**
 * TodoForm Component
 * 
 * Handles creating new todos with optimistic UI updates
 */
export default function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const addTodoMutation = useAddTodo();

  const isLoading = addTodoMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Todo title cannot be empty');
      return;
    }

    setError(null);
    setSuccess(false);
    const currentTitle = title;
    
    try {
      await addTodoMutation.mutateAsync(currentTitle);
      setTitle('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err: any) {
      setError(err?.message || 'Failed to create todo');
      setTitle(currentTitle);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Add a new todo..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600 font-medium">✓ Todo added successfully!</p>
      )}
    </form>
  );
}

