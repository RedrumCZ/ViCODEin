/*
  # Admin Access Monitoring
  
  Creates a comprehensive logging system for tracking admin activities and access attempts.
  
  1. New Tables
    - `admin_access_log`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `action_type` (text) - Type of action performed (login_success, login_failure, update, delete, view)
      - `project_id` (uuid, nullable) - Reference to the project being acted upon
      - `project_name` (text, nullable) - Name of the project for historical records
      - `ip_address` (text, nullable) - IP address of the admin performing the action
      - `user_agent` (text, nullable) - Browser/device information
      - `details` (jsonb, nullable) - Additional details about the action
      - `created_at` (timestamptz) - Timestamp of the action
      
  2. Security
    - Enable RLS on `admin_access_log` table
    - No public access - logs are write-only from edge functions
    - Add index on created_at for efficient querying
    - Add index on action_type for filtering
    
  3. Important Notes
    - This table is append-only (no updates or deletes)
    - Logs are retained indefinitely for security audit purposes
    - Access to logs should be restricted to super admins only
*/

-- Create admin access log table
CREATE TABLE IF NOT EXISTS admin_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  project_id uuid,
  project_name text,
  ip_address text,
  user_agent text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_access_log ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy - no public access
-- Logs can only be inserted by service role and read by authenticated admins via edge function
CREATE POLICY "No direct access to admin logs"
  ON admin_access_log
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_access_log_created_at 
  ON admin_access_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_access_log_action_type 
  ON admin_access_log(action_type);

CREATE INDEX IF NOT EXISTS idx_admin_access_log_project_id 
  ON admin_access_log(project_id) 
  WHERE project_id IS NOT NULL;