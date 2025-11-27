import { supabase } from "../supabaseClient.js";

// Increment view count for articles/insights
export async function incrementViewCount(tableName, recordId) {
  try {
    await supabase.rpc('increment_view_count', {
      table_name: tableName,
      record_id: recordId
    });
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

// Generate unique slug
export async function generateSlug(tableName, title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // No existing record found, slug is unique
      return slug;
    }

    if (error) {
      throw error;
    }

    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
