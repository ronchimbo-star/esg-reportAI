/*
  # Fix RLS Policy Performance

  ## Changes
  - Update ALL RLS policies to use `(select auth.uid())` instead of `auth.uid()`
  - This prevents re-evaluation for each row and significantly improves query performance
  - Affects 60+ policies across all tables

  ## Tables Affected
  - admin_users
  - banned_ips
  - generated_reports
  - user_profiles
  - page_views
  - user_events
  - article_comments
  - user_favorites
  - site_settings
  - template_ratings
  - contact_submissions
  - newsletter_subscriptions
  - template_downloads
  - template_comments
  - comment_likes
  - cms_pages
  - esg_templates
  - news_articles
  - media_library
  - sitemap_entries
  - seo_settings

  ## Security Impact
  - Eliminates RLS policy re-evaluation overhead
  - No change to access control logic, only performance optimization
*/

-- =====================================================
-- ADMIN_USERS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can read own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update their own account" ON public.admin_users;

CREATE POLICY "Authenticated users can read own admin record"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admin users can update their own account"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- BANNED_IPS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admin users can read banned IPs" ON public.banned_ips;
DROP POLICY IF EXISTS "Admin users can insert banned IPs" ON public.banned_ips;
DROP POLICY IF EXISTS "Admin users can update banned IPs" ON public.banned_ips;
DROP POLICY IF EXISTS "Admin users can delete banned IPs" ON public.banned_ips;

CREATE POLICY "Admin users can read banned IPs"
  ON public.banned_ips FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admin users can insert banned IPs"
  ON public.banned_ips FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admin users can update banned IPs"
  ON public.banned_ips FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admin users can delete banned IPs"
  ON public.banned_ips FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- GENERATED_REPORTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admin users can read all reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Admin users can update reports" ON public.generated_reports;

CREATE POLICY "Admin users can read all reports"
  ON public.generated_reports FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admin users can update reports"
  ON public.generated_reports FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- USER_PROFILES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- PAGE_VIEWS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all page views" ON public.page_views;

CREATE POLICY "Admins can view all page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- USER_EVENTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all events" ON public.user_events;

CREATE POLICY "Admins can view all events"
  ON public.user_events FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- ARTICLE_COMMENTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own comments" ON public.article_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.article_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.article_comments;
DROP POLICY IF EXISTS "Admins can approve comments" ON public.article_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.article_comments;

CREATE POLICY "Users can view own comments"
  ON public.article_comments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can insert comments"
  ON public.article_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own comments"
  ON public.article_comments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can approve comments"
  ON public.article_comments FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Users can delete own comments"
  ON public.article_comments FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- USER_FAVORITES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;

CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- SITE_SETTINGS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Authenticated admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated admins can insert site settings" ON public.site_settings;

CREATE POLICY "Authenticated admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Authenticated admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- TEMPLATE_RATINGS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can update own ratings" ON public.template_ratings;
DROP POLICY IF EXISTS "Authenticated users can insert ratings" ON public.template_ratings;
DROP POLICY IF EXISTS "Admins can view all ratings" ON public.template_ratings;

CREATE POLICY "Users can update own ratings"
  ON public.template_ratings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can insert ratings"
  ON public.template_ratings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all ratings"
  ON public.template_ratings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- CONTACT_SUBMISSIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can read all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can read all contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- NEWSLETTER_SUBSCRIPTIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can read all newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can update newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can delete newsletter subscriptions" ON public.newsletter_subscriptions;

CREATE POLICY "Admins can read all newsletter subscriptions"
  ON public.newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update newsletter subscriptions"
  ON public.newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete newsletter subscriptions"
  ON public.newsletter_subscriptions FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- TEMPLATE_DOWNLOADS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all downloads" ON public.template_downloads;

CREATE POLICY "Admins can view all downloads"
  ON public.template_downloads FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- TEMPLATE_COMMENTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Users can view own template comments" ON public.template_comments;
DROP POLICY IF EXISTS "Authenticated users can insert template comments" ON public.template_comments;
DROP POLICY IF EXISTS "Users can update own template comments" ON public.template_comments;
DROP POLICY IF EXISTS "Admins can manage all template comments" ON public.template_comments;
DROP POLICY IF EXISTS "Users can delete own template comments" ON public.template_comments;

CREATE POLICY "Users can view own template comments"
  ON public.template_comments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can insert template comments"
  ON public.template_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own template comments"
  ON public.template_comments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can manage all template comments"
  ON public.template_comments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Users can delete own template comments"
  ON public.template_comments FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- COMMENT_LIKES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can insert comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete own comment likes" ON public.comment_likes;

CREATE POLICY "Authenticated users can insert comment likes"
  ON public.comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own comment likes"
  ON public.comment_likes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- CMS_PAGES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins can insert pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins can update pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON public.cms_pages;

CREATE POLICY "Admins can view all pages"
  ON public.cms_pages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can insert pages"
  ON public.cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update pages"
  ON public.cms_pages FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete pages"
  ON public.cms_pages FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- ESG_TEMPLATES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all templates" ON public.esg_templates;
DROP POLICY IF EXISTS "Admins can insert templates" ON public.esg_templates;
DROP POLICY IF EXISTS "Admins can update templates" ON public.esg_templates;
DROP POLICY IF EXISTS "Admins can delete templates" ON public.esg_templates;

CREATE POLICY "Admins can view all templates"
  ON public.esg_templates FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can insert templates"
  ON public.esg_templates FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update templates"
  ON public.esg_templates FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete templates"
  ON public.esg_templates FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- NEWS_ARTICLES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can view all articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.news_articles;

CREATE POLICY "Admins can view all articles"
  ON public.news_articles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can insert articles"
  ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update articles"
  ON public.news_articles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete articles"
  ON public.news_articles FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- MEDIA_LIBRARY TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can insert media" ON public.media_library;
DROP POLICY IF EXISTS "Admins can update media" ON public.media_library;
DROP POLICY IF EXISTS "Admins can delete media" ON public.media_library;

CREATE POLICY "Admins can insert media"
  ON public.media_library FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can update media"
  ON public.media_library FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admins can delete media"
  ON public.media_library FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- SITEMAP_ENTRIES TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage sitemap entries" ON public.sitemap_entries;

CREATE POLICY "Admins can manage sitemap entries"
  ON public.sitemap_entries FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

-- =====================================================
-- SEO_SETTINGS TABLE
-- =====================================================
DROP POLICY IF EXISTS "Admin users can read SEO settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Admin users can update SEO settings" ON public.seo_settings;

CREATE POLICY "Admin users can read SEO settings"
  ON public.seo_settings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));

CREATE POLICY "Admin users can update SEO settings"
  ON public.seo_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = (select auth.uid())));
