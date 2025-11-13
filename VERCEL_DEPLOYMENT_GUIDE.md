# Vercel Deployment Guide for GlitchWrld

This guide will help you deploy your 3D Galaxy visualization to Vercel.

## Pre-Deployment Checklist

### 1. Project Status
- ✅ `vercel.json` configuration created
- ✅ `.vercelignore` file created
- ✅ `package.json` updated with Vercel scripts
- ✅ `index.html` updated with production metadata
- ✅ Build directory: `glitchwrld/dist`

### 2. Current Configuration

**Build Settings:**
- Build Command: `cd glitchwrld && npm install && npm run build`
- Output Directory: `glitchwrld/dist`
- Install Command: `npm install --prefix glitchwrld`
- Framework: Vite

### 3. Environment Variables (if needed)

Currently, your project doesn't require environment variables. If you add API keys or secrets later:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables (e.g., `VITE_API_KEY`, `VITE_SPLINE_URL`)
3. Redeploy to apply changes

**Important:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the browser.

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - What's your project's name? `glitchwrld` (or your preferred name)
   - In which directory is your code located? `./`

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the settings from `vercel.json`

3. **Verify Build Settings:**
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as root)
   - Build Command: Should auto-fill from `vercel.json`
   - Output Directory: Should auto-fill as `glitchwrld/dist`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (typically 2-5 minutes)

## Post-Deployment

### 1. Verify Deployment

After deployment, check:
- [ ] Homepage loads without errors
- [ ] 3D Galaxy renders correctly
- [ ] Galaxy controls (Leva panel) work
- [ ] Camera controls (zoom, pan, rotate) function
- [ ] Spline models load (if integrated)
- [ ] AR/VR modes are accessible (on compatible devices)
- [ ] Mobile responsiveness works
- [ ] No console errors in browser DevTools

### 2. Performance Optimization

Your build is already optimized with:
- Code splitting (vendor chunks for React, Three.js, R3F, etc.)
- Asset caching (31536000s for static assets)
- Chunk size limit set to 1000kb
- Three.js deduplication

### 3. Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed by Vercel

### 4. Analytics & Monitoring

Enable Vercel Analytics:
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Analytics (free tier available)
3. Monitor page views, performance, and Web Vitals

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `glitchwrld/package.json`
- Run `cd glitchwrld && npm install` locally to verify

**Error: "TypeScript compilation failed"**
- Run `cd glitchwrld && npm run type-check` locally
- Fix type errors before redeploying

**Error: "Command failed with exit code 1"**
- Check Vercel build logs for specific error
- Common causes: missing dependencies, TypeScript errors, memory issues

### Runtime Errors

**Black screen / Canvas doesn't render:**
- Check browser console for WebGL errors
- Ensure device supports WebGL 2.0
- Check Spline URLs are accessible

**Performance issues:**
- Reduce particle count in galaxy controls
- Disable post-processing effects on mobile
- Check network tab for large asset downloads

**Spline models don't load:**
- Verify Spline URLs in your code are public
- Check CORS settings on Spline assets
- Ensure `@splinetool` packages are up to date

### Security Headers

The deployment includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

To modify these, edit `vercel.json` headers section.

## Continuous Deployment

Once connected to GitHub, Vercel automatically:
- Deploys on every push to `main` branch (production)
- Creates preview deployments for pull requests
- Runs build checks before merging

To configure:
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Adjust production branch, ignored paths, etc.

## Cost Considerations

**Vercel Free Tier includes:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Edge network (global CDN)

**Your app characteristics:**
- Large Three.js bundle (~2-3MB total after compression)
- Spline assets loaded from external CDN
- Mostly client-side rendering

**Recommendations:**
- Monitor bandwidth usage in Vercel Dashboard
- Consider upgrading if you exceed free tier limits
- Spline assets should be cached by browsers after first load

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Three.js Optimization](https://discoverthreejs.com/tips-and-tricks/)

## Support

If you encounter issues:
1. Check Vercel build logs (Dashboard → Deployments → View details)
2. Review browser console errors
3. Test build locally: `cd glitchwrld && npm run build && npm run preview`
4. Contact Vercel Support or consult their documentation

---

**Ready to deploy?** Run `vercel` from your project root to get started!
