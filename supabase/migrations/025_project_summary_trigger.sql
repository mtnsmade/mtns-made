-- Migration: Auto-generate project short descriptions using AI
-- Triggers on INSERT/UPDATE to call the generate-project-summary Edge Function

-- Enable pg_net extension for HTTP calls (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the generate-project-summary Edge Function
CREATE OR REPLACE FUNCTION trigger_generate_project_summary()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  service_key TEXT;
BEGIN
  -- Only trigger if:
  -- 1. This is an INSERT with a description but no short_description
  -- 2. Or an UPDATE where description changed and short_description is still null
  IF (TG_OP = 'INSERT' AND NEW.description IS NOT NULL AND NEW.short_description IS NULL)
     OR (TG_OP = 'UPDATE' AND NEW.description IS DISTINCT FROM OLD.description AND NEW.short_description IS NULL) THEN

    -- Get Supabase URL from environment (set via Vault or config)
    supabase_url := current_setting('app.settings.supabase_url', true);
    service_key := current_setting('app.settings.service_role_key', true);

    -- If settings not configured, use hardcoded URL (for initial setup)
    IF supabase_url IS NULL OR supabase_url = '' THEN
      supabase_url := 'https://epszwomtxkpjegbjbixr.supabase.co';
    END IF;

    -- Call Edge Function asynchronously via pg_net
    -- The function will update the project with the generated short_description
    PERFORM net.http_post(
      url := supabase_url || '/functions/v1/generate-project-summary',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(service_key, current_setting('request.jwt', true))
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'id', NEW.id,
          'description', NEW.description,
          'short_description', NEW.short_description
        )
      )
    );

    RAISE LOG 'Triggered generate-project-summary for project %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on projects table
DROP TRIGGER IF EXISTS trigger_project_summary_generation ON projects;

CREATE TRIGGER trigger_project_summary_generation
  AFTER INSERT OR UPDATE OF description
  ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_project_summary();

-- Add comment
COMMENT ON FUNCTION trigger_generate_project_summary() IS 'Automatically generates short descriptions for projects using AI when description is added/updated';
