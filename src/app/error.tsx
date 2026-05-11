'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <BurgerMenu />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-lg rounded-3xl p-8 max-w-md text-center"
      >
        <h1 className="text-4xl font-bold text-red-400 mb-4">⚠️ Fehler</h1>
        <p className="text-white/60 mb-6">
          Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <code className="text-xs text-red-200">{error.message}</code>
          </div>
        )}
        <button
          onClick={reset}
          className="btn-glass inline-block"
        >
          Erneut versuchen
        </button>
      </motion.div>
    </div>
  );
}
