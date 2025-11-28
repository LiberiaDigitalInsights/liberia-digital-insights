// Test database connection and seeding
import { supabase } from './src/supabaseClient.js';

async function testAndSeed() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test connection
    const { data, error } = await supabase.from('categories').select('count').single();
    if (error) {
      console.error('❌ Connection error:', error.message);
      return;
    }
    
    console.log('✅ Database connected!');
    
    // Insert categories
    console.log('🌱 Seeding categories...');
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .upsert([
        { name: "Technology", slug: "technology", description: "Latest in technology and digital innovation" },
        { name: "Business", slug: "business", description: "Business insights and market analysis" },
        { name: "Innovation", slug: "innovation", description: "Innovation trends and case studies" },
        { name: "Digital Transformation", slug: "digital-transformation", description: "Digital transformation strategies" },
        { name: "Leadership", slug: "leadership", description: "Leadership and management insights" }
      ])
      .select();

    if (catError) {
      console.error('❌ Categories error:', catError.message);
      return;
    }

    console.log(`✅ Inserted ${categories.length} categories`);
    
    // Insert articles
    console.log('🌱 Seeding articles...');
    const techCategory = categories.find(c => c.slug === 'technology');
    const categoryId = techCategory?.id || categories[0]?.id;

    const { data: articles, error: artError } = await supabase
      .from("articles")
      .upsert([
        {
          title: "The Future of AI in African Business",
          slug: "future-of-ai-in-african-business",
          excerpt: "Exploring how artificial intelligence is transforming business landscapes across Africa.",
          content: `<h2>The AI Revolution in Africa</h2><p>Artificial intelligence is reshaping African business landscapes.</p>`,
          cover_image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
          category_id: categoryId,
          author_id: 1,
          status: "published",
          tags: ["AI", "Business", "Africa"],
          published_at: new Date().toISOString()
        },
        {
          title: "Digital Transformation in Liberia",
          slug: "digital-transformation-liberia",
          excerpt: "How Liberia is embracing digital technologies to drive economic growth.",
          content: `<h2>Liberia's Digital Journey</h2><p>Liberia is undergoing significant digital transformation.</p>`,
          cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
          category_id: categoryId,
          author_id: 1,
          status: "published",
          tags: ["Digital", "Liberia", "Transformation"],
          published_at: new Date().toISOString()
        }
      ])
      .select();

    if (artError) {
      console.error('❌ Articles error:', artError.message);
      return;
    }

    console.log(`✅ Inserted ${articles.length} articles`);
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAndSeed();
