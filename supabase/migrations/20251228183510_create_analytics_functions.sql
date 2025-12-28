-- Create helper functions for analytics dashboard

-- Function to get top pages by view count
CREATE OR REPLACE FUNCTION get_top_pages(
  time_filter timestamptz DEFAULT '2020-01-01',
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  page_url text,
  view_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_url,
    COUNT(*)::bigint as view_count
  FROM page_views pv
  WHERE pv.created_at >= time_filter
  GROUP BY pv.page_url
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
