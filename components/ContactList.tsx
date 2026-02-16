'use client';

import { useContacts } from '@/hooks/useContacts';
import ContactItem from './ContactItem';

export default function ContactList() {
  const { data: contacts, isLoading, error } = useContacts();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-medium">Failed to load contacts</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No contacts yet. Use the Contacts manager to add your first contact.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700">NAME</th>
            <th className="text-left p-4 font-semibold text-gray-700">DETAILS</th>
            <th className="text-left p-4 font-semibold text-gray-700">NOTES</th>
            <th className="text-left p-4 font-semibold text-gray-700">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactItem key={contact._id.toString()} contact={contact} />
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-gray-600 text-sm">
        {contacts.length} contacts
      </div>
    </div>
  );
}
