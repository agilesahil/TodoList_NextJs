import { NextResponse } from 'next/server';
import { createContact, getContacts, updateContact, deleteContact } from '@/app/actions';

export async function GET() {
  const res = await getContacts();
  if (!res.success) {
    return NextResponse.json({ error: res.error || 'Failed to fetch contacts' }, { status: 500 });
  }
  return NextResponse.json(res.data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await createContact(body);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to create contact' }, { status: 400 });
    }
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body;
    const res = await updateContact(id, updates);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to update contact' }, { status: 400 });
    }
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    const res = await deleteContact(id);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to delete contact' }, { status: 400 });
    }
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Invalid request' }, { status: 400 });
  }
}
