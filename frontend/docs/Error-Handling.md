# Error Handling

## ⚠️ Overview

Comprehensive error handling is crucial for maintaining a robust and user-friendly application. This document outlines the error handling strategies, patterns, and best practices used throughout Liberia Digital Insights.

## 🏗️ Error Architecture

### Error Types

```javascript
// Base Error Class
class AppError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific Error Types
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

class ExternalServiceError extends AppError {
  constructor(service, message) {
    super(`${service} error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}
```

## 🔧 Backend Error Handling

### Global Error Handler

```javascript
// middleware/errorHandler.js
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error({
    error: err,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user?.id
    }
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404, 'NOT_FOUND');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} '${value}' already exists`;
    error = new AppError(message, 409, 'DUPLICATE_KEY');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    error = new ValidationError('Validation failed', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AuthenticationError(message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AuthenticationError(message);
  }

  // Supabase errors
  if (err.code?.startsWith('PGRST')) {
    error = handleSupabaseError(err);
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.code = 'INTERNAL_SERVER_ERROR';
  }

  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
```

### Async Error Wrapper

```javascript
// middleware/catchAsync.js
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
```

### Route Error Handling Example

```javascript
// routes/articles.js
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const getArticle = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const article = await Article.findById(id).populate('author');
  
  if (!article) {
    return next(new NotFoundError('Article'));
  }
  
  if (article.status !== 'published' && article.author.id !== req.user.id) {
    return next(new AuthorizationError('Access to this article is restricted'));
  }
  
  res.json({
    success: true,
    data: { article }
  });
});

const createArticle = catchAsync(async (req, res, next) => {
  const { title, content, category_id } = req.body;
  
  // Validation
  if (!title || !content) {
    return next(new ValidationError('Title and content are required'));
  }
  
  // Check category exists
  const category = await Category.findById(category_id);
  if (!category) {
    return next(new NotFoundError('Category'));
  }
  
  try {
    const article = await Article.create({
      title,
      content,
      category_id,
      author_id: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: { article },
      message: 'Article created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('Article with this title already exists'));
    }
    return next(error);
  }
});
```

## 🎨 Frontend Error Handling

### Error Boundary Component

```jsx
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    // Send to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Example: Send to Sentry, LogRocket, etc.
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="mb-4">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. 
                Our team has been notified and is working on a fix.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Go Home
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto">
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### API Error Hook

```javascript
// hooks/useApiError.js
import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error) => {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let details = null;

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      errorCode = data.error?.code || `HTTP_${status}`;
      errorMessage = data.error?.message || `Request failed with status ${status}`;
      details = data.error?.details || null;
    } else if (error.request) {
      // Request was made but no response received
      errorCode = 'NETWORK_ERROR';
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      errorCode = 'CLIENT_ERROR';
      errorMessage = error.message || 'An unexpected error occurred';
    }

    setError({
      code: errorCode,
      message: errorMessage,
      details,
      originalError: error
    });

    // Log to error service
    logError(error, { context: 'api_call', errorCode });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeRequest = useCallback(async (requestFn) => {
    setIsLoading(true);
    clearError();
    
    try {
      const result = await requestFn();
      setIsLoading(false);
      return result;
    } catch (error) {
      handleError(error);
      setIsLoading(false);
      throw error;
    }
  }, [handleError, clearError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeRequest
  };
};
```

### Error Display Component

```jsx
// components/ErrorDisplay.jsx
import React from 'react';

const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorIcon = (code) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return <WifiOffIcon className="h-5 w-5 text-orange-500" />;
      case 'VALIDATION_ERROR':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'AUTHENTICATION_ERROR':
        return <LockClosedIcon className="h-5 w-5 text-red-500" />;
      case 'NOT_FOUND':
        return <DocumentMissingIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getErrorColor = (code) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'VALIDATION_ERROR':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'AUTHENTICATION_ERROR':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'NOT_FOUND':
        return 'border-gray-200 bg-gray-50 text-gray-800';
      default:
        return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getErrorColor(error.code)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon(error.code)}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {error.message}
          </h3>
          
          {error.details && (
            <div className="mt-2 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {Array.isArray(error.details) ? (
                  error.details.map((detail, index) => (
                    <li key={index}>{detail.message || detail}</li>
                  ))
                ) : (
                  <li>{error.details}</li>
                )}
              </ul>
            </div>
          )}
          
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
```

## 📝 Form Validation Errors

### Form Validation Hook

```javascript
// hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return '';
    
    const schema = validationSchema[name];
    
    if (schema.required && (!value || value.toString().trim() === '')) {
      return schema.requiredMessage || `${name} is required`;
    }
    
    if (schema.minLength && value.length < schema.minLength) {
      return `${name} must be at least ${schema.minLength} characters`;
    }
    
    if (schema.maxLength && value.length > schema.maxLength) {
      return `${name} must not exceed ${schema.maxLength} characters`;
    }
    
    if (schema.pattern && !schema.pattern.test(value)) {
      return schema.patternMessage || `${name} format is invalid`;
    }
    
    if (schema.custom && !schema.custom(value)) {
      return schema.customMessage || `${name} is invalid`;
    }
    
    return '';
  }, [validationSchema]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationSchema).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema, validateField]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};
```

## 🔍 Error Logging & Monitoring

### Logger Utility

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'liberia-digital-insights',
    version: process.env.APP_VERSION || '1.0.0'
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Write error logs to file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    
    // Write all logs to file
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Add external logging services in production
if (process.env.NODE_ENV === 'production') {
  // Add Sentry, DataDog, etc.
  logger.add(new winston.transports.Http({
    host: 'logs.example.com',
    port: 8080,
    path: '/logs'
  }));
}

module.exports = logger;
```

### Error Reporting Service

```javascript
// services/errorReporting.js
class ErrorReportingService {
  static async report(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode,
      context: {
        userAgent: context.userAgent,
        url: context.url,
        method: context.method,
        userId: context.userId,
        timestamp: new Date().toISOString(),
        ...context
      }
    };

    // Log locally
    logger.error('Error reported', errorData);

    // Send to external service
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.sendToExternalService(errorData);
      } catch (reportingError) {
        logger.error('Failed to report error', { error: reportingError });
      }
    }
  }

  static async sendToExternalService(errorData) {
    // Integration with Sentry, Bugsnag, etc.
    if (process.env.SENTRY_DSN) {
      const Sentry = require('@sentry/node');
      Sentry.captureException(new Error(errorData.message), {
        extra: errorData
      });
    }
  }
}

module.exports = ErrorReportingService;
```

## 🛡️ Error Prevention Strategies

### Input Validation

```javascript
// middleware/validateRequest.js
const { body, validationResult } = require('express-validator');

const validateArticle = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  
  body('category_id')
    .isUUID()
    .withMessage('Invalid category ID'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
          }))
        }
      });
    }
    next();
  }
];

module.exports = validateArticle;
```

### Database Transaction Safety

```javascript
// utils/database.js
const { createClient } = require('@supabase/supabase-js');

class DatabaseService {
  static async withTransaction(callback) {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    try {
      const result = await callback(supabase);
      return result;
    } catch (error) {
      // Rollback is handled automatically by Supabase
      throw new DatabaseError(`Transaction failed: ${error.message}`);
    }
  }

  static async safeExecute(operation) {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      logger.error('Database operation failed', { error: error.message });
      return { 
        success: false, 
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database operation failed'
        }
      };
    }
  }
}

module.exports = DatabaseService;
```

## 📋 Error Response Standards

### Standard Error Format

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required",
        "value": null
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| AUTHENTICATION_ERROR | 401 | Authentication required or failed |
| AUTHORIZATION_ERROR | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (duplicate, etc.) |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| DATABASE_ERROR | 500 | Database operation failed |
| EXTERNAL_SERVICE_ERROR | 502 | External service unavailable |
| NETWORK_ERROR | N/A | Client-side network issue |
| CLIENT_ERROR | N/A | Client-side error |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |

## 🔄 Retry Mechanisms

### Exponential Backoff

```javascript
// utils/retry.js
class RetryService {
  static async execute(operation, options = {}) {
    const {
      maxAttempts = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      factor = 2,
      retryCondition = () => true
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts || !retryCondition(error)) {
          throw error;
        }
        
        const delay = Math.min(
          baseDelay * Math.pow(factor, attempt - 1),
          maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  static shouldRetry(error) {
    // Retry on network errors and 5xx server errors
    if (!error.response) return true; // Network error
    
    const status = error.response.status;
    return status >= 500 || status === 429;
  }
}

module.exports = RetryService;
```

## 📚 Best Practices

### General Guidelines

1. **Fail Fast**: Validate inputs early and fail immediately
2. **Consistent Format**: Use standard error response format across all endpoints
3. **Meaningful Messages**: Provide clear, actionable error messages
4. **Security**: Don't expose sensitive information in error messages
5. **Logging**: Log all errors with sufficient context for debugging

### Frontend Guidelines

1. **Error Boundaries**: Wrap components in error boundaries to catch React errors
2. **User Feedback**: Display user-friendly error messages with recovery options
3. **Graceful Degradation**: Provide fallbacks when features fail
4. **Loading States**: Show loading indicators to prevent user confusion
5. **Retry Logic**: Implement retry mechanisms for transient failures

### Backend Guidelines

1. **Centralized Handling**: Use global error handler for consistent responses
2. **Error Classification**: Use specific error types for different scenarios
3. **Input Validation**: Validate all inputs before processing
4. **Transaction Safety**: Use database transactions for data consistency
5. **Monitoring**: Set up error monitoring and alerting

This comprehensive error handling system ensures robust, user-friendly, and maintainable error management throughout Liberia Digital Insights.