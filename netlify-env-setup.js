// This script helps prepare the Netlify build environment
// It's used by netlify-build.js during the build process

const fs = require('fs');
const path = require('path');

// Check if we need to install additional dependencies
const missingDeps = [];

try {
  require('@babel/preset-typescript/package.json');
} catch (error) {
  missingDeps.push('@babel/preset-typescript');
}

try {
  require('lightningcss');
} catch (error) {
  missingDeps.push('lightningcss');
}

// Log the missing dependencies
if (missingDeps.length > 0) {
  console.log(`Missing dependencies detected: ${missingDeps.join(', ')}`);
  console.log('These will be installed during the build process.');
}

// Check for required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('These must be set in the Netlify dashboard for the application to work properly.');
}

// Create a temporary environment file for local testing if needed
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('Creating a sample .env.local file for local development...');
    fs.writeFileSync(
      envPath,
      `# Sample environment variables for local development
# Replace these with your actual values
DATABASE_URL=postgres://username:password@host:port/database
JWT_SECRET=your-secret-key-for-local-dev
NODE_ENV=development
`
    );
    console.log('Created .env.local template file. Edit it with your actual values.');
  }
}