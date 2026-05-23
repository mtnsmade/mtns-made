-- Migration: Fix and apply auto-generate project short descriptions trigger
-- Replaces 025_project_summary_trigger.sql which was never applied
--
-- Run this in: Supabase Dashboard → SQL Editor

-- Enable pg_net extension for async HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop old version if it exists (from 025)
DROP FUNCTION IF EXISTS trigger_generate_project_summary() CASCADE;

-- Trigger function: calls generate-project-summary edge function asynchronously
CREATE OR REPLACE FUNCTION trigger_generate_project_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger when:
  --   INSERT: has a description (≥20 chars) and no short_description yet
  --   UPDATE: description changed and short_description is still null
  IF (
    TG_OP = 'INSERT'
    AND NEW.description IS NOT NULL
    AND char_length(NEW.description) >= 20
    AND NEW.short_description IS NULL
  ) OR (
    TG_OP = 'UPDATE'
    AND NEW.description IS DISTINCT FROM OLD.description
    AND char_length(NEW.description) >= 20
    AND NEW.short_description IS NULL
  ) THEN
    PERFORM net.http_post(
      url     := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/generate-project-summary',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
        'record', jsonb_build_object(
          'id',                NEW.id,
          'description',       NEW.description,
          'short_description', NEW.short_description
        )
      )
    );

    RAISE LOG 'Triggered generate-project-summary for project %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger (idempotent)
DROP TRIGGER IF EXISTS trigger_project_summary_generation ON projects;

CREATE TRIGGER trigger_project_summary_generation
  AFTER INSERT OR UPDATE OF description
  ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_project_summary();

COMMENT ON FUNCTION trigger_generate_project_summary() IS
  'Calls generate-project-summary edge function asynchronously when a project description is added or changed';
