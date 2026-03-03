// Gallery Seed Script
// Run this with: node scripts/seed-gallery.js

import { supabase } from '../src/supabaseClient.js';

// Sample gallery data
const galleryItems = [
  // Event Gallery Items
  {
    title: 'Africa Tech Summit 2024 - Opening Ceremony',
    description: 'The grand opening of Africa Tech Summit 2024 with keynote speakers and VIP guests.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Conference',
    tags: ['summit', 'opening', 'keynote', 'tech'],
    featured: true
  },
  {
    title: 'Africa Tech Summit 2024 - Panel Discussion',
    description: 'Expert panel discussing the future of technology in Africa.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Conference',
    tags: ['panel', 'discussion', 'experts', 'future'],
    featured: false
  },
  {
    title: 'Africa Tech Summit 2024 - Networking Session',
    description: 'Attendees networking and building connections during the summit.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c06c4?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c06c4?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Conference',
    tags: ['networking', 'connections', 'community'],
    featured: false
  },
  {
    title: 'Africa Tech Summit 2024 - Highlights Video',
    description: 'Official highlights video showcasing the best moments from Africa Tech Summit 2024.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Conference',
    tags: ['highlights', 'video', 'recap'],
    featured: true
  },
  {
    title: 'Startup Pitch Night - Winner Announcement',
    description: 'The winning team celebrating their victory at Startup Pitch Night.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Pitch Event',
    tags: ['winner', 'celebration', 'pitch', 'startup'],
    featured: true
  },
  {
    title: 'Startup Pitch Night - Team Presentation',
    description: 'One of the startup teams presenting their innovative idea to the judges.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Pitch Event',
    tags: ['presentation', 'innovation', 'judges'],
    featured: false
  },

  // Podcast Gallery Items
  {
    title: 'Tech Talk Africa - Episode 1 Thumbnail',
    description: 'Official thumbnail for Tech Talk Africa Episode 1 featuring AI discussion.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    event_type: 'podcast',
    category: 'Podcast',
    tags: ['thumbnail', 'tech-talk', 'episode-1'],
    featured: false
  },
  {
    title: 'Tech Talk Africa - Episode 1 Behind the Scenes',
    description: 'Behind the scenes footage from the recording of Tech Talk Africa Episode 1.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    event_type: 'podcast',
    category: 'Podcast',
    tags: ['behind-the-scenes', 'recording', 'bts'],
    featured: false
  },

  // Innovation Workshop Gallery Items
  {
    title: 'Innovation Workshop - Group Activity',
    description: 'Participants working together on an innovation exercise during the workshop.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Workshop',
    tags: ['workshop', 'collaboration', 'innovation'],
    featured: false
  },
  {
    title: 'Innovation Workshop - Presentation',
    description: 'Workshop facilitator presenting innovation methodologies to participants.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    event_type: 'event',
    category: 'Workshop',
    tags: ['presentation', 'facilitator', 'methodology'],
    featured: false
  },

  // Additional Gallery Items without event/podcast links
  {
    title: 'Team Building Activity',
    description: 'LDI team building activity at a local outdoor venue.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Team Building',
    tags: ['team', 'building', 'activity', 'outdoor'],
    featured: false
  },
  {
    title: 'Office Tour - New Space',
    description: 'Tour of our new office space in Monrovia.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1497366754085-fcff917b2c25?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Office',
    tags: ['office', 'tour', 'new-space', 'monrovia'],
    featured: false
  },
  {
    title: 'Community Outreach - Local School',
    description: 'LDI team conducting technology workshop at a local school.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Community',
    tags: ['outreach', 'education', 'school', 'workshop'],
    featured: true
  },
  {
    title: 'Guest Lecture - University Visit',
    description: 'Guest lecture on digital transformation at University of Liberia.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Education',
    tags: ['lecture', 'university', 'education', 'digital'],
    featured: false
  },
  {
    title: 'Product Launch - New App',
    description: 'Launch event for our new mobile application.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Product Launch',
    tags: ['launch', 'app', 'mobile', 'product'],
    featured: true
  },
  {
    title: 'Awards Ceremony 2024',
    description: 'Annual awards ceremony recognizing outstanding contributors.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511792444207-f6fba0843497?w=1200&h=800&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1511792444207-f6fba0843497?w=400&h=300&fit=crop',
    event_type: null,
    category: 'Awards',
    tags: ['awards', 'ceremony', 'recognition', '2024'],
    featured: false
  }
];

async function seedGallery() {
  try {
    console.log('Starting gallery seed...');

    // Get existing events and podcasts to link with gallery items
    const { data: events } = await supabase
      .from('events')
      .select('id, slug')
      .in('slug', ['africa-tech-summit-2024', 'startup-pitch-night', 'innovation-workshop']);

    const { data: podcasts } = await supabase
      .from('podcasts')
      .select('id, slug')
      .in('slug', ['tech-talk-africa-episode-1', 'tech-talk-africa-episode-2']);

    const eventMap = events?.reduce((acc, event) => {
      acc[event.slug] = event.id;
      return acc;
    }, {}) || {};

    const podcastMap = podcasts?.reduce((acc, podcast) => {
      acc[podcast.slug] = podcast.id;
      return acc;
    }, {}) || {};

    // Process gallery items and add event/podcast IDs
    const processedItems = galleryItems.map(item => {
      const processedItem = { ...item };

      if (item.event_type === 'event') {
        // Find matching event slug and assign ID
        if (item.title.includes('Africa Tech Summit')) {
          processedItem.event_id = eventMap['africa-tech-summit-2024'];
        } else if (item.title.includes('Startup Pitch')) {
          processedItem.event_id = eventMap['startup-pitch-night'];
        } else if (item.title.includes('Innovation Workshop')) {
          processedItem.event_id = eventMap['innovation-workshop'];
        }
      } else if (item.event_type === 'podcast') {
        // Find matching podcast slug and assign ID
        if (item.title.includes('Episode 1')) {
          processedItem.event_id = podcastMap['tech-talk-africa-episode-1'];
        } else if (item.title.includes('Episode 2')) {
          processedItem.event_id = podcastMap['tech-talk-africa-episode-2'];
        }
      }

      // Remove null event_id for items without event/podcast links
      if (!processedItem.event_id) {
        processedItem.event_type = null;
      }

      return processedItem;
    });

    // Insert gallery items
    const { data, error } = await supabase
      .from('gallery')
      .insert(processedItems)
      .select();

    if (error) {
      console.error('Error seeding gallery:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${data.length} gallery items`);
    console.log('Gallery seed completed!');

    // Display summary
    const summary = {
      total: data.length,
      images: data.filter(item => item.type === 'image').length,
      videos: data.filter(item => item.type === 'video').length,
      featured: data.filter(item => item.featured).length,
      linked_to_events: data.filter(item => item.event_type === 'event').length,
      linked_to_podcasts: data.filter(item => item.event_type === 'podcast').length,
      categories: [...new Set(data.map(item => item.category))]
    };

    console.log('\n📊 Gallery Summary:');
    console.log(`Total items: ${summary.total}`);
    console.log(`Images: ${summary.images}`);
    console.log(`Videos: ${summary.videos}`);
    console.log(`Featured: ${summary.featured}`);
    console.log(`Linked to events: ${summary.linked_to_events}`);
    console.log(`Linked to podcasts: ${summary.linked_to_podcasts}`);
    console.log(`Categories: ${summary.categories.join(', ')}`);

  } catch (error) {
    console.error('Gallery seed failed:', error);
    process.exit(1);
  }
}

// Run the seed
seedGallery();
