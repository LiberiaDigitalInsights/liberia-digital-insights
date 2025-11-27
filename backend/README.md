# Liberia Digital Insights — Backend

Express API with Supabase (PostgreSQL + Storage).

## Setup

1. Copy `.env.example` to `.env` and fill:

- PORT=5000
- CORS_ORIGIN=http://localhost:5173
- SUPABASE_URL=...
- SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=... (optional, server-side)
- SUPABASE_STORAGE_BUCKET=uploads

2. Install deps

```bash
npm install
```

3. Run

```bash
npm run dev
```

Health: GET /health

## Upload (to be completed)

POST /v1/upload
Body: { dataUrl: 'data:image/png;base64,...', folder?: 'articles' }
Returns: { path, url }
