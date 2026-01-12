# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fatherhood Is** — A platform where anyone can share their definition of fatherhood. Users input text describing what fatherhood means to them, and an AI generates an image in the style of "Love Is..." comics by Kim Casali, but with "Fatherhood is..." text overlay.

**Target Audience:** Fathers, future fathers, anyone wanting to share thoughts about fatherhood

## Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3 with React Compiler enabled
- **TypeScript**: 5.x with strict mode
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (via `next/font`)
- **Icons**: Lucide React

### Backend (Python + FastAPI)
- **Framework**: FastAPI 0.109.0
- **Python**: 3.11+
- **Package Manager**: uv (modern Python package manager)
- **Database**: Supabase (PostgreSQL) via `supabase-py`
- **Storage**: Cloudflare R2 (S3-compatible via `boto3`)
- **AI Image Generation**: Google Gemini Imagen 3.0 (imagen-3.0-generate-001)
- **Validation**: Pydantic 2.x
- **Server**: Uvicorn with auto-reload

### Hosting
- **Frontend**: Vercel or Render.com
- **Backend**: Render.com (free tier with auto-sleep after 15min inactivity)

## Development Commands

### Frontend (Next.js)
```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

### Backend (Python FastAPI)
```bash
cd backend

# Install dependencies with uv (recommended)
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run development server (http://localhost:8000)
python run.py
# or
uvicorn app.main:app --reload

# Format code
uv run black app/

# Lint
uv run ruff check app/

# Run tests
uv run pytest
```

## Project Structure

### Frontend (Next.js)
```
app/
├── create/
│   └── page.tsx                  # Post creation form
├── post/
│   └── [id]/
│       └── page.tsx              # Individual post view
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page - grid of all posts
└── globals.css

components/
├── ui/                           # Base UI components
├── PostCard.tsx                  # Card for post grid
├── PostGrid.tsx                  # Masonry layout grid
├── CreatePostForm.tsx            # Post creation form
├── ImagePreview.tsx              # Preview of generated image
├── LoadingSpinner.tsx
├── Header.tsx
└── Footer.tsx

lib/
└── api.ts                        # API client for backend

types/
└── index.ts                      # TypeScript types
```

### Backend (Python FastAPI)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app entry point
│   ├── config.py                 # Settings from env vars
│   ├── api/
│   │   └── posts.py              # POST /api/posts, GET /api/posts
│   ├── models/
│   │   └── post.py               # Pydantic models
│   ├── services/
│   │   ├── db.py                 # Supabase client
│   │   ├── image_generator.py   # Banana.dev Nano integration
│   │   └── storage.py            # Cloudflare R2
│   └── utils/
│       └── validators.py         # Input validation
├── requirements.txt
├── .env.example
└── run.py
```

## Database Schema (Supabase PostgreSQL)

### Posts Table (MVP)
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text VARCHAR(280) NOT NULL,
    image_url TEXT NOT NULL,
    author_name VARCHAR(100),
    author_id UUID REFERENCES users(id),  -- NULL for anonymous
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    language VARCHAR(5) DEFAULT 'en',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_language ON posts(language);
```

## API Endpoints (MVP)

### POST /api/posts
Create a new post with AI-generated image.

**Request:**
```json
{
    "text": "teaching my daughter to ride a bike",
    "author_name": "John"  // optional
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "text": "teaching my daughter to ride a bike",
    "image_url": "https://r2.fatherhood.is/images/uuid.png",
    "author_name": "John",
    "created_at": "2024-01-15T10:30:00Z"
}
```

**Process:**
1. Validate text (3-280 chars, no blocked words)
2. Generate prompt for Imagen
3. Call Gemini API to generate image
4. Save image to R2
5. Create DB record
6. Return post

### GET /api/posts
Get list of posts with pagination.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20, max: 50)
- `sort` (default: "newest") - newest | oldest | popular

**Response:**
```json
{
    "posts": [...],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "pages": 8
    }
}
```

### GET /api/posts/:id
Get individual post by ID.

## AI Image Generation (Google Imagen)

### Why Google Imagen?
- **High Quality**: State-of-the-art image generation
- **Fast**: ~3-5 seconds per image
- **Reliable**: Google's managed infrastructure
- **Safety**: Built-in content safety filters
- **Free Tier**: Generous free quota for testing

### Image Generation Flow
```python
# backend/app/services/image_generator.py

async def generate_fatherhood_image(user_text: str) -> bytes:
    """
    1. Build prompt in 'Love Is...' style
    2. Call Google Gemini Imagen API
    3. Generate 1:1 aspect ratio image
    4. Add text overlay using Pillow
    5. Return PNG bytes
    """
```

### Prompt Template
```python
prompt = f"""A heartwarming illustration in the style of 'Love Is...'
comic strips by Kim Casali.

Scene: A father {user_text}

Style: simple cute cartoon, soft pastel colors (pink, blue, yellow),
white background, minimalist, hand-drawn gentle line art,
warm 1970s aesthetic.

Characters: father figure and child in a loving moment,
simple cartoon style, no detailed facial features.

Composition: centered characters, minimal background,
soft rounded shapes, family-friendly.

Important: cartoon illustration, NOT a photograph."""
```

### Model Configuration
```python
result = genai.ImageGenerationModel("imagen-3.0-generate-001").generate_images(
    prompt=prompt,
    number_of_images=1,
    safety_filter_level="block_some",
    person_generation="allow_adult",
    aspect_ratio="1:1",  # Square for cards
    negative_prompt="text, words, letters, watermark, blurry, ugly, nsfw, realistic photo",
)
```

### Text Overlay (Pillow)
Text "Fatherhood is... {user_text}" is added programmatically using PIL for consistency.

### Setup
1. Get API key: https://aistudio.google.com/app/apikey
2. Add to `backend/.env`: `GOOGLE_API_KEY=your-key`
3. Documentation: https://ai.google.dev/gemini-api/docs/image-generation

## Validation & Security

### Text Validation
- Length: 3-280 characters
- No blocked words (hate, kill, violence, abuse, etc.)
- No spam patterns (4+ repeated characters)

### Rate Limiting
- 10 posts per hour per IP address
- Implemented in middleware

## Environment Variables

### Frontend (.env.local)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (for direct client queries if needed)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Backend (backend/.env)
```env
# Database (Supabase)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...  # Service role key
SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...

# Image Generation (Google Gemini Imagen)
GOOGLE_API_KEY=your-google-ai-api-key

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=fatherhood-images
R2_PUBLIC_URL=https://images.fatherhood.is

# App
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_PER_HOUR=10
```

## Configuration

### Next.js (next.config.ts)
```typescript
const nextConfig = {
    output: 'standalone',  // For deployment
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.fatherhood.is',  // R2 domain
            },
        ],
    },
    // Proxy API requests to Python backend in development
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};
```

### Python Backend (Pydantic Settings)
All settings loaded from environment variables via `app/config.py`.

## Development Workflow

### MVP Development Plan (3 Weeks)

**Week 1: Backend Infrastructure**
- ✅ Supabase setup + posts table migration
- ✅ Python FastAPI project structure with uv
- ✅ Google Gemini Imagen integration
- ✅ Cloudflare R2 storage service
- ✅ Validation and Pydantic models
- ✅ API endpoints (POST /api/posts, GET /api/posts, GET /api/posts/:id)
- ✅ Removed unnecessary TypeScript backend files

**Week 2: Frontend**
- Next.js components (PostCard, PostGrid, CreatePostForm)
- Home page with post grid
- Create post page with form
- Individual post page
- API client for backend communication

**Week 3: Polish & Deploy**
- Pagination UI
- Error handling & loading states
- Testing (pytest for backend, Jest for frontend)
- Deploy backend to Render.com
- Deploy frontend to Vercel

## Key Implementation Notes

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)

### Styling
- Tailwind CSS v4 with `@theme inline` in `globals.css`
- Dark mode via `prefers-color-scheme`

### Server vs Client Components
- Use Server Components by default (Next.js 16 App Router)
- Client components only for interactivity (forms, pagination)

### Image Handling
- Images stored in Cloudflare R2 (S3-compatible)
- Use Next.js `<Image>` component with R2 remote pattern
- Consider hybrid approach if AI text rendering unstable: generate illustration only, add text overlay with Pillow/Canvas

### Render.com Free Tier Constraints
- Service sleeps after 15min inactivity (first request slow)
- 750 hours/month (sufficient for 24/7 single service)
- Auto HTTPS
- Auto-deploy from GitHub

## Future Phases

**Phase 2:** Auth (Supabase), comments, user profiles, likes
**Phase 3:** Multilingual support, social sharing, admin moderation panel
