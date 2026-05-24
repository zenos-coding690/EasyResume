-- Revoke execution from public (anon and authenticated roles) for sensitive RPCs
REVOKE EXECUTE ON FUNCTION public.credit_tokens(UUID, INTEGER, TEXT, NUMERIC) FROM public;
REVOKE EXECUTE ON FUNCTION public.credit_tokens(UUID, INTEGER, TEXT, NUMERIC) FROM anon;
REVOKE EXECUTE ON FUNCTION public.credit_tokens(UUID, INTEGER, TEXT, NUMERIC) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.credit_downloads(UUID, INTEGER, TEXT, NUMERIC) FROM public;
REVOKE EXECUTE ON FUNCTION public.credit_downloads(UUID, INTEGER, TEXT, NUMERIC) FROM anon;
REVOKE EXECUTE ON FUNCTION public.credit_downloads(UUID, INTEGER, TEXT, NUMERIC) FROM authenticated;

-- Ensure service_role can still execute it
GRANT EXECUTE ON FUNCTION public.credit_tokens(UUID, INTEGER, TEXT, NUMERIC) TO service_role;
GRANT EXECUTE ON FUNCTION public.credit_downloads(UUID, INTEGER, TEXT, NUMERIC) TO service_role;
