// This script is used by Vercel to build the client-side application
const { execSync } = require('child_process');

// Build the client application
console.log('Building client application...');
execSync('npm run build', { stdio: 'inherit' });

// Copy the client build to the Vercel serverless function directory
console.log('Client build completed successfully!');