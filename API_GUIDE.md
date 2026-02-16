# API Integration Guide

## Overview
This application features a full-stack Todo + CRM application built with Next.js, TypeScript, MongoDB, and React Query.

## Architecture

### Backend (Server-Side)
- **Server Actions** (`app/actions.ts`) - Direct server function calls from client components
- **API Routes** - RESTful endpoints for external API calls
- **MongoDB** - Database with Mongoose ODM

### Frontend (Client-Side)
- **React Query** - Data fetching, caching, and synchronization
- **Custom Hooks** - Abstraction for API operations
- **React Components** - UI implementation with error handling

---

## API Endpoints

### Todos

#### Get All Todos
```
GET /api/todos
Response: ITodo[]
```

#### Create Todo
```
POST /api/todos
Body: { title: string }
Response: ITodo
```

#### Update Todo
```
PUT /api/todos
Body: { id: string, updates: { title?: string, completed?: boolean } }
Response: ITodo
```

#### Delete Todo
```
DELETE /api/todos
Body: { id: string }
Response: ITodo
```

### Contacts (CRM)

#### Get All Contacts
```
GET /api/contacts
Response: IContact[]
```

#### Create Contact
```
POST /api/contacts
Body: {
  name: string,
  email: string,
  phone?: string,
  company?: string,
  notes?: string
}
Response: IContact
```

#### Update Contact
```
PUT /api/contacts
Body: {
  id: string,
  updates: {
    name?: string,
    email?: string,
    phone?: string,
    company?: string,
    notes?: string
  }
}
Response: IContact
```

#### Delete Contact
```
DELETE /api/contacts
Body: { id: string }
Response: IContact
```

---

## Data Models

### Todo Model
```typescript
interface ITodo {
  _id: ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

### Contact Model
```typescript
interface IContact {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Available Pages

### Public Pages
- **Home** (`/`) - Welcome landing page with quick links
- **Todos** (`/todos`) - Todo list application
- **CRM** (`/crm`) - Read-only contact list view

### Admin Pages
- **Admin Dashboard** (`/admin`) - Comprehensive management interface
  - Dashboard overview
  - Todos manager - Create, edit, and delete todos
  - Contacts manager - Create, edit, and delete contacts

---

## Custom Hooks Usage

### useTodos()
```typescript
const { data: todos, isLoading, error } = useTodos();
```

### useAddTodo()
```typescript
const addTodoMutation = useAddTodo();
await addTodoMutation.mutateAsync('Todo title');
```

### useUpdateTodo()
```typescript
const updateMutation = useUpdateTodo();
await updateMutation.mutateAsync({
  id: 'todoId',
  updates: { title: 'New title', completed: true }
});
```

### useDeleteTodo()
```typescript
const deleteMutation = useDeleteTodo();
await deleteMutation.mutateAsync('todoId');
```

### useContacts()
```typescript
const { data: contacts, isLoading, error } = useContacts();
```

### useAddContact()
```typescript
const addContactMutation = useAddContact();
await addContactMutation.mutateAsync({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 555 000 0000',
  company: 'Acme Corp',
  notes: 'Important contact'
});
```

### useUpdateContact() & useDeleteContact()
Similar pattern to todos

---

## Error Handling

All API endpoints and mutations include built-in error handling:

```typescript
try {
  const result = await mutation.mutateAsync(data);
} catch (error) {
  // Error is automatically shown to user
  console.error(error.message);
}
```

---

## Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete for todos and contacts
✅ **Real-time Updates** - React Query handles automatic cache invalidation
✅ **Type Safety** - Full TypeScript support throughout
✅ **Input Validation** - Server-side validation for data integrity
✅ **Error Messages** - User-friendly error feedback
✅ **Optimistic UI** - Instant feedback with mutation states
✅ **MongoDB Integration** - Persistent data storage
✅ **Responsive Design** - Works on desktop and mobile

---

## Getting Started

1. Set up MongoDB URI in `.env.local` file
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Navigate to `http://localhost:3000`
5. Use the Admin panel to manage todos and contacts
