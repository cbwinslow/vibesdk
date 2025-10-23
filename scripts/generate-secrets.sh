#!/bin/bash

# Secret Generator for VibSDK Deployment
#
# Generates cryptographically secure random secrets required for
# VibSDK deployment to Cloudflare Workers.
#
# Usage:
#   ./scripts/generate-secrets.sh

# ANSI color codes
RESET='\033[0m'
BRIGHT='\033[1m'
GREEN='\033[32m'
BLUE='\033[34m'
YELLOW='\033[33m'
CYAN='\033[36m'

# Function to generate a random secret
generate_secret() {
    local length=$1
    if command -v openssl &> /dev/null; then
        # Use openssl for better entropy
        openssl rand -base64 $((length * 3 / 4)) | tr -d '\n' | head -c $length
    else
        # Fallback to /dev/urandom
        LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c $length
    fi
}

# Function to display a secret with formatting
display_secret() {
    local name=$1
    local value=$2
    local description=$3
    
    echo -e "\n${BRIGHT}${BLUE}${name}${RESET}"
    echo -e "${CYAN}${description}${RESET}"
    echo -e "${GREEN}${value}${RESET}"
}

# Main function
main() {
    echo -e "\n${BRIGHT}${YELLOW}🔐 VibSDK Secret Generator${RESET}"
    echo -e "${YELLOW}==================================================${RESET}\n"
    
    echo "Generating cryptographically secure secrets for your VibSDK deployment..."
    
    # Generate secrets
    JWT_SECRET=$(generate_secret 64)
    WEBHOOK_SECRET=$(generate_secret 32)
    SECRETS_ENCRYPTION_KEY=$(generate_secret 32)
    
    # Display secrets with descriptions
    display_secret \
        "JWT_SECRET" \
        "$JWT_SECRET" \
        "Used for session management and JWT token signing (64 characters)"
    
    display_secret \
        "WEBHOOK_SECRET" \
        "$WEBHOOK_SECRET" \
        "Used for webhook authentication (32 characters)"
    
    display_secret \
        "SECRETS_ENCRYPTION_KEY" \
        "$SECRETS_ENCRYPTION_KEY" \
        "Used for encrypting stored secrets (32 characters)"
    
    # Display usage instructions
    echo -e "\n${BRIGHT}${YELLOW}📋 Next Steps:${RESET}\n"
    echo "1. Copy the secrets above"
    echo "2. Add them to your deployment configuration:"
    echo -e "   ${CYAN}• For \"Deploy to Cloudflare\" button: Enter during deployment flow${RESET}"
    echo -e "   ${CYAN}• For manual deployment: Add to .prod.vars file${RESET}"
    echo -e "   ${CYAN}• For local development: Add to .dev.vars file${RESET}"
    echo ""
    echo "3. Keep these secrets secure and never commit them to version control"
    
    # Display .env format
    echo -e "\n${BRIGHT}${YELLOW}📝 .env Format:${RESET}\n"
    echo -e "${CYAN}JWT_SECRET=\"${JWT_SECRET}\"${RESET}"
    echo -e "${CYAN}WEBHOOK_SECRET=\"${WEBHOOK_SECRET}\"${RESET}"
    echo -e "${CYAN}SECRETS_ENCRYPTION_KEY=\"${SECRETS_ENCRYPTION_KEY}\"${RESET}"
    
    echo -e "\n${YELLOW}==================================================${RESET}\n"
    echo -e "${GREEN}✅ Secrets generated successfully!${RESET}\n"
    
    # Security reminder
    echo -e "${BRIGHT}${YELLOW}⚠️  Security Reminder:${RESET}"
    echo -e "${YELLOW}• Store these secrets securely${RESET}"
    echo -e "${YELLOW}• Never commit them to version control${RESET}"
    echo -e "${YELLOW}• Use different secrets for dev and production${RESET}"
    echo -e "${YELLOW}• Rotate secrets regularly${RESET}\n"
}

# Run the script
main
