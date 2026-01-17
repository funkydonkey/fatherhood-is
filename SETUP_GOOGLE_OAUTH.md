# Google OAuth Setup Guide

This guide will help you configure Google OAuth authentication for the Fatherhood Is project.

## Prerequisites

- Supabase project with Authentication enabled
- Vercel deployment (or other hosting platform)
- Google Cloud Console account

## Step 1: Configure Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `fatherhood-is` project
3. Navigate to **Authentication** → **URL Configuration**
4. Add the following **Redirect URLs** (one per line):
   ```
   http://localhost:3000/auth/callback
   https://fatherhood-is.vercel.app/auth/callback
   ```

5. Set **Site URL**:
   ```
   https://fatherhood-is.vercel.app
   ```

6. Click **Save**

## Step 2: Get Google OAuth Credentials

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it `fatherhood-is` or similar

### 2.2 Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### 2.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - **User Type**: External
   - **App name**: Fatherhood Is
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `email` and `profile`
   - **Test users**: Add your email (for testing)
4. Choose **Application type**: Web application
5. **Name**: Fatherhood Is Web Client
6. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://fatherhood-is.vercel.app
   ```
7. **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Replace `<your-project-ref>` with your Supabase project reference (found in Dashboard → Settings → API)

8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Google Provider in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it **Enabled**
3. Paste your **Client ID** (from step 2.3)
4. Paste your **Client Secret** (from step 2.3)
5. Click **Save**

## Step 4: Verify Environment Variables

### Local Development (.env.local)

Ensure you have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Production (Vercel)

1. Go to Vercel Dashboard → fatherhood-is → **Settings** → **Environment Variables**
2. Add the same variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Values can be found in Supabase Dashboard → Settings → API
4. After adding, **redeploy** the project

## Step 5: Test Authentication

### Local Testing
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "Sign In" → "Continue with Google"
4. You should be redirected to Google OAuth
5. After authentication, redirected back to `http://localhost:3000/auth/callback`
6. Then redirected to home page (logged in)

### Production Testing
1. Open https://fatherhood-is.vercel.app
2. Click "Sign In" → "Continue with Google"
3. Should redirect to Google OAuth
4. After authentication, redirect to `https://fatherhood-is.vercel.app/auth/callback`
5. Then redirect to home page (logged in)

## Troubleshooting

### Issue: "Redirect URL mismatch" error

**Solution**:
- Double-check redirect URLs in both:
  - Supabase Dashboard → Authentication → URL Configuration
  - Google Cloud Console → Credentials → OAuth 2.0 Client IDs
- Ensure they match exactly (no trailing slashes)
- Make sure you added production URL: `https://fatherhood-is.vercel.app/auth/callback`

### Issue: "Invalid redirect URI" from Google

**Solution**:
- Verify in Google Cloud Console → Credentials that you added:
  ```
  https://<your-project>.supabase.co/auth/v1/callback
  ```
- The callback must go to **Supabase**, not your app
- Your app's callback (`/auth/callback`) is handled after Supabase processes the auth

### Issue: Redirects to localhost in production

**Solution**:
- Check Supabase **Site URL** is set to production URL
- Verify Vercel environment variables are set correctly
- Redeploy after changing environment variables

### Issue: "Access blocked: This app's request is invalid"

**Solution**:
- Make sure you published the OAuth consent screen (or added test users)
- In Google Cloud Console → OAuth consent screen:
  - If **Publishing status** is "Testing", add your email to **Test users**
  - Or click **Publish App** to make it public

### Issue: User logs in but profile not created

**Solution**:
- Check database migration created `users` table
- Verify trigger creates user profile on signup
- For Google OAuth, you may need to manually create profile:
  ```sql
  INSERT INTO public.users (id, username, display_name)
  SELECT id, email, email FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.users);
  ```

## How It Works

1. User clicks "Continue with Google"
2. `signInWithGoogle()` called in `AuthContext.tsx`
3. Supabase redirects to Google OAuth
4. User authorizes on Google
5. Google redirects to: `https://<project>.supabase.co/auth/v1/callback`
6. Supabase processes auth, redirects to: `https://fatherhood-is.vercel.app/auth/callback?code=...`
7. Next.js callback route (`app/auth/callback/route.ts`) exchanges code for session
8. User redirected to home page, now logged in

## Security Notes

- **Never commit** Google OAuth credentials to git
- Use environment variables for all secrets
- Keep `Client Secret` private
- Regularly rotate credentials if compromised
- Use HTTPS in production (Vercel provides this automatically)

## Google OAuth Limits (Free Tier)

- **Requests**: 10,000 per day
- **Users**: Unlimited
- **Cost**: Free

This should be sufficient for MVP and early growth.
