-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    assigned_to BIGINT REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (optional, depends on user setup)
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all for now (matching user's "unrestricted" view)
-- CREATE POLICY "allow_all" ON public.leads FOR ALL USING (true);
