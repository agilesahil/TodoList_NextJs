import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Todo + CRM',
  description: 'A production-ready todo list and CRM application built with Next.js and MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          {/* Navigation Header */}
          <header className="bg-white shadow-sm border-b">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 text-white rounded-md px-3 py-2 font-bold text-sm">
                  TC
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Todo + CRM</h1>
                  <p className="text-xs text-gray-600">Next.js demo workspace</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link href="/todos" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Todos
                </Link>
                <Link href="/crm" className="text-gray-700 hover:text-gray-900 transition-colors">
                  CRM
                </Link>
                <Link href="/admin" className="text-gray-700 hover:text-gray-900 transition-colors font-semibold">
                  Admin
                </Link>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-600">
            <p>Built with Next.js App Router</p>
            <p className="mt-1">Todos + simple CRM demo</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
