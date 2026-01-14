/*
  # Fix Security Issues

  1. Index Optimization
    - Drop unused `commits_region_idx` index (not being used in queries)
    - Keep `commits_created_at_idx` as it's used for ordering results

  2. Improve RLS Policy Security
    - Replace overly permissive `Anyone can insert commits` policy
    - Add validation to ensure required fields are provided
    - Enforce data integrity at the database level
    - Validate region values match allowed enum
    
  3. Important Notes
    - Auth DB Connection Strategy: This must be configured in Supabase Dashboard
      under Settings > Database > Connection Pooling
    - Change from fixed number to percentage-based allocation
    - Recommended: Switch to percentage mode for better scalability
*/

-- Drop the unused region index
DROP INDEX IF EXISTS commits_region_idx;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert commits" ON commits;

-- Create a more secure policy with validation
CREATE POLICY "Public can insert valid commits"
  ON commits
  FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure required fields are present and non-empty
    project_name IS NOT NULL AND 
    length(trim(project_name)) > 0 AND
    author_info IS NOT NULL AND 
    length(trim(author_info)) > 0 AND
    -- Ensure region is valid if provided
    (region IS NULL OR region IN ('CZ_SK', 'ROW'))
  );