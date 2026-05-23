-- Fix admin_get_stats
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
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue FROM public.transactions WHERE status = 'successful';

  RETURN json_build_object(
    'total_users', total_users,
    'total_resumes', total_resumes,
    'total_cover_letters', total_cover_letters,
    'total_revenue', total_revenue
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix admin_get_users
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(u) INTO result FROM (
    SELECT
      p.id,
      p.first_name,
      p.last_name,
      au.email,
      p.plan,
      p.role,
      p.created_at,
      ut.balance,
      ut.download_credits
    FROM public.profiles p
    JOIN auth.users au ON au.id = p.id
    LEFT JOIN public.user_tokens ut ON ut.id = p.id
    ORDER BY p.created_at DESC
  ) u;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix admin_get_transactions
CREATE OR REPLACE FUNCTION public.admin_get_transactions()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(t) INTO result FROM (
    SELECT
      tr.id,
      tr.user_id,
      tr.amount,
      tr.currency,
      tr.status,
      tr.pack_name,
      tr.created_at,
      p.first_name,
      p.last_name
    FROM public.transactions tr
    JOIN public.profiles p ON p.id = tr.user_id
    ORDER BY tr.created_at DESC
  ) t;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
