// Simple seed script for Liberia Digital Insights database
import { supabase } from './src/supabaseClient.js';

// Sample data (simplified without password hashing)
const categories = [
  { name: 'Technology', slug: 'technology', description: 'Latest in technology and digital innovation' },
  { name: 'Business', slug: 'business', description: 'Business insights and market analysis' },
  { name: 'Innovation', slug: 'innovation', description: 'Innovation trends and case studies' },
  { name: 'Digital Transformation', slug: 'digital-transformation', description: 'Digital transformation strategies' },
  { name: 'Leadership', slug: 'leadership', description: 'Leadership and management insights' }
];

const articles = [
  {
    title: 'The Future of AI in African Business',
    slug: 'future-of-ai-in-african-business',
    excerpt: 'Exploring how artificial intelligence is transforming business landscapes across Africa.',
    content: `<h2>The AI Revolution in Africa</h2>
    <p>Artificial intelligence is no longer a futuristic concept; it's a present-day reality that's reshaping how African businesses operate. From fintech to healthcare, AI is driving innovation and efficiency across multiple sectors.</p>
    
    <h3>Key Applications</h3>
    <ul>
      <li><strong>Fintech:</strong> AI-powered fraud detection and credit scoring</li>
      <li><strong>Agriculture:</strong> Predictive analytics for crop management</li>
      <li><strong>Healthcare:</strong> Diagnostic tools and treatment recommendations</li>
      <li><strong>Education:</strong> Personalized learning platforms</li>
    </ul>
    
    <h3>Challenges and Opportunities</h3>
    <p>While the potential is enormous, African businesses face unique challenges in AI adoption, including limited infrastructure, data scarcity, and skills gaps. However, these challenges also present opportunities for innovative solutions tailored to local contexts.</p>
    
    <h3>The Road Ahead</h3>
    <p>As AI technology becomes more accessible, we can expect to see increased adoption across African markets. Companies that invest in AI capabilities now will be well-positioned to lead in their respective industries.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    category_id: null,
    author_id: null,
    status: 'published',
    tags: ['AI', 'Technology', 'Business', 'Africa'],
    published_at: new Date().toISOString()
  },
  {
    title: 'Digital Banking Revolution in Liberia',
    slug: 'digital-banking-revolution-liberia',
    excerpt: 'How mobile banking and digital payments are transforming financial services in Liberia.',
    content: `<h2>The Digital Banking Transformation</h2>
    <p>Liberia is experiencing a remarkable transformation in its banking sector, driven by mobile technology and innovative fintech solutions. This digital revolution is making financial services more accessible to previously underserved populations.</p>
    
    <h3>Key Developments</h3>
    <ul>
      <li>Mobile money adoption rates are soaring</li>
      <li>Digital payment systems are becoming mainstream</li>
      <li>Traditional banks are embracing digital transformation</li>
      <li>Regulatory frameworks are evolving to support innovation</li>
    </ul>
    
    <h3>Impact on Financial Inclusion</h3>
    <p>The digital banking revolution is significantly improving financial inclusion in Liberia. More people now have access to basic financial services, enabling them to save, invest, and participate in the formal economy.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1563986768494-8dee0e561f93?w=800&h=400&fit=crop',
    category_id: null,
    author_id: null,
    status: 'published',
    tags: ['Banking', 'Fintech', 'Liberia', 'Digital'],
    published_at: new Date().toISOString()
  }
];

const insights = [
  {
    title: '5G Deployment: Opportunities for African Markets',
    slug: '5g-deployment-opportunities-african-markets',
    excerpt: 'Analyzing the potential impact of 5G technology on African economies and businesses.',
    content: `<h2>The 5G Opportunity</h2>
    <p>The rollout of 5G technology presents unprecedented opportunities for African markets. This next-generation network infrastructure promises to revolutionize industries and create new possibilities for economic growth.</p>
    
    <h3>Key Benefits</h3>
    <ul>
      <li>Ultra-fast connectivity for businesses and consumers</li>
      <li>Support for IoT and smart city initiatives</li>
      <li>Enhanced mobile broadband experiences</li>
      <li>Low latency for real-time applications</li>
    </ul>
    
    <h3>Strategic Considerations</h3>
    <p>Successful 5G deployment requires careful planning and investment. African countries need to develop comprehensive strategies that address infrastructure gaps, regulatory frameworks, and skills development.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    category_id: null,
    author_id: null,
    status: 'published',
    tags: ['5G', 'Technology', 'Telecom', 'Africa'],
    published_at: new Date().toISOString()
  }
];

const podcasts = [
  {
    title: 'Tech Talk Africa: Episode 1',
    slug: 'tech-talk-africa-episode-1',
    description: 'Exploring the latest technology trends and innovations across the African continent.',
    audio_url: 'https://example.com/audio/tech-talk-africa-ep1.mp3',
    transcript: `Welcome to Tech Talk Africa, your weekly dose of technology insights from across the continent. In today's episode, we're discussing the rise of fintech innovations in West Africa...`,
    youtube_url: 'https://youtube.com/watch?v=example1',
    spotify_url: 'https://spotify.com/episode/example1',
    apple_podcasts_url: 'https://podcasts.apple.com/example1',
    cover_image_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop',
    duration: '45:30',
    episode_number: 1,
    season_number: 1,
    status: 'published',
    published_at: new Date().toISOString()
  }
];

const events = [
  {
    title: 'Africa Tech Summit 2024',
    slug: 'africa-tech-summit-2024',
    description: 'Annual gathering of tech leaders, innovators, and investors from across Africa and beyond.',
    cover_image_url: 'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=800&h=400&fit=crop',
    date: '2024-06-15',
    location: 'Monrovia, Liberia',
    category: 'Conference',
    max_attendees: 500,
    status: 'upcoming'
  },
  {
    title: 'Digital Marketing Workshop',
    slug: 'digital-marketing-workshop',
    description: 'Hands-on workshop for businesses looking to enhance their digital marketing strategies.',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    date: '2024-05-20',
    location: 'Virtual',
    category: 'Workshop',
    max_attendees: 100,
    status: 'upcoming'
  }
];

const training = [
  {
    title: 'Digital Marketing Fundamentals',
    slug: 'digital-marketing-fundamentals',
    description: 'Comprehensive course covering the essentials of digital marketing for modern businesses.',
    cover_image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
    type: 'course',
    duration: '6 weeks',
    instructor: 'Dr. Michael Chen',
    max_students: 30,
    start_date: '2024-05-01',
    end_date: '2024-06-12',
    status: 'upcoming'
  }
];

const newsletters = [
  {
    subject: 'Weekly Tech Digest: AI Innovations in Africa',
    preview: 'This week we explore how AI is transforming healthcare, agriculture, and finance across the African continent.',
    content: `<h2>AI Innovations Across Africa</h2>
    <p>Welcome to this week's Tech Digest! We're excited to share some groundbreaking developments in artificial intelligence across the African continent.</p>
    
    <h3>Healthcare Revolution</h3>
    <p>Hospitals in Kenya are using AI-powered diagnostic tools that can detect diseases faster and more accurately than traditional methods.</p>
    
    <h3>Smart Agriculture</h3>
    <p>Nigerian startups are developing AI solutions that help farmers predict crop yields and optimize irrigation.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
    scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft'
  }
];

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create categories
    console.log('1. Creating categories...');
    const { data: createdCategories, error: catError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (catError) throw catError;
    console.log(`✅ Created ${createdCategories.length} categories`);

    // 2. Use existing admin user or create simple one
    console.log('\n2. Setting up admin user...');
    const adminEmail = 'admin@liberiadigitalinsights.com';
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    let adminId;
    if (!existingAdmin) {
      // Create admin with simple hash (you should update this password)
      const { data: newAdmin, error: adminError } = await supabase
        .from('users')
        .insert({
          email: adminEmail,
          password_hash: '$2a$10$placeholder.hash.update.with.real.hash', // Placeholder - update this
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        })
        .select('id')
        .single();

      if (adminError) throw adminError;
      adminId = newAdmin.id;
      console.log('✅ Created admin user (update password hash manually)');
    } else {
      adminId = existingAdmin.id;
      console.log('✅ Using existing admin user');
    }

    // 3. Create articles
    console.log('\n3. Creating articles...');
    const techCategory = createdCategories.find(c => c.slug === 'technology');
    const businessCategory = createdCategories.find(c => c.slug === 'business');
    
    const articlesWithIds = articles.map(article => ({
      ...article,
      category_id: article.title.includes('Banking') ? businessCategory?.id : techCategory?.id,
      author_id: adminId
    }));

    const { data: createdArticles, error: articlesError } = await supabase
      .from('articles')
      .insert(articlesWithIds)
      .select();

    if (articlesError) throw articlesError;
    console.log(`✅ Created ${createdArticles.length} articles`);

    // 4. Create insights
    console.log('\n4. Creating insights...');
    const insightsWithIds = insights.map(insight => ({
      ...insight,
      category_id: techCategory?.id,
      author_id: adminId
    }));

    const { data: createdInsights, error: insightsError } = await supabase
      .from('insights')
      .insert(insightsWithIds)
      .select();

    if (insightsError) throw insightsError;
    console.log(`✅ Created ${createdInsights.length} insights`);

    // 5. Create podcasts
    console.log('\n5. Creating podcasts...');
    const { data: createdPodcasts, error: podcastsError } = await supabase
      .from('podcasts')
      .insert(podcasts)
      .select();

    if (podcastsError) throw podcastsError;
    console.log(`✅ Created ${createdPodcasts.length} podcasts`);

    // 6. Create events
    console.log('\n6. Creating events...');
    const { data: createdEvents, error: eventsError } = await supabase
      .from('events')
      .insert(events)
      .select();

    if (eventsError) throw eventsError;
    console.log(`✅ Created ${createdEvents.length} events`);

    // 7. Create training
    console.log('\n7. Creating training courses...');
    const { data: createdTraining, error: trainingError } = await supabase
      .from('training')
      .insert(training)
      .select();

    if (trainingError) throw trainingError;
    console.log(`✅ Created ${createdTraining.length} training courses`);

    // 8. Create newsletters
    console.log('\n8. Creating newsletters...');
    const { data: createdNewsletters, error: newslettersError } = await supabase
      .from('newsletters')
      .insert(newsletters)
      .select();

    if (newslettersError) throw newslettersError;
    console.log(`✅ Created ${createdNewsletters.length} newsletters`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Articles: ${createdArticles.length}`);
    console.log(`- Insights: ${createdInsights.length}`);
    console.log(`- Podcasts: ${createdPodcasts.length}`);
    console.log(`- Events: ${createdEvents.length}`);
    console.log(`- Training: ${createdTraining.length}`);
    console.log(`- Newsletters: ${createdNewsletters.length}`);
    console.log(`- Admin User: ${adminEmail}`);
    console.log('\n⚠️  Remember to update the admin password hash manually!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
