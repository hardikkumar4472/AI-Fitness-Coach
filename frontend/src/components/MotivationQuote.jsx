import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MotivationQuote = ({ quote }) => {
  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10 flex items-start gap-4">
          <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">
              Daily Motivation
            </h3>
            <p className="text-xl font-medium leading-relaxed">
              {quote}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MotivationQuote;