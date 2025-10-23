# 🚀 Cloudflare Deployment Guide

This guide provides step-by-step instructions for deploying VibSDK to Cloudflare Workers, including how to generate and configure all required secrets.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deploy with "Deploy to Cloudflare" Button](#quick-deploy-with-deploy-to-cloudflare-button)
3. [Manual Deployment Setup](#manual-deployment-setup)
4. [Generating Required Secrets](#generating-required-secrets)
5. [Configuration Guide](#configuration-guide)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

### Cloudflare Account Requirements
- ✅ **Cloudflare Workers Paid Plan** (required for most features)
- ✅ **Workers for Platforms subscription** (required for app deployment features)
- ✅ **Advanced Certificate Manager** (required if using first-level subdomains like `abc.xyz.com`)
- ✅ **Custom domain** added to Cloudflare and DNS configured

### API Keys You'll Need
- ✅ **Google Gemini API Key** from [ai.google.dev](https://ai.google.dev) - **Required**
- ⚙️ **Anthropic API Key** (optional, for Claude models)
- ⚙️ **OpenAI API Key** (optional, for GPT models)

### Tools
- ✅ Node.js v18 or later (or Bun for better performance)
- ✅ Git
- ✅ Text editor

---

## Quick Deploy with "Deploy to Cloudflare" Button

The fastest way to deploy VibSDK is using the one-click deployment button:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/vibesdk)

### Step 1: Click the Deploy Button

When you click the button above, you'll be taken to your Cloudflare dashboard to configure your deployment.

### Step 2: Configure Build Variables

During the deployment flow, you'll be asked to provide the following variables:

#### Required Secrets

1. **GOOGLE_AI_STUDIO_API_KEY**
   - Your Google Gemini API key
   - Get it from: [ai.google.dev](https://ai.google.dev)
   
2. **JWT_SECRET**
   - Secure random string for session management
   - See [Generating Required Secrets](#generating-required-secrets) below

3. **WEBHOOK_SECRET**
   - Webhook authentication secret
   - See [Generating Required Secrets](#generating-required-secrets) below

4. **SECRETS_ENCRYPTION_KEY**
   - Encryption key for storing secrets
   - See [Generating Required Secrets](#generating-required-secrets) below

5. **ALLOWED_EMAIL**
   - Email address allowed to use the app
   - Example: `your.email@example.com`

6. **CUSTOM_DOMAIN** ⚠️ **Required**
   - Your custom domain configured in Cloudflare
   - Example: `build.mycompany.com`
   - Must be already added to Cloudflare with DNS configured

#### Optional Configuration

7. **SANDBOX_INSTANCE_TYPE** (optional, default: `standard-3`)
   - Container performance tier
   - Options: `lite`, `standard-1`, `standard-2`, `standard-3` (recommended), `standard-4`

8. **CLOUDFLARE_AI_GATEWAY_TOKEN** (optional but recommended)
   - If provided, AI Gateway will be created automatically
   - Requires **Run** permissions at minimum
   - Token should have Read, Edit, and Run permissions

### Step 3: DNS Configuration

After deployment, add a wildcard DNS record for preview apps:

1. Go to your Cloudflare DNS settings for your custom domain
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `*` (or `*.build` if using `build.mycompany.com`)
   - **Target**: Your base custom domain (e.g., `build.mycompany.com`)
   - **Proxy status**: ✅ Proxied (orange cloud)

Example for domain `build.mycompany.com`:
```
Type: CNAME
Name: *.build
Target: build.mycompany.com
Proxy: ON (orange cloud)
```

⏰ DNS propagation can take up to an hour.

### Step 4: Post-Deployment

After deployment completes:

1. ✅ A GitHub repository is automatically created in your account
2. ✅ Clone the repository to work locally
3. ✅ Pushes to `main` branch trigger automatic deployments
4. ✅ Visit your custom domain to start using VibSDK

---

## Manual Deployment Setup

If you prefer manual deployment or need more control:

### Step 1: Clone the Repository

```bash
git clone https://github.com/cloudflare/vibesdk.git
cd vibesdk
```

Or if you used the "Deploy to Cloudflare" button, clone your auto-created repository:

```bash
git clone https://github.com/YOUR_USERNAME/vibesdk.git
cd vibesdk
```

### Step 2: Install Dependencies

```bash
npm install
# or: bun install (recommended for better performance)
```

### Step 3: Run the Setup Script

The automated setup script will guide you through configuration:

```bash
npm run setup
# or: bun run setup
```

The setup script will:
- ✅ Collect your Cloudflare credentials (Account ID & API Token)
- ✅ Configure your custom domain
- ✅ Set up AI providers (Google Gemini, OpenAI, Anthropic)
- ✅ Generate required secrets automatically
- ✅ Create Cloudflare resources (KV, D1, R2, AI Gateway)
- ✅ Create `.dev.vars` for local development
- ✅ Create `.prod.vars` for production deployment
- ✅ Update `wrangler.jsonc` with resource IDs
- ✅ Set up database migrations

### Step 4: Review Generated Configuration

After setup completes, review the generated files:

**`.dev.vars`** - Local development environment
```bash
cat .dev.vars
```

**`.prod.vars`** - Production deployment environment
```bash
cat .prod.vars
```

### Step 5: Deploy to Cloudflare

```bash
npm run deploy
# or: bun run deploy
```

This command will:
- Build the frontend application
- Update container configurations
- Deploy to Cloudflare Workers
- Run database migrations
- Configure routing

---

## Generating Required Secrets

All secrets should be cryptographically secure random strings. Here are multiple methods to generate them:

### Method 1: Using OpenSSL (Recommended)

**Linux/macOS:**
```bash
# Generate JWT_SECRET (64 characters)
openssl rand -base64 48

# Generate WEBHOOK_SECRET (32 characters)
openssl rand -base64 24

# Generate SECRETS_ENCRYPTION_KEY (32 characters)
openssl rand -base64 24
```

### Method 2: Using Node.js

Create and run this script:

```javascript
// generate-secrets.js
const crypto = require('crypto');

function generateSecret(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

console.log('JWT_SECRET:', generateSecret(64));
console.log('WEBHOOK_SECRET:', generateSecret(32));
console.log('SECRETS_ENCRYPTION_KEY:', generateSecret(32));
```

Run it:
```bash
node generate-secrets.js
```

### Method 3: Using Python

```python
# generate-secrets.py
import secrets
import string

def generate_secret(length):
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

print('JWT_SECRET:', generate_secret(64))
print('WEBHOOK_SECRET:', generate_secret(32))
print('SECRETS_ENCRYPTION_KEY:', generate_secret(32))
```

Run it:
```bash
python3 generate-secrets.py
```

### Method 4: Using Online Tools (Less Secure)

⚠️ **Use with caution for production deployments**

- [Random.org String Generator](https://www.random.org/strings/)
  - Length: 64 for JWT_SECRET, 32 for others
  - Characters: Alphanumeric (a-z, A-Z, 0-9)

### Method 5: Let Setup Script Generate Them

The automated setup script (`npm run setup`) generates all secrets automatically. This is the **recommended approach** for manual deployment.

---

## Configuration Guide

### Environment Variables Reference

Here's a complete reference of all configuration variables:

#### Security (Required)
```bash
JWT_SECRET="<64-char-random-string>"           # Session management
WEBHOOK_SECRET="<32-char-random-string>"       # Webhook authentication
SECRETS_ENCRYPTION_KEY="<32-char-random-string>" # Secrets encryption
```

#### Domain (Required)
```bash
CUSTOM_DOMAIN="build.mycompany.com"            # Your custom domain
ALLOWED_EMAIL="your.email@example.com"         # Allowed user email
```

#### AI Provider Keys (At least one required)
```bash
GOOGLE_AI_STUDIO_API_KEY="<your-key>"          # Google Gemini (recommended)
ANTHROPIC_API_KEY="<your-key>"                 # Claude models (optional)
OPENAI_API_KEY="<your-key>"                    # GPT models (optional)
```

#### Cloudflare Resources (Auto-configured by setup script)
```bash
CLOUDFLARE_API_TOKEN="<your-token>"            # Cloudflare API access
CLOUDFLARE_ACCOUNT_ID="<your-account-id>"      # Your Cloudflare account
CLOUDFLARE_AI_GATEWAY_TOKEN="<your-token>"     # AI Gateway token (optional)
```

#### Optional OAuth (For user authentication)
```bash
# Google OAuth
GOOGLE_CLIENT_ID="<your-client-id>"
GOOGLE_CLIENT_SECRET="<your-client-secret>"

# GitHub OAuth (Login)
GITHUB_CLIENT_ID="<your-client-id>"
GITHUB_CLIENT_SECRET="<your-client-secret>"

# GitHub OAuth (Export feature)
GITHUB_EXPORTER_CLIENT_ID="<your-client-id>"
GITHUB_EXPORTER_CLIENT_SECRET="<your-client-secret>"
```

#### Optional Performance Tuning
```bash
SANDBOX_INSTANCE_TYPE="standard-3"             # Container tier
MAX_SANDBOX_INSTANCES="10"                     # Max concurrent containers
```

### Cloudflare API Token Permissions

Your Cloudflare API token needs these permissions:

**Account Permissions:**
- ✅ Account:Read
- ✅ Workers KV Storage:Edit
- ✅ D1:Edit
- ✅ Workers Scripts:Edit
- ✅ Workers AI:Edit
- ✅ R2:Edit
- ✅ Cloudflare Images:Edit
- ✅ Account Rulesets:Edit

**Zone Permissions (if using custom domain):**
- ✅ Zone Settings:Edit
- ✅ Zone:Edit
- ✅ DNS:Edit

Create token at: [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your custom domain to ensure VibSDK is running:
```
https://build.mycompany.com
```

### 2. Test Preview App DNS

Verify wildcard DNS is working:
```bash
# Replace with your domain
nslookup preview.build.mycompany.com
```

Should resolve to your Cloudflare proxy.

### 3. Set Up OAuth (Optional)

If you want user authentication:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized origins: `https://build.mycompany.com`
6. Add redirect URI: `https://build.mycompany.com/api/auth/callback/google`
7. Copy Client ID and Secret
8. Add to `.prod.vars`:
   ```bash
   GOOGLE_CLIENT_ID="<your-client-id>"
   GOOGLE_CLIENT_SECRET="<your-client-secret>"
   ```
9. Redeploy: `npm run deploy`

#### GitHub OAuth (Login)
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Application name: `VibSDK`
4. Homepage URL: `https://build.mycompany.com`
5. Authorization callback URL: `https://build.mycompany.com/api/auth/callback/github`
6. Copy Client ID and Secret
7. Add to `.prod.vars`:
   ```bash
   GITHUB_CLIENT_ID="<your-client-id>"
   GITHUB_CLIENT_SECRET="<your-client-secret>"
   ```
8. Redeploy: `npm run deploy`

#### GitHub OAuth (Export Feature)
1. Create a **separate** GitHub OAuth app (e.g., `VibSDK Export`)
2. Authorization callback URL: `https://build.mycompany.com/api/github-exporter/callback`
3. Add to `.prod.vars`:
   ```bash
   GITHUB_EXPORTER_CLIENT_ID="<your-export-client-id>"
   GITHUB_EXPORTER_CLIENT_SECRET="<your-export-client-secret>"
   ```
4. Redeploy: `npm run deploy`

### 4. Monitor Your Deployment

Check deployment status in Cloudflare dashboard:
- Workers → Your worker
- Analytics → Performance metrics
- Logs → Real-time logs

---

## Troubleshooting

### Deployment Issues

#### "Insufficient Permissions" Error
**Solution:**
- Authentication is handled automatically during deployment
- Try redeploying - permissions are auto-granted
- Contact Cloudflare support if issue persists

#### "AI Gateway Authentication Failed"
**Solution:**
- Confirm AI Gateway is set to **Authenticated** mode
- Verify token has **Run** permissions
- Check gateway URL format is correct

#### "Database Migration Failed"
**Solution:**
- D1 resources may take time to provision
- Wait a few minutes and retry
- Check that your account has D1 access enabled

#### "Missing Required Variables"
**Solution:**
- Verify all required secrets are set
- Check `.prod.vars` file exists and is complete
- Re-run `npm run setup` if needed

#### "Container Instance Type Issues"
**Solution:**
- Slow previews: Upgrade to `standard-3` or `standard-4`
- Out of memory: Use higher instance type
- Build timeouts: Use `standard-3` or `standard-4` for more CPU

### DNS Issues

#### Wildcard DNS Not Working
**Solution:**
- Verify CNAME record is correct
- Ensure proxy status is ON (orange cloud)
- Wait up to 1 hour for DNS propagation
- Test with: `nslookup *.build.mycompany.com`

#### Custom Domain Not Accessible
**Solution:**
- Verify domain is added to Cloudflare
- Check DNS records are configured
- Ensure API token has zone permissions
- Check `wrangler.jsonc` routes configuration

### Secrets Issues

#### Invalid JWT_SECRET Length
**Solution:**
- JWT_SECRET should be at least 64 characters
- Regenerate using methods in [Generating Required Secrets](#generating-required-secrets)

#### Webhook Authentication Failing
**Solution:**
- Verify WEBHOOK_SECRET matches in all environments
- Check it's a secure random string (32+ characters)
- Redeploy after updating

### AI Provider Issues

#### "API Key Invalid"
**Solution:**
- Verify API key is correct and active
- Check key has proper permissions
- Test key directly with provider's API
- Ensure no extra spaces or quotes

#### Models Not Available
**Solution:**
- Check you have access to the model in your API account
- Verify model name in `worker/agents/inferutils/config.ts`
- Ensure AI Gateway is configured correctly
- Check AI Gateway logs for errors

### Performance Issues

#### Slow App Generation
**Solution:**
- Upgrade SANDBOX_INSTANCE_TYPE to `standard-4`
- Increase MAX_SANDBOX_INSTANCES if hitting limits
- Check AI provider API rate limits
- Monitor Cloudflare Workers analytics

#### Out of Memory Errors
**Solution:**
- Upgrade to higher instance type
- Check generated app for memory leaks
- Reduce concurrent app generations

---

## Additional Resources

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)
- [AI Gateway Docs](https://developers.cloudflare.com/ai-gateway/)

### Community
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Community Forum](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/cloudflare/vibesdk/issues)

### Related Guides
- [Setup Guide](docs/setup.md) - Detailed local development setup
- [README](README.md) - Project overview and quick start
- [CLAUDE.md](CLAUDE.md) - Development guidelines

---

## Quick Reference

### Essential Commands

```bash
# Setup
npm run setup              # Interactive setup wizard

# Development
npm run dev                # Start local development server

# Database
npm run db:migrate:local   # Run local migrations
npm run db:migrate:remote  # Run remote migrations

# Deployment
npm run deploy             # Build and deploy to Cloudflare

# Testing
npm run test               # Run tests
npm run lint               # Run linter
```

### Required Secrets Checklist

Before deployment, ensure you have:

- [ ] `JWT_SECRET` (64 characters)
- [ ] `WEBHOOK_SECRET` (32 characters)
- [ ] `SECRETS_ENCRYPTION_KEY` (32 characters)
- [ ] `GOOGLE_AI_STUDIO_API_KEY`
- [ ] `ALLOWED_EMAIL`
- [ ] `CUSTOM_DOMAIN`
- [ ] Cloudflare API Token with proper permissions
- [ ] Cloudflare Account ID
- [ ] DNS wildcard record configured

### Support

If you need help:

1. Check this deployment guide
2. Review the [Setup Guide](docs/setup.md)
3. Search [GitHub Issues](https://github.com/cloudflare/vibesdk/issues)
4. Ask in [Cloudflare Discord](https://discord.gg/cloudflaredev)
5. Post on [Community Forum](https://community.cloudflare.com/)

---

**Made with 🧡 by Cloudflare**
