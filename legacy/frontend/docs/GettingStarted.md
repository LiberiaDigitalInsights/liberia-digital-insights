# Getting Started

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn)
- **Git** for version control
- **Supabase** account (for database and backend services)

### 🛠️ Installation & Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/LiberiaDigitalInsights/liberia-digital-insights.git
   cd liberia-digital-insights
   ```

2. **Environment Configuration**

   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Configure Supabase credentials in backend/.env

   # Frontend environment
   cp frontend/.env.example frontend/.env
   # Configure API endpoints in frontend/.env
   ```

3. **Install Dependencies**

   ```bash
   # Use our convenience script (recommended)
   npm run install:all

   # Or install manually
   npm install
   cd backend && npm install && cd ../frontend && npm install
   ```

4. **Database Setup**
   1. Create a Supabase project
   2. Run `backend/supabase/supabase-schema.sql` in Supabase SQL Editor
   3. Run `backend/supabase/database-functions.sql` for helper functions
   4. Run `backend/supabase/seed-data.sql` for sample content

5. **Start Development Servers**

   ```bash
   # Start all services (backend, frontend, docs)
   npm run dev

   # Or use platform-specific scripts
   ./dev-script/start-dev.sh          # Linux/macOS
   ./dev-script/start-dev.bat         # Windows
   node dev-script/start-dev.js       # Cross-platform
   ```

6. **Access Your Platform**
   - **🌐 Frontend**: http://localhost:5173
   - **🔧 Backend API**: http://localhost:5000
   - **📚 Documentation**: http://localhost:5174
   - **📊 Health Check**: http://localhost:5000/health

## 📋 Available Scripts

### Root Level Scripts

```bash
npm run dev              # Start all services (backend, frontend, docs)
npm run start            # Same as npm run dev
npm run dev:docs         # Start only documentation server
npm run build:docs       # Build documentation for production
npm run preview:docs     # Preview production build
npm run install:all      # Install all dependencies
npm run clean            # Clean log files
npm run logs:backend     # Follow backend logs
npm run logs:frontend    # Follow frontend logs
```

### Frontend Scripts (from `frontend/`)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run test             # Run Vitest
npm run test:coverage    # Run tests with coverage
npm run test:watch       # Run tests in watch mode
npm run docs:dev         # Start documentation server
npm run docs:build       # Build documentation
npm run docs:preview     # Preview documentation
```

### Backend Scripts (from `backend/`)

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm test                 # Run tests (when implemented)
```

## 🏗️ Project Structure

```
liberia-digital-insights/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 admin/         # Admin panel components
│   │   │   ├── 📁 articles/      # Article-related components
│   │   │   ├── 📁 auth/          # Authentication components
│   │   │   ├── 📁 events/        # Event components
│   │   │   ├── 📁 podcasts/      # Podcast components
│   │   │   ├── 📁 gallery/       # Gallery components
│   │   │   ├── 📁 ui/            # Base UI components
│   │   │   ├── 📄 ErrorBoundary.jsx # Error handling
│   │   │   ├── 📄 Footer.jsx     # Site footer
│   │   │   ├── 📄 Navbar.jsx     # Navigation bar
│   │   │   ├── 📄 SEO.jsx        # SEO meta tags
│   │   │   └── 📄 Search.jsx     # Search functionality
│   │   ├── 📁 pages/             # Page-level components
│   │   │   ├── 📄 Home.jsx       # Homepage
│   │   │   ├── 📄 Articles.jsx   # Articles listing
│   │   │   ├── 📄 Insights.jsx   # Insights listing
│   │   │   ├── 📄 Podcasts.jsx   # Podcasts listing
│   │   │   ├── 📄 Events.jsx     # Events listing
│   │   │   ├── 📄 Gallery.jsx    # Photo gallery
│   │   │   ├── 📄 TrainingCourses.jsx # Training courses
│   │   │   ├── 📄 Admin.jsx      # Admin dashboard
│   │   │   ├── 📄 About.jsx      # About page
│   │   │   ├── 📄 Contact.jsx    # Contact page
│   │   │   └── 📄 [20+] more pages # Additional pages
│   │   ├── 📁 context/           # React contexts
│   │   ├── 📁 utils/            # Utility functions
│   │   ├── 📁 data/              # Static data and constants
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 services/          # API services
│   │   └── 📄 App.jsx            # Main app component
│   ├── 📁 docs/                  # VitePress documentation
│   └── 📄 package.json           # Frontend dependencies
├── 📁 backend/                  # Express.js API server
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API route handlers
│   │   │   ├── 📄 articles.js   # Articles CRUD operations
│   │   │   ├── 📄 auth.js       # Authentication endpoints
│   │   │   ├── 📄 events.js     # Events management
│   │   │   ├── 📄 insights.js   # Insights CRUD
│   │   │   ├── 📄 podcasts.js   # Podcast operations
│   │   │   ├── 📄 gallery.js    # Gallery management
│   │   │   ├── 📄 training.js   # Training courses
│   │   │   └── 📄 [8+] more routes # Additional API endpoints
│   │   └── 📁 supabase/         # Database schema and setup
│   └── 📄 server.js            # Main Express server
├── 📁 dev-script/              # Development startup scripts
│   ├── 📄 start-dev.js         # Cross-platform script
│   ├── 📄 start-dev.sh         # Linux/macOS script
│   └── 📄 start-dev.bat        # Windows script
└── 📄 package.json             # Root dependencies and scripts
```

## 🔧 Key Features & Routes

### Public Routes

- `/` - Homepage with featured content
- `/articles` - Articles listing and search
- `/insights` - Industry insights and analysis
- `/podcasts` - Podcast episodes with audio player
- `/events` - Tech events and workshops
- `/gallery` - Photo and video gallery
- `/training-courses` - Professional development courses
- `/talent` - Community talent directory
- `/about` - About page
- `/contact` - Contact form

### Admin Routes (Protected)

- `/admin` - Comprehensive admin dashboard
  - Content management (articles, insights, podcasts, events)
  - Gallery management
  - User management
  - Analytics and reporting
  - System settings

### API Endpoints

- `GET /health` - Health check endpoint
- `/v1/auth/*` - Authentication endpoints
- `/v1/articles/*` - Articles CRUD
- `/v1/insights/*` - Insights CRUD
- `/v1/podcasts/*` - Podcasts CRUD
- `/v1/events/*` - Events CRUD
- `/v1/gallery/*` - Gallery CRUD
- `/v1/training/*` - Training CRUD
- `/v1/newsletters/*` - Newsletter management
- `/v1/upload` - File upload handling

## 🎨 Development Guidelines

### Coding Standards

- Follow ESLint and Prettier configurations
- Use semantic commit messages
- Write tests for new features
- Follow React best practices and hooks patterns

### Component Development

- Use the existing design system and UI components
- Follow the established file naming conventions
- Implement proper error handling with ErrorBoundary
- Use React Router for navigation
- Implement SEO optimization with SEO component

### API Integration

- Use the custom hooks in `/src/hooks/` for API calls
- Follow the established error handling patterns
- Implement proper loading states and error messages
- Use the centralized API configuration

---

## Rich Text Editing (TipTap)

- Editor component: `src/components/ui/RichTextEditor.jsx` (TipTap)
- Props API: `value` (HTML string), `onChange({ target: { value: html }})`, `disabled`
- Toolbar: Bold, Italic, Underline, H1–H3, lists, align, link, image, clear, code block, blockquote
- Image uploads use file input and embed as base64. No backend upload.

### Using in forms

```jsx
<RichTextEditor
  value={form.content || ''}
  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
/>
```

## HTML Sanitization

- Utility: `src/utils/sanitizeHtml.js`
- Always sanitize user-generated HTML before display (preview/detail pages).
- Preview and detail pages use `ContentRenderer` which wraps sanitization.

## Content Rendering

- Component: `src/components/ui/ContentRenderer.jsx`
- Usage:

```jsx
<ContentRenderer html={article.content || article.excerpt} />
```

## Centralized Categories

- Source: `src/data/categories.js` exporting `CATEGORIES`.
- Use in Admin forms and filters via `<Select>`.

## Modal & Table Responsiveness

- Modals: constrain height and enable scroll to avoid viewport overflow.
- Tables: reduce column widths on small screens, convert action buttons to icons.

## Routes

- Public: `/`, `/insights`, `/articles`, `/insight/:id`, `/article/:id`
- Admin (protected by `AuthGate`): `/admin`

## Persisted UI State

- `localStorage` keys
  - `admin_editor_tab` – last-used editor tab (Edit/Preview)
  - `admin_chart_range` – selected analytics range

## Search

The docs site supports search via Algolia DocSearch.

- App ID: `0MG5COI1YB`
- Index name: `liberia-digital-insights`
- Configuration lives in `docs/.vitepress/config.mjs` under `themeConfig.algolia`.
