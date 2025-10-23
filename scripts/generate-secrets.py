#!/usr/bin/env python3

"""
Secret Generator for VibSDK Deployment

Generates cryptographically secure random secrets required for
VibSDK deployment to Cloudflare Workers.

Usage:
    python3 scripts/generate-secrets.py
"""

import secrets
import string

# ANSI color codes for better output
class Colors:
    RESET = '\033[0m'
    BRIGHT = '\033[1m'
    GREEN = '\033[32m'
    BLUE = '\033[34m'
    YELLOW = '\033[33m'
    CYAN = '\033[36m'

def generate_secret(length):
    """
    Generate a cryptographically secure random secret
    
    Args:
        length (int): Length of the secret to generate
        
    Returns:
        str: Random secret string
    """
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

def display_secret(name, value, description):
    """
    Display a secret with formatting
    
    Args:
        name (str): Name of the secret
        value (str): Secret value
        description (str): Description of the secret
    """
    print(f"\n{Colors.BRIGHT}{Colors.BLUE}{name}{Colors.RESET}")
    print(f"{Colors.CYAN}{description}{Colors.RESET}")
    print(f"{Colors.GREEN}{value}{Colors.RESET}")

def main():
    """Main function"""
    print(f"\n{Colors.BRIGHT}{Colors.YELLOW}🔐 VibSDK Secret Generator{Colors.RESET}")
    print(f"{Colors.YELLOW}{'=' * 50}{Colors.RESET}\n")
    
    print("Generating cryptographically secure secrets for your VibSDK deployment...\n")
    
    # Generate secrets
    jwt_secret = generate_secret(64)
    webhook_secret = generate_secret(32)
    secrets_encryption_key = generate_secret(32)
    
    # Display secrets with descriptions
    display_secret(
        'JWT_SECRET',
        jwt_secret,
        'Used for session management and JWT token signing (64 characters)'
    )
    
    display_secret(
        'WEBHOOK_SECRET',
        webhook_secret,
        'Used for webhook authentication (32 characters)'
    )
    
    display_secret(
        'SECRETS_ENCRYPTION_KEY',
        secrets_encryption_key,
        'Used for encrypting stored secrets (32 characters)'
    )
    
    # Display usage instructions
    print(f"\n{Colors.BRIGHT}{Colors.YELLOW}📋 Next Steps:{Colors.RESET}\n")
    print("1. Copy the secrets above")
    print("2. Add them to your deployment configuration:")
    print(f"   {Colors.CYAN}• For \"Deploy to Cloudflare\" button: Enter during deployment flow{Colors.RESET}")
    print(f"   {Colors.CYAN}• For manual deployment: Add to .prod.vars file{Colors.RESET}")
    print(f"   {Colors.CYAN}• For local development: Add to .dev.vars file{Colors.RESET}")
    print("\n3. Keep these secrets secure and never commit them to version control")
    
    # Display .env format
    print(f"\n{Colors.BRIGHT}{Colors.YELLOW}📝 .env Format:{Colors.RESET}\n")
    print(f'{Colors.CYAN}JWT_SECRET="{jwt_secret}"{Colors.RESET}')
    print(f'{Colors.CYAN}WEBHOOK_SECRET="{webhook_secret}"{Colors.RESET}')
    print(f'{Colors.CYAN}SECRETS_ENCRYPTION_KEY="{secrets_encryption_key}"{Colors.RESET}')
    
    print(f"\n{Colors.YELLOW}{'=' * 50}{Colors.RESET}\n")
    print(f"{Colors.GREEN}✅ Secrets generated successfully!{Colors.RESET}\n")
    
    # Security reminder
    print(f"{Colors.BRIGHT}{Colors.YELLOW}⚠️  Security Reminder:{Colors.RESET}")
    print(f"{Colors.YELLOW}• Store these secrets securely{Colors.RESET}")
    print(f"{Colors.YELLOW}• Never commit them to version control{Colors.RESET}")
    print(f"{Colors.YELLOW}• Use different secrets for dev and production{Colors.RESET}")
    print(f"{Colors.YELLOW}• Rotate secrets regularly{Colors.RESET}\n")

if __name__ == '__main__':
    main()
