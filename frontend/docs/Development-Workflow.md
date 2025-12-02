# Development Workflow

## 🔄 Overview

This guide outlines the development workflow for Liberia Digital Insights, including coding standards, Git workflow, testing procedures, and deployment processes.

## 📋 Prerequisites

- Complete environment setup (see [Environment Setup](./Environment-Setup.md))
- Git configured with SSH keys
- VS Code with recommended extensions
- Node.js 18+ and npm installed

## 🌿 Git Workflow

### Branch Strategy

We use a simplified Git flow with these main branches:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features and enhancements
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### Branch Naming Conventions

```bash
# Feature branches
feature/user-authentication
feature/gallery-system
feature/podcast-player

# Bugfix branches
bugfix/gallery-image-loading
bugfix/api-timeout-error

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-bug-fix
```

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates

**Examples:**
```bash
feat(auth): add JWT token refresh mechanism
fix(gallery): resolve image loading timeout issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(api): simplify error handling
test(articles): add unit tests for article service
chore(deps): update react to v18.2.0
```

### Workflow Steps

1. **Create Feature Branch**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Develop Feature**
```bash
# Make changes
git add .
git commit -m "feat(feature): implement new functionality"
```

3. **Push and Create PR**
```bash
git push origin feature/your-feature-name
# Create pull request on GitHub
```

4. **Code Review**
- Request review from team members
- Address feedback
- Ensure tests pass

5. **Merge to Develop**
```bash
git checkout develop
git pull origin develop
git merge feature/your-feature-name
git push origin develop
```

6. **Deploy to Staging**
- Automated deployment from develop branch
- Test in staging environment

7. **Merge to Main**
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

## 💻 Coding Standards

### JavaScript/React Standards

#### Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import components
import Button from '@/components/ui/Button';
import ArticleCard from '@/components/articles/ArticleCard';

// Import hooks
import { useArticles } from '@/hooks/useArticles';

// Import utils
import { formatDate } from '@/utils/helpers';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onClick - Click handler
 */
function ComponentName({ title, onClick }) {
  // Hooks
  const [state, setState] = useState(null);
  const { data, loading, error } = useArticles();

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    onClick?.();
  };

  // Conditional rendering
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Main render
  return (
    <div className="component-name">
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}

export default ComponentName;
```

#### Hooks Structure
```javascript
// hooks/useArticles.js
import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('/v1/articles', { params });
      setArticles(response.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (articleData) => {
    setLoading(true);
    try {
      const response = await apiRequest('/v1/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
      setArticles(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle,
  };
};
```

#### API Service Structure
```javascript
// services/apiService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### CSS/Tailwind Standards

#### Component Styling
```jsx
// Use Tailwind classes for styling
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    Title
  </h2>
  <p className="text-gray-600 leading-relaxed">
    Content
  </p>
</div>

// For complex components, use CSS modules with Tailwind
import styles from './ComponentName.module.css';

<div className={styles.container}>
  <h2 className={styles.title}>Title</h2>
</div>
```

#### Responsive Design
```jsx
// Mobile-first approach
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>

// Responsive utilities
<div className="text-sm sm:text-base lg:text-lg">
  Responsive text
</div>
```

## 🧪 Testing Workflow

### Frontend Testing

#### Unit Tests
```javascript
// __tests__/components/ArticleCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '@/components/articles/ArticleCard';

const mockArticle = {
  id: '1',
  title: 'Test Article',
  slug: 'test-article',
  excerpt: 'Test excerpt',
  category: 'Technology',
  author: 'Test Author',
  published_at: '2024-01-01T00:00:00Z',
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ArticleCard', () => {
  test('renders article information correctly', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  test('navigates to article detail when clicked', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />);
    
    const link = screen.getByRole('link', { name: /test article/i });
    expect(link).toHaveAttribute('href', '/article/test-article');
  });
});
```

#### Hook Tests
```javascript
// __tests__/hooks/useArticles.test.jsx
import { renderHook, waitFor } from '@testing-library/react';
import { useArticles } from '@/hooks/useArticles';

// Mock API service
jest.mock('@/utils/api', () => ({
  apiRequest: jest.fn(),
}));

describe('useArticles', () => {
  test('fetches articles successfully', async () => {
    const mockArticles = [{ id: '1', title: 'Test Article' }];
    apiRequest.mockResolvedValue({ items: mockArticles });

    const { result } = renderHook(() => useArticles());

    await waitFor(() => {
      expect(result.current.articles).toEqual(mockArticles);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  test('handles API errors', async () => {
    apiRequest.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useArticles());

    await waitFor(() => {
      expect(result.current.articles).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('API Error');
    });
  });
});
```

### Backend Testing

#### Route Tests
```javascript
// __tests__/routes/articles.test.js
import request from 'supertest';
import app from '../../server.js';

describe('Articles API', () => {
  test('GET /v1/articles returns articles list', async () => {
    const response = await request(app)
      .get('/v1/articles')
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('pagination');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  test('POST /v1/articles creates new article', async () => {
    const articleData = {
      title: 'New Article',
      content: 'Article content',
      category: 'Technology',
    };

    const response = await request(app)
      .post('/v1/articles')
      .send(articleData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(articleData.title);
  });
});
```

### Running Tests

```bash
# Frontend tests
cd frontend
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage

# Backend tests
cd backend
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
```

## 📊 Code Quality

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

## 🚀 Deployment Workflow

### Staging Deployment

1. **Push to Develop Branch**
```bash
git checkout develop
git add .
git commit -m "feat: add new feature"
git push origin develop
```

2. **Automatic Deployment**
- GitHub Actions triggers on push to develop
- Runs tests and builds application
- Deploys to staging environment
- Runs integration tests

3. **Staging Testing**
- Manual testing in staging environment
- User acceptance testing
- Performance testing

### Production Deployment

1. **Merge to Main Branch**
```bash
git checkout main
git merge develop
git push origin main
```

2. **Production Deployment**
- GitHub Actions triggers on push to main
- Runs comprehensive test suite
- Builds optimized production assets
- Deploys to production servers
- Runs smoke tests

3. **Post-deployment**
- Monitor application health
- Check error logs
- Verify key functionality
- Notify team of deployment

### Deployment Scripts

```bash
# scripts/deploy.sh
#!/bin/bash

echo "🚀 Starting deployment..."

# Environment variables
ENVIRONMENT=${1:-staging}
BRANCH=${2:-develop}

echo "📦 Deploying to $ENVIRONMENT from $BRANCH"

# Run tests
echo "🧪 Running tests..."
npm run test

# Build application
echo "🔨 Building application..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
  echo "🌐 Deploying to production..."
  # Production deployment commands
else
  echo "🧪 Deploying to staging..."
  # Staging deployment commands
fi

echo "✅ Deployment completed!"
```

## 🔍 Code Review Process

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Performance considerations addressed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information for reviewers.
```

### Review Guidelines

1. **Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code clean and maintainable?
3. **Performance**: Are there any performance concerns?
4. **Security**: Are there any security vulnerabilities?
5. **Testing**: Are tests comprehensive and appropriate?
6. **Documentation**: Is documentation adequate?

## 📈 Performance Optimization

### Frontend Performance

1. **Code Splitting**
```javascript
// Lazy load components
const AdminPanel = lazy(() => import('@/pages/Admin'));
const Gallery = lazy(() => import('@/pages/Gallery'));

// Route-based code splitting
const routes = [
  {
    path: '/admin',
    component: lazy(() => import('@/pages/Admin')),
  },
];
```

2. **Image Optimization**
```jsx
// Lazy load images
<img
  src={imageUrl}
  loading="lazy"
  alt="Description"
  className="w-full h-auto"
/>
```

3. **Bundle Analysis**
```bash
# Analyze bundle size
npm run build
npm run analyze
```

### Backend Performance

1. **Database Optimization**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
```

2. **API Caching**
```javascript
// Implement caching
const cache = new Map();

const getCachedData = (key) => {
  return cache.get(key);
};

const setCachedData = (key, data, ttl = 300000) => {
  cache.set(key, data);
  setTimeout(() => cache.delete(key), ttl);
};
```

## 🐛 Debugging

### Frontend Debugging

1. **React DevTools**
- Inspect component state and props
- Track component re-renders
- Profile component performance

2. **Browser DevTools**
- Network tab for API calls
- Console for errors and logs
- Performance tab for profiling

3. **Debugging Tools**
```javascript
// Debug component
useEffect(() => {
  console.log('Component mounted', { props, state });
}, []);

// Debug API calls
const debugApiCall = async (endpoint) => {
  console.log(`Calling API: ${endpoint}`);
  const response = await apiRequest(endpoint);
  console.log('API Response:', response);
  return response;
};
```

### Backend Debugging

1. **Logging**
```javascript
// Structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info('API request', { method, url, userId });
```

2. **Error Handling**
```javascript
// Comprehensive error handling
try {
  const result = await someOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error: error.message, stack: error.stack });
  throw new Error('Operation failed');
}
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/docs)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)

### Learning
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [JavaScript Best Practices](https://github.com/ryanmcdermott/clean-code-javascript)
- [API Design Guidelines](https://restfulapi.net/)

This workflow ensures consistent, high-quality code development and deployment for the Liberia Digital Insights platform.
