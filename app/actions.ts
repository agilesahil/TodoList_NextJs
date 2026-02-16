'use server';

import { connectDB, Todo, Contact, type ITodo, type IContact } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Server Actions for Todo CRUD Operations
 * 
 * Server Actions allow us to call server-side functions directly from
 * client components without creating API routes. They automatically handle:
 * - Serialization of arguments and return values
 * - Type safety
 * - Error handling
 * - Revalidation of cached data
 */

export interface TodoResponse {
  success: boolean;
  data?: ITodo | ITodo[];
  error?: string;
}

export interface ContactResponse {
  success: boolean;
  data?: IContact | IContact[];
  error?: string;
}

/**
 * Create a new todo
 */
export async function createTodo(title: string): Promise<TodoResponse> {
  try {
    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: 'Todo title cannot be empty',
      };
    }

    await connectDB();

    const todo = await Todo.create({
      title: title.trim(),
      completed: false,
      showOnFront: true,
      createdAt: new Date(),
    });

    // Revalidate the page to show the new todo
    revalidatePath('/');

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create todo',
    };
  }
}

/**
 * Get all todos
 */
export async function getTodos(): Promise<TodoResponse> {
  try {
    await connectDB();

    const todos = await Todo.find({}).sort({ createdAt: -1 }).lean();

    // Convert MongoDB documents to plain objects
    const todosArray = todos.map((todo) => ({
      _id: todo._id.toString(),
      title: todo.title,
      completed: todo.completed,
      showOnFront: todo.showOnFront ?? true,
      createdAt: todo.createdAt,
    })) as unknown as ITodo[];

    return {
      success: true,
      data: todosArray,
    };
  } catch (error) {
    console.error('Error fetching todos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch todos',
    };
  }
}

/**
 * Update a todo (title and/or completed status)
 */
export async function updateTodo(
  id: string,
  updates: { title?: string; completed?: boolean; showOnFront?: boolean }
): Promise<TodoResponse> {
  try {
    await connectDB();

    const updateData: Partial<ITodo> = {};
    
    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        return {
          success: false,
          error: 'Todo title cannot be empty',
        };
      }
      updateData.title = updates.title.trim();
    }

    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    if (updates.showOnFront !== undefined) {
      updateData.showOnFront = updates.showOnFront;
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!todo) {
      return {
        success: false,
        error: 'Todo not found',
      };
    }

    // Revalidate the page to show updated data
    revalidatePath('/');

    return {
      success: true,
      data: {
        _id: todo._id.toString(),
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt,
      } as unknown as ITodo,
    };
  } catch (error) {
    console.error('Error updating todo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update todo',
    };
  }
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<TodoResponse> {
  try {
    await connectDB();

    const todo = await Todo.findByIdAndDelete(id).lean();

    if (!todo) {
      return {
        success: false,
        error: 'Todo not found',
      };
    }

    // Revalidate the page to remove the deleted todo
    revalidatePath('/');

    return {
      success: true,
      data: {
        _id: todo._id.toString(),
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt,
      } as unknown as ITodo,
    };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete todo',
    };
  }
}

// ============================================
// CONTACT / CRM ACTIONS
// ============================================

/**
 * Create a new contact
 */
export async function createContact(
  contactData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
  }
): Promise<ContactResponse> {
  try {
    if (!contactData.name || contactData.name.trim().length === 0) {
      return {
        success: false,
        error: 'Contact name is required',
      };
    }

    if (!contactData.email || contactData.email.trim().length === 0) {
      return {
        success: false,
        error: 'Contact email is required',
      };
    }

    await connectDB();

    const contact = await Contact.create({
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      phone: contactData.phone?.trim() || undefined,
      company: contactData.company?.trim() || undefined,
      notes: contactData.notes?.trim() || undefined,
    });

    revalidatePath('/admin');
    revalidatePath('/crm');

    return {
      success: true,
      data: contact,
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create contact',
    };
  }
}

/**
 * Get all contacts
 */
export async function getContacts(): Promise<ContactResponse> {
  try {
    await connectDB();

    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();

    const contactsArray = contacts.map((contact) => ({
      _id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      notes: contact.notes,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    })) as unknown as IContact[];

    return {
      success: true,
      data: contactsArray,
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch contacts',
    };
  }
}

/**
 * Update a contact
 */
export async function updateContact(
  id: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  }
): Promise<ContactResponse> {
  try {
    await connectDB();

    const updateData: any = {};

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return {
          success: false,
          error: 'Contact name cannot be empty',
        };
      }
      updateData.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      if (!updates.email.trim()) {
        return {
          success: false,
          error: 'Contact email cannot be empty',
        };
      }
      updateData.email = updates.email.trim().toLowerCase();
    }

    if (updates.phone !== undefined) {
      updateData.phone = updates.phone.trim() || undefined;
    }

    if (updates.company !== undefined) {
      updateData.company = updates.company.trim() || undefined;
    }

    if (updates.notes !== undefined) {
      updateData.notes = updates.notes.trim() || undefined;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    revalidatePath('/admin');
    revalidatePath('/crm');

    return {
      success: true,
      data: {
        _id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        notes: contact.notes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      } as unknown as IContact,
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update contact',
    };
  }
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<ContactResponse> {
  try {
    await connectDB();

    const contact = await Contact.findByIdAndDelete(id).lean();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    revalidatePath('/admin');
    revalidatePath('/crm');

    return {
      success: true,
      data: {
        _id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        notes: contact.notes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      } as unknown as IContact,
    };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete contact',
    };
  }
}
