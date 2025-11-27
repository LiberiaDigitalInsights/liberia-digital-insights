# Liberia Digital Insights — Backend API

🚀 **Complete REST API** for Liberia Digital Insights platform built with Express.js and Supabase (PostgreSQL + Storage).

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

- **🔐 JWT Authentication** with bcrypt password hashing
- **📁 File Upload** to Supabase Storage with base64 support
- **🗄️ Complete CRUD** operations for all content types
- **🏛️ Row Level Security** with Supabase policies
- **📊 Rich Content** support with HTML content and metadata
- **🔍 Pagination & Filtering** on list endpoints
- **📈 View Counting** and analytics
- **🛡️ CORS & Security** middleware
- **📝 Comprehensive Error** handling
- **🧪 Seed Data** for development and testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account and project
- Git

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Fill .env with your Supabase credentials (see Environment Setup below)
```

### 3. Database Setup
```bash
# Run the schema in Supabase SQL Editor:
# 1. supabase-schema.sql
# 2. database-functions.sql
# 3. seed-data.sql
```

### 4. Start Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Verify Installation
```bash
curl http://localhost:5000/health
# Expected: {"ok":true,"service":"backend","timestamp":"..."}
```

## ⚙️ Environment Setup

Create `.env` file with:

```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=uploads

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Development
NODE_ENV=development
```

**Getting Supabase Credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy Project URL and `anon`/`service_role` keys

## 🗄️ Database Setup

### 1. Run Schema
Execute `supabase-schema.sql` in Supabase SQL Editor to create:
- Tables: `categories`, `users`, `articles`, `insights`, `podcasts`, `events`, `training`, `newsletters`
- Indexes for performance
- Row Level Security policies

### 2. Run Functions
Execute `database-functions.sql` to add:
- `increment_view_count()` function
- `generate_unique_slug()` helper

### 3. Seed Data
Execute `seed-data.sql` to populate with sample content:
- 5 categories
- 2 articles with rich content
- 2 insights
- 2 podcasts
- 3 events
- 3 training courses
- 2 newsletters

### 4. Fix RLS Policies (if needed)
Execute `fix-user-policies.sql` to resolve authentication issues.

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "ok": true,
  "service": "backend",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication

### Register User
```http
POST /v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Login
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

### Verify Token
```http
POST /v1/auth/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "token": "jwt-token-here"
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## 📁 File Upload

### Upload Image
```http
POST /v1/upload
Content-Type: application/json

{
  "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...",
  "folder": "articles"
}
```

**Response:**
```json
{
  "path": "articles/1640995200000-abc123.png",
  "url": "https://project.supabase.co/storage/v1/object/public/uploads/articles/1640995200000-abc123.png"
}
```

**Supported Formats:** PNG, JPG, JPEG, GIF, WebP, SVG  
**Max Size:** 10MB  
**Default Folder:** `uploads`

---

## 📰 Articles API

### Get Articles
```http
GET /v1/articles?page=1&limit=10&category=technology&status=published
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `category` (string): Filter by category slug
- `status` (string): Filter by status (`published`, `draft`, `pending`)
- `search` (string): Search in title and excerpt

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Article excerpt...",
      "content": "<h1>Full HTML content</h1>",
      "cover_image_url": "https://...",
      "category": {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology"
      },
      "author": {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe"
      },
      "status": "published",
      "tags": ["tag1", "tag2"],
      "view_count": 150,
      "published_at": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get Single Article
```http
GET /v1/articles/{slug}
```

### Create Article
```http
POST /v1/articles
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "New Article",
  "slug": "new-article",
  "excerpt": "Article excerpt",
  "content": "<h1>HTML content</h1>",
  "cover_image_url": "https://...",
  "category_id": "uuid",
  "status": "published",
  "tags": ["tag1", "tag2"]
}
```

### Update Article
```http
PUT /v1/articles/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "content": "<h1>Updated content</h1>"
}
```

### Delete Article
```http
DELETE /v1/articles/{id}
Authorization: Bearer <token>
```

---

## 💡 Insights API

Same structure as Articles API:
- `GET /v1/insights` - List insights with pagination
- `GET /v1/insights/{slug}` - Get single insight
- `POST /v1/insights` - Create insight
- `PUT /v1/insights/{id}` - Update insight
- `DELETE /v1/insights/{id}` - Delete insight

---

## 🎙️ Podcasts API

### Get Podcasts
```http
GET /v1/podcasts?page=1&limit=10
```

**Response includes:**
- Audio URLs, transcripts
- YouTube, Spotify, Apple Podcasts links
- Episode and season numbers
- Duration

### Create Podcast
```http
POST /v1/podcasts
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Podcast Title",
  "slug": "podcast-slug",
  "description": "Podcast description",
  "audio_url": "https://...",
  "transcript": "Full transcript text",
  "youtube_url": "https://youtube.com/...",
  "spotify_url": "https://spotify.com/...",
  "apple_podcasts_url": "https://podcasts.apple.com/...",
  "cover_image_url": "https://...",
  "duration": "45:30",
  "episode_number": 1,
  "season_number": 1,
  "status": "published"
}
```

---

## 📅 Events API

### Get Events
```http
GET /v1/events?category=Conference&status=upcoming
```

**Response includes:**
- Event dates and locations
- Categories (Conference, Workshop, etc.)
- Current/max attendees
- Event status

### Create Event
```http
POST /v1/events
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Event Title",
  "slug": "event-slug",
  "description": "Event description",
  "cover_image_url": "https://...",
  "date": "2024-06-15",
  "location": "Monrovia, Liberia",
  "category": "Conference",
  "max_attendees": 500,
  "status": "upcoming"
}
```

---

## 🎓 Training API

### Get Training
```http
GET /v1/training?type=course&status=upcoming
```

**Response includes:**
- Course types (course, training, workshop, seminar)
- Duration and instructor info
- Start/end dates
- Student enrollment numbers

### Create Training
```http
POST /v1/training
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Course Title",
  "slug": "course-slug",
  "description": "Course description",
  "cover_image_url": "https://...",
  "type": "course",
  "duration": "6 weeks",
  "instructor": "Dr. Smith",
  "max_students": 30,
  "start_date": "2024-05-01",
  "end_date": "2024-06-12",
  "status": "upcoming"
}
```

---

## 📧 Newsletters API

### Get Newsletters
```http
GET /v1/newsletters?status=draft
```

**Response includes:**
- Subject and preview text
- Full HTML content
- Scheduled/sent dates
- Subscriber counts

### Create Newsletter
```http
POST /v1/newsletters
Content-Type: application/json
Authorization: Bearer <token>

{
  "subject": "Newsletter Subject",
  "preview": "Preview text",
  "content": "<h1>Newsletter content</h1>",
  "cover_image_url": "https://...",
  "scheduled_date": "2024-01-02T00:00:00.000Z",
  "status": "draft"
}
```

---

## 📊 Categories API

### Get Categories
```http
GET /v1/categories
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "description": "Latest in technology and digital innovation"
    }
  ]
}
```

---

## 🛠️ Error Handling

All errors follow consistent format:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "backend",
  "path": "/v1/articles",
  "message": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests (when implemented)
```

### Project Structure
```
backend/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.js      # Authentication endpoints
│   │   ├── articles.js  # Articles CRUD
│   │   ├── insights.js  # Insights CRUD
│   │   ├── podcasts.js  # Podcasts CRUD
│   │   ├── events.js    # Events CRUD
│   │   ├── training.js  # Training CRUD
│   │   ├── newsletters.js # Newsletters CRUD
│   │   └── upload.js    # File upload
│   ├── utils/           # Helper functions
│   │   └── database.js  # Database utilities
│   └── supabaseClient.js # Supabase client
├── server.js            # Main Express server
├── package.json         # Dependencies
└── README.md           # This file
```

### Adding New Endpoints
1. Create route file in `src/routes/`
2. Import and mount in `server.js`
3. Add documentation to README
4. Update database schema if needed

### Testing Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Test upload
curl -X POST http://localhost:5000/v1/upload \
  -H "Content-Type: application/json" \
  -d '{"dataUrl":"data:image/png;base64,...","folder":"test"}'

# Test authentication
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🚀 Deployment

### Environment Variables
Set all environment variables in production:
- `NODE_ENV=production`
- `PORT` (default: 5000)
- `CORS_ORIGIN` (your frontend domain)
- Supabase credentials
- `JWT_SECRET` (use strong secret)

### Production Considerations
1. **Security:** Use HTTPS and strong JWT secrets
2. **Rate Limiting:** Implement rate limiting middleware
3. **Logging:** Add structured logging
4. **Monitoring:** Set up health check monitoring
5. **Backups:** Enable Supabase automated backups

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For issues and questions:
1. Check this README
2. Review API documentation
3. Check database schema
4. Create an issue with detailed description

---

**Built with ❤️ using Express.js and Supabase**
