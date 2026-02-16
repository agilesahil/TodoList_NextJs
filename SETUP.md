# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/todoapp`

## 3. Create Environment File

Create `.env.local` in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

**Example for MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

**Example for Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
```

## 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### MongoDB Connection Error

- Verify `MONGODB_URI` in `.env.local` is correct
- For MongoDB Atlas: Check IP whitelist (allow all IPs: `0.0.0.0/0`)
- For local MongoDB: Ensure MongoDB service is running

### Port Already in Use

Change the port:
```bash
PORT=3001 npm run dev
```
