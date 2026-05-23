-- Create transactions table
CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY, -- Notch Pay reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  tokens INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Secure RPC to consume tokens (runs as SECURITY DEFINER to bypass RLS)
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
  
  IF current_balance > 0 THEN
    UPDATE public.user_tokens 
    SET balance = balance - 1, total_used = total_used + 1, updated_at = NOW()
    WHERE id = p_user_id;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure RPC to credit tokens from backend
CREATE OR REPLACE FUNCTION public.credit_tokens(
  p_user_id UUID, 
  p_tokens INTEGER, 
  p_tx_ref TEXT, 
  p_amount NUMERIC
)
RETURNS BOOLEAN AS $$
DECLARE
  tx_exists BOOLEAN;
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

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
