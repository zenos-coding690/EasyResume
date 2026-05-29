CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, plan, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'firstName', ''),
    COALESCE(new.raw_user_meta_data->>'lastName', ''),
    'Free',
    'user'
  );
  
  INSERT INTO public.user_tokens (id, balance, download_credits)
  VALUES (new.id, 60, 0); -- 60 free tokens on signup, 0 downloads
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset balance to 60 for existing users who currently have 20 tokens or fewer
UPDATE public.user_tokens
SET balance = 60
WHERE balance <= 20;
