# Fatherhood Is - Python Backend

FastAPI backend service with Google Gemini Imagen for AI image generation.

## Setup

### Prerequisites
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip

### Installation with uv (Recommended)

```bash
cd backend

# Install dependencies with uv
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### Alternative: Installation with pip

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`, `SUPABASE_KEY` - From Supabase dashboard
- `GOOGLE_API_KEY` - Google AI API key for Imagen
- `R2_*` - Cloudflare R2 credentials

## Running the Server

### Development
```bash
# Method 1: Using run.py
python run.py

# Method 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings from env vars
│   ├── api/
│   │   ├── posts.py         # POST /api/posts, GET /api/posts
│   ├── models/
│   │   └── post.py          # Pydantic models
│   ├── services/
│   │   ├── db.py            # Supabase client
│   │   ├── image_generator.py  # Banana.dev Nano
│   │   └── storage.py       # Cloudflare R2
│   └── utils/
│       └── validators.py    # Input validation
├── requirements.txt
├── .env.example
└── run.py
```

## API Endpoints

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
  "image_url": "https://images.fatherhood.is/uuid.png",
  "author_name": "John",
  "likes_count": 0,
  "comments_count": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/posts
Get paginated list of posts.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20, max: 50)
- `sort` (default: "newest") - newest | oldest | popular

### GET /api/posts/{id}
Get a specific post by ID.

## Image Generation with Google Imagen

The service uses Google's Gemini Imagen model for high-quality image generation.

**Features:**
- Imagen 3.0 model (imagen-3.0-generate-001)
- 1:1 aspect ratio (square for cards)
- Text overlay added programmatically using Pillow
- "Love Is..." comic style prompt
- Safety filters and negative prompts

**Setup:**
1. Get API key from https://aistudio.google.com/app/apikey
2. Add to `.env` as `GOOGLE_API_KEY`

**Documentation:** https://ai.google.dev/gemini-api/docs/image-generation

## Storage with Cloudflare R2

Images are stored in Cloudflare R2 (S3-compatible).

**Benefits:**
- Free egress bandwidth
- Global CDN
- S3-compatible API

## Development

### Code Formatting
```bash
# Format code
uv run black app/

# Lint
uv run ruff check app/

# Or if virtual env is activated:
black app/
ruff check app/
```

### Testing
```bash
uv run pytest
# or if virtual env is activated:
pytest
```

## Deployment

### Render.com

Create a new Web Service:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`

Add environment variables in Render dashboard.

## Troubleshooting

### Google Gemini API Issues
- Check API key is correct and active
- Verify billing is enabled on Google Cloud (if required)
- Check quota limits at https://aistudio.google.com/
- Ensure you're using the correct model name

### Image Upload Fails
- Verify R2 credentials
- Check bucket name is correct
- Ensure bucket has public access configured

### Database Connection
- Verify Supabase URL and service key
- Check if IP is allowed (Supabase -> Project Settings -> Database)
