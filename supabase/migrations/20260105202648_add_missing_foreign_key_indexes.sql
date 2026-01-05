/*
  # Add Missing Foreign Key Indexes

  ## Changes
  - Add indexes for all unindexed foreign keys to improve query performance
  
  ## Tables Affected
  - cms_pages: created_by, updated_by
  - esg_templates: archived_by, created_by, updated_by
  - media_library: uploaded_by
  - news_articles: created_by, updated_by
  - template_comments: edited_by
  - template_downloads: user_id

  ## Security Impact
  - Prevents suboptimal query performance on foreign key lookups
*/

-- cms_pages foreign key indexes
CREATE INDEX IF NOT EXISTS idx_cms_pages_created_by ON public.cms_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_cms_pages_updated_by ON public.cms_pages(updated_by);

-- esg_templates foreign key indexes
CREATE INDEX IF NOT EXISTS idx_esg_templates_archived_by ON public.esg_templates(archived_by);
CREATE INDEX IF NOT EXISTS idx_esg_templates_created_by ON public.esg_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_esg_templates_updated_by ON public.esg_templates(updated_by);

-- media_library foreign key indexes
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON public.media_library(uploaded_by);

-- news_articles foreign key indexes
CREATE INDEX IF NOT EXISTS idx_news_articles_created_by ON public.news_articles(created_by);
CREATE INDEX IF NOT EXISTS idx_news_articles_updated_by ON public.news_articles(updated_by);

-- template_comments foreign key indexes
CREATE INDEX IF NOT EXISTS idx_template_comments_edited_by ON public.template_comments(edited_by);

-- template_downloads foreign key indexes
CREATE INDEX IF NOT EXISTS idx_template_downloads_user_id_fk ON public.template_downloads(user_id);
