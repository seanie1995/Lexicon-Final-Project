-- Admin Role Claims Trigger
-- This function automatically sets the 'role' claim in raw_app_meta_data
-- based on the admin_users table whenever a user is created or updated.

CREATE OR REPLACE FUNCTION public.handle_admin_claims()
RETURNS TRIGGER AS $$
DECLARE
  admin_record RECORD;
  existing_metadata JSONB;
BEGIN
  -- Look up the user in admin_users table
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE user_id = NEW.id;

  -- Get existing metadata or initialize as empty object
  existing_metadata := COALESCE(NEW.raw_app_meta_data, '{}'::jsonb);

  IF FOUND AND admin_record.is_admin = true THEN
    -- Set admin role claim, preserving other metadata
    NEW.raw_app_meta_data := jsonb_set(
      existing_metadata,
      '{role}',
      '"admin"'
    );
  ELSE
    -- Remove admin role if not an admin, preserving other metadata
    NEW.raw_app_meta_data := existing_metadata - 'role';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_admin_claims ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_admin_claims
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_claims();
