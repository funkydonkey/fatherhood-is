# Supabase Setup Instructions

This directory contains database migrations for the Fatherhood Is project.

## Quick Setup (MVP)

For the MVP, you can run migrations directly in the Supabase SQL Editor:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (or create a new one)
3. **Navigate to**: SQL Editor → New Query
4. **Copy and paste** the contents of `migrations/001_create_posts_table.sql`
5. **Click "Run"** to execute the migration

## Environment Variables

After setting up your Supabase project:

1. Go to **Project Settings → API**
2. Copy the following values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (keep this secret!)

3. Go to **Project Settings → Database**
4. Copy the **Connection String (URI)** → `DATABASE_URL`
   - Switch to "URI" mode in the dropdown
   - Replace `[YOUR-PASSWORD]` with your database password

## Migration Files

- `001_create_posts_table.sql` - Creates the main posts table with indexes, triggers, and RLS policies

## Using Supabase CLI (Optional, for advanced users)

If you want to manage migrations programmatically:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Generate TypeScript types (auto-generate from schema)
supabase gen types typescript --local > types/database.types.ts
```

## Testing the Connection

After setting up, test the connection by running:

```bash
npm run dev
```

The app should start without database connection errors. Check the console for any Supabase-related issues.

## Row Level Security (RLS)

The migration automatically sets up RLS policies:

- ✅ **Public read access** - Anyone can view published posts
- ✅ **Public write access** - Anyone can create posts (anonymous posting for MVP)
- 🔒 **Protected updates/deletes** - Reserved for authenticated users (Phase 2)

## Next Steps

After running the migration:

1. Verify the `posts` table exists in the Table Editor
2. Test creating a post via the Supabase dashboard
3. Set up Cloudflare R2 for image storage
4. Configure Gemini API for image generation
