# API Reference

## 🚀 API Overview

The Liberia Digital Insights platform provides a comprehensive RESTful API for managing content, users, and platform features. The API is built with Express.js and uses Supabase as the backend database.

## 🌐 Base URL

```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST /v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "user"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### POST /v1/auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### POST /v1/auth/verify
Verify a JWT token and get user information.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## 📝 Content Management Endpoints

### Articles

#### GET /v1/articles
Get all articles with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `search` (string): Search in title and content
- `status` (string): Filter by status (published, draft)

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Article excerpt...",
      "content": "Full article content...",
      "category": "Technology",
      "author": "Author Name",
      "status": "published",
      "featured": false,
      "tags": ["tag1", "tag2"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### GET /v1/articles/:id
Get a single article by ID or slug.

#### POST /v1/articles
Create a new article (requires authentication).

**Request Body:**
```json
{
  "title": "New Article Title",
  "slug": "new-article-slug",
  "excerpt": "Article excerpt...",
  "content": "Full article content...",
  "category": "Technology",
  "status": "published",
  "featured": false,
  "tags": ["tag1", "tag2"]
}
```

#### PUT /v1/articles/:id
Update an existing article (requires authentication).

#### DELETE /v1/articles/:id
Delete an article (requires authentication).

### Insights

#### GET /v1/insights
Get all insights with pagination and filtering.

#### POST /v1/insights
Create a new insight (requires authentication).

#### PUT /v1/insights/:id
Update an existing insight (requires authentication).

#### DELETE /v1/insights/:id
Delete an insight (requires authentication).

### Podcasts

#### GET /v1/podcasts
Get all podcasts with pagination and filtering.

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Podcast Episode Title",
      "slug": "podcast-slug",
      "description": "Episode description...",
      "content": "Show notes and transcript...",
      "audio_url": "https://example.com/audio.mp3",
      "duration": "45:30",
      "file_size": "45MB",
      "guests": ["Guest Name"],
      "status": "published",
      "featured": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### POST /v1/podcasts
Create a new podcast (requires authentication).

#### PUT /v1/podcasts/:id
Update an existing podcast (requires authentication).

#### DELETE /v1/podcasts/:id
Delete a podcast (requires authentication).

### Events

#### GET /v1/events
Get all events with pagination and filtering.

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Annual technology conference...",
      "content": "Full event details...",
      "start_date": "2024-06-15T09:00:00Z",
      "end_date": "2024-06-15T17:00:00Z",
      "location": "Monrovia, Liberia",
      "venue": "Conference Center",
      "registration_url": "https://example.com/register",
      "max_attendees": 200,
      "current_attendees": 150,
      "status": "upcoming",
      "featured": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

#### POST /v1/events
Create a new event (requires authentication).

#### PUT /v1/events/:id
Update an existing event (requires authentication).

#### DELETE /v1/events/:id
Delete an event (requires authentication).

## 🖼️ Gallery Endpoints

#### GET /v1/gallery
Get all gallery items with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by type (image, video)
- `event` (string): Filter by event ID
- `category` (string): Filter by category
- `search` (string): Search in title and description

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Event Photo",
      "description": "Photo from tech conference...",
      "type": "image",
      "url": "https://example.com/image.jpg",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "event_type": "event",
      "event_id": "uuid",
      "category": "conference",
      "tags": ["tech", "conference"],
      "featured": false,
      "events": {
        "id": "uuid",
        "title": "Tech Conference 2024",
        "slug": "tech-conference-2024"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### GET /v1/gallery/events
Get all events that have gallery items.

#### GET /v1/gallery/podcasts
Get all podcasts that have gallery items.

#### GET /v1/gallery/categories
Get all unique categories from gallery items.

#### POST /v1/gallery
Create a new gallery item (requires authentication).

**Request Body:**
```json
{
  "title": "New Gallery Item",
  "description": "Item description...",
  "type": "image",
  "url": "https://example.com/image.jpg",
  "thumbnail_url": "https://example.com/thumb.jpg",
  "event_type": "event",
  "event_id": "uuid",
  "category": "conference",
  "tags": ["tag1", "tag2"],
  "featured": false
}
```

#### PUT /v1/gallery/:id
Update an existing gallery item (requires authentication).

#### DELETE /v1/gallery/:id
Delete a gallery item (requires authentication).

## 🎓 Training Endpoints

#### GET /v1/training
Get all training courses with pagination and filtering.

#### POST /v1/training
Create a new training course (requires authentication).

#### PUT /v1/training/:id
Update an existing training course (requires authentication).

#### DELETE /v1/training/:id
Delete a training course (requires authentication).

## 👥 Talent Directory

#### GET /v1/talents
Get all talent profiles with pagination and filtering.

#### POST /v1/talents
Create a new talent profile (requires authentication).

#### PUT /v1/talents/:id
Update an existing talent profile (requires authentication).

#### DELETE /v1/talents/:id
Delete a talent profile (requires authentication).

## 📧 Newsletter Endpoints

#### GET /v1/newsletters
Get all newsletters with pagination.

#### POST /v1/newsletters
Create a new newsletter (requires authentication).

#### POST /v1/newsletters/subscribe
Subscribe to the newsletter.

**Request Body:**
```json
{
  "email": "subscriber@example.com",
  "name": "Subscriber Name"
}
```

#### POST /v1/newsletters/unsubscribe
Unsubscribe from the newsletter.

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

## 📁 File Upload

#### POST /v1/upload
Upload files to Supabase Storage (requires authentication).

**Request:** Multipart form data with file field.

**Response:**
```json
{
  "url": "https://storage.supabase.co/...",
  "path": "uploads/filename.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

## 📊 Categories

#### GET /v1/categories
Get all available categories.

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "description": "Technology related content",
      "color": "#3B82F6"
    }
  ]
}
```

#### POST /v1/categories
Create a new category (requires authentication).

#### PUT /v1/categories/:id
Update an existing category (requires authentication).

#### DELETE /v1/categories/:id
Delete a category (requires authentication).

## 🔧 System Endpoints

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "service": "backend",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## ❌ Error Handling

The API returns standard HTTP status codes and consistent error responses:

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "backend",
  "path": "/v1/articles",
  "message": "Detailed error message"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔄 Pagination

Most list endpoints support pagination with these parameters:

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

The response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 🔍 Search and Filtering

Many endpoints support search and filtering:

- `search` (string): Search in title and content
- `category` (string): Filter by category
- `status` (string): Filter by status
- `type` (string): Filter by type
- `featured` (boolean): Filter featured items

## 📝 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```
