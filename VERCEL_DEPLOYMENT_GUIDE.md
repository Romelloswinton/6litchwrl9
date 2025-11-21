# Vercel Deployment Guide - glitchwii9ine.com

## Quick Start Deployment

### Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

### Step 2: Deploy to Vercel
From the root directory of your project (`3dGalaxy`), run:

```bash
vercel
```

You'll be asked:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **What's your project's name?** → glitchwrld (or your preferred name)
- **In which directory is your code located?** → `./`
- **Want to override settings?** → No (we have vercel.json configured)

### Step 3: Deploy to Production
```bash
vercel --prod
```

This will deploy your project to production.

---

## Custom Domain Setup (glitchwii9ine.com)

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (glitchwrld)
3. **Click "Settings"** tab
4. **Click "Domains"** in the sidebar
5. **Add Domain**:
   - Enter: `glitchwii9ine.com`
   - Click "Add"
6. **Configure DNS Records**:

Vercel will provide you with DNS records. You need to add these to your domain registrar:

**For Root Domain (glitchwii9ine.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.glitchwii9ine.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

7. **Wait for DNS Propagation** (can take 1-48 hours, usually 15 minutes)
8. **SSL Certificate**: Vercel automatically provisions SSL certificates

### Option 2: Using Vercel CLI

```bash
vercel domains add glitchwii9ine.com
```

Follow the prompts to configure DNS.

---

## DNS Configuration at Your Registrar

Depending on where you bought `glitchwii9ine.com` (GoDaddy, Namecheap, Google Domains, etc.):

### 1. Find DNS Settings
- Login to your domain registrar
- Navigate to DNS settings for glitchwii9ine.com

### 2. Add/Update Records

**Delete any existing A records for @ and www**, then add:

**A Record (Root Domain):**
```
Type: A
Host: @
Points to: 76.76.21.21
TTL: 3600 (or automatic)
```

**CNAME Record (WWW):**
```
Type: CNAME
Host: www
Points to: cname.vercel-dns.com
TTL: 3600 (or automatic)
```

### 3. Save Changes

DNS changes can take time to propagate worldwide (15 mins - 48 hours).

---

## Ready to Deploy!

**Run these commands now:**

```bash
# 1. Login (opens browser)
vercel login

# 2. Deploy to production
vercel --prod
```

After deployment completes, you'll get a URL like: `https://glitchwrld.vercel.app`

Then add your custom domain `glitchwii9ine.com` via the Vercel dashboard.

---

## Post-Deployment Checklist

- [ ] Visit your deployment URL
- [ ] Test Venus emotional effects
- [ ] Test celestial tooltips
- [ ] Test all interactions
- [ ] Add custom domain
- [ ] Configure DNS
- [ ] Wait for DNS propagation
- [ ] Visit https://glitchwii9ine.com

---

Your 3D Galaxy with Emotional Venus and Celestial Tooltips will be live! 🚀✨
