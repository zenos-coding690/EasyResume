-- Add download_credits to user_tokens table
ALTER TABLE public.user_tokens ADD COLUMN download_credits INTEGER NOT NULL DEFAULT 0;

-- Add unlocked_until to resumes table
ALTER TABLE public.resumes ADD COLUMN unlocked_until TIMESTAMPTZ;

-- Add unlocked_until to cover_letters table
ALTER TABLE public.cover_letters ADD COLUMN unlocked_until TIMESTAMPTZ;

-- Create secure RPC for unlocking a document
CREATE OR REPLACE FUNCTION public.unlock_document(p_user_id UUID, p_doc_id UUID, p_doc_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Validate caller
  IF auth.uid() != p_user_id THEN
    RETURN FALSE;
  END IF;

  -- Check credits
  SELECT download_credits INTO current_credits FROM public.user_tokens WHERE id = p_user_id;
  
  IF current_credits > 0 THEN
    -- Consume 1 credit
    UPDATE public.user_tokens 
    SET download_credits = download_credits - 1, updated_at = NOW()
    WHERE id = p_user_id;

    -- Update the document unlocked_until field (+15 minutes)
    IF p_doc_type = 'resume' THEN
      UPDATE public.resumes 
      SET unlocked_until = NOW() + INTERVAL '15 minutes', updated_at = NOW()
      WHERE id = p_doc_id AND user_id = p_user_id;
    ELSIF p_doc_type = 'cover_letter' THEN
      UPDATE public.cover_letters 
      SET unlocked_until = NOW() + INTERVAL '15 minutes', updated_at = NOW()
      WHERE id = p_doc_id AND user_id = p_user_id;
    END IF;

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure RPC to add download credits from payment webhook
CREATE OR REPLACE FUNCTION public.credit_downloads(
  p_user_id UUID, 
  p_credits INTEGER, 
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
  VALUES (p_tx_ref, p_user_id, p_amount, 0, 'complete')
  ON CONFLICT (id) DO UPDATE SET status = 'complete', updated_at = NOW();

  -- Update user download credits
  UPDATE public.user_tokens 
  SET download_credits = download_credits + p_credits, updated_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
