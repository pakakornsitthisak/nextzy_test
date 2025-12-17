# Vercel Deployment Guide

This guide will help you deploy the Nextflix frontend to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub/GitLab/Bitbucket account (for connecting your repository)
- Your backend API deployed and accessible (you'll need the URL)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

3. **Login to Vercel**:

   ```bash
   vercel login
   ```

4. **Deploy**:

   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Deploy

#### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your Git repository**

4. **Configure the project**:

   - **Root Directory**: Set to `frontend` (if deploying from monorepo)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (will run from frontend directory)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (will run from frontend directory)

   **Note**: The `vercel.json` file in the root directory is configured to handle the monorepo structure automatically.

5. **Add Environment Variables**:

   - `NEXT_PUBLIC_API_URL`: Your deployed backend API base URL (without `/api/movies`)
     - Example: `https://your-backend-api.vercel.app`
     - Or if backend is on a different platform: `https://your-backend-domain.com`
     - **Important**: Do NOT include `/api/movies` in the URL - the code appends this automatically

6. **Click "Deploy"**

### 3. Environment Variables

In the Vercel dashboard, go to your project → Settings → Environment Variables and add:

| Variable Name         | Value                          | Description                                  |
| --------------------- | ------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` | Backend API base URL (without `/api/movies`) |

**Note**: Make sure to add this for all environments (Production, Preview, Development).

### 4. Backend Deployment

The backend (NestJS) needs to be deployed separately. Options:

- **Vercel Serverless Functions**: Convert NestJS to serverless functions
- **Railway**: Good for NestJS applications
- **Render**: Free tier available for NestJS
- **Heroku**: Traditional hosting
- **DigitalOcean App Platform**: Simple deployment
- **AWS/GCP/Azure**: Cloud platforms

**Important Backend Configuration:**

When deploying the backend, set the `FRONTEND_URL` environment variable to your Vercel frontend URL:

- Example: `https://your-app.vercel.app`
- This allows CORS requests from your frontend

Once your backend is deployed, update the `NEXT_PUBLIC_API_URL` environment variable in Vercel to point to your backend URL.

### 5. Post-Deployment

After deployment:

1. **Verify the deployment** by visiting your Vercel URL
2. **Check environment variables** are set correctly
3. **Test API connectivity** - ensure frontend can reach backend
4. **Update CORS settings** on backend to allow your Vercel domain

### 6. Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Errors

- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings allow your Vercel domain
- Ensure backend is deployed and accessible

### Image Loading Issues

- Verify `next.config.ts` has correct image domain settings
- Check that OMDb image URLs are accessible

## Continuous Deployment

Vercel automatically deploys when you push to your main branch. For other branches, it creates preview deployments.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
