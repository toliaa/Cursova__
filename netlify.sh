#!/bin/bash

# Build the frontend
echo "Building the frontend..."
npm run build

# Create Netlify directory if it doesn't exist
mkdir -p netlify/functions

# Transpile the Netlify function
echo "Building Netlify function..."
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=netlify/functions/build

echo "Build completed successfully!"