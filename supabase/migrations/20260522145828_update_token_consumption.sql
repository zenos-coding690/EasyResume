-- Update consume_ai_token to deduct 4 tokens instead of 1
CREATE OR REPLACE FUNCTION public.consume_ai_token(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Only allow the user to consume their own tokens
  IF auth.uid() != p_user_id THEN
    RETURN FALSE;
  END IF;

  SELECT balance INTO current_balance FROM public.user_tokens WHERE id = p_user_id;
  
  IF current_balance >= 4 THEN
    UPDATE public.user_tokens 
    SET balance = balance - 4, total_used = total_used + 4, updated_at = NOW()
    WHERE id = p_user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
