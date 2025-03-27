import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Build the frontend
console.log('Building the frontend...');
execSync('vite build', { stdio: 'inherit' });

// Ensure we have the functions directory
if (!fs.existsSync('netlify/functions')) {
  fs.mkdirSync('netlify/functions', { recursive: true });
}

// Build netlify function from server code
console.log('Building the Netlify function...');
execSync('esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=netlify/functions', { stdio: 'inherit' });

console.log('Build completed successfully!');