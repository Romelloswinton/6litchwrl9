# Deploy Your 3D Galaxy to glitchwii9ine.com - NOW!

## ✅ Build Test Passed!

Your project builds successfully. You're ready to deploy!

---

## Step 1: Login to Vercel

Run this command and follow the prompts in your browser:

```bash
vercel login
```

This will open your browser to authenticate.

---

## Step 2: Deploy to Production

From your project root directory (`C:\Users\Jswin\Desktop\dev\3dGalaxy`), run:

```bash
vercel --prod
```

You'll be asked:
- **Set up and deploy?** → `Yes`
- **Which scope?** → Select your Vercel account
- **Link to existing project?** → `No` (first time)
- **What's your project's name?** → `glitchwrld` or your choice
- **In which directory is your code located?** → `./` (press Enter)
- **Want to modify settings?** → `No` (we have vercel.json)

Vercel will:
1. Upload your code
2. Install dependencies
3. Run the build (using your vercel.json config)
4. Deploy to production

**You'll get a URL like:** `https://glitchwrld.vercel.app` or `https://glitchwrld-xxx.vercel.app`

---

## Step 3: Add Your Custom Domain

### Option A: Via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Click on your project (`glitchwrld`)
3. Click "Settings" → "Domains"
4. Click "Add Domain"
5. Enter: `glitchwii9ine.com`
6. Click "Add"

Vercel will show you DNS records to add at your domain registrar.

### Option B: Via Command Line

```bash
vercel domains add glitchwii9ine.com --project glitchwrld
```

---

## Step 4: Configure DNS at Your Domain Registrar

Go to wherever you bought `glitchwii9ine.com` (GoDaddy, Namecheap, etc.)

### Add These DNS Records:

**A Record (Root Domain):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME Record (WWW):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Save and Wait

DNS propagation takes 15 minutes to 48 hours (usually 15-30 minutes).

---

## Step 5: Verify

After DNS propagates:

1. Visit: `https://glitchwii9ine.com`
2. Your 3D Galaxy should load!
3. Test Venus emotional effects (click Venus)
4. Test celestial tooltips (hover over planets/moons)

---

## Quick Commands Reference

```bash
# Login (opens browser)
vercel login

# Deploy to production
vercel --prod

# Check deployments
vercel ls

# Add domain
vercel domains add glitchwii9ine.com
```

---

## Troubleshooting

### "Domain already in use"
The domain might be linked to another Vercel project. Remove it first via the dashboard.

### "Build failed"
We already tested the build locally and it passed, so this shouldn't happen!

### "DNS not propagating"
Wait longer (can take up to 48 hours). Check with:
```bash
nslookup glitchwii9ine.com
```

---

## What's Deployed

Your deployment includes:
- ✅ Emotional Venus with burning love interior
- ✅ Celestial tooltips for all planets & moons
- ✅ Complete 3D solar system
- ✅ All interactions and animations
- ✅ Optimized production build
- ✅ Automatic HTTPS (SSL)
- ✅ Global CDN (fast worldwide)

---

## Ready? Let's Deploy! 🚀

Run these two commands:

```bash
vercel login
vercel --prod
```

Then add your domain via the dashboard!

Your cosmic creation will be live at https://glitchwii9ine.com! ✨
