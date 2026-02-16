import ContactForm from '@/components/ContactForm';

export default function CRMPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts manager</h1>
            <p className="text-gray-600">
              Create, edit, or delete CRM contacts from here.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All contacts you add here are stored in the shared CRM database and will also show
              up in the Admin contacts list.
            </p>
          </div>

          <ContactForm />

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
            <p className="font-medium">Need a full contacts list?</p>
            <p className="mt-1">
              Go to the{' '}
              <a href="/admin" className="underline font-semibold hover:no-underline">
                Admin panel
              </a>{' '}
              to view, audit, or bulk-manage all CRM contacts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
