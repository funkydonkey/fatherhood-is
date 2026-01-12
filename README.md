# Fatherhood Is 👨‍👧‍👦

A platform where anyone can share their definition of fatherhood through AI-generated illustrations in the vintage "Love Is..." comic style.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi)

## ✨ Features

- **AI Image Generation**: Google Gemini Imagen 3.0 creates illustrations in vintage "Love Is..." comic style
- **Two-Step Creation Flow**: Generate → Preview → Regenerate/Save
- **Real-time Preview**: See your illustration before publishing
- **Regeneration Option**: Not happy? Generate a new variation instantly
- **Responsive Grid**: Beautiful masonry layout of all posts
- **Individual Post Pages**: Share specific posts with unique URLs
- **Fast & Scalable**: Built with modern tech stack for performance

## 🎨 How It Works

1. **Share Your Story**: Enter what fatherhood means to you (3-280 characters)
2. **AI Creates Magic**: Google Gemini generates a vintage comic-style illustration
3. **Preview & Decide**: See the result and regenerate if needed
4. **Publish & Share**: Save to gallery and share with the world

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **UI Library**: React 19 with React Compiler
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono
- **Image Optimization**: Next.js Image component

### Backend
- **Framework**: FastAPI 0.109
- **Language**: Python 3.11+
- **AI Model**: Google Gemini Imagen 3.0
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Package Manager**: uv (modern Python tooling)

### Infrastructure
- **Database**: Supabase PostgreSQL
- **Image Storage**: Cloudflare R2
- **Rate Limiting**: In-memory with cleanup
- **Validation**: Pydantic models

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- uv package manager (\`curl -LsSf https://astral.sh/uv/install.sh | sh\`)
- Supabase account
- Cloudflare R2 bucket
- Google AI API key

### Frontend Setup

\`\`\`bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
\`\`\`

Visit http://localhost:3000

### Backend Setup

\`\`\`bash
cd backend

# Install dependencies with uv
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Create environment file
cp .env.example .env

# Edit .env with your credentials (see Environment Variables below)

# Run development server
python run.py
\`\`\`

Visit http://localhost:8000/docs for API documentation

## 🔐 Environment Variables

### Frontend (.env.local)

\`\`\`env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Backend (.env)

\`\`\`env
# Google Gemini API
GOOGLE_API_KEY=your_google_ai_api_key_here

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# Cloudflare R2
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=fatherhood-images
R2_PUBLIC_URL=https://images.your-domain.com

# App Configuration
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_PER_HOUR=10
\`\`\`

## 🗄 Database Setup

### Supabase Migration

\`\`\`bash
# Connect to your Supabase project
cd supabase

# Run migration
supabase db push
\`\`\`

Or manually run the SQL from \`supabase/migrations/001_create_posts_table.sql\` in your Supabase SQL editor.

## 🚀 Deployment

### Frontend (Vercel)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
\`\`\`

### Backend (Render.com)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: \`cd backend && uv sync\`
   - **Start Command**: \`cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT\`
   - **Environment**: Add all backend env vars
4. Deploy!

## 📁 Project Structure

\`\`\`
fatherhood-is/
├── app/                      # Next.js App Router pages
│   ├── create/              # Post creation page
│   ├── post/[id]/           # Individual post page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (post grid)
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   │   ├── db.py       # Supabase client
│   │   │   ├── image_generator.py  # Gemini integration
│   │   │   └── storage.py  # R2 storage
│   │   └── utils/          # Validators
│   ├── pyproject.toml      # Python dependencies
│   └── run.py              # Server entry point
├── components/              # React components
│   ├── CreatePostForm.tsx  # Post creation form
│   ├── PostCard.tsx        # Post card component
│   └── PostGrid.tsx        # Masonry grid layout
├── lib/                     # Frontend utilities
│   └── api.ts              # API client
├── types/                   # TypeScript types
│   └── index.ts
└── supabase/               # Database migrations
    └── migrations/
\`\`\`

## 🎯 API Endpoints

### POST \`/api/posts/generate\`
Generate an image without saving to database.

**Request:**
\`\`\`json
{
  "text": "teaching my daughter to ride a bike",
  "author_name": "John"  // optional
}
\`\`\`

**Response:**
\`\`\`json
{
  "image_url": "https://r2.example.com/images/uuid.png",
  "text": "teaching my daughter to ride a bike",
  "author_name": "John"
}
\`\`\`

### POST \`/api/posts\`
Save a post with pre-generated image.

**Request:**
\`\`\`json
{
  "text": "teaching my daughter to ride a bike",
  "author_name": "John",
  "image_url": "https://r2.example.com/images/uuid.png"
}
\`\`\`

### GET \`/api/posts\`
Get paginated list of posts.

**Query Parameters:**
- \`page\` (default: 1)
- \`limit\` (default: 20, max: 50)
- \`sort\` (default: "newest") - newest | oldest | popular

### GET \`/api/posts/{id}\`
Get individual post by ID.

## 🎨 Image Generation

The AI generates images using Google Gemini Imagen 3.0 with:
- **Style**: Vintage "Love Is..." comic aesthetic (Kim Casali 1970s style)
- **Characters**: Simple chibi-style father and child figures
- **Colors**: Muted pastels with hand-drawn quality
- **Aspect Ratio**: 2:3 (vertical portrait)
- **Text Overlay**: "Fatherhood is..." with user's text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by Kim Casali's iconic "Love Is..." comic strips
- Powered by Google Gemini Imagen for AI image generation
- Built with modern web technologies

---

**Made with ❤️ by fathers, for fathers**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
