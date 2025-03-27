# Deploying to Netlify

This guide will help you deploy the University Research Portal to Netlify.

## Prerequisites

1. Create a Netlify account if you don't already have one
2. Make sure you have a PostgreSQL database accessible from the internet (Neon, Supabase, etc.)

## Deployment Steps

### Option 1: Deploy from the Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. In the Netlify dashboard, click "Add new site" → "Import an existing project"
3. Choose your Git provider and authorize Netlify
4. Select your repository
5. Configure the build settings:
   - Build command: `node netlify-build.js`
   - Publish directory: `dist/public`
6. Add the required environment variables (see Environment Variables section below)
7. Click "Deploy site"

### Option 2: Deploy using Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Log in to your Netlify account: `netlify login`
3. Initialize your site: `netlify init`
4. Configure your build settings as described in Option 1
5. Deploy your site: `netlify deploy --prod`

## Environment Variables

**IMPORTANT**: The application requires these environment variables to function correctly.

Set the following environment variables in the Netlify dashboard (Site settings → Environment variables):

- `DATABASE_URL`: Your PostgreSQL database URL (required)
- `JWT_SECRET`: Secret key for JWT token generation (required)
- `NODE_ENV`: Set to `production`

## Troubleshooting

### Database Connection Issues

- Make sure your database is accessible from Netlify's IP range
- Check if your database URL is correctly formatted
- Verify SSL settings in your database connection string

### API Request Errors

- The URL format is already configured to use `/.netlify/functions/api` in production
- If you get CORS errors, check the allowed origins in the Netlify function
- Check the function logs in the Netlify dashboard

### Build Failures

- The `netlify-build.js` script installs necessary dependencies like `@babel/preset-typescript` and `lightningcss`
- If you're still having issues, try installing these dependencies directly in your package.json

## Testing Locally

To test your Netlify functions locally:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Start the local development server: `netlify dev`
3. Your site will be available at `http://localhost:8888` with functions at `http://localhost:8888/.netlify/functions/api`

## Files Explained

- `netlify.toml`: Configuration file for Netlify build settings and redirects
- `netlify/functions/api.ts`: The serverless function that serves all API requests
- `netlify-build.js`: Custom build script to handle dependencies and build process
- `netlify.sh`: Helper script for environment setup