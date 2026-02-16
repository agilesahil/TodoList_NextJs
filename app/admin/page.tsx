"use client";

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useContacts } from '@/hooks/useContacts';
import ContactForm from '@/components/ContactForm';
import ContactList from '@/components/ContactList';
import AdminTodoManager from '@/components/AdminTodoManager';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'todos' | 'contacts'>('dashboard');

  const {
    data: todos = [],
    isLoading: todosLoading,
  } = useTodos();
  const {
    data: contacts = [],
    isLoading: contactsLoading,
  } = useContacts();

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const openTodos = totalTodos - completedTodos;

  const totalContacts = contacts.length;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-6">ADMIN MENU</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('todos')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors flex justify-between items-center ${
                    activeTab === 'todos'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>Todos</span>
                  <span className="text-xs">
                    {todosLoading ? '...' : totalTodos}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors flex justify-between items-center ${
                    activeTab === 'contacts'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>Contacts</span>
                  <span className="text-xs">
                    {contactsLoading ? '...' : totalContacts}
                  </span>
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Tips
                </h3>
                <p className="text-sm text-gray-600">
                  Use this panel to quickly inspect, clean up, or audit data.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin dashboard</h1>
                  <p className="text-gray-600 mb-6">Manage all todos and CRM contacts in one place.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Total todos</p>
                      <p className="text-4xl font-bold text-gray-900 mb-2">
                        {todosLoading ? '—' : totalTodos}
                      </p>
                      <p className="text-sm text-gray-500">
                        {todosLoading
                          ? 'Loading...'
                          : `${completedTodos} completed, ${openTodos} open`}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">CRM contacts</p>
                      <p className="text-4xl font-bold text-gray-900 mb-2">
                        {contactsLoading ? '—' : totalContacts}
                      </p>
                      <p className="text-sm text-gray-500">Manage relationships and leads.</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium mb-2">Quick links</p>
                      <div className="space-y-2">
                        <a
                          href="/todos"
                          className="block text-blue-600 hover:underline text-sm font-medium"
                        >
                          Open todo app
                        </a>
                        <a
                          href="/crm"
                          className="block text-blue-600 hover:underline text-sm font-medium"
                        >
                          Open CRM app
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'todos' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos manager</h1>
                  <p className="text-gray-600 mb-6">
                    Create, update status, or delete todos from here.
                  </p>

                  <AdminTodoManager />
                </div>
              )}

              {activeTab === 'contacts' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts list</h1>
                  <p className="text-gray-600 mb-6">
                    Inspect, edit, or delete CRM contacts that were created from the Contacts
                    manager.
                  </p>

                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                    <p className="font-medium">Add new contacts from the CRM app</p>
                    <p className="mt-1">
                      Use the{' '}
                      <a href="/crm" className="underline font-semibold hover:no-underline">
                        Contacts manager
                      </a>{' '}
                      to create new CRM contacts. They will automatically appear in this list.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <ContactList />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
