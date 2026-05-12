'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const usernamePreview = useMemo(() => {
    const first = firstName.trim().slice(0, 2).toUpperCase().padEnd(2, 'X');
    const last = lastName.trim().slice(0, 2).toUpperCase().padEnd(2, 'X');
    return `${first}${last}`;
  }, [firstName, lastName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Vorname und Nachname sind erforderlich');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registrierung fehlgeschlagen');
      } else {
        setSuccess(
          `Erfolgreich registriert! Dein Benutzername lautet ${data.username}. Warte auf die Freigabe durch einen Admin.`
        );
        setTimeout(() => {
          router.push('/login');
        }, 2500);
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
            Registrierung
          </h1>
          <p className="text-white/60 text-center mb-8">
            Erstelle deinen Account mit deinem Namen und Passwort
          </p>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
            >
              <p className="text-green-200 text-sm">{success}</p>
            </motion.div>
          )}

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
                Vorname
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="z.B. Moritz"
                className="input-glass"
                disabled={isLoading || !!success}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nachname
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="z.B. Bauer"
                className="input-glass"
                disabled={isLoading || !!success}
                required
              />
            </div>

            <div className="glass-sm p-3 rounded-lg">
              <p className="text-white/60">
                Dein zukünftiger Benutzername: <span className="text-accent-purple font-semibold">{usernamePreview}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                className="input-glass"
                disabled={isLoading || !!success}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort wiederholen"
                className="input-glass"
                disabled={isLoading || !!success}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="btn-glass w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Du hast bereits einen Account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-accent-purple hover:text-accent-purple-light transition-colors font-semibold"
              >
                Hier anmelden
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
