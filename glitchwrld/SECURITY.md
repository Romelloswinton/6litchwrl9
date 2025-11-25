# Security Guidelines

## 🔒 Environment Variables Protection

### Overview
This project uses environment variables to store sensitive configuration data like API keys, database credentials, and other secrets. **NEVER commit these files to git.**

---

## ✅ Protected Files

The following files are automatically excluded from git via `.gitignore`:

```
.env
.env.local
.env.development
.env.development.local
.env.test
.env.test.local
.env.production
.env.production.local
.env.*.local
```

---

## 🛠️ Setup Instructions

### For New Developers:

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your credentials:**
   Open `.env.local` and replace placeholder values with your actual API keys

3. **Never commit `.env.local`:**
   Git is configured to ignore it, but double-check before committing

---

## 🚨 Security Best Practices

### DO:
✅ Use `.env.local` for local development
✅ Use `.env.example` as a template (commit this)
✅ Rotate API keys if they're ever exposed
✅ Use different keys for development and production
✅ Store production secrets in secure services (Vercel, AWS Secrets Manager, etc.)

### DON'T:
❌ Commit `.env` or `.env.local` files to git
❌ Share API keys in Slack, Discord, or email
❌ Hard-code secrets in source code
❌ Use production keys in development
❌ Store secrets in public repositories

---

## 🔍 Check Before Committing

Before pushing to GitHub, always run:

```bash
# Check what files will be committed
git status

# Make sure no .env files are listed
git ls-files | grep .env

# If you see .env files, they should NOT be committed!
```

---

## 🆘 If You Accidentally Commit Secrets

### Immediate Actions:

1. **Revoke/Rotate the exposed key immediately**
   - Go to the service provider (Anthropic, OpenAI, etc.)
   - Deactivate the compromised key
   - Generate a new one

2. **Remove from git history** (if just committed):
   ```bash
   # If you haven't pushed yet
   git reset --soft HEAD~1

   # If you have pushed
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all

   git push origin --force --all
   ```

3. **Notify your team**

4. **Consider the key compromised permanently**

---

## 📦 Deployment Security

### Vercel:
- Use Environment Variables in project settings
- Set different values for Development, Preview, and Production
- Never expose secrets in client-side code

### Netlify:
- Use Build Environment Variables in site settings
- Mark sensitive variables as "Secret"

### AWS/Docker:
- Use AWS Secrets Manager or Parameter Store
- Mount secrets as environment variables at runtime

---

## 🔐 API Key Naming Convention

Use the `VITE_` prefix for client-side environment variables (exposed to browser):

```bash
# ❌ Exposed to client (public)
VITE_PUBLIC_API_URL=https://api.example.com

# ✅ Server-side only (private) - Not available in Vite frontend
DATABASE_URL=postgresql://...
PRIVATE_API_KEY=sk-...
```

**Important:** In Vite, only variables prefixed with `VITE_` are exposed to the client. Never put secrets in `VITE_` variables!

---

## 📚 Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)

---

## 🔔 Current Status

✅ `.gitignore` configured to exclude all `.env*` files
✅ `.env.example` template provided
✅ No secrets found in git history
✅ Security documentation created

**Last Security Audit:** 2025-11-25
