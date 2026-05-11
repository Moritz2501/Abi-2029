'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BurgerMenu } from '@/components/BurgerMenu';

export default function HomePage() {
  const { data: session } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <BurgerMenu />
      
      <div className="pt-32 max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-purple to-accent-purple-light bg-clip-text text-transparent">
                ABI 2029
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Maria-Wächtler Gymnasium
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-12"
          >
            Willkommen auf der offiziellen Web-App des Abiturjahrgangs 2029.
            Hier findest du alle wichtigen Informationen, Events und Funktionen
            für unsere Abiturzeit.
          </motion.p>

          {!session && (
            <motion.div variants={itemVariants}>
              <Link
                href="/login"
                className="btn-glass inline-block text-lg px-8 py-4"
              >
                Jetzt anmelden
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              icon: '📅',
              title: 'Kalender',
              description: 'Wichtige Termine und Events auf einen Blick',
            },
            {
              icon: '💰',
              title: 'Abikasse',
              description: 'Transparente Verwaltung der Abrafinanzierung',
            },
            {
              icon: '👥',
              title: 'Community',
              description: 'Vernetze dich mit deinem Abiturjahrgang',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-lg p-6 rounded-3xl text-center hover:shadow-glass-glow-purple transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Event Teaser */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="glass-lg p-8 rounded-3xl mt-20 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🎊 Nächste Events
          </h2>
          <p className="text-white/60 mb-6">
            Sei dabei bei den wichtigsten Terminen deines Abiturjahrgangs.
            Schaue im Kalender für alle anstehenden Events vorbei.
          </p>
          <Link
            href="/calendar"
            className="btn-glass inline-block"
          >
            Zum Kalender
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
