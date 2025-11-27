// Minimal seed script
console.log('🌱 Starting minimal database seeding...');

// Import dynamically to handle potential issues
try {
  const { supabase } = await import('./src/supabaseClient.js');
  
  // Test connection first
  console.log('1. Testing connection...');
  const { data: testData, error: testError } = await supabase
    .from('categories')
    .select('count')
    .single();
    
  if (testError) {
    console.error('❌ Connection failed:', testError.message);
    process.exit(1);
  }
  
  console.log('✅ Connection successful');
  
  // Create one category
  console.log('2. Creating sample category...');
  const { data: category, error: catError } = await supabase
    .from('categories')
    .insert({
      name: 'Technology',
      slug: 'technology',
      description: 'Latest in technology and digital innovation'
    })
    .select()
    .single();
    
  if (catError) {
    console.error('❌ Category creation failed:', catError.message);
    process.exit(1);
  }
  
  console.log('✅ Created category:', category.name);
  
  // Create one article
  console.log('3. Creating sample article...');
  const { data: article, error: artError } = await supabase
    .from('articles')
    .insert({
      title: 'Getting Started with Digital Transformation',
      slug: 'getting-started-digital-transformation',
      excerpt: 'A comprehensive guide to beginning your digital transformation journey.',
      content: '<p>Digital transformation is essential for modern businesses...</p>',
      cover_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      category_id: category.id,
      status: 'published',
      tags: ['Digital', 'Transformation', 'Business'],
      published_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (artError) {
    console.error('❌ Article creation failed:', artError.message);
    process.exit(1);
  }
  
  console.log('✅ Created article:', article.title);
  
  // Create one event
  console.log('4. Creating sample event...');
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      title: 'Digital Innovation Workshop',
      slug: 'digital-innovation-workshop',
      description: 'Hands-on workshop for digital transformation strategies.',
      cover_image_url: 'https://images.unsplash.com/photo-1540575137025-6a3a5464a1e9?w=800&h=400&fit=crop',
      date: '2024-06-15',
      location: 'Monrovia, Liberia',
      category: 'Workshop',
      max_attendees: 50,
      status: 'upcoming'
    })
    .select()
    .single();
    
  if (eventError) {
    console.error('❌ Event creation failed:', eventError.message);
    process.exit(1);
  }
  
  console.log('✅ Created event:', event.title);
  
  console.log('\n🎉 Minimal seeding completed successfully!');
  console.log('✅ Ready for frontend integration!');
  
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}
