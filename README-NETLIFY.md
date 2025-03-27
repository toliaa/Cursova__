# Deploying to Netlify

This guide will help you deploy the University Research Portal to Netlify.

## Prerequisites

1. Create a Netlify account if you don't already have one
2. Install the Netlify CLI (optional, for local testing)

## Deployment Steps

### Option 1: Manual Deployment

1. Build the project locally:
   ```
   npm run build
   ```

2. Deploy the `dist/public` directory to Netlify using the drag and drop interface in the Netlify dashboard

### Option 2: Connecting to Git Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. In the Netlify dashboard, click "New site from Git"
3. Choose your Git provider and authorize Netlify
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. Click "Deploy site"

## Environment Variables

Make sure to set the following environment variables in the Netlify dashboard:

- `DATABASE_URL`: Your PostgreSQL database URL
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `production`

## Troubleshooting

If you encounter issues with API requests, check:

1. The URL format in the client code should point to `/.netlify/functions/api` in production
2. CORS headers should be properly set in the API function
3. Database connectivity from Netlify Functions to your database

## Functions

The `netlify/functions` directory contains the serverless functions that power the API endpoints. The main function is `api.js` which handles all API requests.