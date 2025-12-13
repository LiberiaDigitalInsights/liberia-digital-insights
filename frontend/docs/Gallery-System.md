# Gallery System

## 🖼️ Overview

The Gallery System is a comprehensive media management feature that allows users to browse, search, and filter photos and videos from events, podcasts, and other platform activities. It provides both public-facing gallery views and admin management capabilities.

## ✨ Key Features

- **Multi-media Support**: Images and videos with thumbnails
- **Event Association**: Link gallery items to specific events or podcasts
- **Category System**: Organize media by categories (conferences, workshops, interviews)
- **Advanced Filtering**: Filter by event, category, media type, and search
- **Lightbox Viewer**: Full-screen media viewing with navigation
- **Responsive Design**: Optimized for all screen sizes
- **Admin Management**: Complete CRUD operations for gallery items

## 🏗️ Architecture

### Frontend Components

```
src/
├── components/
│   ├── gallery/
│   │   ├── GalleryItem.jsx     # Individual gallery item component
│   │   ├── Lightbox.jsx        # Full-screen media viewer
│   │   └── GalleryGrid.jsx     # Grid layout component
│   └── admin/
│       └── AdminGallery.jsx    # Admin gallery management
├── hooks/
│   └── useGallery.js           # Gallery API hook
└── pages/
    └── Gallery.jsx             # Public gallery page
```

### Backend API

```
backend/src/routes/
└── gallery.js                  # Gallery API endpoints
```

### Database Schema

```sql
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  event_type TEXT CHECK (event_type IN ('event', 'podcast')),
  event_id UUID REFERENCES events(id) OR podcasts(id),
  category TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🌐 Public Gallery Interface

### Gallery Page (`/gallery`)

The main gallery page provides a rich browsing experience with:

- **Grid Layout**: Responsive grid of gallery items
- **Filter Bar**: Dynamic filtering options
- **Search**: Real-time search functionality
- **Lightbox**: Full-screen media viewing
- **Loading States**: Smooth loading animations
- **Empty States**: Helpful messages when no items found

#### Features

1. **Smart Filtering**
   - Filter by event (events with gallery items)
   - Filter by category (dynamic from available categories)
   - Filter by media type (image/video)
   - "All" option to show everything

2. **Search Functionality**
   - Search in titles and descriptions
   - Real-time search results
   - Search result highlighting

3. **Lightbox Viewer**
   - Full-screen image/video viewing
   - Keyboard navigation (arrow keys, ESC)
   - Previous/Next buttons
   - Image zoom capability
   - Video player integration

#### Component Structure

```jsx
// Gallery.jsx - Main gallery page
function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gallery = useGallery();

  // Fetch data and handle interactions
}
```

### Gallery Item Component

```jsx
// GalleryItem.jsx - Individual gallery item
function GalleryItem({ item, onClick }) {
  return (
    <div className="gallery-item" onClick={() => onClick(item)}>
      <div className="aspect-w-16 aspect-h-9">
        <LazyImage
          src={item.thumbnail_url || item.url}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.type}</span>
          {item.category && <span className="text-xs text-gray-500">{item.category}</span>}
        </div>
      </div>
    </div>
  );
}
```

### Lightbox Component

```jsx
// Lightbox.jsx - Full-screen media viewer
function Lightbox({ items, currentIndex, onClose, onNext, onPrevious }) {
  const currentItem = items[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <XIcon />
      </button>

      <button onClick={onPrevious} className="absolute left-4 top-1/2 text-white">
        <ChevronLeftIcon />
      </button>

      <button onClick={onNext} className="absolute right-4 top-1/2 text-white">
        <ChevronRightIcon />
      </button>

      <div className="flex items-center justify-center h-full">
        {currentItem.type === 'image' ? (
          <img
            src={currentItem.url}
            alt={currentItem.title}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video src={currentItem.url} controls className="max-w-full max-h-full" />
        )}
      </div>
    </div>
  );
}
```

## 🔧 Admin Gallery Management

### Admin Gallery Interface

The admin panel provides comprehensive gallery management:

- **Gallery Grid**: View all gallery items
- **Upload Interface**: Add new gallery items
- **Edit Forms**: Update existing items
- **Bulk Operations**: Select and manage multiple items
- **Filtering**: Admin-specific filtering options
- **Preview**: Real-time preview of changes

#### Features

1. **Gallery Management**
   - Add new gallery items
   - Edit existing items
   - Delete items (with confirmation)
   - Bulk operations
   - Drag-and-drop file upload

2. **Media Upload**
   - Support for images and videos
   - Automatic thumbnail generation
   - File size validation
   - Multiple file upload
   - Progress indicators

3. **Metadata Management**
   - Title and description editing
   - Category assignment
   - Event/podcast linking
   - Tag management
   - Featured item selection

### Admin Gallery Component

```jsx
// AdminGallery.jsx - Admin gallery management
function AdminGallery() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const gallery = useGallery();

  const handleUpload = async (files) => {
    // Handle file upload and gallery item creation
  };

  const handleBulkDelete = async () => {
    // Handle bulk deletion
  };

  const handleEditItem = async (id, updates) => {
    // Handle item editing
  };
}
```

## 🔌 API Integration

### useGallery Hook

The gallery system uses a custom React hook for API interactions:

```javascript
// hooks/useGallery.js
export const useGallery = () => {
  return {
    // Get all gallery items
    getItems: async (params = {}) => {
      const response = await apiRequest(`/v1/gallery?${queryParams.toString()}`);
      return response;
    },

    // Get single gallery item
    getItem: async (id) => {
      return await apiRequest(`/v1/gallery/${id}`);
    },

    // Get events with gallery items
    getEvents: async () => {
      return await apiRequest('/v1/gallery/events');
    },

    // Get podcasts with gallery items
    getPodcasts: async () => {
      return await apiRequest('/v1/gallery/podcasts');
    },

    // Get categories
    getCategories: async () => {
      return await apiRequest('/v1/gallery/categories');
    },

    // Create gallery item
    createItem: async (itemData) => {
      return await apiRequest('/v1/gallery', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
    },

    // Update gallery item
    updateItem: async (id, itemData) => {
      return await apiRequest(`/v1/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      });
    },

    // Delete gallery item
    deleteItem: async (id) => {
      await apiRequest(`/v1/gallery/${id}`, {
        method: 'DELETE',
      });
    },
  };
};
```

## 📱 Responsive Design

### Breakpoints

- **Mobile** (< 640px): 1 column grid
- **Tablet** (640px - 1024px): 2-3 columns
- **Desktop** (> 1024px): 4 columns

### Mobile Optimizations

- Touch-friendly tap targets
- Swipe gestures for lightbox navigation
- Optimized image loading
- Simplified filter interface

## 🎨 Styling and Theming

### CSS Classes

```css
/* Gallery grid */
.gallery-grid {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
}

/* Gallery item */
.gallery-item {
  @apply bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
         transform transition-all duration-200 hover:scale-105 hover:shadow-lg;
}

/* Filter buttons */
.filter-button {
  @apply px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200;
}

.filter-button.active {
  @apply bg-brand-500 text-white;
}

.filter-button.inactive {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}
```

### Theme Integration

The gallery system integrates with the platform's theme system:

- **Colors**: Uses CSS custom properties for consistent theming
- **Typography**: Follows the platform's typography scale
- **Spacing**: Uses the design system's spacing tokens
- **Animations**: Consistent with platform animation patterns

## 🚀 Performance Optimizations

### Image Optimization

- **Lazy Loading**: Images load as needed
- **Thumbnails**: Smaller thumbnails for grid view
- **Progressive Loading**: Low-quality placeholders
- **WebP Support**: Modern image format when available

### Video Optimization

- **Thumbnail Generation**: Video thumbnails for grid view
- **Lazy Loading**: Videos load only when played
- **Compression**: Optimized video formats
- **Streaming**: Progressive video loading

### Caching Strategy

- **Browser Caching**: Appropriate cache headers
- **CDN Integration**: Static assets served via CDN
- **API Caching**: Gallery data caching
- **Service Worker**: Offline capability

## 🔍 Search and Filtering

### Search Implementation

```javascript
// Search functionality
const filteredItems = React.useMemo(() => {
  if (filter === 'all') return items;

  if (filter.startsWith('event:')) {
    const eventSlug = filter.replace('event:', '');
    return items.filter((item) => item.event_type === 'event' && item.events?.slug === eventSlug);
  }

  if (filter.startsWith('podcast:')) {
    const podcastSlug = filter.replace('podcast:', '');
    return items.filter(
      (item) => item.event_type === 'podcast' && item.podcasts?.slug === podcastSlug,
    );
  }

  if (filter.startsWith('category:')) {
    const category = filter.replace('category:', '');
    return items.filter((item) => item.category === category);
  }

  return items;
}, [filter, items]);
```

### Filter Categories

- **Event-based**: Dynamic from events with gallery items
- **Category-based**: From gallery item categories
- **Type-based**: Image/video filter
- **Search**: Text-based search

## 🛠️ Development Guidelines

### Adding New Features

1. **Backend**: Add new endpoints to `gallery.js`
2. **Frontend**: Extend `useGallery` hook
3. **Components**: Update gallery components
4. **Tests**: Add comprehensive tests
5. **Documentation**: Update this documentation

### Best Practices

- **Performance**: Optimize image and video loading
- **Accessibility**: Add proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful error states and user feedback
- **Testing**: Unit and integration tests for all components
- **Documentation**: Keep this documentation up to date

## 🧪 Testing

### Unit Tests

```javascript
// GalleryItem.test.jsx
test('renders gallery item correctly', () => {
  const mockItem = {
    id: '1',
    title: 'Test Image',
    type: 'image',
    url: 'https://example.com/image.jpg',
    thumbnail_url: 'https://example.com/thumb.jpg',
  };

  render(<GalleryItem item={mockItem} onClick={jest.fn()} />);

  expect(screen.getByText('Test Image')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', mockItem.thumbnail_url);
});
```

### Integration Tests

```javascript
// Gallery.test.jsx
test('loads and displays gallery items', async () => {
  render(<Gallery />);

  await waitFor(() => {
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  // Test filtering, search, and lightbox functionality
});
```

## 📊 Analytics and Metrics

### Gallery Metrics

- **Views**: Track gallery item views
- **Interactions**: Lightbox opens, filter usage
- **Uploads**: Admin upload statistics
- **Popular Content**: Most viewed items

### Implementation

```javascript
// Analytics tracking
const trackGalleryView = (itemId) => {
  analytics.track('gallery_item_viewed', {
    item_id: itemId,
    timestamp: new Date().toISOString(),
  });
};

const trackFilterUsage = (filterType, filterValue) => {
  analytics.track('gallery_filter_used', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};
```

## 🔮 Future Enhancements

### Planned Features

- **Albums**: Group gallery items into albums
- **Comments**: Allow comments on gallery items
- **Sharing**: Social media sharing integration
- **Tags**: Enhanced tagging system
- **AI Features**: Automatic tagging and categorization
- **Virtual Tours**: 360° photo support

### Technical Improvements

- **WebP Support**: Better image compression
- **Video Streaming**: Adaptive bitrate streaming
- **CDN Integration**: Global content delivery
- **Service Worker**: Enhanced offline support
- **Real-time Updates**: WebSocket integration for live updates
