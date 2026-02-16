# Next.js Todo List Application

A production-ready Todo List application built with Next.js 14 (App Router), MongoDB, and TypeScript. This application demonstrates how to build a full-stack application using Next.js Server Actions without requiring a separate backend framework.

## 🏗️ Architecture Overview

This application uses **Next.js Server Actions** to handle all CRUD operations, eliminating the need for a separate backend framework like Express or NestJS. Here's how it works:

### Server Actions vs Traditional Backend

**Traditional Approach:**
```
Client → API Route (/api/todos) → Express/NestJS → Database
```

**Next.js Server Actions Approach:**
```
Client → Server Action (createTodo) → Database
```

Server Actions are server-side functions that can be called directly from client components. They:
- Run exclusively on the server
- Automatically handle serialization
- Provide type safety
- Support progressive enhancement
- Integrate seamlessly with Next.js caching and revalidation

## 📁 Project Structure

```
├── app/
│   ├── actions.ts          # Server Actions for CRUD operations
│   ├── page.tsx            # Main Todo list page (Server Component)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── TodoForm.tsx        # Form component for creating todos
│   └── TodoItem.tsx        # Individual todo item component
├── lib/
│   └── mongodb.ts          # MongoDB connection utility
├── models/
│   └── Todo.ts             # Mongoose Todo model
└── .env.local              # Environment variables (not in git)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/todoapp`

### Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
   ```

   Or for local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 How CRUD Operations Work

### Create Todo

**Server Action** (`app/actions.ts`):
```typescript
export async function createTodo(title: string): Promise<TodoResponse> {
  await connectDB();
  const todo = await Todo.create({ title, completed: false });
  revalidatePath('/'); // Refresh the page data
  return { success: true, data: todo };
}
```

**Client Component** (`components/TodoForm.tsx`):
```typescript
const result = await createTodo(title); // Directly call server function
```

### Read Todos

**Server Component** (`app/page.tsx`):
```typescript
async function TodoList() {
  const result = await getTodos(); // Runs on server
  return <div>{/* Render todos */}</div>;
}
```

### Update Todo

**Server Action**:
```typescript
export async function updateTodo(id: string, updates: {...}) {
  await connectDB();
  const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
  revalidatePath('/');
  return { success: true, data: todo };
}
```

**Client Component**:
```typescript
await updateTodo(todo._id.toString(), { completed: true });
```

### Delete Todo

**Server Action**:
```typescript
export async function deleteTodo(id: string) {
  await connectDB();
  await Todo.findByIdAndDelete(id);
  revalidatePath('/');
  return { success: true };
}
```

## 🔑 Key Concepts

### 1. Database Connection Optimization

The MongoDB connection utility (`lib/mongodb.ts`) uses a caching pattern to:
- Reuse connections across requests
- Prevent connection leaks in development
- Optimize for serverless environments

### 2. Server Components vs Client Components

- **Server Components** (`app/page.tsx`): Fetch data on the server, no JavaScript sent to client
- **Client Components** (`components/*.tsx`): Interactive UI with `'use client'` directive

### 3. Server Actions

- Marked with `'use server'` directive
- Can be imported and called from client components
- Automatically handle form submissions and mutations
- Support progressive enhancement (work without JavaScript)

### 4. Revalidation

After mutations, `revalidatePath('/')` tells Next.js to refresh cached data on the next request, ensuring UI stays in sync.

## 🎨 Features

- ✅ Create todos with validation
- ✅ Read all todos (sorted by creation date)
- ✅ Update todo title and completion status
- ✅ Delete todos with confirmation
- ✅ Optimistic UI updates for better UX
- ✅ Error handling and user feedback
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Server Functions**: Next.js Server Actions

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/todoapp` |

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

### Important Notes for Production

- Ensure MongoDB connection string is secure (use environment variables)
- MongoDB Atlas allows connections from anywhere by default
- For local MongoDB, configure firewall rules appropriately
- Consider adding rate limiting for production use

## 🔒 Security Considerations

- ✅ Environment variables for sensitive data
- ✅ Input validation on server side
- ✅ No SQL injection (MongoDB uses NoSQL)
- ✅ Server Actions run on server (no client-side DB access)
- ⚠️ Add authentication/authorization for multi-user scenarios
- ⚠️ Add rate limiting for production

## 🤔 Why No Separate Backend?

Next.js Server Actions provide:

1. **Simplified Architecture**: One codebase, one deployment
2. **Type Safety**: Shared types between client and server
3. **Better Performance**: No API roundtrips, direct server calls
4. **Progressive Enhancement**: Forms work without JavaScript
5. **Automatic Serialization**: No need to manually serialize/deserialize
6. **Built-in Caching**: Integrated with Next.js caching system

## 📖 Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/)

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` is set correctly in `.env.local`
- Check MongoDB Atlas IP whitelist (should allow all IPs for development)
- Ensure MongoDB service is running (for local setup)

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## 📄 License

MIT

---

Built with ❤️ using Next.js and MongoDB
