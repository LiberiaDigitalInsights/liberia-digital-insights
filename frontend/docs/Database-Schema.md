# Database Schema

## 🗄️ Overview

The Liberia Digital Insights platform uses Supabase (PostgreSQL) as its primary database. This document outlines the complete database schema, including all tables, relationships, indexes, and constraints that power the application.

## ✨ Key Features

- **Relational Design**: Proper foreign key relationships and constraints
- **Performance Optimized**: Strategic indexing for fast queries
- **Data Integrity**: Comprehensive constraints and validation rules
- **Audit Trail**: Timestamp tracking and soft delete functionality
- **Scalability**: Designed for horizontal scaling and high availability
- **Security**: Row Level Security (RLS) policies for data protection

## 🏗️ Database Architecture

### Core Tables Structure

```
liberia_digital_insights/
├── users/                     # User management
├── content/                  # Content management (articles, podcasts, etc.)
├── events/                   # Event management
├── training/                  # Training courses
├── gallery/                  # Media gallery
├── analytics/                # Analytics and metrics
├── newsletter/               # Newsletter system
└── system/                   # System configuration
```

## 👥 User Management Tables

### users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  full_name VARCHAR(101) GENERATED ALWAYS AS (
    COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
  ) STORED,
  
  -- Authentication
  password_hash VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  
  -- Profile Information
  bio TEXT,
  avatar_url TEXT,
  avatar_thumbnail TEXT,
  initials VARCHAR(2) GENERATED ALWAYS AS (
    UPPER(SUBSTRING(COALESCE(first_name, ''), 1, 1) || 
           SUBSTRING(COALESCE(last_name, ''), 1, 1))
  ) STORED,
  
  -- Location
  city VARCHAR(100),
  country VARCHAR(100),
  coordinates POINT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Professional Information
  title VARCHAR(100),
  company VARCHAR(100),
  experience_years INTEGER CHECK (experience_years >= 0),
  website TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  
  -- Preferences
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'light',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Privacy Settings
  profile_visibility VARCHAR(20) DEFAULT 'public' 
    CHECK (profile_visibility IN ('public', 'private', 'connections')),
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  
  -- Subscription
  subscription_plan VARCHAR(20) DEFAULT 'free'
    CHECK (subscription_plan IN ('free', 'basic', 'premium')),
  subscription_status VARCHAR(20) DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'expired')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Security
  last_password_change TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Status
  role VARCHAR(20) DEFAULT 'user'
    CHECK (role IN ('user', 'editor', 'admin')),
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_username_check CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_seen ON users(last_seen);
CREATE INDEX idx_users_location ON users USING GIST(coordinates);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
```

### user_skills Table

```sql
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  skill_level VARCHAR(20) NOT NULL 
    CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER CHECK (years_experience >= 0),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, skill_name)
);

-- Indexes
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_name ON user_skills(skill_name);
CREATE INDEX idx_user_skills_level ON user_skills(skill_level);
```

### user_education Table

```sql
CREATE TABLE user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree VARCHAR(100) NOT NULL,
  field VARCHAR(100) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  year INTEGER CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 10),
  gpa DECIMAL(3,2) CHECK (gpa >= 0 AND gpa <= 4.0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_education_user_id ON user_education(user_id);
CREATE INDEX idx_user_education_institution ON user_education(institution);
```

## 📝 Content Management Tables

### categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7) DEFAULT '#6B7280', -- Hex color
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT categories_slug_check CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
```

### articles Table

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  featured_image_thumbnail TEXT,
  
  -- Author and Category
  author_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  -- Metadata
  tags TEXT[], -- PostgreSQL array
  reading_time INTEGER, -- in minutes
  word_count INTEGER,
  
  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  focus_keyword VARCHAR(100),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT articles_slug_unique UNIQUE(slug),
  CONSTRAINT articles_slug_check CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Indexes
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at) WHERE status = 'published';
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_views ON articles(views_count DESC);
CREATE INDEX idx_articles_search ON articles USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content)
);
CREATE INDEX idx_articles_deleted_at ON articles(deleted_at) WHERE deleted_at IS NULL;

-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are publicly viewable" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view own articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all articles" ON articles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### podcasts Table

```sql
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  transcript TEXT,
  
  -- Media Files
  audio_url TEXT NOT NULL,
  audio_file_size BIGINT, -- in bytes
  audio_duration INTEGER, -- in seconds
  cover_image TEXT,
  cover_image_thumbnail TEXT,
  
  -- Host and Category
  host_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  -- Metadata
  tags TEXT[],
  language VARCHAR(10) DEFAULT 'en',
  
  -- Episode Information
  episode_number INTEGER,
  season_number INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Analytics
  plays_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  
  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT podcasts_slug_unique UNIQUE(slug),
  CONSTRAINT podcasts_slug_check CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Indexes
CREATE INDEX idx_podcasts_host_id ON podcasts(host_id);
CREATE INDEX idx_podcasts_category_id ON podcasts(category_id);
CREATE INDEX idx_podcasts_status ON podcasts(status);
CREATE INDEX idx_podcasts_published_at ON podcasts(published_at) WHERE status = 'published';
CREATE INDEX idx_podcasts_episode ON podcasts(episode_number, season_number);
CREATE INDEX idx_podcasts_tags ON podcasts USING GIN(tags);
CREATE INDEX idx_podcasts_plays ON podcasts(plays_count DESC);
CREATE INDEX idx_podcasts_deleted_at ON podcasts(deleted_at) WHERE deleted_at IS NULL;
```

### podcast_guests Table

```sql
CREATE TABLE podcast_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  podcast_id UUID NOT NULL REFERENCES podcasts(id) ON DELETE CASCADE,
  guest_name VARCHAR(200) NOT NULL,
  guest_title VARCHAR(200),
  guest_company VARCHAR(200),
  guest_bio TEXT,
  guest_avatar TEXT,
  guest_social_links JSONB, -- { twitter: '', linkedin: '', website: '' }
  role VARCHAR(50) DEFAULT 'guest' 
    CHECK (role IN ('host', 'co-host', 'guest', 'interviewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_podcast_guests_podcast_id ON podcast_guests(podcast_id);
CREATE INDEX idx_podcast_guests_name ON podcast_guests(guest_name);
```

## 📅 Events Tables

### events Table

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Event Details
  event_type VARCHAR(50) NOT NULL 
    CHECK (event_type IN ('workshop', 'conference', 'meetup', 'webinar', 'social')),
  format VARCHAR(20) DEFAULT 'in-person'
    CHECK (format IN ('in-person', 'virtual', 'hybrid')),
  
  -- Schedule
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Location
  venue_name VARCHAR(200),
  venue_address TEXT,
  venue_coordinates POINT,
  virtual_meeting_url TEXT,
  virtual_meeting_id VARCHAR(100),
  
  -- Capacity
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  waiting_list_count INTEGER DEFAULT 0,
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  early_bird_price DECIMAL(10,2),
  early_bird_deadline TIMESTAMP WITH TIME ZONE,
  
  -- Organizer
  organizer_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  -- Media
  cover_image TEXT,
  cover_image_thumbnail TEXT,
  gallery_images TEXT[], -- Array of image URLs
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'cancelled', 'completed')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  registrations_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT events_slug_unique UNIQUE(slug),
  CONSTRAINT events_start_end_check CHECK (end_time > start_time),
  CONSTRAINT events_capacity_check CHECK (max_attendees > 0),
  CONSTRAINT events_price_check CHECK (price >= 0)
);

-- Indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;
CREATE INDEX idx_events_location ON events USING GIST(venue_coordinates);
CREATE INDEX idx_events_deleted_at ON events(deleted_at) WHERE deleted_at IS NULL;
```

### event_registrations Table

```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Registration Details
  registration_type VARCHAR(20) DEFAULT 'standard'
    CHECK (registration_type IN ('standard', 'vip', 'speaker', 'organizer')),
  ticket_type VARCHAR(50),
  price_paid DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'registered'
    CHECK (status IN ('registered', 'confirmed', 'cancelled', 'attended', 'no-show')),
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Additional Information
  dietary_restrictions TEXT[],
  accessibility_needs TEXT,
  special_requests TEXT,
  
  -- Timestamps
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  attended_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(event_id, user_id) -- One registration per user per event
);

-- Indexes
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);
CREATE INDEX idx_event_registrations_registered_at ON event_registrations(registered_at);
```

## 🎓 Training Courses Tables

### training_courses Table

```sql
CREATE TABLE training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  
  -- Course Details
  course_type VARCHAR(50) NOT NULL 
    CHECK (course_type IN ('beginner', 'intermediate', 'advanced', 'workshop', 'certification')),
  format VARCHAR(20) DEFAULT 'online'
    CHECK (format IN ('online', 'in-person', 'hybrid')),
  language VARCHAR(10) DEFAULT 'en',
  
  -- Duration and Schedule
  duration_hours INTEGER,
  duration_weeks INTEGER,
  self_paced BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  
  -- Instructor
  instructor_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  
  -- Capacity
  max_students INTEGER,
  current_enrollments INTEGER DEFAULT 0,
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  has_certificate BOOLEAN DEFAULT false,
  certificate_cost DECIMAL(10,2),
  
  -- Media
  cover_image TEXT,
  cover_image_thumbnail TEXT,
  promotional_video TEXT,
  
  -- Requirements
  prerequisites TEXT[],
  required_materials TEXT[],
  skill_level VARCHAR(20) DEFAULT 'beginner'
    CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Analytics
  enrollments_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT training_courses_slug_unique UNIQUE(slug),
  CONSTRAINT training_courses_duration_check CHECK (duration_hours > 0),
  CONSTRAINT training_courses_dates_check CHECK (end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_training_courses_instructor_id ON training_courses(instructor_id);
CREATE INDEX idx_training_courses_category_id ON training_courses(category_id);
CREATE INDEX idx_training_courses_status ON training_courses(status);
CREATE INDEX idx_training_courses_type ON training_courses(course_type);
CREATE INDEX idx_training_courses_featured ON training_courses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_training_courses_rating ON training_courses(average_rating DESC);
CREATE INDEX idx_training_courses_deleted_at ON training_courses(deleted_at) WHERE deleted_at IS NULL;
```

### course_lessons Table

```sql
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT,
  
  -- Lesson Details
  lesson_type VARCHAR(20) DEFAULT 'text'
    CHECK (lesson_type IN ('text', 'video', 'audio', 'quiz', 'assignment')),
  video_url TEXT,
  video_duration INTEGER, -- in seconds
  audio_url TEXT,
  audio_duration INTEGER, -- in seconds
  
  -- Order and Structure
  lesson_order INTEGER NOT NULL,
  module_number INTEGER,
  is_mandatory BOOLEAN DEFAULT true,
  
  -- Resources
  resources JSONB, -- { files: [], links: [], downloads: [] }
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  is_preview BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(course_id, lesson_order)
);

-- Indexes
CREATE INDEX idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX idx_course_lessons_order ON course_lessons(course_id, lesson_order);
CREATE INDEX idx_course_lessons_status ON course_lessons(status);
CREATE INDEX idx_course_lessons_deleted_at ON course_lessons(deleted_at) WHERE deleted_at IS NULL;
```

### course_enrollments Table

```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Enrollment Details
  enrollment_type VARCHAR(20) DEFAULT 'standard'
    CHECK (enrollment_type IN ('standard', 'premium', 'audit')),
  price_paid DECIMAL(10,2),
  
  -- Progress
  progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER,
  last_accessed_lesson_id UUID REFERENCES course_lessons(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
  completion_date TIMESTAMP WITH TIME ZONE,
  
  -- Certificate
  certificate_issued BOOLEAN DEFAULT false,
  certificate_id VARCHAR(100),
  certificate_url TEXT,
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Timestamps
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(course_id, student_id)
);

-- Indexes
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX idx_course_enrollments_progress ON course_enrollments(progress_percentage);
CREATE INDEX idx_course_enrollments_enrolled_at ON course_enrollments(enrolled_at);
```

## 🖼️ Gallery Tables

### gallery_items Table

```sql
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200),
  description TEXT,
  
  -- Media Information
  file_type VARCHAR(20) NOT NULL 
    CHECK (file_type IN ('image', 'video', 'document')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT, -- in bytes
  mime_type VARCHAR(100),
  
  -- Image Specific
  width INTEGER,
  height INTEGER,
  thumbnail_url TEXT,
  medium_url TEXT,
  
  -- Video Specific
  duration INTEGER, -- in seconds
  thumbnail_time INTEGER, -- thumbnail at this second
  
  -- Association
  associated_type VARCHAR(50), -- 'article', 'event', 'course', 'user', etc.
  associated_id UUID,
  
  -- Organization
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  sort_order INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'processing')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT gallery_items_association_check CHECK (
    (associated_type IS NULL AND associated_id IS NULL) OR
    (associated_type IS NOT NULL AND associated_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_gallery_items_type ON gallery_items(file_type);
CREATE INDEX idx_gallery_items_associated ON gallery_items(associated_type, associated_id);
CREATE INDEX idx_gallery_items_category_id ON gallery_items(category_id);
CREATE INDEX idx_gallery_items_status ON gallery_items(status);
CREATE INDEX idx_gallery_items_featured ON gallery_items(is_featured) WHERE is_featured = true;
CREATE INDEX idx_gallery_items_tags ON gallery_items USING GIN(tags);
CREATE INDEX idx_gallery_items_deleted_at ON gallery_items(deleted_at) WHERE deleted_at IS NULL;
```

## 📊 Analytics Tables

### analytics_events Table

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  
  -- User and Session
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  
  -- Request Information
  url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Geographic Information
  country VARCHAR(100),
  city VARCHAR(100),
  coordinates POINT,
  
  -- Device Information
  device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  os VARCHAR(50),
  browser VARCHAR(50),
  browser_version VARCHAR(20),
  
  -- Event Specific Data
  target_type VARCHAR(50), -- 'article', 'podcast', 'event', etc.
  target_id UUID,
  action VARCHAR(100), -- 'view', 'like', 'share', 'download', etc.
  value DECIMAL(10,2),
  properties JSONB, -- Additional event properties
  
  -- Timestamp
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_target ON analytics_events(target_type, target_id);
CREATE INDEX idx_analytics_events_properties ON analytics_events USING GIN(properties);

-- Partition by month for performance
CREATE TABLE analytics_events_y2024m01 PARTITION OF analytics_events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### analytics_metrics Table

```sql
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'page_views', 'users', 'sessions', etc.
  metric_value BIGINT NOT NULL,
  
  -- Dimensions
  dimension_type VARCHAR(50), -- 'source', 'device', 'location', etc.
  dimension_value VARCHAR(100),
  
  -- Additional Context
  properties JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(metric_date, metric_type, dimension_type, dimension_value)
);

-- Indexes
CREATE INDEX idx_analytics_metrics_date ON analytics_metrics(metric_date);
CREATE INDEX idx_analytics_metrics_type ON analytics_metrics(metric_type);
CREATE INDEX idx_analytics_metrics_dimension ON analytics_metrics(dimension_type, dimension_value);
```

## 📧 Newsletter Tables

### newsletters Table

```sql
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  preview_text VARCHAR(500),
  
  -- Content
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_id UUID REFERENCES newsletter_templates(id),
  
  -- Sending Details
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(100),
  reply_to_email VARCHAR(255),
  
  -- Schedule
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  
  -- Analytics
  recipients_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  -- Creator
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_newsletters_status ON newsletters(status);
CREATE INDEX idx_newsletters_scheduled_at ON newsletters(scheduled_at);
CREATE INDEX idx_newsletters_sent_at ON newsletters(sent_at);
CREATE INDEX idx_newsletters_created_by ON newsletters(created_by);
CREATE INDEX idx_newsletters_deleted_at ON newsletters(deleted_at) WHERE deleted_at IS NULL;
```

### newsletter_subscribers Table

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  
  -- Subscription Details
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'unsubscribed', 'bounced')),
  subscription_source VARCHAR(50), -- 'website', 'import', 'manual', etc.
  
  -- Preferences
  preferences JSONB DEFAULT '{}', -- { articles: true, events: true, courses: false }
  
  -- Analytics
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  last_opened_at TIMESTAMP WITH TIME ZONE,
  last_clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- User Association
  user_id UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT newsletter_subscribers_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_user_id ON newsletter_subscribers(user_id);
```

## 🔧 System Tables

### settings Table

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false, -- Whether setting is exposed to frontend
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_settings_public ON settings(is_public) WHERE is_public = true;
```

### audit_logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL 
    CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  
  -- User Information
  user_id UUID REFERENCES users(id),
  user_role VARCHAR(20),
  ip_address INET,
  user_agent TEXT,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  changed_columns TEXT[],
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 🔄 Triggers and Functions

### Update Timestamp Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all relevant tables)
```

### Audit Log Trigger

```sql
-- Function to create audit logs
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_columns, user_id)
    VALUES (
      TG_TABLE_NAME, 
      NEW.id, 
      'UPDATE', 
      row_to_json(OLD), 
      row_to_json(NEW),
      (SELECT array_agg(key) FROM jsonb_object_keys(row_to_json(NEW)) 
       WHERE row_to_json(NEW)->>key IS DISTINCT FROM row_to_json(OLD)->>key),
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to critical tables
CREATE TRIGGER audit_users_trigger AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_articles_trigger AFTER INSERT OR UPDATE OR DELETE ON articles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ... (apply to all critical tables)
```

## 📋 Database Views

### Content Analytics View

```sql
CREATE VIEW content_analytics AS
SELECT 
  'article' as content_type,
  a.id,
  a.title,
  a.slug,
  a.views_count,
  a.likes_count,
  a.comments_count,
  a.shares_count,
  a.published_at,
  u.first_name || ' ' || u.last_name as author_name,
  c.name as category_name
FROM articles a
JOIN users u ON a.author_id = u.id
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published' AND a.deleted_at IS NULL

UNION ALL

SELECT 
  'podcast' as content_type,
  p.id,
  p.title,
  p.slug,
  p.plays_count as views_count,
  p.likes_count,
  0 as comments_count,
  0 as shares_count,
  p.published_at,
  u.first_name || ' ' || u.last_name as author_name,
  c.name as category_name
FROM podcasts p
JOIN users u ON p.host_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published' AND p.deleted_at IS NULL;
```

### User Activity Summary View

```sql
CREATE VIEW user_activity_summary AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  u.created_at,
  u.last_seen,
  COALESCE(article_stats.article_count, 0) as articles_count,
  COALESCE(podcast_stats.podcast_count, 0) as podcasts_count,
  COALESCE(event_stats.events_attended, 0) as events_attended,
  COALESCE(course_stats.courses_enrolled, 0) as courses_enrolled,
  COALESCE(course_stats.courses_completed, 0) as courses_completed
FROM users u
LEFT JOIN (
  SELECT author_id, COUNT(*) as article_count
  FROM articles 
  WHERE status = 'published' AND deleted_at IS NULL
  GROUP BY author_id
) article_stats ON u.id = article_stats.author_id
LEFT JOIN (
  SELECT host_id, COUNT(*) as podcast_count
  FROM podcasts 
  WHERE status = 'published' AND deleted_at IS NULL
  GROUP BY host_id
) podcast_stats ON u.id = podcast_stats.host_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as events_attended
  FROM event_registrations 
  WHERE status = 'attended'
  GROUP BY user_id
) event_stats ON u.id = event_stats.user_id
LEFT JOIN (
  SELECT 
    student_id,
    COUNT(*) as courses_enrolled,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as courses_completed
  FROM course_enrollments
  GROUP BY student_id
) course_stats ON u.id = course_stats.student_id
WHERE u.deleted_at IS NULL;
```

## 🛡️ Security Considerations

### Row Level Security (RLS)

1. **User Data**: Users can only access their own data
2. **Content**: Published content is publicly readable
3. **Admin Access**: Admins have full access to all data
4. **Analytics**: Restricted to authorized users

### Data Encryption

1. **Passwords**: Hashed using bcrypt
2. **Sensitive Data**: Encrypted at rest
3. **Communication**: TLS encryption in transit
4. **PII**: Personal identifiable information protected

### Backup Strategy

1. **Daily Backups**: Automated daily backups
2. **Point-in-Time Recovery**: 7-day retention
3. **Geographic Distribution**: Multi-region replication
4. **Testing**: Regular backup restoration tests

## 📈 Performance Optimization

### Indexing Strategy

1. **Primary Keys**: UUID indexes for all tables
2. **Foreign Keys**: Indexed for join performance
3. **Search**: Full-text search indexes
4. **Time Series**: Partitioned by date
5. **Geospatial**: GIST indexes for location data

### Query Optimization

1. **Materialized Views**: Pre-computed aggregations
2. **Connection Pooling**: PgBouncer for connection management
3. **Caching**: Redis for frequent queries
4. **Read Replicas**: Separate read replicas
5. **Query Monitoring**: Slow query logging

## 🔄 Migration Strategy

### Version Control

1. **Schema Migrations**: Version-controlled schema changes
2. **Data Migrations**: Automated data transformations
3. **Rollback Plans**: Reversible migration scripts
4. **Testing**: Migration testing in staging
5. **Zero Downtime**: Blue-green deployment strategy

This comprehensive database schema provides a solid foundation for the Liberia Digital Insights platform, ensuring data integrity, performance, and scalability while maintaining security best practices.