-- Create user_feedbacks table
CREATE TABLE IF NOT EXISTS public.user_feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own feedbacks
CREATE POLICY "Users can insert their own feedbacks" 
ON public.user_feedbacks 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy: Admin can read all feedbacks
CREATE POLICY "Admin can view all feedbacks" 
ON public.user_feedbacks 
FOR SELECT 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- Policy: Admin can update (mark as read) feedbacks
CREATE POLICY "Admin can update feedbacks" 
ON public.user_feedbacks 
FOR UPDATE 
TO authenticated 
USING (public.is_admin(auth.uid()));

-- RPC to get feedbacks for admin dashboard
CREATE OR REPLACE FUNCTION public.admin_get_feedbacks()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(f) INTO result FROM (
    SELECT
      uf.id,
      uf.user_id,
      uf.message,
      uf.is_read,
      uf.created_at,
      p.first_name,
      p.last_name,
      au.email
    FROM public.user_feedbacks uf
    JOIN public.profiles p ON p.id = uf.user_id
    JOIN auth.users au ON au.id = uf.user_id
    ORDER BY uf.created_at DESC
  ) f;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
