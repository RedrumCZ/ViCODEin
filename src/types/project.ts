export interface Project {
  id: string;
  project_name: string;
  demo_url?: string;
  repo_url?: string;
  tech_stack?: string;
  mvp_time?: string;
  vibe_score?: number;
  wtf_moment?: string;
  author_info: string;
  image_url?: string;
  region: 'CZ_SK' | 'ROW';
  li_post_url?: string;
  created_at: string;
}

export type GeographicCategory = 'CZ_SK' | 'ROW' | 'All';

export interface ProjectSubmission {
  project_name: string;
  demo_url?: string;
  repo_url?: string;
  tech_stack?: string;
  mvp_time?: string;
  vibe_score?: number;
  wtf_moment?: string;
  author_info: string;
  image_url?: string;
  region: 'CZ_SK' | 'ROW';
  li_post_url?: string;
  ui_image?: File;
  publish_to_linkedin?: boolean;
  custom_hashtags?: string;
}
