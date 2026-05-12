'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: string;
  onboardingStatus: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'cash' | 'pages' | 'stats'>('users');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (
      status === 'authenticated' &&
      session?.user?.role !== 'ADMIN' &&
      session?.user?.role !== 'ROOT'
    ) {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionMessage('');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Aktion fehlgeschlagen');
      }

      setActionMessage('Aktion erfolgreich ausgeführt');
      fetchUsers();
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : 'Aktion fehlgeschlagen'
      );
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-white/60">Wird geladen...</div>
      </div>
    );
  }

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ROOT')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <BurgerMenu />

      <div className="pt-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60 mb-8">
            {session.user?.role === 'ROOT' ? '🔑 Root Admin' : '👮 Administrator'}
          </p>

          {actionMessage && (
            <div className="mb-4 p-4 bg-white/5 rounded-3xl text-sm text-white/80">
              {actionMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="glass-lg rounded-3xl p-1 mb-8 flex gap-1 overflow-x-auto">
            {[
              { id: 'users', label: '👥 User', icon: '👥' },
              { id: 'cash', label: '💰 Kasse', icon: '💰' },
              { id: 'pages', label: '📄 Seiten', icon: '📄' },
              { id: 'stats', label: '📊 Statistik', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent-purple/30 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-lg rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Benutzerverwaltung</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">Rolle</th>
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-white/80">{user.username || '-'}</td>
                        <td className="py-3 px-4 text-white/80">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'ROOT'
                                ? 'bg-red-500/30 text-red-200'
                                : user.role === 'ADMIN'
                                ? 'bg-purple-500/30 text-purple-200'
                                : user.role === 'KASSE'
                                ? 'bg-green-500/30 text-green-200'
                                : user.role === 'PLANUNG'
                                ? 'bg-blue-500/30 text-blue-200'
                                : 'bg-white/20 text-white'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.onboardingStatus === 'APPROVED'
                                ? 'bg-green-500/30 text-green-200'
                                : user.onboardingStatus === 'REJECTED'
                                ? 'bg-red-500/30 text-red-200'
                                : 'bg-yellow-500/30 text-yellow-200'
                            }`}
                          >
                            {user.onboardingStatus === 'PENDING' && 'Ausstehend'}
                            {user.onboardingStatus === 'APPROVED' && 'Bestätigt'}
                            {user.onboardingStatus === 'REJECTED' && 'Abgelehnt'}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          {user.onboardingStatus === 'PENDING' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="btn-glass px-3 py-2 text-xs"
                              >
                                Freigeben
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUserAction(user.id, 'reject')}
                                className="btn-glass px-3 py-2 text-xs bg-red-500/20 hover:bg-red-500/30"
                              >
                                Ablehnen
                              </button>
                            </>
                          ) : (
                            <span className="text-white/60 text-xs">Keine Aktion nötig</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Cash Tab */}
          {activeTab === 'cash' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-lg rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">💰 Abikasse Management</h2>
              <p className="text-white/60">Cash-Management-Funktionen werden hier angezeigt</p>
            </motion.div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-lg rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">📄 Seiten Management</h2>
              <p className="text-white/60">Seiten-Management-Funktionen werden hier angezeigt</p>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: 'Gesamtnutzer', value: users.length, icon: '👥' },
                  { label: 'Bestätigt', value: users.filter((u) => u.onboardingStatus === 'APPROVED').length, icon: '✓' },
                  { label: 'Ausstehend', value: users.filter((u) => u.onboardingStatus === 'PENDING').length, icon: '⏳' },
                  { label: 'Abgelehnt', value: users.filter((u) => u.onboardingStatus === 'REJECTED').length, icon: '✗' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-lg rounded-3xl p-6 text-center"
                  >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <p className="text-white/60 text-sm mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
