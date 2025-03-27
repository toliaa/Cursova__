// This script is used by Vercel to build the client-side application
const { execSync } = require('child_process');
const path = require('path');

// Build the client application
console.log('Building client application...');
try {
  // Set NODE_ENV to production
  process.env.NODE_ENV = 'production';
  
  // Run the build command from the root directory
  execSync('cd .. && npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('Client build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}