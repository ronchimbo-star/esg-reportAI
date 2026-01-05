/*
  # Fix Function Search Paths (v2)

  ## Changes
  - Set search_path to empty for all functions to prevent security issues
  - Use CREATE OR REPLACE to update functions without breaking dependencies

  ## Functions Affected
  - update_updated_at_column
  - get_top_pages
  - get_template_average_rating
  - get_template_comment_count

  ## Security Impact
  - Removes function search path vulnerabilities
  - Prevents potential SQL injection through search_path manipulation
*/

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop and recreate get_top_pages function with secure search_path
DROP FUNCTION IF EXISTS public.get_top_pages(integer);

CREATE FUNCTION public.get_top_pages(limit_count integer DEFAULT 10)
RETURNS TABLE (
  page_url text,
  view_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_url,
    COUNT(*) as view_count
  FROM public.page_views pv
  GROUP BY pv.page_url
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$;

-- Drop and recreate get_template_average_rating function with secure search_path
DROP FUNCTION IF EXISTS public.get_template_average_rating(uuid);

CREATE FUNCTION public.get_template_average_rating(template_id_param uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM public.template_ratings
  WHERE template_id = template_id_param;
  
  RETURN ROUND(avg_rating, 2);
END;
$$;

-- Drop and recreate get_template_comment_count function with secure search_path
DROP FUNCTION IF EXISTS public.get_template_comment_count(uuid);

CREATE FUNCTION public.get_template_comment_count(template_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  comment_count integer;
BEGIN
  SELECT COUNT(*)
  INTO comment_count
  FROM public.template_comments
  WHERE template_id = template_id_param
    AND approved = true;
  
  RETURN comment_count;
END;
$$;
