'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OnboardingModalProps {
  isOpen: boolean;
  onSubmit: (data: { firstName: string; lastName: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('Vor- und Nachname sind erforderlich');
      return;
    }

    if (password.length < 8) {
      setValidationError('Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwörter stimmen nicht überein');
      return;
    }

    await onSubmit({ firstName, lastName, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="glass-lg max-w-md w-full p-8 relative overflow-hidden"
      >
        {/* Gradient Background Effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-blue/20 rounded-full blur-3xl -z-10" />

        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen! 🎉</h1>
          <p className="text-white/60 mb-6">Bitte vervollständige dein Profil</p>

          {(error || validationError) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{error || validationError}</p>
            </div>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="glass-sm p-3 rounded-lg text-sm">
              <p className="text-white/60">
                Dein Username: <span className="text-accent-purple font-semibold">
                  {`${firstName.substring(0, 2).toUpperCase()}${lastName.substring(0, 2).toUpperCase()}` || 'XX'}
                </span>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-glass w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird gespeichert...' : 'Profil vervollständigen'}
            </button>

            <p className="text-xs text-white/40 text-center mt-4">
              Dein Profil ist nach der Bestätigung durch einen Admin sichtbar.
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
