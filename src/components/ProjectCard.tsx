import { useState } from 'react';
import { ExternalLink, Github, Clock, ChevronDown, ChevronUp, User, AlertTriangle, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [showSideEffects, setShowSideEffects] = useState(false);

  // Map tech stack to Active Ingredients
  const activeIngredients = project.tech_stack
    ? project.tech_stack.split(',').map(tech => tech.trim()).filter(Boolean)
    : ['Placebo'];

  // Map vibe score to Dosage with fallback
  const dosage = project.vibe_score != null && project.vibe_score > 0
    ? `${project.vibe_score}/10 Pure Vibe`
    : 'Unknown Dosage';

  // Map time to MVP to Reaction Time
  const reactionTime = project.mvp_time || 'Unknown Reaction Time';

  // Map WTF moment to Side Effects
  const sideEffects = project.wtf_moment || 'No side effects reported.';

  const getLinkedInInfo = () => {
    if (project.li_post_url) {
      return { url: project.li_post_url, displayText: project.author_info };
    }

    const linkedInPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
    const match = project.author_info.match(linkedInPattern);

    if (match) {
      const url = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
      return { url, displayText: project.author_info };
    }

    return null;
  };

  const linkedInInfo = getLinkedInInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-lg rounded-3xl border border-emerald-500/20 overflow-hidden hover:border-emerald-400/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-all duration-500" />

      {project.image_url && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.project_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-100 flex-1 leading-tight">
            {project.project_name}
          </h3>
          <motion.div
            animate={{
              scale: [1, 1.08, 1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
            className="flex-shrink-0 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-xs font-bold text-white shadow-lg shadow-emerald-500/30"
          >
            {dosage}
          </motion.div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono">Reaction Time: {reactionTime}</span>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Active Ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {activeIngredients.map((ingredient, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-800/80 border border-emerald-500/30 rounded-full text-xs text-gray-300 font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {linkedInInfo ? (
          <a
            href={linkedInInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors group/li"
          >
            <Linkedin className="w-4 h-4 group-hover/li:text-blue-500" />
            <span className="group-hover/li:underline">{linkedInInfo.displayText}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>{project.author_info}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-full text-emerald-400 font-medium transition-all hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            Demo
          </a>
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 rounded-full text-gray-300 font-medium transition-all hover:scale-105"
          >
            <Github className="w-4 h-4" />
            Code
          </a>
        </div>

        <button
          onClick={() => setShowSideEffects(!showSideEffects)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/40 rounded-full text-red-400 font-medium transition-all"
        >
          {showSideEffects ? (
            <>
              Hide Side Effects <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              View Side Effects <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        <AnimatePresence>
          {showSideEffects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-red-950/50 border-2 border-red-500/40 rounded-2xl">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide">Warning Label</h4>
                </div>
                <div className="border-l-2 border-red-500/50 pl-3 ml-2">
                  <p className="text-xs text-red-300/90 leading-relaxed font-medium">
                    {sideEffects}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-red-500/30">
                  <p className="text-xs text-red-400/70 italic">
                    Consult your codebase before use. May cause unexpected behavior.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
