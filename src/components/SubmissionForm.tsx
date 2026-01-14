import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Linkedin, Loader2, Pill, CheckCircle, ExternalLink, Users, MessageSquare, Copy, Twitter, Share2 } from 'lucide-react';
import { ProjectSubmission } from '../types/project';
import { supabase } from '../lib/supabase';

interface SubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type FormStep = 'entry' | 'promotion' | 'complete';

export function SubmissionForm({ isOpen, onClose, onSuccess }: SubmissionFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('entry');
  const [submittedProjectId, setSubmittedProjectId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProjectSubmission>({
    project_name: "",
    demo_url: "",
    repo_url: "",
    tech_stack: "",
    mvp_time: "",
    vibe_score: 0,
    wtf_moment: "",
    author_info: "",
    region: "CZ_SK",
    li_post_url: "",
    ui_image: undefined,
    publish_to_linkedin: false,
    custom_hashtags: "",
  });

  const [linkedinPostUrl, setLinkedinPostUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleInputChange = (field: keyof ProjectSubmission, value: string | number | boolean | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      handleInputChange("ui_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handleInputChange("ui_image", undefined);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping image upload');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
         if (filePath.includes('..')) {
        throw new Error('Invalid file path');
      }

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleStepOneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error('Database is not configured. Please contact support.');
      }

      // Validate required fields
      if (!formData.project_name || !formData.author_info) {
        throw new Error('Project name and author are required');
      }

      // Upload image if provided
      let imageUrl = null;
      if (formData.ui_image) {
        imageUrl = await uploadImage(formData.ui_image);
      }

      // Prepare data for Supabase
      const submissionData = {
        project_name: formData.project_name,
        demo_url: formData.demo_url || null,
        repo_url: formData.repo_url || null,
        tech_stack: formData.tech_stack || null,
        mvp_time: formData.mvp_time || null,
        vibe_score: formData.vibe_score || null,
        wtf_moment: formData.wtf_moment || null,
        author_info: formData.author_info,
        image_url: imageUrl,
        region: formData.region,
        li_post_url: null,
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('commits')
        .insert([submissionData])
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to submit project: ${error.message}`);
      }

      setSubmittedProjectId(data.id);
      setCurrentStep('promotion');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepTwoSubmit = async () => {
    if (!submittedProjectId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Database is not configured. Please contact support.');
      }

      // Update the record with LinkedIn post URL
      const { error } = await supabase
        .from('commits')
        .update({ li_post_url: linkedinPostUrl || null })
        .eq('id', submittedProjectId);

      if (error) {
        throw new Error(`Failed to update LinkedIn URL: ${error.message}`);
      }

      setCurrentStep('complete');

      // Auto-close after showing success for 3 seconds
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update LinkedIn URL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset all state
    setCurrentStep('entry');
    setSubmittedProjectId(null);
    setLinkedinPostUrl('');
    setFormData({
      project_name: "",
      demo_url: "",
      repo_url: "",
      tech_stack: "",
      mvp_time: "",
      vibe_score: 0,
      wtf_moment: "",
      author_info: "",
      region: "CZ_SK",
      li_post_url: "",
      ui_image: undefined,
      publish_to_linkedin: false,
      custom_hashtags: "",
    });
    setImagePreview(null);
    setError(null);
    setCopiedSummary(false);
    onClose();
  };

  const generateSocialSummary = () => {
    const summary = `🚀 Just shipped: ${formData.project_name}

${formData.wtf_moment ? `💡 ${formData.wtf_moment}\n\n` : ''}${formData.tech_stack ? `🛠️ Tech Stack: ${formData.tech_stack}\n` : ''}${formData.mvp_time ? `⚡ Built in: ${formData.mvp_time}\n` : ''}${formData.vibe_score ? `💊 Vibe Score: ${formData.vibe_score}/10\n` : ''}
${formData.demo_url ? `🌐 Demo: ${formData.demo_url}\n` : ''}
Check out more vibe-coded projects: https://vicodin-lake.vercel.app/

#ViCODEin #VibeCoding #ShipIt #BuildInPublic`;

    return summary;
  };

  const getShareUrls = () => {
    const summary = generateSocialSummary();
    const encodedSummary = encodeURIComponent(summary);

    return {
      linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedSummary}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedSummary}`,
      threads: `https://www.threads.net/intent/post?text=${encodedSummary}`,
    };
  };

  const copySocialSummary = async () => {
    try {
      await navigator.clipboard.writeText(generateSocialSummary());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderStepOne = () => (
    <form onSubmit={handleStepOneSubmit} className="p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Name 🚀 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.project_name}
          onChange={(e) => handleInputChange("project_name", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Live Demo URL 🌐
        </label>
        <input
          type="url"
          value={formData.demo_url}
          onChange={(e) => handleInputChange("demo_url", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="https://your-demo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          GitHub Repo or Shared Chat Link 💾
        </label>
        <input
          type="url"
          value={formData.repo_url}
          onChange={(e) => handleInputChange("repo_url", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="https://github.com/user/repo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Active Ingredients (Tech Stack) 🛠️
        </label>
        <input
          type="text"
          value={formData.tech_stack}
          onChange={(e) => handleInputChange("tech_stack", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="React, TypeScript, Tailwind (comma-separated)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reaction Time ⏱️
          </label>
          <input
            type="text"
            value={formData.mvp_time}
            onChange={(e) => handleInputChange("mvp_time", e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            placeholder="4 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dosage (Vibe Score 1-10) 💊
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.vibe_score || ''}
            onChange={(e) => handleInputChange("vibe_score", parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            placeholder="9"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Region 🌍
        </label>
        <select
          value={formData.region}
          onChange={(e) => handleInputChange("region", e.target.value as 'CZ_SK' | 'ROW')}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        >
          <option value="CZ_SK">Czech Republic & Slovakia</option>
          <option value="ROW">Rest of World</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Author Name / LinkedIn / X Handle 👤 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.author_info}
          onChange={(e) => handleInputChange("author_info", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          placeholder="John Doe linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Side Effects (WTF Moment & Fix) 🤯
        </label>
        <textarea
          value={formData.wtf_moment}
          onChange={(e) => handleInputChange("wtf_moment", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-2xl text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
          placeholder="Describe your biggest challenge and how you fixed it..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          UI Screenshot 📸
        </label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-2xl border border-emerald-500/30"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-500/30 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-colors bg-slate-800/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-emerald-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-gray-300 font-medium transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Prescribing...
            </>
          ) : (
            <>
              <Pill className="w-5 h-5" />
              Submit Project
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderStepTwo = () => {
    const shareUrls = getShareUrls();

    return (
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-emerald-400">Project Submitted Successfully!</h3>
          <p className="text-gray-400">Your build is now live on ViCODEin. Share it with the world!</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-400" />
            <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Share Your Build
            </h4>
          </div>

          <p className="text-gray-300">
            Spread the word about your project! Click to share on your favorite platform:
          </p>

          <div className="flex gap-3 justify-center">
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/40 hover:border-blue-400/60 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:scale-105 flex-1"
            >
              <Linkedin className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                LinkedIn
              </span>
            </a>

            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br from-sky-500/20 to-sky-600/20 hover:from-sky-500/30 hover:to-sky-600/30 border border-sky-500/40 hover:border-sky-400/60 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-sky-500/20 hover:scale-105 flex-1"
            >
              <Twitter className="w-7 h-7 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <span className="text-sm font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
                X (Twitter)
              </span>
            </a>

            <a
              href={shareUrls.threads}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30 border border-purple-500/40 hover:border-purple-400/60 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105 flex-1"
            >
              <MessageSquare className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                Threads
              </span>
            </a>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
              {generateSocialSummary()}
            </pre>
          </div>

          <button
            onClick={copySocialSummary}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-full transition-all shadow-lg shadow-emerald-600/30"
          >
            {copiedSummary ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Summary
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <h4 className="text-lg font-bold text-emerald-400">LinkedIn Group</h4>
            </div>

            <p className="text-gray-300 text-sm mb-4">
              Connect with other builders in our community
            </p>

            <a
              href="https://www.linkedin.com/groups/16746017/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-600/20 w-full justify-center"
            >
              <Linkedin className="w-4 h-4" />
              Join Group
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-bold text-purple-400">Slack Community</h4>
            </div>

            <p className="text-gray-300 text-sm mb-4">
              Real-time chat with vibe coders
            </p>

            <a
              href="https://vibecodersczsk.slack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-purple-600/20 w-full justify-center"
            >
              <MessageSquare className="w-4 h-4" />
              Join Slack
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn Post URL (optional) 🔗
          </label>
          <input
            type="url"
            value={linkedinPostUrl}
            onChange={(e) => setLinkedinPostUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-full text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            placeholder="https://linkedin.com/posts/..."
          />
          <p className="mt-2 text-xs text-gray-500">
            If you shared on LinkedIn, paste your post URL here to complete the feedback loop
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-gray-300 font-medium transition-all"
          >
            Skip for Now
          </button>
          <button
            onClick={handleStepTwoSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Finish
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderStepThree = () => (
    <div className="p-6 space-y-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-emerald-400">Vibe Confirmed! ✨</h3>
        <p className="text-gray-400">Your project is now live in the community showcase.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-500"
      >
        Closing automatically...
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 rounded-3xl border border-emerald-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-emerald-500/30 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-emerald-400">
                  {currentStep === 'entry' && 'Prescribe a Build'}
                  {currentStep === 'promotion' && 'Success & Verify'}
                  {currentStep === 'complete' && 'Vibe Confirmed'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 'entry' && renderStepOne()}
                  {currentStep === 'promotion' && renderStepTwo()}
                  {currentStep === 'complete' && renderStepThree()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
