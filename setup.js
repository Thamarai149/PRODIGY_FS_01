#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 Setting up Secure Authentication System...\n');

// Generate a secure JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Create .env file if it doesn't exist
const createEnvFile = () => {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    return;
  }
  
  if (!fs.existsSync(envExamplePath)) {
    console.log('❌ .env.example file not found');
    return;
  }
  
  // Read the example file
  let envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace the JWT secret with a generated one
  const jwtSecret = generateJWTSecret();
  envContent = envContent.replace(
    'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production',
    `JWT_SECRET=${jwtSecret}`
  );
  
  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with secure JWT secret');
};

// Create admin user function (for future use)
const createAdminUser = async () => {
  console.log('\n📝 Admin user creation will be available after starting the server');
  console.log('   You can manually update a user\'s role to "admin" in the database');
};

// Main setup function
const setup = async () => {
  try {
    // Create environment file
    createEnvFile();
    
    // Show next steps
    console.log('\n🎉 Setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run dev');
    console.log('3. Open your browser to: http://localhost:3000');
    console.log('4. Register a new account to get started\n');
    
    console.log('📚 For more information, check the README.md file');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup
setup();