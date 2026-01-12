-- Migration: Create posts table for Fatherhood Is platform
-- Description: Main table for storing user posts with AI-generated images
-- Version: 001
-- Created: 2025-01-10

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content
    text VARCHAR(280) NOT NULL,           -- User's definition of fatherhood (Twitter-like limit)
    image_url TEXT NOT NULL,              -- URL of AI-generated image in R2 storage

    -- Metadata
    author_name VARCHAR(100),             -- Optional author name (for anonymous posts)
    author_id UUID,                       -- NULL for MVP (anonymous posts), will add FK in Phase 2

    -- Statistics
    likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INTEGER DEFAULT 0 CHECK (comments_count >= 0),

    -- Settings
    language VARCHAR(5) DEFAULT 'en',     -- For future multilingual support
    is_published BOOLEAN DEFAULT true,    -- For moderation (can hide inappropriate posts)

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id) WHERE author_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_language ON posts(language);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published) WHERE is_published = true;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE posts IS 'Stores user-submitted posts with AI-generated fatherhood illustrations';
COMMENT ON COLUMN posts.text IS 'User input: what fatherhood means to them (3-280 characters)';
COMMENT ON COLUMN posts.image_url IS 'Full URL to AI-generated image stored in Cloudflare R2';
COMMENT ON COLUMN posts.author_name IS 'Optional display name for anonymous posts (no account required)';
COMMENT ON COLUMN posts.author_id IS 'Reserved for Phase 2 (user authentication), NULL for MVP anonymous posts';
COMMENT ON COLUMN posts.is_published IS 'False if post is hidden by moderation';

-- Row Level Security (RLS) policies for MVP
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published posts
CREATE POLICY "Public posts are viewable by everyone"
    ON posts FOR SELECT
    USING (is_published = true);

-- Policy: Anyone can insert posts (anonymous posting for MVP)
CREATE POLICY "Anyone can create posts"
    ON posts FOR INSERT
    WITH CHECK (true);

-- Policy: Service role can do anything (for API routes)
-- Note: This is handled by using the service role key in API routes

-- Grant permissions
GRANT SELECT ON posts TO anon, authenticated;
GRANT INSERT ON posts TO anon, authenticated;
GRANT UPDATE, DELETE ON posts TO authenticated;  -- For future: only post owners or admins
