# Newsletter System

## 📧 Overview

The Newsletter System provides comprehensive functionality for creating, managing, and distributing email newsletters to keep Liberia's digital community informed about the latest technology insights, events, and opportunities. It supports subscriber management, campaign tracking, and automated workflows.

## ✨ Key Features

- **Newsletter Creation**: Design and create beautiful newsletters with rich content
- **Subscriber Management**: Handle subscriptions, preferences, and segmentation
- **Campaign Management**: Schedule and track newsletter campaigns
- **Template System**: Reusable templates for consistent branding
- **Analytics Tracking**: Monitor open rates, click-through rates, and engagement
- **Automation**: Set up automated email sequences and triggers
- **Unsubscribe Management**: Handle opt-outs and preferences respectfully

## 🏗️ Architecture

### Frontend Components

```
src/components/newsletter/
├── NewsletterEditor.jsx     # Newsletter creation/editing interface
├── CampaignManager.jsx       # Campaign scheduling and management
├── SubscriberList.jsx        # Subscriber management interface
├── TemplateGallery.jsx       # Template selection and preview
├── AnalyticsDashboard.jsx    # Campaign performance analytics
├── AutomationRules.jsx      # Automated workflow setup
├── PreviewMode.jsx           # Newsletter preview component
└── UnsubscribePage.jsx       # Unsubscribe preference page
```

### Backend API

```
backend/src/routes/newsletters.js  # Newsletter CRUD operations
backend/src/routes/subscribers.js   # Subscriber management
backend/src/routes/campaigns.js      # Campaign management
```

## 📝 Newsletter Structure

```javascript
{
  id: "uuid",
  title: "Tech Insights Monthly - January 2024",
  subject: "🚀 Latest Tech Trends & Opportunities in Liberia",
  preview_text: "Discover the hottest tech trends, upcoming events, and career opportunities...",
  content: {
    header: {
      logo_url: "https://example.com/logo.png",
      banner_image: "https://example.com/banner.jpg",
      tagline: "Empowering Liberia's Digital Future"
    },
    sections: [
      {
        id: "section-1",
        type: "hero",
        title: "Welcome to 2024: Tech Trends to Watch",
        content: "Full section content with rich text...",
        image: "https://example.com/hero-image.jpg",
        cta: {
          text: "Read Full Article",
          url: "https://example.com/article"
        }
      },
      {
        id: "section-2",
        type: "featured",
        title: "Featured Stories",
        items: [
          {
            title: "Local Startup Raises $1M Funding",
            excerpt: "Tech startup secures major investment...",
            image: "https://example.com/story1.jpg",
            url: "https://example.com/story1"
          }
        ]
      },
      {
        id: "section-3",
        type: "events",
        title: "Upcoming Events",
        events: [
          {
            title: "Tech Meetup Monrovia",
            date: "2024-01-15T18:00:00Z",
            location: "Innovation Hub, Monrovia",
            url: "https://example.com/event1"
          }
        ]
      }
    ],
    footer: {
      social_links: [
        { platform: "twitter", url: "https://twitter.com/liberiadigital" },
        { platform: "linkedin", url: "https://linkedin.com/company/liberiadigital" }
      ],
      unsubscribe_url: "https://example.com/unsubscribe",
      company_info: {
        name: "Liberia Digital Insights",
        address: "123 Tech Street, Monrovia, Liberia",
        phone: "+231-xxx-xxxx"
      }
    }
  },
  template_id: "template-uuid",
  status: "draft", // draft, scheduled, sent, archived
  scheduled_at: "2024-01-10T09:00:00Z",
  sent_at: null,
  stats: {
    sent_count: 0,
    opened_count: 0,
    clicked_count: 0,
    unsubscribed_count: 0,
    bounced_count: 0
  },
  segments: ["all_subscribers", "tech_enthusiasts"],
  created_by: "user-uuid",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
}
```

## 👥 Subscriber Management

### Subscriber Structure

```javascript
{
  id: "uuid",
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  status: "active", // active, unsubscribed, bounced, pending
  subscription_date: "2024-01-01T00:00:00Z",
  preferences: {
    frequency: "weekly", // daily, weekly, monthly
    categories: ["tech_news", "events", "opportunities"],
    format: "html" // html, text
  },
  segments: ["tech_enthusiasts", "developers"],
  stats: {
    emails_sent: 45,
    emails_opened: 32,
    emails_clicked: 12,
    last_opened: "2024-01-15T10:30:00Z",
    last_clicked: "2024-01-14T15:20:00Z"
  },
  custom_fields: {
    company: "Tech Solutions Liberia",
    job_title: "Software Developer",
    interests: ["web development", "ai", "blockchain"]
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

## 📧 Newsletter Editor

### Newsletter Creation Interface

```jsx
// NewsletterEditor.jsx
function NewsletterEditor({ newsletter, onSave, onPreview, onSendTest }) {
  const [content, setContent] = useState(newsletter?.content || {
    header: {
      logo_url: '',
      banner_image: '',
      tagline: ''
    },
    sections: [],
    footer: {
      social_links: [],
      unsubscribe_url: '',
      company_info: {}
    }
  });
  
  const [activeSection, setActiveSection] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title: '',
      content: '',
      ...getDefaultSectionContent(type)
    };
    
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, updates) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const sectionTypes = [
    { type: 'hero', label: 'Hero Section', icon: '🎯' },
    { type: 'featured', label: 'Featured Stories', icon: '⭐' },
    { type: 'events', label: 'Events', icon: '📅' },
    { type: 'opportunities', label: 'Opportunities', icon: '💼' },
    { type: 'cta', label: 'Call to Action', icon: '🚀' },
    { type: 'divider', label: 'Divider', icon: '➖' }
  ];

  if (isPreview) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Preview Mode</h3>
          <button
            onClick={() => setIsPreview(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Editor
          </button>
        </div>
        <PreviewMode content={content} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Newsletter Editor</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          
          <button
            onClick={() => onSendTest(content)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send Test
          </button>
          
          <button
            onClick={() => onSave(content)}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Header Settings */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Header Settings</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={content.header.logo_url}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, logo_url: e.target.value }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            <input
              type="url"
              value={content.header.banner_image}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, banner_image: e.target.value }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com/banner.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={content.header.tagline}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, tagline: e.target.value }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Your newsletter tagline"
            />
          </div>
        </div>
      </div>
      
      {/* Sections */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Newsletter Sections</h4>
          <div className="flex space-x-2">
            {sectionTypes.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {content.sections.map((section, index) => (
            <SectionEditor
              key={section.id}
              section={section}
              index={index}
              isActive={activeSection === index}
              onClick={() => setActiveSection(index)}
              onUpdate={(updates) => updateSection(section.id, updates)}
              onRemove={() => removeSection(section.id)}
            />
          ))}
        </div>
        
        {content.sections.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No sections added yet</p>
            <p className="text-sm text-gray-400">Click the buttons above to add your first section</p>
          </div>
        )}
      </div>
      
      {/* Footer Settings */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Footer Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unsubscribe URL
            </label>
            <input
              type="url"
              value={content.footer.unsubscribe_url}
              onChange={(e) => setContent({
                ...content,
                footer: { ...content.footer, unsubscribe_url: e.target.value }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com/unsubscribe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={content.footer.company_info?.name || ''}
              onChange={(e) => setContent({
                ...content,
                footer: {
                  ...content.footer,
                  company_info: { ...content.footer.company_info, name: e.target.value }
                }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Your company name"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 📊 Campaign Management

### Campaign Manager Component

```jsx
// CampaignManager.jsx
function CampaignManager({ campaigns, onCreateCampaign, onUpdateCampaign }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    if (filter === 'draft') return campaign.status === 'draft';
    if (filter === 'scheduled') return campaign.status === 'scheduled';
    if (filter === 'sent') return campaign.status === 'sent';
    return true;
  });

  const handleSchedule = (campaignId, scheduledAt) => {
    onUpdateCampaign(campaignId, {
      status: 'scheduled',
      scheduled_at: scheduledAt
    });
  };

  const handleSendNow = (campaignId) => {
    onUpdateCampaign(campaignId, {
      status: 'sent',
      sent_at: new Date().toISOString()
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Campaign Management</h3>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">All Campaigns</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
          </select>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Create Campaign
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{campaign.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{campaign.subject}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created {formatDate(campaign.created_at)}</span>
                  
                  {campaign.scheduled_at && campaign.status === 'scheduled' && (
                    <span>Scheduled for {formatDate(campaign.scheduled_at)}</span>
                  )}
                  
                  {campaign.sent_at && campaign.status === 'sent' && (
                    <span>Sent {formatDate(campaign.sent_at)}</span>
                  )}
                  
                  {campaign.stats.sent_count > 0 && (
                    <span>{campaign.stats.sent_count} recipients</span>
                  )}
                </div>
                
                {campaign.status === 'sent' && (
                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    <div className="flex items-center">
                      <MailOpenIcon className="w-4 h-4 mr-1 text-green-500" />
                      <span>{campaign.stats.opened_count} opens</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MousePointerIcon className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{campaign.stats.clicked_count} clicks</span>
                    </div>
                    
                    <div className="flex items-center">
                      <UserMinusIcon className="w-4 h-4 mr-1 text-red-500" />
                      <span>{campaign.stats.unsubscribed_count} unsubscribes</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCampaign(campaign)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Edit
                </button>
                
                {campaign.status === 'draft' && (
                  <>
                    <button
                      onClick={() => {
                        // Show schedule modal
                        const scheduledAt = prompt('Schedule for (YYYY-MM-DD HH:MM):');
                        if (scheduledAt) {
                          handleSchedule(campaign.id, new Date(scheduledAt).toISOString());
                        }
                      }}
                      className="px-3 py-1 border border-blue-300 rounded text-sm text-blue-600 hover:bg-blue-50"
                    >
                      Schedule
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Send this campaign now?')) {
                          handleSendNow(campaign.id);
                        }
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Send Now
                    </button>
                  </>
                )}
                
                {campaign.status === 'scheduled' && (
                  <button
                    onClick={() => {
                      if (confirm('Cancel this scheduled campaign?')) {
                        onUpdateCampaign(campaign.id, { status: 'draft', scheduled_at: null });
                      }
                    }}
                    className="px-3 py-1 border border-red-300 rounded text-sm text-red-600 hover:bg-red-50"
                  >
                    Cancel Schedule
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No campaigns found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Create Your First Campaign
          </button>
        </div>
      )}
      
      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(campaignData) => {
            onCreateCampaign(campaignData);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
```

## 📈 Analytics Dashboard

### Analytics Component

```jsx
// AnalyticsDashboard.jsx
function AnalyticsDashboard({ campaignId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchCampaignAnalytics(campaignId, timeRange).then(data => {
      setAnalytics(data);
      setLoading(false);
    });
  }, [campaignId, timeRange]);

  if (loading) return <LoadingSpinner />;
  
  const openRate = analytics.sent_count > 0 
    ? (analytics.opened_count / analytics.sent_count) * 100 
    : 0;
    
  const clickRate = analytics.opened_count > 0 
    ? (analytics.clicked_count / analytics.opened_count) * 100 
    : 0;
    
  const unsubscribeRate = analytics.sent_count > 0 
    ? (analytics.unsubscribed_count / analytics.sent_count) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Sent</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.sent_count}</p>
          <p className="text-sm text-gray-600">Total emails sent</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Open Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{openRate.toFixed(1)}%</p>
          <p className="text-sm text-green-600">+5% from last campaign</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Click Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{clickRate.toFixed(1)}%</p>
          <p className="text-sm text-blue-600">Above average</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Unsubscribe Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{unsubscribeRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Industry standard</p>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Email Opens Over Time</h3>
          <LineChart data={analytics.opens_over_time} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Link Clicks</h3>
          <BarChart data={analytics.link_clicks} />
        </div>
      </div>
      
      {/* Top Links */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Most Clicked Links</h3>
        <div className="space-y-3">
          {analytics.top_links.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{link.url}</p>
                <p className="text-sm text-gray-500">{link.text}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{link.clicks}</p>
                <p className="text-sm text-gray-500">clicks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Geographic Data */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.geographic_data.map((location, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{location.opens}</p>
              <p className="text-sm text-gray-600">{location.country}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Template System

### Template Gallery Component

```jsx
// TemplateGallery.jsx
function TemplateGallery({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletterTemplates().then(data => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'events', label: 'Events' },
    { id: 'updates', label: 'Updates' }
  ];

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'all') return true;
    return template.category === selectedCategory;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Template Gallery</h3>
        
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedCategory === category.id
                  ? 'bg-brand-500 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100">
              <img
                src={template.preview_image}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {template.category}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Preview template
                      window.open(template.preview_url, '_blank');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Preview
                  </button>
                  
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="text-sm bg-brand-500 text-white px-3 py-1 rounded hover:bg-brand-600"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No templates found in this category</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 API Integration

### Newsletter Hooks

```javascript
// hooks/useNewsletter.js
export const useNewsletter = () => {
  return {
    // Get all newsletters
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/newsletters?${queryParams.toString()}`);
      return response;
    },

    // Get single newsletter
    getById: async (id) => {
      return await apiRequest(`/v1/newsletters/${id}`);
    },

    // Create newsletter
    create: async (newsletterData) => {
      return await apiRequest('/v1/newsletters', {
        method: 'POST',
        body: JSON.stringify(newsletterData),
      });
    },

    // Update newsletter
    update: async (id, newsletterData) => {
      return await apiRequest(`/v1/newsletters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newsletterData),
      });
    },

    // Send newsletter
    send: async (id, options = {}) => {
      return await apiRequest(`/v1/newsletters/${id}/send`, {
        method: 'POST',
        body: JSON.stringify(options),
      });
    },

    // Send test email
    sendTest: async (id, testEmail) => {
      return await apiRequest(`/v1/newsletters/${id}/test`, {
        method: 'POST',
        body: JSON.stringify({ email: testEmail }),
      });
    },

    // Get analytics
    getAnalytics: async (id, timeRange = '7d') => {
      return await apiRequest(`/v1/newsletters/${id}/analytics?range=${timeRange}`);
    },

    // Get templates
    getTemplates: async (category = 'all') => {
      return await apiRequest(`/v1/newsletters/templates?category=${category}`);
    },

    // Duplicate newsletter
    duplicate: async (id) => {
      return await apiRequest(`/v1/newsletters/${id}/duplicate`, {
        method: 'POST',
      });
    },
  };
};

// hooks/useSubscribers.js
export const useSubscribers = () => {
  return {
    // Get all subscribers
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/subscribers?${queryParams.toString()}`);
      return response;
    },

    // Add subscriber
    add: async (subscriberData) => {
      return await apiRequest('/v1/subscribers', {
        method: 'POST',
        body: JSON.stringify(subscriberData),
      });
    },

    // Update subscriber
    update: async (id, subscriberData) => {
      return await apiRequest(`/v1/subscribers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(subscriberData),
      });
    },

    // Unsubscribe subscriber
    unsubscribe: async (id, reason) => {
      return await apiRequest(`/v1/subscribers/${id}/unsubscribe`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },

    // Import subscribers
    import: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return await apiRequest('/v1/subscribers/import', {
        method: 'POST',
        body: formData,
      });
    },

    // Export subscribers
    export: async (format = 'csv') => {
      return await apiRequest(`/v1/subscribers/export?format=${format}`);
    },
  };
};
```

## 📋 Best Practices

### Content Strategy

1. **Value-Driven Content**: Focus on providing valuable insights and information
2. **Consistent Branding**: Maintain consistent visual identity and tone
3. **Mobile Optimization**: Ensure newsletters look great on all devices
4. **Compelling Subject Lines**: Write engaging subject lines that drive opens
5. **Clear Call-to-Actions**: Include clear, actionable CTAs in each newsletter

### List Management

1. **Permission-Based Marketing**: Only send to subscribers who have opted in
2. **Easy Unsubscribe**: Make it simple to unsubscribe from newsletters
3. **Segmentation**: Segment your list for targeted, relevant content
4. **Regular Cleaning**: Remove bounced and inactive subscribers
5. **Preference Management**: Allow subscribers to choose content preferences

### Deliverability

1. **Authentication**: Set up SPF, DKIM, and DMARC records
2. **Reputation Management**: Monitor sender reputation and spam complaints
3. **Consistent Sending**: Maintain regular but not excessive sending frequency
4. **Quality Content**: Avoid spam trigger words and maintain high content quality
5. **Testing**: Test deliverability across different email providers

### Analytics & Optimization

1. **A/B Testing**: Test subject lines, content, and send times
2. **Performance Monitoring**: Track open rates, click rates, and conversions
3. **Segment Analysis**: Analyze performance by subscriber segments
4. **Continuous Improvement**: Use data to improve future campaigns
5. **Benchmarking**: Compare performance against industry standards

This Newsletter System provides comprehensive functionality for managing email communications and keeping Liberia's digital community engaged and informed.