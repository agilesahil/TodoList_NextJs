# Deploy to Vercel

## Before you deploy

1. **MongoDB**: Use a MongoDB Atlas connection string. In Vercel you will add it as an environment variable (see below).

## Deploy with Vercel CLI

1. **Install Vercel CLI** (if needed):
   ```bash
   npm i -g vercel
   ```

2. **Log in** (first time only):
   ```bash
   vercel login
   ```

3. **Deploy** from the project root:
   ```bash
   vercel
   ```
   - First run: link to a new or existing Vercel project and follow prompts.
   - Preview URL will be printed after the build.

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Set environment variables on Vercel

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: your MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
   - **Environment**: Production (and Preview if you want).

3. Redeploy after adding variables (Deployments → … → Redeploy).

## Deploy from Git (optional)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. Add `MONGODB_URI` in project Settings → Environment Variables.
4. Each push to the main branch will trigger a production deploy.

## Troubleshooting: 500 / ECONNREFUSED 127.0.0.1:27017

If the app works locally but fails on the server with **500** or **connect ECONNREFUSED 127.0.0.1:27017**:

- **Cause**: The server is trying to connect to MongoDB at `localhost:27017`. On the server there is no MongoDB running on localhost.
- **Fix**: Use a **remote** MongoDB on the server (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
  1. Create a free cluster at MongoDB Atlas and get a connection string like  
     `mongodb+srv://user:pass@cluster.mongodb.net/todoapp?retryWrites=true&w=majority`
  2. In your host (e.g. Vercel): **Settings → Environment Variables** add:
     - **Name**: `MONGODB_URI`
     - **Value**: your Atlas (or other remote) connection string — **do not use** `mongodb://localhost:27017/...`
  3. Redeploy after saving the variable.
