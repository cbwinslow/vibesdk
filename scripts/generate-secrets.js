#!/usr/bin/env node

/**
 * Secret Generator for VibSDK Deployment
 * 
 * Generates cryptographically secure random secrets required for
 * VibSDK deployment to Cloudflare Workers.
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

import crypto from 'crypto';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

/**
 * Generate a cryptographically secure random secret
 * @param {number} length - Length of the secret to generate
 * @returns {string} - Random secret string
 */
function generateSecret(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
}

/**
 * Display a secret with formatting
 * @param {string} name - Name of the secret
 * @param {string} value - Secret value
 * @param {string} description - Description of the secret
 */
function displaySecret(name, value, description) {
  console.log(`\n${colors.bright}${colors.blue}${name}${colors.reset}`);
  console.log(`${colors.cyan}${description}${colors.reset}`);
  console.log(`${colors.green}${value}${colors.reset}`);
}

/**
 * Main function
 */
function main() {
  console.log(`\n${colors.bright}${colors.yellow}🔐 VibSDK Secret Generator${colors.reset}`);
  console.log(`${colors.yellow}${'='.repeat(50)}${colors.reset}\n`);
  
  console.log('Generating cryptographically secure secrets for your VibSDK deployment...\n');
  
  // Generate secrets
  const jwtSecret = generateSecret(64);
  const webhookSecret = generateSecret(32);
  const secretsEncryptionKey = generateSecret(32);
  
  // Display secrets with descriptions
  displaySecret(
    'JWT_SECRET',
    jwtSecret,
    'Used for session management and JWT token signing (64 characters)'
  );
  
  displaySecret(
    'WEBHOOK_SECRET',
    webhookSecret,
    'Used for webhook authentication (32 characters)'
  );
  
  displaySecret(
    'SECRETS_ENCRYPTION_KEY',
    secretsEncryptionKey,
    'Used for encrypting stored secrets (32 characters)'
  );
  
  // Display usage instructions
  console.log(`\n${colors.bright}${colors.yellow}📋 Next Steps:${colors.reset}\n`);
  console.log('1. Copy the secrets above');
  console.log('2. Add them to your deployment configuration:');
  console.log(`   ${colors.cyan}• For "Deploy to Cloudflare" button: Enter during deployment flow${colors.reset}`);
  console.log(`   ${colors.cyan}• For manual deployment: Add to .prod.vars file${colors.reset}`);
  console.log(`   ${colors.cyan}• For local development: Add to .dev.vars file${colors.reset}`);
  console.log('\n3. Keep these secrets secure and never commit them to version control');
  
  // Display .env format
  console.log(`\n${colors.bright}${colors.yellow}📝 .env Format:${colors.reset}\n`);
  console.log(`${colors.cyan}JWT_SECRET="${jwtSecret}"${colors.reset}`);
  console.log(`${colors.cyan}WEBHOOK_SECRET="${webhookSecret}"${colors.reset}`);
  console.log(`${colors.cyan}SECRETS_ENCRYPTION_KEY="${secretsEncryptionKey}"${colors.reset}`);
  
  console.log(`\n${colors.yellow}${'='.repeat(50)}${colors.reset}\n`);
  console.log(`${colors.green}✅ Secrets generated successfully!${colors.reset}\n`);
  
  // Security reminder
  console.log(`${colors.bright}${colors.yellow}⚠️  Security Reminder:${colors.reset}`);
  console.log(`${colors.yellow}• Store these secrets securely${colors.reset}`);
  console.log(`${colors.yellow}• Never commit them to version control${colors.reset}`);
  console.log(`${colors.yellow}• Use different secrets for dev and production${colors.reset}`);
  console.log(`${colors.yellow}• Rotate secrets regularly${colors.reset}\n`);
}

// Run the script
main();
