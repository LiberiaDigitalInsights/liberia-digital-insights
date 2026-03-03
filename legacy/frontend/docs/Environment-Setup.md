# Environment Setup

## 🚀 Overview

This guide covers the complete environment setup for Liberia Digital Insights, including system requirements, environment configuration, database setup, and development tools.

## 📋 Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE (optional but recommended)

### Required Accounts

- **Supabase Account**: For database and backend services
- **GitHub Account**: For code hosting and collaboration
- **Email Service Account**: For newsletter functionality (optional)

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/LiberiaDigitalInsights/liberia-digital-insights.git

# Navigate to the project directory
cd liberia-digital-insights
```

### 2. Install Node.js Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend Environment (.env)

Create `backend/.env` file:

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@liberiadigitalinsights.com

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760  # 10MB in bytes
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/webm

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment (.env)

Create `frontend/.env` file:

```bash
# Copy the example file
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_VERSION=v1

# Supabase Configuration (for client-side operations)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_NAME=Liberia Digital Insights
VITE_APP_URL=http://localhost:5173
VITE_APP_DESCRIPTION=Empowering Liberia's technology landscape

# Analytics (Optional)
VITE_GA_TRACKING_ID=your-google-analytics-id

# Social Links (Optional)
VITE_GITHUB_URL=https://github.com/LiberiaDigitalInsights
VITE_TWITTER_URL=https://twitter.com/LDI_Tech
VITE_LINKEDIN_URL=https://linkedin.com/company/liberia-digital-insights
```

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or Google
4. Create a new organization (if needed)
5. Create a new project:
   - **Project Name**: `liberia-digital-insights`
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
6. Wait for the project to be created (2-3 minutes)

### 2. Get Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `your-anon-key`
   - **service_role**: `your-service-role-key`

### 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL files in order:

#### Database Schema

```sql
-- Run backend/src/supabase/supabase-schema.sql
-- This creates all the necessary tables
```

#### Database Functions

```sql
-- Run backend/src/supabase/database-functions.sql
-- This creates helper functions and triggers
```

#### Seed Data

```sql
-- Run backend/src/supabase/seed-data.sql
-- This populates the database with sample data
```

### 4. Configure Row Level Security (RLS)

Enable RLS on all tables:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE training ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
```

### 5. Create RLS Policies

```sql
-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public content policies
CREATE POLICY "Published articles are viewable by everyone" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published insights are viewable by everyone" ON insights
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published podcasts are viewable by everyone" ON podcasts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published events are viewable by everyone" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Gallery items are viewable by everyone" ON gallery
  FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can manage all content" ON articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Similar policies for other content tables...
```

## 🔧 Development Tools Setup

### 1. VS Code Extensions (Recommended)

Install these VS Code extensions for better development experience:

```bash
# Install VS Code extensions
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-eslint
```

### 2. Git Hooks Setup

Install Husky for pre-commit hooks:

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format"

# Add pre-push hook
npx husky add .husky/pre-push "npm run test"
```

### 3. VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "html"
  }
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🚀 Running the Application

### Development Mode

Start all services (backend, frontend, docs):

```bash
# Start all services
npm run dev

# Or use the cross-platform script
node dev-script/start-dev.js

# Or use platform-specific scripts
./dev-script/start-dev.sh    # Linux/macOS
./dev-script/start-dev.bat   # Windows
```

### Individual Services

Start services individually:

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Documentation only
npm run dev:docs
```

### Access Points

When running locally:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Documentation**: http://localhost:5174
- **API Health Check**: http://localhost:5000/health

## 🧪 Testing Setup

### Frontend Testing

```bash
# Run tests
cd frontend && npm run test

# Run tests in watch mode
cd frontend && npm run test:watch

# Run tests with coverage
cd frontend && npm run test:coverage
```

### Backend Testing

```bash
# Run tests
cd backend && npm test

# Run tests in watch mode
cd backend && npm run test:watch
```

## 📧 Email Configuration (Optional)

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings → Security
3. Enable "App passwords"
4. Generate a new app password for your application
5. Use the app password in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### Alternative Email Services

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill process on port 5174 (docs)
lsof -ti:5174 | xargs kill -9
```

#### Database Connection Issues

1. Verify Supabase credentials in `.env` files
2. Check if Supabase project is active
3. Ensure RLS policies are correctly configured
4. Test connection with health endpoint:

```bash
curl http://localhost:5000/health
```

#### Environment Variable Issues

1. Verify `.env` files exist in correct locations
2. Check for typos in variable names
3. Restart services after changing environment variables
4. Use `dotenv` to load environment variables

#### Dependency Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Debug Mode

Enable debug logging:

```bash
# Set debug mode
export DEBUG=*

# Run with debug
npm run dev
```

### Log Files

Check log files for errors:

```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Documentation logs
tail -f docs.log
```

## 🔄 Environment Variables Reference

### Backend Variables

| Variable                    | Description               | Required | Default               |
| --------------------------- | ------------------------- | -------- | --------------------- |
| `SUPABASE_URL`              | Supabase project URL      | Yes      | -                     |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key    | Yes      | -                     |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes      | -                     |
| `JWT_SECRET`                | JWT signing secret        | Yes      | -                     |
| `JWT_EXPIRES_IN`            | JWT expiration time       | No       | 7d                    |
| `PORT`                      | Backend server port       | No       | 5000                  |
| `NODE_ENV`                  | Environment mode          | No       | development           |
| `SMTP_HOST`                 | Email SMTP host           | No       | -                     |
| `SMTP_PORT`                 | Email SMTP port           | No       | 587                   |
| `SMTP_USER`                 | Email SMTP username       | No       | -                     |
| `SMTP_PASS`                 | Email SMTP password       | No       | -                     |
| `EMAIL_FROM`                | From email address        | No       | -                     |
| `UPLOAD_MAX_SIZE`           | Max file upload size      | No       | 10485760              |
| `UPLOAD_ALLOWED_TYPES`      | Allowed file types        | No       | image/_,video/_       |
| `CORS_ORIGIN`               | CORS allowed origin       | No       | http://localhost:5173 |

### Frontend Variables

| Variable                 | Description            | Required | Default                  |
| ------------------------ | ---------------------- | -------- | ------------------------ |
| `VITE_API_BASE_URL`      | Backend API URL        | Yes      | -                        |
| `VITE_API_VERSION`       | API version            | No       | v1                       |
| `VITE_SUPABASE_URL`      | Supabase project URL   | Yes      | -                        |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes      | -                        |
| `VITE_APP_NAME`          | Application name       | No       | Liberia Digital Insights |
| `VITE_APP_URL`           | Frontend URL           | No       | http://localhost:5173    |
| `VITE_APP_DESCRIPTION`   | App description        | No       | -                        |
| `VITE_GA_TRACKING_ID`    | Google Analytics ID    | No       | -                        |
| `VITE_GITHUB_URL`        | GitHub URL             | No       | -                        |
| `VITE_TWITTER_URL`       | Twitter URL            | No       | -                        |
| `VITE_LINKEDIN_URL`      | LinkedIn URL           | No       | -                        |

## 🚀 Production Deployment

### Environment Preparation

1. Update environment variables for production
2. Set up production database
3. Configure domain and SSL
4. Set up monitoring and logging

### Security Considerations

1. Use strong, unique secrets
2. Enable HTTPS in production
3. Configure proper CORS settings
4. Set up database backups
5. Monitor for security vulnerabilities

### Performance Optimization

1. Enable database connection pooling
2. Configure CDN for static assets
3. Set up proper caching headers
4. Monitor performance metrics

This setup provides a complete development environment for Liberia Digital Insights with all necessary tools and configurations.
