const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in production mode for Netlify
process.env.NODE_ENV = 'production';

// Create a function to run shell commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
}

// Run environment setup first
console.log('Running environment setup...');
require('./netlify-env-setup');

// Install dependencies required for Netlify build
console.log('Installing Netlify-specific dependencies...');
try {
  runCommand('npm install @babel/preset-typescript lightningcss --no-save');
} catch (error) {
  console.warn('Warning: Could not install some dependencies, build might fail');
}

// Build the frontend using Vite
console.log('Building frontend...');
runCommand('vite build');

// Build the server-side code using esbuild directly
console.log('Building server-side code...');
runCommand('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');

// Copy the necessary files for Netlify Functions
console.log('Preparing Netlify Functions...');

// Make sure netlify/functions directory exists
if (!fs.existsSync(path.join(__dirname, 'netlify', 'functions'))) {
  fs.mkdirSync(path.join(__dirname, 'netlify', 'functions'), { recursive: true });
}

// Make netlify.sh executable
try {
  fs.chmodSync(path.join(__dirname, 'netlify.sh'), '755');
  console.log('Made netlify.sh executable');
} catch (error) {
  console.warn('Warning: Could not make netlify.sh executable');
}

// Add a Netlify environment variables template
const envTemplateContent = `# Sample environment variables for Netlify
# Add these to your Netlify site configuration
DATABASE_URL=postgres://username:password@host:port/database
JWT_SECRET=your-secret-key-for-production
NODE_ENV=production
`;

fs.writeFileSync(path.join(__dirname, '.env.netlify.template'), envTemplateContent);
console.log('Created .env.netlify.template file as a reference for required environment variables');

console.log('Build completed successfully!');