'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('Benutzername existiert nicht')) {
          setError('Benutzername existiert nicht');
        } else if (result.error.includes('noch nicht freigeschaltet')) {
          setError('Dein Account wurde noch nicht freigeschaltet');
        } else if (result.error.includes('abgelehnt')) {
          setError('Dein Account wurde abgelehnt');
        } else {
          setError('Benutzername oder Passwort ungültig');
        }
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <BurgerMenu />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-lg max-w-md w-full p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-blue/20 rounded-full blur-3xl -z-10" />

        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Anmelden
          </h1>
          <p className="text-white/60 text-center mb-8">
            ABI 2029 - Maria-Wächtler Gymnasium
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Dein Benutzername"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-glass"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-glass w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Du hast noch keinen Account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-accent-purple hover:text-accent-purple-light transition-colors font-semibold"
              >
                Hier registrieren
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
