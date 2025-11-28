# 🌍 Liberia Digital Insights

🚀 **Empowering Liberia's Digital Future** - A comprehensive platform for technology insights, business innovation, and digital transformation across Africa.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 About

Liberia Digital Insights is a cutting-edge digital platform designed to bridge the information gap in Africa's technology landscape. Founded on the principle that knowledge drives progress, we provide:

- **📰 Rich Content**: Articles, insights, and analysis on technology trends affecting Liberia and the broader African continent
- **🎙️ Multimedia Learning**: Podcasts featuring industry leaders and innovators
- **📅 Educational Events**: Workshops, conferences, and networking opportunities
- **🎓 Professional Development**: Training courses and certification programs
- **📧 Knowledge Sharing**: Curated newsletters with the latest digital insights

Our mission is to democratize access to digital knowledge and foster a thriving tech ecosystem in Liberia and across Africa.

## ✨ Features

### 🎯 Core Platform Features

- **📱 Responsive Design**: Optimized for all devices and screen sizes
- **🔍 Advanced Search**: Find content quickly with intelligent search functionality
- **📊 Analytics Dashboard**: Track engagement and content performance
- **👥 User Profiles**: Personalized experience with bookmarking and preferences
- **💬 Interactive Comments**: Engage with content and community discussions

### 📰 Content Management

- **📝 Articles**: In-depth analysis and thought leadership pieces
- **💡 Insights**: Data-driven industry reports and trend analysis
- **🎙️ Podcasts**: Audio content with transcripts and show notes
- **📅 Events**: Calendar of tech events, workshops, and conferences
- **🎓 Training**: Professional development courses and certifications
- **📧 Newsletters**: Weekly digests and curated content delivery

### 🔧 Technical Features

- **🚀 Modern Stack**: React 18, Vite, Express.js, Supabase
- **🔐 Secure Authentication**: JWT-based auth with bcrypt encryption
- **📁 File Management**: Cloud-based image and media storage
- **🌐 API-First**: RESTful API with comprehensive documentation
- **📈 Scalable Architecture**: Built for growth and performance
- **🛡️ Security**: Row-level security and data protection

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Git** for version control
- **Supabase** account (for database and storage)

### 1. Clone Repository

```bash
git clone https://github.com/LiberiaDigitalInsights/liberia-digital-insights.git
cd liberia-digital-insights
```

### 2. Environment Setup

```bash
# Backend environment
cp backend/.env.example backend/.env
# Configure Supabase credentials in backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
# Configure API endpoints in frontend/.env
```

### 3. Install Dependencies

```bash
# Option 1: Use our convenience script
npm run install:all

# Option 2: Install manually
npm install
cd backend && npm install && cd ../frontend && npm install
```

### 4. Database Setup

1. Create a Supabase project
2. Run `backend/supabase-schema.sql` in Supabase SQL Editor
3. Run `backend/database-functions.sql` for helper functions
4. Run `backend/seed-data.sql` for sample content

### 5. Start Development Servers

```bash
# Option 1: Use our startup script (recommended)
npm run dev

# Option 2: Use platform-specific scripts
./start-dev.sh          # Linux/macOS
start-dev.bat           # Windows
node start-dev.js       # Cross-platform

# Option 3: Start manually
npm run dev:backend     # Terminal 1
npm run dev:frontend    # Terminal 2
```

### 6. Access Your Platform

- **🌐 Frontend**: http://localhost:5173
- **🔧 Backend API**: http://localhost:5000
- **📊 Health Check**: http://localhost:5000/health
- **📚 API Docs**: See `backend/README.md`

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Supabase      │
│   (React)       │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • Data Storage  │
│ • State Mgmt     │    │ • Auth          │    │ • Auth Service  │
│ • Routing        │    │ • File Upload   │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend

- **React 18** - Modern UI framework with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing for SPA navigation
- **Lucide Icons** - Beautiful, consistent icon system
- **React Hook Form** - Performant forms with easy validation

#### Backend

- **Express.js** - Fast, minimalist web framework for Node.js
- **Supabase** - Backend-as-a-Service with PostgreSQL and auth
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

#### Database & Storage

- **PostgreSQL** - Robust relational database via Supabase
- **Supabase Storage** - Cloud-based file storage
- **Row Level Security** - Fine-grained data access control
- **Real-time Subscriptions** - Live data updates (future feature)

### Project Structure

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
│   │   │   ├── 📄 TrainingCourses.jsx # Training courses
│   │   │   ├── 📄 Admin.jsx      # Admin dashboard
│   │   │   ├── 📄 About.jsx      # About page
│   │   │   ├── 📄 Contact.jsx    # Contact page
│   │   │   └── 📄 [40+] more pages # Additional pages
│   │   ├── 📁 context/           # React contexts
│   │   │   ├── 📄 ThemeContext.jsx # Theme management
│   │   │   └── 📄 ToastContext.jsx # Notification system
│   │   ├── 📁 utils/            # Utility functions
│   │   │   ├── 📄 analytics.js   # Google Analytics
│   │   │   ├── 📄 performance.jsx # Performance monitoring
│   │   │   └── 📄 sanitizeHtml.js # HTML sanitization
│   │   ├── 📁 data/              # Static data and constants
│   │   ├── 📁 assets/            # Static assets
│   │   ├── 📁 services/          # API services
│   │   ├── 📁 lib/               # Library configurations
│   │   ├── 📄 App.jsx            # Main app component
│   │   ├── 📄 main.jsx           # App entry point
│   │   └── 📄 index.css          # Global styles
│   ├── 📁 public/                # Public assets
│   │   ├── 📄 LDI_favicon.png    # Site favicon
│   │   └── 📄 traffic.json       # Traffic analytics
│   ├── 📁 docs/                  # Documentation
│   │   ├── 📄 GettingStarted.md  # Setup guide
│   │   ├── 📄 Components.md      # Component docs
│   │   ├── 📄 DesignSystem.md    # Design system
│   │   └── 📄 AdminGuide.md      # Admin panel guide
│   ├── 📄 .env                   # Environment variables (gitignored)
│   ├── 📄 .env.example           # Environment template
│   ├── 📄 .gitignore             # Git ignore rules
│   ├── 📄 .prettierrc.json       # Prettier configuration
│   ├── 📄 eslint.config.js       # ESLint configuration
│   ├── 📄 index.html             # HTML template
│   ├── 📄 package.json           # Frontend dependencies
│   ├── 📄 package-lock.json      # Dependency lock file
│   ├── 📄 vite.config.js         # Vite configuration
│   └── 📄 README.md              # Frontend documentation
├── 📁 backend/                  # Express.js API server
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API route handlers
│   │   │   ├── 📄 articles.js   # Articles CRUD operations
│   │   │   ├── 📄 auth.js       # Authentication endpoints
│   │   │   ├── 📄 events.js     # Events management
│   │   │   ├── 📄 insights.js   # Insights CRUD
│   │   │   ├── 📄 newsletters.js # Newsletter management
│   │   │   ├── 📄 podcasts.js   # Podcast operations
│   │   │   ├── 📄 training.js   # Training courses
│   │   │   └── 📄 upload.js     # File upload handling
│   │   ├── 📁 utils/           # Helper functions
│   │   │   └── 📄 database.js  # Database utilities
│   │   └── 📄 supabaseClient.js # Supabase client configuration
│   ├── 📁 scripts/             # Development and utility scripts
│   │   ├── 📄 seed-data.js     # Database seeding script
│   │   ├── 📄 seed-minimal.js  # Minimal seed script
│   │   ├── 📄 seed-simple.js   # Simple seed script
│   │   ├── 📄 test-auth.js     # Authentication testing
│   │   ├── 📄 test-connection.js # Database connection test
│   │   ├── 📄 test-endpoint.js # API endpoint testing
│   │   └── 📄 test-upload.js   # File upload testing
│   ├── 📁 supabase/            # Database schema and setup
│   │   ├── 📄 supabase-schema.sql # Complete database schema
│   │   ├── 📄 database-functions.sql # Database helper functions
│   │   ├── 📄 fix-user-policies.sql # RLS policy fixes
│   │   └── 📄 seed-data.sql   # SQL seed data
│   ├── 📄 .env                 # Environment variables (gitignored)
│   ├── 📄 .env.example         # Environment variables template
│   ├── 📄 .gitignore           # Git ignore rules
│   ├── 📄 package.json         # Backend dependencies
│   ├── 📄 package-lock.json    # Dependency lock file
│   ├── 📄 server.js            # Main Express server
│   └── 📄 README.md            # Backend API documentation
├── 📄 start-dev.sh             # Linux/macOS startup script
├── 📄 start-dev.bat            # Windows startup script
├── 📄 start-dev.js             # Cross-platform startup script
└── 📄 README.md                # This file
```

## 🛠️ Development

### Available Scripts

#### Root Level Scripts

```bash
npm run dev              # Start both frontend and backend
npm run start            # Same as npm run dev
npm run dev:sh           # Use shell script (Linux/macOS)
npm run dev:bat          # Use batch script (Windows)
npm run install:all      # Install all dependencies
npm run clean            # Clean log files
npm run logs:backend     # Follow backend logs
npm run logs:frontend    # Follow frontend logs
```

#### Frontend Scripts (from `frontend/`)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

#### Backend Scripts (from `backend/`)

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm test                 # Run tests (when implemented)
```

### Development Workflow

1. **Feature Development**

   ```bash
   git checkout -b feature/new-feature
   npm run dev
   # Make changes...
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Code Quality**

   ```bash
   # Frontend linting
   cd frontend && npm run lint

   # Backend linting (when implemented)
   cd backend && npm run lint
   ```

3. **Testing**

   ```bash
   # Frontend tests (when implemented)
   cd frontend && npm test

   # Backend tests (when implemented)
   cd backend && npm test
   ```

### Environment Variables

#### Backend (`.env`)

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=uploads
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

#### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Liberia Digital Insights
VITE_APP_DESCRIPTION=Empowering Liberia's Digital Future
```

## 📚 API Documentation

Our comprehensive API documentation is available in `backend/README.md`. Key endpoints include:

### Authentication

- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `POST /v1/auth/verify` - Token verification

### Content Management

- `GET/POST/PUT/DELETE /v1/articles` - Articles CRUD
- `GET/POST/PUT/DELETE /v1/insights` - Insights CRUD
- `GET/POST/PUT/DELETE /v1/podcasts` - Podcasts CRUD
- `GET/POST/PUT/DELETE /v1/events` - Events CRUD
- `GET/POST/PUT/DELETE /v1/training` - Training CRUD
- `GET/POST/PUT/DELETE /v1/newsletters` - Newsletters CRUD

### File Management

- `POST /v1/upload` - File upload to Supabase Storage

### System

- `GET /health` - Health check endpoint

## 🚀 Deployment

### Production Deployment Options

#### 1. Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### 2. Railway/Render (Recommended for Backend)

```bash
# Deploy backend
cd backend
# Connect to Railway/Render and deploy
```

#### 3. Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### 4. Self-Hosted (VPS/Dedicated Server)

```bash
# Install dependencies
sudo apt update && sudo apt install -y nodejs nginx postgresql

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/liberia-digital-insights

# Deploy with PM2
npm install -g pm2
pm2 start backend/server.js --name "liberia-backend"
pm2 start frontend/build --name "liberia-frontend" --spa
```

### Environment Configuration

- **Production**: Set `NODE_ENV=production`
- **Database**: Use Supabase production project
- **Security**: Generate strong JWT secrets
- **CORS**: Update `CORS_ORIGIN` to production domain
- **HTTPS**: Configure SSL certificates

### Monitoring & Logging

- **Health Checks**: Monitor `/health` endpoint
- **Error Tracking**: Implement Sentry or similar
- **Analytics**: Google Analytics or Plausible
- **Performance**: Web Vitals monitoring

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs**: Create detailed issues with reproduction steps
2. **💡 Feature Requests**: Propose new features with use cases
3. **📝 Documentation**: Improve docs and README files
4. **🎨 Design**: Contribute UI/UX improvements
5. **💻 Code**: Submit pull requests for bug fixes and features

### Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **ESLint**: Follow linting rules
- **Prettier**: Use consistent formatting
- **Conventional Commits**: Use semantic commit messages
- **TypeScript**: Prefer typed code (when implemented)
- **Tests**: Write tests for new features

### Community Guidelines

- **Be Respectful**: Maintain professional and constructive communication
- **Be Inclusive**: Welcome contributors of all backgrounds and experience levels
- **Be Helpful**: Provide guidance and support to fellow contributors
- **Be Patient**: Allow time for review and feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Supabase** - For providing excellent backend services
- **Vercel** - For the fantastic build tool and hosting platform
- **Liberian Tech Community** - For inspiration and feedback
- **All Contributors** - Everyone who has contributed to this project

## 📞 Contact & Support

- **📧 Email**: contact@liberiadigitalinsights.com
- **🐛 Issues**: [GitHub Issues](https://github.com/your-org/liberia-digital-insights/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-org/liberia-digital-insights/discussions)
- **🐦 Twitter**: [@LiberiaDigital](https://twitter.com/LiberiaDigital)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-org/liberia-digital-insights&type=Date)](https://star-history.com/#your-org/liberia-digital-insights&Date)

---

**🚀 Built with ❤️ for Liberia's Digital Future**

_"Empowering communities through knowledge, innovation, and digital transformation."_
