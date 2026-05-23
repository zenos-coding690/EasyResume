-- Secure RPC to credit tokens from backend AND update user plan
CREATE OR REPLACE FUNCTION public.credit_tokens(
  p_user_id UUID, 
  p_tokens INTEGER, 
  p_tx_ref TEXT, 
  p_amount NUMERIC
)
RETURNS BOOLEAN AS $$
DECLARE
  tx_exists BOOLEAN;
  new_plan TEXT;
BEGIN
  -- Verification que la transaction n'a pas deja ete traitee
  SELECT EXISTS(SELECT 1 FROM public.transactions WHERE id = p_tx_ref AND status = 'complete') INTO tx_exists;
  
  IF tx_exists THEN
    RETURN FALSE;
  END IF;

  -- Insert or update transaction
  INSERT INTO public.transactions (id, user_id, amount, tokens, status)
  VALUES (p_tx_ref, p_user_id, p_amount, p_tokens, 'complete')
  ON CONFLICT (id) DO UPDATE SET status = 'complete', updated_at = NOW();

  -- Update user tokens
  UPDATE public.user_tokens 
  SET balance = balance + p_tokens, updated_at = NOW()
  WHERE id = p_user_id;

  -- Determine the plan based on tokens
  IF p_tokens = 50 THEN new_plan := 'Pack Bronze';
  ELSIF p_tokens = 120 THEN new_plan := 'Pack Silver';
  ELSIF p_tokens = 300 THEN new_plan := 'Pack Gold';
  ELSE new_plan := 'Premium';
  END IF;

  -- Update user profile plan
  UPDATE public.profiles SET plan = new_plan WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Secure RPC to add download credits from payment webhook AND update user plan
CREATE OR REPLACE FUNCTION public.credit_downloads(
  p_user_id UUID, 
  p_credits INTEGER, 
  p_tx_ref TEXT, 
  p_amount NUMERIC
)
RETURNS BOOLEAN AS $$
DECLARE
  tx_exists BOOLEAN;
  new_plan TEXT;
BEGIN
  -- Verification que la transaction n'a pas deja ete traitee
  SELECT EXISTS(SELECT 1 FROM public.transactions WHERE id = p_tx_ref AND status = 'complete') INTO tx_exists;
  
  IF tx_exists THEN
    RETURN FALSE;
  END IF;

  -- Insert or update transaction
  INSERT INTO public.transactions (id, user_id, amount, tokens, status)
  VALUES (p_tx_ref, p_user_id, p_amount, 0, 'complete')
  ON CONFLICT (id) DO UPDATE SET status = 'complete', updated_at = NOW();

  -- Update user download credits
  UPDATE public.user_tokens 
  SET download_credits = download_credits + p_credits, updated_at = NOW()
  WHERE id = p_user_id;

  -- Determine the plan based on credits
  IF p_credits = 1 THEN new_plan := 'Pack Basique';
  ELSIF p_credits = 3 THEN new_plan := 'Pack Standard';
  ELSIF p_credits = 10 THEN new_plan := 'Pack Premium';
  ELSE new_plan := 'Premium';
  END IF;

  -- Update user profile plan
  UPDATE public.profiles SET plan = new_plan WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
