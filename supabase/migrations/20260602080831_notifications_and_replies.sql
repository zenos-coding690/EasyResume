-- Create user_notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.user_notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (e.g. mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.user_notifications;
CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications 
FOR UPDATE
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Admins can insert notifications for any user
DROP POLICY IF EXISTS "Admin can insert notifications" ON public.user_notifications;
CREATE POLICY "Admin can insert notifications" 
ON public.user_notifications 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.uid()));
