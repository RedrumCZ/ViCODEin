import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface UpdateRequest {
  id: string;
  project_name?: string;
  demo_url?: string;
  repo_url?: string;
  tech_stack?: string;
  mvp_time?: string;
  vibe_score?: number;
  wtf_moment?: string;
  author_info?: string;
  image_url?: string;
  region?: string | null;
  li_post_url?: string;
  admin_key: string;
}

interface DeleteRequest {
  id: string;
  admin_key: string;
}

async function logAdminAction(
  supabase: any,
  actionType: string,
  req: Request,
  projectId?: string,
  projectName?: string,
  details?: any
) {
  try {
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await supabase.from('admin_access_log').insert({
      action_type: actionType,
      project_id: projectId,
      project_name: projectName,
      ip_address: ipAddress,
      user_agent: userAgent,
      details: details || {},
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminKey = 'Vasek142018?';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname;

    // Get logs endpoint
    if (req.method === 'GET' && path.endsWith('/logs')) {
      const adminKeyParam = url.searchParams.get('admin_key');
      
      if (adminKeyParam !== adminKey) {
        await logAdminAction(supabase, 'view_logs_failure', req, undefined, undefined, {
          reason: 'Invalid admin key',
        });
        
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const limit = parseInt(url.searchParams.get('limit') || '100');
      const actionType = url.searchParams.get('action_type');

      let query = supabase
        .from('admin_access_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      const { data, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await logAdminAction(supabase, 'view_logs_success', req);

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update endpoint
    if (req.method === 'PUT' && path.endsWith('/update')) {
      const body: UpdateRequest = await req.json();

      if (body.admin_key !== adminKey) {
        await logAdminAction(supabase, 'update_failure', req, body.id, undefined, {
          reason: 'Invalid admin key',
        });
        
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const updateData: Record<string, unknown> = {};
      if (body.project_name !== undefined) updateData.project_name = body.project_name;
      if (body.demo_url !== undefined) updateData.demo_url = body.demo_url;
      if (body.repo_url !== undefined) updateData.repo_url = body.repo_url;
      if (body.tech_stack !== undefined) updateData.tech_stack = body.tech_stack;
      if (body.mvp_time !== undefined) updateData.mvp_time = body.mvp_time;
      if (body.vibe_score !== undefined) updateData.vibe_score = body.vibe_score;
      if (body.wtf_moment !== undefined) updateData.wtf_moment = body.wtf_moment;
      if (body.author_info !== undefined) updateData.author_info = body.author_info;
      if (body.image_url !== undefined) updateData.image_url = body.image_url;
      if (body.region !== undefined) updateData.region = body.region;
      if (body.li_post_url !== undefined) updateData.li_post_url = body.li_post_url;

      const { data, error } = await supabase
        .from('commits')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        await logAdminAction(supabase, 'update_failure', req, body.id, body.project_name, {
          reason: error.message,
          attempted_changes: updateData,
        });
        
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await logAdminAction(supabase, 'update_success', req, body.id, data.project_name, {
        changes: updateData,
      });

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Delete endpoint
    if (req.method === 'DELETE' && path.endsWith('/delete')) {
      const body: DeleteRequest = await req.json();

      if (body.admin_key !== adminKey) {
        await logAdminAction(supabase, 'delete_failure', req, body.id, undefined, {
          reason: 'Invalid admin key',
        });
        
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Get project name before deleting
      const { data: projectData } = await supabase
        .from('commits')
        .select('project_name')
        .eq('id', body.id)
        .single();

      const { error } = await supabase
        .from('commits')
        .delete()
        .eq('id', body.id);

      if (error) {
        await logAdminAction(supabase, 'delete_failure', req, body.id, projectData?.project_name, {
          reason: error.message,
        });
        
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await logAdminAction(supabase, 'delete_success', req, body.id, projectData?.project_name);

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});