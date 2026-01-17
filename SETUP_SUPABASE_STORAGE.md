# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for the Fatherhood Is project.

## Prerequisites

- Supabase account and project created
- Project already has database configured

## Steps

### 1. Create Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `fatherhood-is` project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Fill in the form:
   - **Name**: `fatherhood-images`
   - **Public bucket**: ✅ **Enable** (IMPORTANT!)
   - **File size limit**: Leave default or set to 5MB
   - **Allowed MIME types**: Leave empty (allows all)
6. Click **Create bucket**

### 2. Verify Bucket is Public

1. In the Storage dashboard, click on your `fatherhood-images` bucket
2. You should see "Public bucket" badge
3. Test by uploading a file manually and accessing it via:
   ```
   https://<your-project-ref>.supabase.co/storage/v1/object/public/fatherhood-images/<filename>
   ```

### 3. Configure Backend Environment Variables

Your backend is already configured! Just make sure these env vars are set in Render.com:

```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_KEY=<your-service-role-key>
SUPABASE_ANON_KEY=<your-anon-key>
```

You can find these values in Supabase Dashboard → Settings → API

### 4. Deploy Backend

Once the bucket is created and env vars are set:

1. Push the updated code to GitHub:
   ```bash
   git add .
   git commit -m "Switch to Supabase Storage"
   git push
   ```

2. Render.com will auto-deploy the backend

3. Check logs to confirm: `✓ Using Supabase Storage`

### 5. Deploy Frontend

1. Push to GitHub (if using Vercel auto-deploy)
2. Or manually deploy to Vercel/Render

Frontend `next.config.ts` is already configured to allow images from `*.supabase.co`

## Troubleshooting

### Images return 404

**Problem**: Image URLs return 404 Not Found

**Solution**:
- Make sure bucket is **public** (not private!)
- Check bucket name is exactly `fatherhood-images`
- Verify URL format: `https://<project>.supabase.co/storage/v1/object/public/fatherhood-images/<file>.png`

### "Access denied" errors

**Problem**: Backend can't upload to bucket

**Solution**:
- Verify `SUPABASE_KEY` is the **service role key** (not anon key)
- Check Storage policies in Supabase Dashboard → Storage → Policies
- Ensure "Insert" and "Delete" policies exist for service role

### Next.js image optimization fails

**Problem**: Next.js shows "Invalid src prop"

**Solution**:
- Verify `next.config.ts` has the wildcard pattern:
  ```typescript
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ]
  ```
- Restart Next.js dev server after config changes

## Storage Limits (Free Tier)

- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **File uploads**: Unlimited

This should be sufficient for MVP with ~200-500 posts.

## Migration Notes

We switched from Cloudflare R2 to Supabase Storage because:
- ✅ Already using Supabase for database
- ✅ Simpler setup (no separate service)
- ✅ Generous free tier (1GB storage)
- ✅ Built-in CDN
- ✅ No Render.com ephemeral filesystem issues

Old images in Render.com `/uploads/` folder were lost due to ephemeral storage.
All new images will persist in Supabase Storage.
