/*
  # Create commits table for ViCODEin project submissions

  1. New Tables
    - `commits`
      - `id` (uuid, primary key)
      - `project_name` (text, required)
      - `demo_url` (text, optional)
      - `repo_url` (text, optional)
      - `tech_stack` (text, optional)
      - `mvp_time` (text, optional)
      - `vibe_score` (integer, optional)
      - `wtf_moment` (text, optional)
      - `author_info` (text, required)
      - `image_url` (text, optional)
      - `region` (text, default 'CZ_SK', check constraint for 'CZ_SK' or 'ROW')
      - `li_post_url` (text, optional)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `commits` table
    - Add policy for public read access
    - Add policy for authenticated users to insert
*/

CREATE TABLE IF NOT EXISTS commits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  demo_url text,
  repo_url text,
  tech_stack text,
  mvp_time text,
  vibe_score integer,
  wtf_moment text,
  author_info text NOT NULL,
  image_url text,
  region text DEFAULT 'CZ_SK' CHECK (region IN ('CZ_SK', 'ROW')),
  li_post_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all commits
CREATE POLICY "Anyone can read commits"
  ON commits
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert commits (for public submissions)
CREATE POLICY "Anyone can insert commits"
  ON commits
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS commits_created_at_idx ON commits (created_at DESC);
CREATE INDEX IF NOT EXISTS commits_region_idx ON commits (region);