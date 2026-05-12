'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.onboardingStatus === 'PENDING') {
      setIsOnboardingOpen(true);
    }
  }, [status, session, router]);

  const handleOnboarding = async (data: {
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Onboarding fehlgeschlagen');
      }

      setIsOnboardingOpen(false);
      // Refresh session
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-white/60">Wird geladen...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <BurgerMenu />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onSubmit={handleOnboarding}
        isLoading={isLoading}
        error={error}
      />

      <div className="pt-20 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome, {session.user?.name || session.user?.username}! 👋
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-lg p-6 rounded-3xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Status</h2>
              <div className="space-y-3">
                <p className="text-white/60">
                  <span className="text-white font-semibold">Benutzername:</span>{' '}
                  <span className="text-accent-purple">{session.user?.username}</span>
                </p>
                <p className="text-white/60">
                  <span className="text-white font-semibold">Rolle:</span>{' '}
                  <span className="text-accent-purple">{session.user?.role}</span>
                </p>
                <p className="text-white/60">
                  <span className="text-white font-semibold">Onboarding:</span>{' '}
                  <span
                    className={
                      session.user?.onboardingStatus === 'APPROVED'
                        ? 'text-green-400'
                        : session.user?.onboardingStatus === 'REJECTED'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }
                  >
                    {session.user?.onboardingStatus === 'PENDING' && 'Ausstehend'}
                    {session.user?.onboardingStatus === 'APPROVED' && 'Bestätigt'}
                    {session.user?.onboardingStatus === 'REJECTED' && 'Abgelehnt'}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-lg p-6 rounded-3xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Schnelllinks</h2>
              <div className="space-y-2">
                {session.user?.role === 'ADMIN' || session.user?.role === 'ROOT' ? (
                  <button className="w-full glass-sm p-3 rounded-lg text-left hover:bg-white/10 transition-colors">
                    ⚙️ Admin-Panel
                  </button>
                ) : null}
                <button className="w-full glass-sm p-3 rounded-lg text-left hover:bg-white/10 transition-colors">
                  📅 Kalender
                </button>
                <button className="w-full glass-sm p-3 rounded-lg text-left hover:bg-white/10 transition-colors">
                  💰 Abikasse
                </button>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-lg p-6 rounded-3xl flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                className="btn-glass w-full"
              >
                Abmelden
              </button>
            </motion.div>
          </div>

          {session.user?.onboardingStatus === 'REJECTED' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-lg p-6 rounded-3xl mt-12 bg-red-500/10 border-red-500/30"
            >
              <h2 className="text-2xl font-bold text-red-400 mb-2">❌ Registrierung abgelehnt</h2>
              <p className="text-white/60">
                Deine Registrierung wurde abgelehnt. Bitte kontaktiere einen Admin.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
