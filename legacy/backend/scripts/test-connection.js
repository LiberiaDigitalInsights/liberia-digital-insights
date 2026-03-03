// Test Supabase connection
import { supabase } from '../src/supabaseClient.js';

async function testConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('count').single();
    
    if (error) {
      console.error('❌ Connection error:', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('Categories count:', data);
    }
    
    // Test categories table
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (catError) {
      console.error('❌ Categories error:', catError.message);
    } else {
      console.log(`✅ Found ${categories.length} categories`);
      console.log('Sample:', categories.map(c => c.name));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
