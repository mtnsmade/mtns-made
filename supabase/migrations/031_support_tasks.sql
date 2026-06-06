-- Support Tasks table for MTNS MADE admin dashboard
-- Tracks member support, website bugs, and feature requests

CREATE TABLE public.support_tasks (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category            text NOT NULL CHECK (category IN ('member_support', 'website_bug', 'feature_request')),
  title               text NOT NULL,
  description         text,
  status              text NOT NULL DEFAULT 'not_started'
                        CHECK (status IN ('not_started', 'in_progress', 'feedback_needed', 'complete', 'stalled')),
  member_id           uuid REFERENCES public.members(id) ON DELETE SET NULL,
  member_name         text,
  member_profile_url  text,
  hours               numeric(5,2),
  notes               text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TABLE public.support_task_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES public.support_tasks(id) ON DELETE CASCADE,
  author      text NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- RLS: open for anon (dashboard is behind Webflow password protection)
ALTER TABLE public.support_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage support tasks" ON public.support_tasks
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin can manage support comments" ON public.support_task_comments
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Auto-update updated_at on support_tasks
CREATE OR REPLACE FUNCTION public.touch_support_task()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER support_task_updated
  BEFORE UPDATE ON public.support_tasks
  FOR EACH ROW EXECUTE FUNCTION public.touch_support_task();
