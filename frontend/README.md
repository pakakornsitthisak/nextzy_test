# Nextflix Frontend

Next.js frontend application for the Nextflix movie discovery platform.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Backend API URL
# For local development, use: http://localhost:3000
# For production, use your deployed backend URL (e.g., https://your-backend.vercel.app)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Note:** The `.env.local` file is gitignored and won't be committed to the repository.

### Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```
