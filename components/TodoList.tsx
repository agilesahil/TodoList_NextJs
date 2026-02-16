"use client";

import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import { ITodo } from '@/models/Todo';

interface TodoListProps {
  readOnly?: boolean;
}

export default function TodoList({ readOnly = false }: TodoListProps) {
  const { data, isLoading, error } = useTodos();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error loading todos</p>
      </div>
    );
  }

  const todos = (data as ITodo[]) || [];
  const visibleTodos = readOnly
    ? todos.filter((todo) => todo.showOnFront !== false)
    : todos;

  if (visibleTodos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">
          {readOnly
            ? 'No todos yet. Admin can add todos from the admin area.'
            : 'No todos yet. Add one above to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo._id.toString()} todo={todo} readOnly={readOnly} />
      ))}
    </div>
  );
}
