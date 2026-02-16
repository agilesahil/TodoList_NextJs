import TodoList from '@/components/TodoList';

export default function TodosPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Todo List
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Todos are managed by admin. You can view the list here.
          </p>

          <TodoList readOnly />
        </div>
      </div>
    </main>
  );
}
