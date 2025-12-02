# Event Management

## 📅 Overview

The Event Management system provides comprehensive functionality for creating, managing, and promoting technology events, workshops, conferences, and networking opportunities in Liberia's digital ecosystem.

## ✨ Key Features

- **Event Creation**: Create and publish events with detailed information
- **Registration System**: Manage attendee registration and capacity
- **Event Promotion**: Promote events through newsletters and social media
- **Calendar Integration**: Export events to calendar formats
- **Attendee Management**: Track attendance and send reminders
- **Event Analytics**: Monitor event performance and engagement

## 🏗️ Architecture

### Frontend Components

```
src/components/events/
├── EventCard.jsx          # Event preview component
├── EventDetail.jsx        # Full event view
├── EventForm.jsx          # Event creation/editing form
├── EventRegistration.jsx  # Registration form
├── EventCalendar.jsx      # Calendar view
└── EventAnalytics.jsx     # Event analytics dashboard
```

### Backend API

```
backend/src/routes/events.js  # Event CRUD operations
```

## 📝 Event Structure

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

## 🎯 Event Types

### Conferences
- Large-scale technology conferences
- Multiple tracks and sessions
- Keynote speakers and panels
- Networking opportunities

### Workshops
- Hands-on training sessions
- Limited capacity for personalized attention
- Focus on specific skills or technologies
- Certificate of completion

### Meetups
- Informal networking events
- Community gatherings
- Knowledge sharing sessions
- Free or low-cost events

### Webinars
- Online events and presentations
- Remote participation
- Recording availability
- Interactive Q&A sessions

## 🔧 Event Management Features

### Event Creation

```jsx
// EventForm.jsx
function EventForm({ event, onSave, onCancel }) {
  const [formData, setFormData] = useState(event || {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    venue: '',
    max_attendees: 100,
    price: 0,
    currency: 'USD'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Save Event
        </button>
      </div>
    </form>
  );
}
```

### Registration System

```jsx
// EventRegistration.jsx
function EventRegistration({ event, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    special_requirements: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onRegister(event.id, formData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (event.current_attendees >= event.max_attendees) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800">Event Full</h3>
        <p className="text-red-600">This event has reached maximum capacity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Register for {event.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600"
        >
          Register Now
        </button>
      </form>
    </div>
  );
}
```

## 📊 Event Analytics

### Key Metrics

- **Registration Rate**: Percentage of registered attendees vs capacity
- **Attendance Rate**: Percentage of registered attendees who actually attended
- **Engagement**: Social media mentions, website visits, newsletter opens
- **Satisfaction**: Post-event survey results and feedback
- **Revenue**: Ticket sales and sponsorship income

## 📧 Event Communication

### Email Notifications

- **Registration Confirmation**: Immediate confirmation upon registration
- **Event Reminders**: Automated reminders 1 week and 1 day before event
- **Event Updates**: Important updates and changes to event details
- **Post-Event Follow-up**: Thank you message and feedback requests

## 🔗 Calendar Integration

### Export Formats

- **iCal (.ics)**: Standard calendar format for all calendar applications
- **Google Calendar**: Direct integration with Google Calendar
- **Outlook Calendar**: Direct integration with Outlook

## 🎨 Event Display

### Event Card Component

```jsx
function EventCard({ event }) {
  const isUpcoming = new Date(event.start_date) > new Date();
  const isOngoing = new Date(event.start_date) <= new Date() && 
                   new Date(event.end_date) >= new Date();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            isOngoing ? 'bg-green-100 text-green-800' :
            isUpcoming ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {isOngoing ? 'Live Now' : isUpcoming ? 'Upcoming' : 'Completed'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/event/${event.slug}`} className="hover:text-brand-500">
            {event.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {formatDate(event.start_date)}
          </div>
          
          <div className="flex items-center">
            <LocationIcon className="w-4 h-4 mr-2" />
            {event.venue}, {event.location}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🔧 API Integration

### Event Hooks

```javascript
// hooks/useEvents.js
export const useEvents = () => {
  return {
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/events?${queryParams.toString()}`);
      return response;
    },
    getById: async (id) => {
      return await apiRequest(`/v1/events/${id}`);
    },
    create: async (eventData) => {
      return await apiRequest('/v1/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },
    update: async (id, eventData) => {
      return await apiRequest(`/v1/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
    },
    delete: async (id) => {
      await apiRequest(`/v1/events/${id}`, {
        method: 'DELETE',
      });
    },
    register: async (eventId, registrationData) => {
      return await apiRequest(`/v1/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    },
  };
};
```

## 📅 Best Practices

### Event Planning

1. **Plan Ahead**: Start planning events 2-3 months in advance
2. **Clear Objectives**: Define clear goals and target audience
3. **Budget Planning**: Include venue, catering, speakers, and marketing costs
4. **Venue Selection**: Choose accessible venues with proper facilities
5. **Speaker Management**: Confirm speakers and prepare briefing materials

This Event Management system provides comprehensive functionality for organizing and managing technology events in Liberia's digital ecosystem.