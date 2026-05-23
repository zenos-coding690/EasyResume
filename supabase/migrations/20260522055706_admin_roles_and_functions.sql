-- Add role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Helper function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger function to handle new users explicitly as 'user'
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
  VALUES (new.id, 20, 0); -- 20 free tokens on signup, 0 downloads
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to get global stats for admin
CREATE OR REPLACE FUNCTION public.admin_get_stats()
RETURNS JSON AS $$
DECLARE
  total_users INT;
  total_resumes INT;
  total_cover_letters INT;
  total_revenue NUMERIC;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO total_resumes FROM public.resumes;
  SELECT COUNT(*) INTO total_cover_letters FROM public.cover_letters;
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue FROM public.payments WHERE status = 'successful';

  RETURN json_build_object(
    'total_users', total_users,
    'total_resumes', total_resumes,
    'total_cover_letters', total_cover_letters,
    'total_revenue', total_revenue
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to get all users
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(
    json_build_object(
      'id', p.id,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'email', au.email,
      'plan', p.plan,
      'role', p.role,
      'created_at', p.created_at,
      'balance', ut.balance,
      'download_credits', ut.download_credits
    )
  ) INTO result
  FROM public.profiles p
  JOIN auth.users au ON au.id = p.id
  LEFT JOIN public.user_tokens ut ON ut.id = p.id
  ORDER BY p.created_at DESC;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to get transactions (for accounting)
CREATE OR REPLACE FUNCTION public.admin_get_transactions()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(
    json_build_object(
      'id', pm.id,
      'user_id', pm.user_id,
      'amount', pm.amount,
      'currency', pm.currency,
      'status', pm.status,
      'pack_name', pm.pack_name,
      'created_at', pm.created_at,
      'first_name', p.first_name,
      'last_name', p.last_name
    )
  ) INTO result
  FROM public.payments pm
  JOIN public.profiles p ON p.id = pm.user_id
  ORDER BY pm.created_at DESC;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to update a user (manual override)
CREATE OR REPLACE FUNCTION public.admin_update_user(
  target_user_id UUID,
  new_plan TEXT,
  new_balance INTEGER,
  new_downloads INTEGER
)
RETURNS VOID AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.profiles SET plan = new_plan WHERE id = target_user_id;
  UPDATE public.user_tokens SET balance = new_balance, download_credits = new_downloads WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
