#!/bin/bash

# This script helps prepare the Netlify function environment

# Install required dependencies
echo "Installing dependencies for Netlify Functions..."
npm install @babel/preset-typescript lightningcss

# Make sure all environment variables are available
echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL is not set. Database connections may fail."
fi

if [ -z "$JWT_SECRET" ]; then
  echo "Warning: JWT_SECRET is not set. Using default value for development only."
  export JWT_SECRET="your-secret-key-for-dev-only"
fi

# Done
echo "Netlify environment setup complete!"