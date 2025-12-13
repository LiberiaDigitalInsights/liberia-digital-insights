# Project Structure

## 🏗️ Overview

Liberia Digital Insights follows a well-organized monorepo structure that separates concerns between frontend, backend, and development tooling. This structure ensures maintainability, scalability, and clear separation of responsibilities.

## 📁 Directory Structure

```
liberia-digital-insights/
├── 📁 frontend/                    # React frontend application
│   ├── 📁 public/                   # Static assets
│   │   ├── 📄 favicon.ico          # Site favicon
│   │   ├── 📄 LDI_favicon.png     # Main favicon
│   │   └── 📄 manifest.json       # PWA manifest
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── 📁 admin/           # Admin-specific components
│   │   │   │   ├── 📄 AdminSidebar.jsx
│   │   │   │   ├── 📄 AdminTabs.jsx
│   │   │   │   ├── 📄 AdminContent.jsx
│   │   │   │   └── 📄 [other admin components]
│   │   │   ├── 📁 articles/        # Article-related components
│   │   │   │   ├── 📄 ArticleCard.jsx
│   │   │   │   ├── 📄 ArticleDetail.jsx
│   │   │   │   └── 📄 ArticleForm.jsx
│   │   │   ├── 📁 auth/            # Authentication components
│   │   │   │   ├── 📄 AuthGate.jsx
│   │   │   │   ├── 📄 LoginForm.jsx
│   │   │   │   └── 📄 RegisterForm.jsx
│   │   │   ├── 📁 events/          # Event components
│   │   │   │   ├── 📄 EventCard.jsx
│   │   │   │   ├── 📄 EventDetail.jsx
│   │   │   │   └── 📄 EventForm.jsx
│   │   │   ├── 📁 gallery/         # Gallery components
│   │   │   │   ├── 📄 GalleryItem.jsx
│   │   │   │   ├── 📄 Lightbox.jsx
│   │   │   │   └── 📄 GalleryGrid.jsx
│   │   │   ├── 📁 podcasts/        # Podcast components
│   │   │   │   ├── 📄 PodcastCard.jsx
│   │   │   │   ├── 📄 PodcastDetail.jsx
│   │   │   │   └── 📄 PodcastPlayer.jsx
│   │   │   ├── 📁 training/        # Training components
│   │   │   │   ├── 📄 CourseCard.jsx
│   │   │   │   ├── 📄 CourseDetail.jsx
│   │   │   │   └── 📄 CourseForm.jsx
│   │   │   ├── 📁 ui/              # Base UI components
│   │   │   │   ├── 📄 Button.jsx
│   │   │   │   ├── 📄 Input.jsx
│   │   │   │   ├── 📄 Modal.jsx
│   │   │   │   ├── 📄 Card.jsx
│   │   │   │   ├── 📄 RichTextEditor.jsx
│   │   │   │   ├── 📄 ContentRenderer.jsx
│   │   │   │   ├── 📄 Search.jsx
│   │   │   │   └── 📄 [other UI components]
│   │   │   ├── 📄 ErrorBoundary.jsx # Error handling wrapper
│   │   │   ├── 📄 Footer.jsx        # Site footer
│   │   │   ├── 📄 Navbar.jsx        # Navigation bar
│   │   │   ├── 📄 SEO.jsx           # SEO meta tags
│   │   │   └── 📄 LoadingSpinner.jsx # Loading indicator
│   │   ├── 📁 pages/                 # Page-level components
│   │   │   ├── 📄 Home.jsx           # Homepage
│   │   │   ├── 📄 Articles.jsx       # Articles listing
│   │   │   ├── 📄 ArticleDetail.jsx  # Article detail page
│   │   │   ├── 📄 Insights.jsx       # Insights listing
│   │   │   ├── 📄 InsightDetail.jsx  # Insight detail page
│   │   │   ├── 📄 Podcasts.jsx       # Podcasts listing
│   │   │   ├── 📄 PodcastDetail.jsx  # Podcast detail page
│   │   │   ├── 📄 Events.jsx         # Events listing
│   │   │   ├── 📄 EventDetail.jsx    # Event detail page
│   │   │   ├── 📄 Gallery.jsx        # Photo gallery
│   │   │   ├── 📄 TrainingCourses.jsx # Training courses
│   │   │   ├── 📄 TrainingDetail.jsx # Training detail page
│   │   │   ├── 📄 Admin.jsx          # Admin dashboard
│   │   │   ├── 📄 About.jsx          # About page
│   │   │   ├── 📄 Contact.jsx        # Contact page
│   │   │   ├── 📄 Register.jsx       # User registration
│   │   │   ├── 📄 Talent.jsx         # Talent directory
│   │   │   └── 📄 [other pages]      # Additional pages
│   │   ├── 📁 context/               # React contexts
│   │   │   ├── 📄 AuthContext.jsx    # Authentication context
│   │   │   ├── 📄 ThemeContext.jsx   # Theme context
│   │   │   └── 📄 [other contexts]  # Additional contexts
│   │   ├── 📁 utils/                 # Utility functions
│   │   │   ├── 📄 api.js             # API configuration
│   │   │   ├── 📄 auth.js            # Authentication utilities
│   │   │   ├── 📄 constants.js       # App constants
│   │   │   ├── 📄 helpers.js          # Helper functions
│   │   │   ├── 📄 sanitizeHtml.js    # HTML sanitization
│   │   │   └── 📄 [other utils]      # Additional utilities
│   │   ├── 📁 data/                  # Static data and constants
│   │   │   ├── 📄 categories.js       # Content categories
│   │   │   ├── 📄 navigation.js      # Navigation structure
│   │   │   └── 📄 [other data]       # Additional static data
│   │   ├── 📁 hooks/                 # Custom React hooks
│   │   │   ├── 📄 useAuth.js         # Authentication hook
│   │   │   ├── 📄 useArticles.js     # Articles API hook
│   │   │   ├── 📄 useInsights.js     # Insights API hook
│   │   │   ├── 📄 usePodcasts.js     # Podcasts API hook
│   │   │   ├── 📄 useEvents.js       # Events API hook
│   │   │   ├── 📄 useGallery.js      # Gallery API hook
│   │   │   ├── 📄 useTraining.js     # Training API hook
│   │   │   └── 📄 [other hooks]      # Additional custom hooks
│   │   ├── 📁 services/              # API services
│   │   │   ├── 📄 apiService.js      # Base API service
│   │   │   ├── 📄 authService.js     # Authentication service
│   │   │   └── 📄 [other services]   # Additional services
│   │   ├── 📁 styles/                # Styling
│   │   │   ├── 📄 globals.css        # Global styles
│   │   │   ├── 📄 components.css    # Component styles
│   │   │   └── 📄 [other styles]     # Additional styles
│   │   ├── 📄 App.jsx                # Main app component
│   │   └── 📄 main.jsx               # App entry point
│   ├── 📁 docs/                      # VitePress documentation
│   │   ├── 📁 .vitepress/            # VitePress configuration
│   │   │   ├── 📄 config.mjs         # VitePress config
│   │   │   └── 📁 theme/             # Custom theme
│   │   ├── 📄 index.md               # Documentation index
│   │   ├── 📄 GettingStarted.md       # Getting started guide
│   │   ├── 📄 [other docs]           # Additional documentation files
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 vite.config.js             # Vite configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS configuration
│   ├── 📄 .env.example               # Environment variables example
│   └── 📄 README.md                  # Frontend README
├── 📁 backend/                       # Express.js API server
│   ├── 📁 src/                        # Source code
│   │   ├── 📁 routes/                 # API route handlers
│   │   │   ├── 📄 articles.js         # Articles CRUD operations
│   │   │   ├── 📄 insights.js         # Insights CRUD operations
│   │   │   ├── 📄 podcasts.js         # Podcasts CRUD operations
│   │   │   ├── 📄 events.js           # Events CRUD operations
│   │   │   ├── 📄 gallery.js          # Gallery CRUD operations
│   │   │   ├── 📄 training.js         # Training CRUD operations
│   │   │   ├── 📄 talents.js          # Talent directory CRUD
│   │   │   ├── 📄 newsletters.js      # Newsletter management
│   │   │   ├── 📄 categories.js       # Categories CRUD
│   │   │   ├── 📄 advertisements.js   # Advertisement management
│   │   │   ├── 📄 auth.js             # Authentication endpoints
│   │   │   ├── 📄 upload.js           # File upload handling
│   │   │   └── 📄 [other routes]      # Additional API endpoints
│   │   ├── 📁 middleware/             # Custom middleware
│   │   │   ├── 📄 auth.js             # Authentication middleware
│   │   │   ├── 📄 cors.js             # CORS configuration
│   │   │   ├── 📄 errorHandler.js     # Error handling
│   │   │   └── 📄 [other middleware]  # Additional middleware
│   │   ├── 📁 utils/                  # Backend utilities
│   │   │   ├── 📄 database.js         # Database connection
│   │   │   ├── 📄 jwt.js              # JWT utilities
│   │   │   ├── 📄 validation.js       # Input validation
│   │   │   ├── 📄 email.js            # Email utilities
│   │   │   └── 📄 [other utils]       # Additional utilities
│   │   ├── 📁 supabase/               # Database schema and setup
│   │   │   ├── 📄 supabase-schema.sql # Database schema
│   │   │   ├── 📄 database-functions.sql # Database functions
│   │   │   ├── 📄 seed-data.sql       # Sample data
│   │   │   └── 📄 [other db files]    # Additional database files
│   │   └── 📁 [other backend dirs]    # Additional backend directories
│   ├── 📄 server.js                  # Main Express server
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 .env.example               # Environment variables example
│   └── 📄 README.md                  # Backend README
├── 📁 dev-script/                    # Development startup scripts
│   ├── 📄 start-dev.js               # Cross-platform Node.js script
│   ├── 📄 start-dev.sh               # Linux/macOS shell script
│   ├── 📄 start-dev.bat              # Windows batch script
│   └── 📄 [other dev scripts]        # Additional development scripts
├── 📄 package.json                   # Root package.json with scripts
├── 📄 README.md                      # Main project README
├── 📄 .gitignore                     # Git ignore file
├── 📄 LICENSE                        # Project license
└── 📄 [other root files]            # Additional root files
```

## 🎯 Component Organization

### Component Hierarchy

```
components/
├── ui/                    # Base UI components (reusable across features)
│   ├── Button.jsx         # Generic button component
│   ├── Input.jsx          # Generic input component
│   ├── Modal.jsx          # Generic modal component
│   ├── Card.jsx           # Generic card component
│   └── [other base components]
├── [feature]/             # Feature-specific components
│   ├── [Feature]Card.jsx  # Feature card/listing component
│   ├── [Feature]Detail.jsx # Feature detail component
│   ├── [Feature]Form.jsx   # Feature form component
│   └── [other feature components]
└── shared/                # Shared components
    ├── ErrorBoundary.jsx  # Error handling
    ├── Navbar.jsx         # Navigation
    ├── Footer.jsx         # Footer
    └── SEO.jsx            # SEO meta tags
```

### Naming Conventions

- **Files**: PascalCase for components (`ArticleCard.jsx`)
- **Folders**: camelCase for features (`articles/`)
- **Components**: PascalCase (`ArticleCard`)
- **Props**: camelCase (`articleTitle`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🔧 Configuration Files

### Frontend Configuration

#### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

#### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

#### `package.json` (Frontend)

```json
{
  "name": "liberia-digital-insights-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "test": "vitest",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "@tiptap/react": "^2.0.4",
    "@tiptap/starter-kit": "^2.0.4",
    "axios": "^1.3.4",
    "js-cookie": "^3.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "eslint": "^8.36.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "prettier": "^2.8.4",
    "vitest": "^0.29.2",
    "tailwindcss": "^3.2.7",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.21",
    "vitepress": "^1.0.0-alpha.65"
  }
}
```

### Backend Configuration

#### `package.json` (Backend)

```json
{
  "name": "liberia-digital-insights-backend",
  "version": "0.1.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^3.0.3",
    "nodemailer": "^7.0.11",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.11",
    "jest": "^29.5.0"
  }
}
```

## 🗄️ Database Structure

### Supabase Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- [Other database tables...]
```

## 🚀 Development Workflow

### File Creation Process

1. **New Feature**: Create feature folder in `components/`
2. **Components**: Create feature-specific components
3. **Pages**: Create page components in `pages/`
4. **Hooks**: Create custom hooks in `hooks/`
5. **Routes**: Add API routes in `backend/src/routes/`
6. **Tests**: Add tests in `__tests__/` folders
7. **Documentation**: Update relevant documentation

### Import Patterns

```javascript
// Component imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Local component imports
import Button from '@/components/ui/Button';
import ArticleCard from '@/components/articles/ArticleCard';

// Hook imports
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';

// Utility imports
import { formatDate } from '@/utils/helpers';
import { API_BASE_URL } from '@/utils/constants';
```

## 🔍 Code Organization Principles

### Separation of Concerns

- **Components**: Focus on UI logic and presentation
- **Hooks**: Handle data fetching and state management
- **Utils**: Pure functions and utilities
- **Services**: API communication logic
- **Context**: Global state management

### Reusability

- **Base Components**: Generic, reusable UI components
- **Feature Components**: Feature-specific but reusable within feature
- **Pages**: Page-level composition, typically not reusable
- **Hooks**: Reusable logic across components

### Testing Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Button.test.jsx
│   └── articles/
│       ├── ArticleCard.jsx
│       └── ArticleCard.test.jsx
├── hooks/
│   ├── useArticles.js
│   └── useArticles.test.js
└── utils/
    ├── helpers.js
    └── helpers.test.js
```

## 📝 Best Practices

### File Organization

1. **Group by Feature**: Organize files by feature, not by type
2. **Index Files**: Use `index.js` for clean imports
3. **Barrel Exports**: Export related items together
4. **Consistent Naming**: Follow established naming conventions

### Component Structure

```jsx
// Component file structure
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

// Component definition
function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
}

export default ComponentName;
```

### Import Organization

```jsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Link } from 'react-router-dom';
import axios from 'axios';

// 3. Internal imports (grouped by type)
// Components
import Button from '@/components/ui/Button';
import ArticleCard from '@/components/articles/ArticleCard';

// Hooks
import { useArticles } from '@/hooks/useArticles';

// Utils
import { formatDate } from '@/utils/helpers';

// Styles
import './ComponentName.css';
```

## 🔧 Development Tools

### Linting and Formatting

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

### Testing

- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Jest**: Backend testing

### Build Tools

- **Vite**: Fast development server and bundler
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

This structure provides a solid foundation for scalable, maintainable development while keeping the codebase organized and easy to navigate.
