# Environment Setup Guide

## Quick Start

### 1. Create Your Local Environment File

```bash
# Copy the example template
cp .env.example .env.local
```

### 2. Add Your API Keys

Open `.env.local` and fill in your actual values:

```bash
# Replace the empty value with your actual API key
glitch-wrld888=your-actual-api-key-here
```

### 3. Restart the Development Server

```bash
npm run dev
```

---

## 🔑 Where to Get API Keys

### Anthropic Claude API
1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `.env.local`

---

## 📁 File Structure

```
glitchwrld/
├── .env.example        ← Template (committed to git)
├── .env.local          ← Your actual secrets (ignored by git)
├── .gitignore          ← Protects .env.local from being committed
└── SECURITY.md         ← Security guidelines
```

---

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] `.env.local` exists in `glitchwrld/` directory
- [ ] `.env.local` contains your actual API keys
- [ ] `git status` does NOT show `.env.local` (it's ignored)
- [ ] Development server starts without errors
- [ ] No security warnings in console

---

## 🚨 Security Reminders

❌ **NEVER** commit `.env.local` to git
❌ **NEVER** share your `.env.local` file
❌ **NEVER** post API keys in Discord/Slack
✅ **ALWAYS** use `.env.example` for documentation
✅ **ALWAYS** rotate keys if exposed

---

## 🤝 Team Collaboration

When sharing this project:

1. **Share:** `.env.example` (the template)
2. **Don't share:** `.env.local` (actual secrets)
3. **Instruct teammates:** "Run `cp .env.example .env.local` and add your own keys"

---

## 🔄 Rotating API Keys

If you suspect a key has been compromised:

1. Go to your API provider's dashboard
2. Revoke the old key
3. Generate a new key
4. Update `.env.local` with the new key
5. Restart your dev server

---

## 📦 Deployment

### Vercel
1. Go to project settings → Environment Variables
2. Add each key from `.env.local`
3. Set appropriate environments (Production, Preview, Development)

### Netlify
1. Site settings → Build & Deploy → Environment
2. Add variables
3. Mark sensitive ones as "Secret"

### Docker
```dockerfile
# Don't copy .env.local into container
# Use --env-file flag instead
docker run --env-file .env.local your-image
```

---

## ❓ Troubleshooting

**Problem:** Environment variables not loading

**Solutions:**
1. Check file is named `.env.local` (not `.env.local.txt`)
2. Restart the dev server after changes
3. Ensure no spaces around `=` in the file
4. Check the file is in the correct directory (`glitchwrld/`)

**Problem:** Git wants to commit `.env.local`

**Solutions:**
1. Check `.gitignore` includes `.env.local`
2. Run: `git rm --cached .env.local` (if already staged)
3. Verify: `git check-ignore -v .env.local` shows it's ignored

---

## 📞 Support

If you have issues with environment setup:
1. Check `SECURITY.md` for best practices
2. Review this guide
3. Check Vite's environment docs: https://vitejs.dev/guide/env-and-mode.html
