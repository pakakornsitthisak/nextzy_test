# Quick Deployment Guide to Vercel

## Prerequisites
- GitHub/GitLab/Bitbucket account with your repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Backend API deployed and accessible (for production)

## Quick Deploy Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your Git repository**

5. **Configure Project Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Add Environment Variables**:
   - Go to "Environment Variables" section
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-api-url.com`
   - Make sure to add for Production, Preview, and Development environments

7. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project root
cd /path/to/nextzy

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

When prompted:
- Set root directory to `frontend`
- Confirm project settings
- Add environment variables when prompted

## Environment Variables

Required environment variable in Vercel:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` | Backend API base URL (without `/api/movies`) |

**Important**: 
- Do NOT include `/api/movies` in the URL
- The frontend code automatically appends `/api/movies` to the base URL
- Example: If your backend is at `https://api.example.com`, set `NEXT_PUBLIC_API_URL=https://api.example.com`

## Backend Deployment

The NestJS backend needs to be deployed separately. Recommended platforms:

- **Railway**: Easy NestJS deployment
- **Render**: Free tier available
- **Vercel Serverless**: Convert to serverless functions
- **DigitalOcean App Platform**: Simple deployment
- **Heroku**: Traditional hosting

After deploying backend, update `NEXT_PUBLIC_API_URL` in Vercel to point to your backend URL.

## Post-Deployment Checklist

- [ ] Verify frontend is accessible at Vercel URL
- [ ] Check environment variables are set correctly
- [ ] Test API connectivity from frontend
- [ ] Verify images load correctly
- [ ] Test search functionality
- [ ] Test movie detail pages
- [ ] Update backend CORS to allow Vercel domain

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### API Not Working
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is deployed and accessible
- Check browser console for errors

### Images Not Loading
- Verify `next.config.ts` has correct image domain settings
- Check that OMDb image URLs are accessible
- Verify image URLs in browser network tab

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main`/`master` branch
- **Preview**: When you push to other branches or create pull requests

## Custom Domain

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

