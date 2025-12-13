# Content Management System

## 📝 Overview

The Content Management System (CMS) is the core of Liberia Digital Insights, enabling creation, editing, and management of various content types including articles, insights, podcasts, events, training courses, and newsletters. The system provides both public-facing content display and comprehensive admin management capabilities.

## 🎯 Content Types

### Articles

Long-form content about technology trends, industry analysis, and thought leadership pieces.

### Insights

Data-driven reports, trend analysis, and shorter analytical content.

### Podcasts

Audio content with show notes, transcripts, and guest information.

### Events

Technology events, workshops, conferences, and networking opportunities.

### Training Courses

Professional development courses and certification programs.

### Newsletters

Curated content delivery via email subscriptions.

## 🏗️ Architecture

### Frontend Components

```
src/
├── components/
│   ├── articles/
│   │   ├── ArticleCard.jsx     # Article preview card
│   │   ├── ArticleDetail.jsx   # Full article view
│   │   └── ArticleForm.jsx     # Article creation/editing
│   ├── insights/
│   │   ├── InsightCard.jsx     # Insight preview card
│   │   ├── InsightDetail.jsx   # Full insight view
│   │   └── InsightForm.jsx     # Insight creation/editing
│   ├── podcasts/
│   │   ├── PodcastCard.jsx     # Podcast preview card
│   │   ├── PodcastDetail.jsx   # Full podcast view
│   │   ├── PodcastPlayer.jsx   # Audio player component
│   │   └── PodcastForm.jsx     # Podcast creation/editing
│   ├── events/
│   │   ├── EventCard.jsx       # Event preview card
│   │   ├── EventDetail.jsx     # Full event view
│   │   └── EventForm.jsx       # Event creation/editing
│   ├── training/
│   │   ├── CourseCard.jsx      # Course preview card
│   │   ├── CourseDetail.jsx    # Full course view
│   │   └── CourseForm.jsx      # Course creation/editing
│   └── admin/
│       ├── AdminContent.jsx    # Main content management
│       ├── ContentEditor.jsx   # Rich text editor
│       └── ContentPreview.jsx  # Content preview
├── hooks/
│   ├── useArticles.js          # Articles API hook
│   ├── useInsights.js          # Insights API hook
│   ├── usePodcasts.js          # Podcasts API hook
│   ├── useEvents.js            # Events API hook
│   └── useTraining.js          # Training API hook
└── pages/
    ├── Articles.jsx            # Public articles listing
    ├── Insights.jsx            # Public insights listing
    ├── Podcasts.jsx            # Public podcasts listing
    ├── Events.jsx              # Public events listing
    ├── TrainingCourses.jsx     # Public training listing
    └── Admin.jsx               # Admin dashboard
```

### Backend API

```
backend/src/routes/
├── articles.js                 # Articles CRUD operations
├── insights.js                 # Insights CRUD operations
├── podcasts.js                 # Podcasts CRUD operations
├── events.js                   # Events CRUD operations
├── training.js                 # Training CRUD operations
└── newsletters.js              # Newsletter management
```

## 📄 Article Management

### Article Structure

```javascript
{
  id: "uuid",
  title: "Article Title",
  slug: "article-slug",
  excerpt: "Brief article summary...",
  content: "Full article content in HTML",
  category: "Technology",
  author: "Author Name",
  author_id: "author-uuid",
  status: "published", // published, draft, archived
  featured: false,
  tags: ["tag1", "tag2", "tag3"],
  seo_title: "Custom SEO title",
  seo_description: "Custom SEO description",
  reading_time: 5, // minutes
  view_count: 1250,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  published_at: "2024-01-01T00:00:00Z"
}
```

### Article Components

#### Article Card

```jsx
function ArticleCard({ article, showAuthor = true, showCategory = true }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {article.featured && (
        <div className="bg-brand-500 text-white text-sm px-3 py-1">Featured</div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {showCategory && (
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{article.category}</span>
          )}
          <span className="text-sm text-gray-500">{article.reading_time} min read</span>
        </div>

        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <Link to={`/article/${article.slug}`} className="hover:text-brand-500">
            {article.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        {showAuthor && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={article.author_avatar}
                alt={article.author}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{article.author}</span>
            </div>
            <time className="text-sm text-gray-500">{formatDate(article.published_at)}</time>
          </div>
        )}
      </div>
    </article>
  );
}
```

#### Article Detail

```jsx
function ArticleDetail({ slug }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const articles = useArticles();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articles.getBySlug(slug);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, articles]);

  if (loading) return <ArticleSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!article) return <NotFound />;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">
            {article.category}
          </span>
          {article.featured && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center">
            <img
              src={article.author_avatar}
              alt={article.author}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">{article.author}</div>
              <div className="text-sm">
                {formatDate(article.published_at)} • {article.reading_time} min read
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ShareButton article={article} />
            <BookmarkButton articleId={article.id} />
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <ContentRenderer html={article.content} />
      </div>

      {article.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      <RelatedArticles currentArticle={article} />
      <Comments articleId={article.id} />
    </article>
  );
}
```

## 🎙️ Podcast Management

### Podcast Structure

```javascript
{
  id: "uuid",
  title: "Podcast Episode Title",
  slug: "podcast-slug",
  description: "Episode description...",
  content: "Show notes and transcript...",
  audio_url: "https://example.com/audio.mp3",
  audio_file_size: "45MB",
  duration: "45:30", // MM:SS format
  episode_number: 12,
  season_number: 1,
  guests: [
    {
      name: "Guest Name",
      title: "Guest Title",
      company: "Guest Company",
      avatar: "https://example.com/avatar.jpg"
    }
  ],
  host: "Host Name",
  status: "published",
  featured: false,
  tags: ["tech", "innovation", "liberia"],
  download_count: 1250,
  play_count: 5000,
  created_at: "2024-01-01T00:00:00Z",
  published_at: "2024-01-01T00:00:00Z"
}
```

### Podcast Player

```jsx
function PodcastPlayer({ podcast, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <audio
        ref={audioRef}
        src={podcast.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        preload="metadata"
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{podcast.title}</h3>
          <p className="text-gray-600">{podcast.description}</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">{formatTime(currentTime)}</div>
          <div className="text-sm text-gray-500">{formatTime(duration)}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all duration-100"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : '0%',
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="bg-brand-500 text-white p-3 rounded-full hover:bg-brand-600"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>

          <select
            value={playbackRate}
            onChange={(e) => {
              const rate = parseFloat(e.target.value);
              setPlaybackRate(rate);
              if (audioRef.current) {
                audioRef.current.playbackRate = rate;
              }
            }}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <DownloadButton podcast={podcast} />
          <ShareButton podcast={podcast} />
        </div>
      </div>
    </div>
  );
}
```

## 📅 Event Management

### Event Structure

```javascript
{
  id: "uuid",
  title: "Tech Conference 2024",
  slug: "tech-conference-2024",
  description: "Annual technology conference...",
  content: "Full event details and agenda...",
  start_date: "2024-06-15T09:00:00Z",
  end_date: "2024-06-15T17:00:00Z",
  location: "Monrovia, Liberia",
  venue: "Conference Center",
  address: "123 Main Street, Monrovia",
  registration_url: "https://example.com/register",
  max_attendees: 200,
  current_attendees: 150,
  price: 50.00,
  currency: "USD",
  status: "upcoming", // upcoming, ongoing, completed, cancelled
  featured: false,
  tags: ["tech", "conference", "networking"],
  organizers: [
    {
      name: "Tech Hub Liberia",
      logo: "https://example.com/logo.png"
    }
  ],
  sponsors: [
    {
      name: "Sponsor Name",
      logo: "https://example.com/sponsor.png",
      tier: "gold"
    }
  ],
  created_at: "2024-01-01T00:00:00Z"
}
```

### Event Components

#### Event Card

```jsx
function EventCard({ event }) {
  const isUpcoming = new Date(event.start_date) > new Date();
  const isOngoing =
    new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isOngoing
                ? 'bg-green-100 text-green-800'
                : isUpcoming
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isOngoing ? 'Live Now' : isUpcoming ? 'Upcoming' : 'Completed'}
          </span>

          {event.featured && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">
          <Link to={`/event/${event.slug}`} className="hover:text-brand-500">
            {event.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {formatDate(event.start_date)}
            {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
          </div>

          <div className="flex items-center">
            <LocationIcon className="w-4 h-4 mr-2" />
            {event.venue}, {event.location}
          </div>

          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-2" />
            {event.current_attendees} / {event.max_attendees} attendees
          </div>

          {event.price > 0 && (
            <div className="flex items-center">
              <CurrencyIcon className="w-4 h-4 mr-2" />
              {event.currency} {event.price}
            </div>
          )}
        </div>

        <div className="mt-4 flex space-x-2">
          {isUpcoming && event.registration_url && (
            <Button
              as="a"
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              Register Now
            </Button>
          )}

          <Button variant="outline" as={Link} to={`/event/${event.slug}`}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 🎓 Training Course Management

### Course Structure

```javascript
{
  id: "uuid",
  title: "Web Development Bootcamp",
  slug: "web-development-bootcamp",
  description: "Comprehensive web development course...",
  content: "Full course curriculum and details...",
  instructor: "John Doe",
  instructor_id: "instructor-uuid",
  instructor_bio: "Experienced web developer...",
  duration: "8 weeks",
  level: "beginner", // beginner, intermediate, advanced
  format: "online", // online, in-person, hybrid
  price: 299.00,
  currency: "USD",
  max_students: 30,
  current_students: 25,
  start_date: "2024-02-01T00:00:00Z",
  end_date: "2024-03-28T00:00:00Z",
  schedule: "Mon, Wed, Fri - 6:00 PM - 8:00 PM",
  prerequisites: ["Basic HTML knowledge", "Computer literacy"],
  learning_outcomes: [
    "Build responsive websites",
    "Understand JavaScript fundamentals",
    "Deploy web applications"
  ],
  certificate: true,
  status: "enrollment_open",
  featured: false,
  tags: ["web-dev", "javascript", "react"],
  rating: 4.8,
  review_count: 45,
  created_at: "2024-01-01T00:00:00Z"
}
```

## 📧 Newsletter Management

### Newsletter Structure

```javascript
{
  id: "uuid",
  title: "Weekly Tech Digest",
  subject: "This Week in Liberian Tech",
  content: "Newsletter content in HTML",
  preview_text: "Brief preview for email clients...",
  template: "default", // default, minimal, promotional
  status: "draft", // draft, scheduled, sent
  scheduled_at: "2024-01-01T09:00:00Z",
  sent_at: "2024-01-01T09:15:00Z",
  recipient_count: 1250,
  open_count: 890,
  click_count: 234,
  unsubscribe_count: 12,
  created_at: "2024-01-01T00:00:00Z"
}
```

### Subscription Management

```javascript
// Newsletter subscription
{
  id: "uuid",
  email: "subscriber@example.com",
  name: "Subscriber Name",
  status: "active", // active, unsubscribed, bounced
  preferences: {
    articles: true,
    insights: true,
    podcasts: false,
    events: true,
    training: false
  },
  subscribed_at: "2024-01-01T00:00:00Z",
  last_sent_at: "2024-01-08T09:00:00Z"
}
```

## 📝 Rich Text Editor

### TipTap Integration

The CMS uses TipTap for rich text editing with custom extensions:

```jsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

function RichTextEditor({ value, onChange, disabled = false }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange({ target: { value: editor.getHTML() } });
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
```

## 🔄 Content Workflow

### Publishing Workflow

1. **Draft Creation**: Content created as draft
2. **Review Process**: Internal review and editing
3. **SEO Optimization**: Meta tags and descriptions
4. **Scheduling**: Set publication date/time
5. **Publication**: Content goes live
6. **Promotion**: Social media and newsletter promotion
7. **Analytics**: Track performance metrics

### Content States

- **Draft**: Work in progress, not public
- **Review**: Ready for editorial review
- **Scheduled**: Set for future publication
- **Published**: Live and publicly accessible
- **Archived**: No longer actively promoted

## 📊 Analytics and Metrics

### Content Performance

- **Views**: Page view counts
- **Read Time**: Average time spent on content
- **Engagement**: Comments, shares, bookmarks
- **Conversion**: Newsletter signups, course enrollments
- **SEO Performance**: Search rankings and traffic

### Implementation

```javascript
// Analytics tracking
const trackContentView = (contentType, contentId) => {
  analytics.track('content_viewed', {
    content_type: contentType,
    content_id: contentId,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    referrer: document.referrer,
  });
};

const trackContentEngagement = (contentType, contentId, action) => {
  analytics.track('content_engaged', {
    content_type: contentType,
    content_id: contentId,
    action: action, // comment, share, bookmark, download
    timestamp: new Date().toISOString(),
  });
};
```

## 🛠️ Development Guidelines

### Content Creation

1. **SEO Optimization**: Use proper headings, meta descriptions
2. **Accessibility**: Add alt text, proper heading structure
3. **Performance**: Optimize images and media
4. **Mobile**: Ensure responsive design
5. **Validation**: Validate all input data

### API Integration

```javascript
// Example content hook
export const useArticles = () => {
  return {
    // Get all articles
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/articles?${queryParams.toString()}`);
      return response;
    },

    // Get article by slug
    getBySlug: async (slug) => {
      return await apiRequest(`/v1/articles/slug/${slug}`);
    },

    // Create article
    create: async (articleData) => {
      return await apiRequest('/v1/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
    },

    // Update article
    update: async (id, articleData) => {
      return await apiRequest(`/v1/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(articleData),
      });
    },

    // Delete article
    delete: async (id) => {
      await apiRequest(`/v1/articles/${id}`, {
        method: 'DELETE',
      });
    },
  };
};
```

## 🧪 Testing

### Content Components

```javascript
// ArticleCard.test.jsx
test('renders article card correctly', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    slug: 'test-article',
    excerpt: 'Test excerpt...',
    category: 'Technology',
    author: 'Test Author',
    reading_time: 5,
    published_at: '2024-01-01T00:00:00Z',
  };

  render(<ArticleCard article={mockArticle} />);

  expect(screen.getByText('Test Article')).toBeInTheDocument();
  expect(screen.getByText('Test excerpt...')).toBeInTheDocument();
  expect(screen.getByText('Technology')).toBeInTheDocument();
  expect(screen.getByText('Test Author')).toBeInTheDocument();
  expect(screen.getByText('5 min read')).toBeInTheDocument();
});
```

## 🔮 Future Enhancements

### Planned Features

- **Content Templates**: Reusable content templates
- **A/B Testing**: Test different content variations
- **Personalization**: Personalized content recommendations
- **Collaborative Editing**: Real-time collaborative editing
- **Content Versioning**: Track content changes and history
- **AI Integration**: AI-powered content suggestions
- **Multi-language**: Support for multiple languages

### Technical Improvements

- **CDN Integration**: Global content delivery
- **Image Optimization**: Automatic image optimization
- **Search Enhancement**: Advanced search capabilities
- **Performance**: Further performance optimizations
- **Offline Support**: Service worker for offline reading
