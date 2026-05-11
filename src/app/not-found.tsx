'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BurgerMenu } from '@/components/BurgerMenu';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <BurgerMenu />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-accent-purple mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Seite nicht gefunden</h2>
        <p className="text-white/60 mb-8 text-lg">
          Die Seite, die du suchst, existiert nicht oder wurde verschoben.
        </p>
        <Link href="/" className="btn-glass inline-block">
          Zurück zur Startseite
        </Link>
      </motion.div>
    </div>
  );
}
