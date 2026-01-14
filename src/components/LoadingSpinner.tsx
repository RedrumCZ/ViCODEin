import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-12 h-12 text-emerald-400" />
      </motion.div>
      <p className="mt-4 text-gray-400 font-mono">Preparing prescriptions...</p>
    </div>
  );
}
