import Link from 'next/link';
import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to your productivity hub
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This Next.js app combines a simple Todo list and a lightweight CRM so you can keep track of tasks and relationships in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/todos"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Open Todo list
            </Link>
            <Link
              href="/crm"
              className="inline-block bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              Go to CRM
            </Link>
            <Link
              href="/admin"
              className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Admin area
            </Link>
          </div>
        </div>

        {/* Inline read-only todo list on the front page */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center lg:text-left">
              Todo overview
            </h2>
            <p className="text-gray-600 mb-6 text-center lg:text-left">
              Todos are managed from the admin area. You can quickly review them here.
            </p>

            <TodoList readOnly />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Todo list info</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Todos are created and managed by admin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Everyone can see the current todo list.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Use the admin area to add, edit, or delete.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">CRM mini-dashboard</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Store contacts with name, email, phone, and company.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Add notes and context for each relationship.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Edit or remove contacts as things change.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
