# ⚡ Quick Start Guide

Get VibSDK up and running in minutes!

## Choose Your Path

### 🚀 Option 1: One-Click Deploy (Fastest)

Perfect for getting started quickly with a production-ready instance.

1. **Click the Deploy Button**
   
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/vibesdk)

2. **Generate Secrets**
   
   Before clicking deploy, generate your required secrets:
   
   ```bash
   # Using Node.js (if you have Node installed)
   node -e "const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';const g=l=>{let r='';const b=require('crypto').randomBytes(l);for(let i=0;i<l;i++)r+=c[b[i]%c.length];return r};console.log('JWT_SECRET:',g(64));console.log('WEBHOOK_SECRET:',g(32));console.log('SECRETS_ENCRYPTION_KEY:',g(32));"
   ```
   
   Or use OpenSSL:
   ```bash
   echo "JWT_SECRET: $(openssl rand -base64 48)"
   echo "WEBHOOK_SECRET: $(openssl rand -base64 24)"
   echo "SECRETS_ENCRYPTION_KEY: $(openssl rand -base64 24)"
   ```

3. **Get Your Google Gemini API Key**
   
   Visit [ai.google.dev](https://ai.google.dev) and create an API key (free tier available)

4. **Configure During Deployment**
   
   When prompted, enter:
   - ✅ `GOOGLE_AI_STUDIO_API_KEY` - Your Gemini API key
   - ✅ `JWT_SECRET` - Generated secret (64 chars)
   - ✅ `WEBHOOK_SECRET` - Generated secret (32 chars)
   - ✅ `SECRETS_ENCRYPTION_KEY` - Generated secret (32 chars)
   - ✅ `ALLOWED_EMAIL` - Your email address
   - ✅ `CUSTOM_DOMAIN` - Your domain (e.g., `build.mycompany.com`)

5. **Set Up DNS**
   
   Add a wildcard CNAME record:
   - Type: `CNAME`
   - Name: `*.build` (adjust for your subdomain)
   - Target: `build.mycompany.com` (your domain)
   - Proxy: ✅ ON (orange cloud)

6. **Done!** 🎉
   
   Visit your custom domain to start building apps with AI!

📖 **Need more details?** Check the [complete deployment guide](DEPLOYMENT.md)

---

### 💻 Option 2: Local Development (Full Control)

Perfect for developers who want to customize and develop locally.

1. **Clone the Repository**
   
   ```bash
   git clone https://github.com/cloudflare/vibesdk.git
   cd vibesdk
   ```

2. **Install Dependencies**
   
   ```bash
   npm install
   # or: bun install (recommended)
   ```

3. **Run Setup Wizard**
   
   ```bash
   npm run setup
   ```
   
   The interactive setup will:
   - ✅ Guide you through Cloudflare credentials
   - ✅ Create required cloud resources
   - ✅ Generate secrets automatically
   - ✅ Set up local and production configs
   - ✅ Initialize the database

4. **Start Development Server**
   
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:5173`

5. **Deploy When Ready**
   
   ```bash
   npm run deploy
   ```

📖 **Need more details?** Check the [complete setup guide](docs/setup.md)

---

## What You Need

### Must Have ✅
- **Cloudflare Account** (free tier OK for development)
- **Google Gemini API Key** (free tier available)
- **Custom Domain** (for production deployment)

### Good to Have 💡
- Node.js v18+ or Bun
- Git
- Text editor

### For Production 🚀
- Cloudflare Workers Paid Plan
- Workers for Platforms subscription
- Advanced Certificate Manager (for wildcard certs)

---

## Secret Generation Tools

We provide multiple tools to generate required secrets:

### Method 1: NPM Script (Recommended if you cloned the repo)
```bash
npm run generate-secrets
```

### Method 2: Node.js Script Directly
```bash
node scripts/generate-secrets.js
```

### Method 3: Python Script
```bash
python3 scripts/generate-secrets.py
```

### Method 4: Shell Script
```bash
./scripts/generate-secrets.sh
```

### Method 5: One-Liner
```bash
# Node.js
node -e "const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';const g=l=>{let r='';const b=require('crypto').randomBytes(l);for(let i=0;i<l;i++)r+=c[b[i]%c.length];return r};console.log('JWT_SECRET:',g(64));console.log('WEBHOOK_SECRET:',g(32));console.log('SECRETS_ENCRYPTION_KEY:',g(32));"

# OpenSSL
openssl rand -base64 48  # JWT_SECRET
openssl rand -base64 24  # WEBHOOK_SECRET
openssl rand -base64 24  # SECRETS_ENCRYPTION_KEY
```

---

## Next Steps

Once deployed, try these example prompts:

### 🎮 Fun Apps
> "Create a todo list with drag and drop and dark mode"

### 📊 Productivity
> "Build a pomodoro timer with task management"

### 🎨 Creative Tools
> "Make a color palette generator from images"

---

## Need Help?

- 📖 [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- 📖 [Setup Guide](docs/setup.md) - Detailed local development setup
- 📖 [README](README.md) - Project overview and architecture
- 💬 [Cloudflare Discord](https://discord.gg/cloudflaredev) - Community support
- 🐛 [GitHub Issues](https://github.com/cloudflare/vibesdk/issues) - Report bugs

---

## Troubleshooting

### Deployment Issues

**"Missing Required Variables"**
- Make sure you generated and entered all required secrets
- Verify your Google Gemini API key is valid

**"Custom Domain Required"**
- VibSDK requires a custom domain for deployment
- Add your domain to Cloudflare first
- Configure DNS as described above

**"DNS Not Resolving"**
- Wildcard DNS records can take up to 1 hour to propagate
- Verify CNAME record is set correctly with proxy enabled

### Local Development Issues

**"Setup Script Fails"**
- Ensure you have Node.js v18+ installed
- Check Cloudflare API token has proper permissions
- Try running setup again - it's idempotent

**"Database Errors"**
- Run `npm run db:migrate:local` to set up the database
- Check that D1 is available on your Cloudflare account

---

**Made with 🧡 by Cloudflare**
