'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages?published=true');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <BurgerMenu />

      <div className="pt-20 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-3">📰 Neuigkeiten</h1>
          <p className="text-white/60 mb-12">
            Alle wichtigen Neuigkeiten und Updates für den Abiturjahrgang 2029
          </p>

          {isLoading ? (
            <div className="text-center text-white/60">Wird geladen...</div>
          ) : pages.length === 0 ? (
            <div className="glass-lg rounded-3xl p-12 text-center">
              <p className="text-white/60">Keine Neuigkeiten vorhanden</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-lg rounded-3xl p-8 hover:shadow-glass-glow-purple transition-all duration-300"
                >
                  <h2 className="text-2xl font-bold text-white mb-3">{page.title}</h2>
                  <p className="text-white/60 text-sm mb-4">
                    📅{' '}
                    {new Date(page.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div
                    className="text-white/70 prose prose-invert max-w-none line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: page.content.substring(0, 200) + '...',
                    }}
                  />
                  <a
                    href={`/news/${page.slug}`}
                    className="inline-block mt-4 text-accent-purple hover:text-accent-purple-light font-semibold transition-colors"
                  >
                    Mehr lesen →
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
