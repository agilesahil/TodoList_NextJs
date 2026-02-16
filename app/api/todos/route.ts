import { NextResponse } from 'next/server';
import { createTodo, getTodos, updateTodo, deleteTodo } from '@/app/actions';

export async function GET() {
  const res = await getTodos();
  if (!res.success) {
    return NextResponse.json({ error: res.error || 'Failed to fetch todos' }, { status: 500 });
  }

  return NextResponse.json(res.data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body.title as string;
    const res = await createTodo(title);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to create todo' }, { status: 400 });
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
    const res = await updateTodo(id, updates);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to update todo' }, { status: 400 });
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
    const res = await deleteTodo(id);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to delete todo' }, { status: 400 });
    }
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Invalid request' }, { status: 400 });
  }
}
