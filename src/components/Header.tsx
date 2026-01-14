import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Sparkles } from 'lucide-react';
import { SubmissionForm } from './SubmissionForm';

export function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <header className="relative pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <Pill className="w-10 h-10 text-emerald-400" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">Vi</span>
            <motion.span
              className="font-black inline-block text-emerald-400"
              style={{
                WebkitTextStroke: '0.5px rgba(16, 185, 129, 0.3)',
                textRendering: 'optimizeLegibility',
              }}
              initial={{
                opacity: 1,
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
              }}
              animate={{
                opacity: [1, 1, 1, 1, 0.3, 1, 1, 1, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 5px rgba(16, 185, 129, 0.4)) drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                  'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                ],
              }}
              transition={{
                duration: 4,
                times: [0, 0.2, 0.4, 0.6, 0.65, 0.7, 0.75, 0.8, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              CODE
            </motion.span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">in</span>
          </h1>
          <Pill className="w-10 h-10 text-emerald-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 font-medium mb-8 font-mono"
        >
          The strongest painkiller for manual coding.
        </motion.p>

        <motion.button
          onClick={() => setIsFormOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg rounded-full shadow-2xl shadow-emerald-500/50 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Prescribe a Build
          <Sparkles className="w-5 h-5" />
        </motion.button>

        <SubmissionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            // Optionally refresh the projects list
            window.location.reload();
          }}
        />
      </div>
    </header>
  );
}
