// Sample newsletter templates data structure
// This would typically come from the backend API

export const newsletterTemplates = [
  {
    id: 'template-1',
    name: 'Monthly Digest',
    description: 'Comprehensive monthly newsletter with highlights and updates',
    category: 'Monthly',
    subject: '{{month}} {{year}} - Liberia Digital Insights Monthly Digest',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Liberia Digital Insights</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">{{month}} {{year}} Monthly Digest</p>
        </header>
        
        <section style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 15px;">📊 This Month's Highlights</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #667eea; margin-top: 0;">Key Achievements</h3>
            <ul style="line-height: 1.6;">
              <li>{{achievement_1}}</li>
              <li>{{achievement_2}}</li>
              <li>{{achievement_3}}</li>
            </ul>
          </div>
        </section>
        
        <section style="padding: 20px;">
          <h2 style="color: #333; margin-bottom: 15px;">📰 Latest Articles</h2>
          {{latest_articles}}
        </section>
        
        <section style="padding: 20px; background: #f0f8ff;">
          <h2 style="color: #333; margin-bottom: 15px;">🎓 Upcoming Training</h2>
          {{upcoming_training}}
        </section>
        
        <footer style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">Thank you for being part of our community!</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
            <a href="{{unsubscribe_url}}" style="color: white;">Unsubscribe</a> | 
            <a href="{{preferences_url}}" style="color: white;">Manage Preferences</a>
          </p>
        </footer>
      </div>
    `,
    variables: ['month', 'year', 'achievement_1', 'achievement_2', 'achievement_3', 'latest_articles', 'upcoming_training', 'unsubscribe_url', 'preferences_url']
  },
  {
    id: 'template-2',
    name: 'Training Announcement',
    description: 'Professional template for announcing new training programs',
    category: 'Training',
    subject: '🎓 New Training Opportunity: {{training_title}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Training Opportunity</h1>
          <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">{{training_title}}</p>
        </header>
        
        <section style="padding: 25px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #11998e; margin-top: 0;">Program Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; width: 120px;">Duration:</td>
                <td style="padding: 8px;">{{duration}}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Start Date:</td>
                <td style="padding: 8px;">{{start_date}}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Location:</td>
                <td style="padding: 8px;">{{location}}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Instructor:</td>
                <td style="padding: 8px;">{{instructor}}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">What You'll Learn</h3>
            <div style="background: white; border-left: 4px solid #11998e; padding: 15px; margin: 10px 0;">
              {{learning_objectives}}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{registration_url}}" style="background: #11998e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Register Now
            </a>
          </div>
        </section>
        
        <footer style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #666;">Questions? Contact us at {{contact_email}}</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
            <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
          </p>
        </footer>
      </div>
    `,
    variables: ['training_title', 'duration', 'start_date', 'location', 'instructor', 'learning_objectives', 'registration_url', 'contact_email', 'unsubscribe_url']
  },
  {
    id: 'template-3',
    name: 'Event Invitation',
    description: 'Elegant template for inviting subscribers to events',
    category: 'Events',
    subject: '🎉 You\'re Invited: {{event_title}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">🎉 You're Invited!</h1>
          <p style="margin: 15px 0 0 0; font-size: 24px; font-weight: bold;">{{event_title}}</p>
        </header>
        
        <section style="padding: 30px; text-align: center;">
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #856404; margin-top: 0;">📅 Event Details</h2>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Date:</strong> {{event_date}}</p>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Time:</strong> {{event_time}}</p>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Location:</strong> {{event_location}}</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #333;">About This Event</h3>
            <p style="line-height: 1.6; text-align: left;">{{event_description}}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">🎯 What to Expect</h3>
            <ul style="text-align: left; line-height: 1.6;">
              {{expectations_list}}
            </ul>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="{{rsvp_url}}" style="background: #fc466b; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 18px;">
              RSVP Now
            </a>
            <p style="margin: 15px 0 0 0; color: #666;">Seats are limited - reserve yours today!</p>
          </div>
        </section>
        
        <footer style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #666;">We can't wait to see you there!</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
            <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
          </p>
        </footer>
      </div>
    `,
    variables: ['event_title', 'event_date', 'event_time', 'event_location', 'event_description', 'expectations_list', 'rsvp_url', 'unsubscribe_url']
  },
  {
    id: 'template-4',
    name: 'Weekly Update',
    description: 'Quick weekly update template for regular communication',
    category: 'Weekly',
    subject: '📬 This Week at Liberia Digital Insights',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: #4a90e2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">📬 Weekly Update</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Week of {{week_date}}</p>
        </header>
        
        <section style="padding: 20px;">
          <h2 style="color: #4a90e2; margin-bottom: 15px;">🔥 Hot Topics This Week</h2>
          {{weekly_highlights}}
          
          <h2 style="color: #4a90e2; margin: 20px 0 15px 0;">📈 What's New</h2>
          {{whats_new}}
          
          <h2 style="color: #4a90e2; margin: 20px 0 15px 0;">🎯 Coming Up</h2>
          {{upcoming_events}}
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">💡 Quick Tip</h3>
            <p>{{weekly_tip}}</p>
          </div>
        </section>
        
        <footer style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            Have a great week!
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
            <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
          </p>
        </footer>
      </div>
    `,
    variables: ['week_date', 'weekly_highlights', 'whats_new', 'upcoming_events', 'weekly_tip', 'unsubscribe_url']
  },
  {
    id: 'template-5',
    name: 'Success Story',
    description: 'Template for sharing success stories and testimonials',
    category: 'Stories',
    subject: '🌟 Success Story: {{story_title}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🌟 Success Story</h1>
          <p style="margin: 10px 0 0 0; font-size: 20px;">{{story_title}}</p>
        </header>
        
        <section style="padding: 25px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="{{story_image}}" alt="{{story_title}}" style="max-width: 100%; border-radius: 10px;">
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #f5576c; margin-top: 0;">The Challenge</h3>
            <p>{{challenge_description}}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">The Solution</h3>
            <p>{{solution_description}}</p>
          </div>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0;">The Results</h3>
            <p>{{results_description}}</p>
          </div>
          
          <div style="background: white; border-left: 4px solid #f093fb; padding: 15px; margin: 20px 0;">
            <p style="font-style: italic; margin: 0;">"{{testimonial_quote}}"</p>
            <p style="text-align: right; margin: 10px 0 0 0; font-weight: bold;">
              — {{testimonial_name}}, {{testimonial_role}}
            </p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{call_to_action_url}}" style="background: #f5576c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 20px; font-weight: bold;">
              {{call_to_action_text}}
            </a>
          </div>
        </section>
        
        <footer style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #666;">Inspired by this story? Share it with others!</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
            <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
          </p>
        </footer>
      </div>
    `,
    variables: ['story_title', 'story_image', 'challenge_description', 'solution_description', 'results_description', 'testimonial_quote', 'testimonial_name', 'testimonial_role', 'call_to_action_url', 'call_to_action_text', 'unsubscribe_url']
  }
];

// Sample subscriber data structure
export const sampleSubscribers = [
  {
    id: 'sub-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    interests: ['technology', 'training', 'events'],
    location: 'Monrovia, Liberia'
  },
  {
    id: 'sub-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    createdAt: '2024-02-20T14:30:00Z',
    interests: ['digital-literacy', 'newsletter'],
    location: 'Buchanan, Liberia'
  },
  {
    id: 'sub-3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    status: 'inactive',
    createdAt: '2024-01-10T09:15:00Z',
    interests: ['business', 'technology'],
    location: 'Gbarnga, Liberia'
  }
];

// Sample newsletter replies data structure
export const sampleReplies = [
  {
    id: 'reply-1',
    newsletterId: 'newsletter-1',
    subscriber: {
      id: 'sub-1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    content: 'Thank you for this informative newsletter! The training opportunities are exactly what I was looking for.',
    createdAt: '2024-03-15T10:30:00Z',
    status: 'read'
  },
  {
    id: 'reply-2',
    newsletterId: 'newsletter-1',
    subscriber: {
      id: 'sub-2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com'
    },
    content: 'I would like to know more about the upcoming events. Can you provide more details about registration?',
    createdAt: '2024-03-15T11:45:00Z',
    status: 'unread'
  }
];
