/*
  # Add Admin Policies for Update and Delete Operations

  1. Security Approach
    - Public users can only SELECT and INSERT (existing policies)
    - UPDATE and DELETE operations are restricted to service_role only
    - This prevents direct client-side modifications
    - Admin operations must go through authenticated edge functions
    
  2. New Policies
    - Restrictive UPDATE policy (blocks all public updates)
    - Restrictive DELETE policy (blocks all public deletes)
    
  3. Cost Optimization
    - No authentication system needed (reduces complexity and cost)
    - Simple admin key validation through edge functions
    - Minimal database overhead
    
  4. Security Benefits
    - No direct database manipulation from client
    - All admin operations logged and controlled
    - Service role key required for modifications
    - Prevents malicious updates/deletes
*/

-- Create restrictive UPDATE policy (effectively blocks all public updates)
CREATE POLICY "Only service role can update commits"
  ON commits
  FOR UPDATE
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- Create restrictive DELETE policy (effectively blocks all public deletes)
CREATE POLICY "Only service role can delete commits"
  ON commits
  FOR DELETE
  TO authenticated, anon
  USING (false);