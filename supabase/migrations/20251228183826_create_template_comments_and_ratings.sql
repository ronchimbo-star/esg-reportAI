-- Create Template Comments and Ratings System
--
-- 1. New Tables
--   template_comments - Comments on ESG templates
--   template_ratings - Star ratings for ESG templates
--   comment_likes - Likes on comments
--
-- 2. Security
--   Enable RLS on all tables
--   Add policies for users and admins

-- Template comments table
CREATE TABLE IF NOT EXISTS template_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES esg_templates(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text,
  user_email text,
  comment_text text NOT NULL,
  is_approved boolean DEFAULT false,
  is_edited boolean DEFAULT false,
  parent_comment_id uuid REFERENCES template_comments(id) ON DELETE CASCADE,
  edited_at timestamptz,
  edited_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE template_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved template comments"
  ON template_comments FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Users can view own template comments"
  ON template_comments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert template comments"
  ON template_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert template comments"
  ON template_comments FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can update own template comments"
  ON template_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all template comments"
  ON template_comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own template comments"
  ON template_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_template_comments_template_id ON template_comments(template_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_user_id ON template_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_parent_id ON template_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_approved ON template_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_template_comments_created_at ON template_comments(created_at DESC);

-- Template ratings table
CREATE TABLE IF NOT EXISTS template_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES esg_templates(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_ip text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, user_id),
  UNIQUE(template_id, user_ip)
);

ALTER TABLE template_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON template_ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ratings"
  ON template_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert ratings"
  ON template_ratings FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND user_ip IS NOT NULL);

CREATE POLICY "Users can update own ratings"
  ON template_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ratings"
  ON template_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_template_ratings_template_id ON template_ratings(template_id);
CREATE INDEX IF NOT EXISTS idx_template_ratings_user_id ON template_ratings(user_id);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES template_comments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_ip text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id),
  UNIQUE(comment_id, user_ip)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comment likes"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert comment likes"
  ON comment_likes FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND user_ip IS NOT NULL);

CREATE POLICY "Users can delete own comment likes"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Function to get average rating for a template
CREATE OR REPLACE FUNCTION get_template_average_rating(template_uuid uuid)
RETURNS TABLE (
  average_rating numeric,
  total_ratings bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*)::bigint as total_ratings
  FROM template_ratings
  WHERE template_id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comment count for a template
CREATE OR REPLACE FUNCTION get_template_comment_count(template_uuid uuid)
RETURNS bigint AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::bigint
    FROM template_comments
    WHERE template_id = template_uuid AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
