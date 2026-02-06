-- Create newsletter_templates table
CREATE TABLE IF NOT EXISTS public.newsletter_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'custom',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.newsletter_templates ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (admins)
CREATE POLICY "Allow read access to authenticated users"
    ON public.newsletter_templates
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert access to authenticated users
CREATE POLICY "Allow insert access to authenticated users"
    ON public.newsletter_templates
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow update access to authenticated users
CREATE POLICY "Allow update access to authenticated users"
    ON public.newsletter_templates
    FOR UPDATE
    TO authenticated
    USING (true);

-- Allow delete access to authenticated users
CREATE POLICY "Allow delete access to authenticated users"
    ON public.newsletter_templates
    FOR DELETE
    TO authenticated
    USING (true);

-- Seed default templates
INSERT INTO public.newsletter_templates (name, subject, content, category)
VALUES 
    ('Welcome Template', 'Welcome to Our Newsletter!', '<h1>Welcome to Our Newsletter!</h1><p>Thank you for subscribing. We''re excited to share our latest updates and insights with you.</p><p>Best regards,<br>The Team</p>', 'welcome'),
    ('Monthly Update', 'Monthly Newsletter - {month}', '<h1>Monthly Update - {month}</h1><p>Here''s what''s been happening this month...</p><h2>Highlights</h2><ul><li>Update 1</li><li>Update 2</li><li>Update 3</li></ul><p>Stay tuned for more updates!</p>', 'update');
