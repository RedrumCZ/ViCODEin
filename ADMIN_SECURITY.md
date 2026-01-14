# Admin Panel & Security Documentation

## Security Implementation

Your database is now secured with a multi-layered approach optimized for low cost and high security:

### Database-Level Security (Row Level Security - RLS)

1. **Read Access**: Public users can view all projects
2. **Insert Access**: Public users can submit new projects with validation
3. **Update/Delete Access**: Completely blocked at the database level for public users

The database policies prevent ANY direct updates or deletes from the client, even if someone tries to manipulate the API calls.

### Edge Function Protection

All admin operations (update/delete) go through a secure edge function that:
- Validates an admin key before processing
- Uses the Supabase service role key to bypass RLS
- Logs all operations
- Returns proper error messages for unauthorized attempts

### Admin Key Setup

**Step 1: Set your local admin key in `.env`:**
```
VITE_ADMIN_KEY=your_secure_admin_key_here
```

**Step 2: Set the same key in Supabase Edge Function secrets:**

You need to configure the `ADMIN_KEY` secret in Supabase for the edge function:

1. Go to your Supabase Dashboard
2. Navigate to Edge Functions → Secrets
3. Add a new secret named `ADMIN_KEY`
4. Use the SAME value as your `VITE_ADMIN_KEY`

**Important Security Guidelines**:
- Replace `your_secure_admin_key_here` with a strong, unique password
- Use a mix of uppercase, lowercase, numbers, and symbols
- Make it at least 20 characters long
- Example: `MyS3cur3!AdM1n#K3y$2026@ViCODE`
- Keep this key secret! Never share it publicly or commit it to public repositories
- The same key must be set in BOTH places (local .env and Supabase secrets)

## Using the Admin Panel

1. **Access**: Click the lock icon in the bottom-right corner of the page
2. **Login**: Enter your admin key (see above)
3. **Edit**: Click the pencil icon on any project
4. **Delete**: Click the trash icon on any project (requires confirmation)

## Cost Optimization Features

- No authentication system needed (saves on auth infrastructure)
- Simple key-based validation
- Minimal database queries
- No additional third-party services
- Edge functions only run when admin operations are performed

## Security Best Practices

1. Change the default admin key in production
2. Use a strong, unique key (mix of letters, numbers, symbols)
3. Never expose the admin key in client-side code (it's only validated server-side)
4. Consider rotating the key periodically
5. Monitor edge function logs for unauthorized access attempts

## Footer Contact

The page footer includes a "Wanna do projects get in touch" link that opens an email to:
- Email: ondrejpetyniak@gmail.com
- Subject: ViCODEin
