import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';
import { ProjectCard } from './ProjectCard';

interface ShowroomProps {
  projects: Project[];
}

export function Showroom({ projects }: ShowroomProps) {
  const czskItems = projects.filter((p) => p.region === 'CZ_SK');
  const rowItems = projects.filter((p) => p.region === 'ROW');

  const [czskIndex1, setCzskIndex1] = useState(0);
  const [czskIndex2, setCzskIndex2] = useState(1);
  const [rowIndex, setRowIndex] = useState(0);

  useEffect(() => {
    if (czskItems.length === 0 && rowItems.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (czskItems.length > 2) {
        setCzskIndex1((prev) => (prev + 2) % czskItems.length);
        setCzskIndex2((prev) => {
          const next = prev + 2;
          return next >= czskItems.length ? (next % czskItems.length) : next;
        });
      }

      if (rowItems.length > 1) {
        setRowIndex((prev) => (prev + 1) % rowItems.length);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [czskItems.length, rowItems.length]);

  const displayedCzsk1 = czskItems[czskIndex1] || null;
  const displayedCzsk2 = czskItems[czskIndex2] || null;
  const displayedRow = rowItems[rowIndex] || null;

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 font-mono">Live Showroom</h2>
        <p className="text-gray-400 text-sm font-mono">
          Featuring the latest vibe-coded projects from CZ/SK and around the world
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`czsk1-${czskIndex1}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {displayedCzsk1 ? (
              <ProjectCard project={displayedCzsk1} index={0} />
            ) : (
              <div className="h-80 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-mono text-sm">Slot 1 Available</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`czsk2-${czskIndex2}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {displayedCzsk2 ? (
              <ProjectCard project={displayedCzsk2} index={1} />
            ) : (
              <div className="h-80 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-mono text-sm">Slot 2 Available</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`row-${rowIndex}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {displayedRow ? (
              <ProjectCard project={displayedRow} index={2} />
            ) : (
              <div className="h-80 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-4xl mb-4">🌍</div>
                  <p className="text-gray-400 font-mono text-sm">
                    Awaiting ROW Vibe Coders...
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-8 text-xs font-mono text-gray-500">
        <div>
          CZ/SK: {czskItems.length} project{czskItems.length !== 1 ? 's' : ''}
        </div>
        <div>
          ROW: {rowItems.length} project{rowItems.length !== 1 ? 's' : ''}
        </div>
        {(czskItems.length > 2 || rowItems.length > 1) && (
          <div className="text-cyan-500">Auto-cycling every 60s</div>
        )}
      </div>
    </div>
  );
}
