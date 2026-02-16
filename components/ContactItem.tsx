'use client';

import { useState, useTransition } from 'react';
import { useUpdateContact, useDeleteContact } from '@/hooks/useContacts';
import { IContact } from '@/models/Contact';

interface ContactItemProps {
  contact: IContact;
}

export default function ContactItem({ contact }: ContactItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
    company: contact.company || '',
    notes: contact.notes || '',
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      notes: contact.notes || '',
    });
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!editData.email.trim()) {
      setError('Email cannot be empty');
      return;
    }

    startTransition(async () => {
      try {
        await updateMutation.mutateAsync({
          id: contact._id.toString(),
          updates: {
            name: editData.name.trim(),
            email: editData.email.trim(),
            phone: editData.phone || undefined,
            company: editData.company || undefined,
            notes: editData.notes || undefined,
          },
        });
        setIsEditing(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to update contact');
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      startTransition(async () => {
        try {
          await deleteMutation.mutateAsync(contact._id.toString());
        } catch (err: any) {
          setError(err?.message || 'Failed to delete contact');
        }
      });
    }
  };

  if (isEditing) {
    return (
      <tr className="border-t hover:bg-gray-50 transition-colors">
        <td colSpan={4} className="p-4">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={editData.company}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={editData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div>
          <p className="font-medium text-gray-900">{contact.name}</p>
          <p className="text-sm text-gray-600">{contact.email}</p>
        </div>
      </td>
      <td className="p-4 text-gray-600 text-sm">
        {contact.phone && <p className="mb-1">{contact.phone}</p>}
        {contact.company && <p className="text-gray-500">{contact.company}</p>}
      </td>
      <td className="p-4 text-gray-600 text-sm">
        {contact.notes && <p className="line-clamp-2">{contact.notes}</p>}
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            disabled={isPending}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
