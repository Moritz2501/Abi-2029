'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function CashPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTransactions();
    }
  }, [status, router]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
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

      <div className="pt-20 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-8">💰 Abikasse</h1>

          {/* Total Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-lg rounded-3xl p-8 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl" />
            <p className="text-white/60 mb-2">Gesamtsumme</p>
            <div className="flex items-end gap-4">
              <h2 className="text-5xl font-bold text-white">
                €{total.toFixed(2).replace('.', ',')}
              </h2>
              <p className={`text-xl font-semibold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {total >= 0 ? '✓' : '!'}
              </p>
            </div>
          </motion.div>

          {/* Admin Controls */}
          {(session.user?.role === 'ADMIN' || session.user?.role === 'ROOT' || session.user?.role === 'KASSE') && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowForm(!showForm)}
              className="btn-glass mb-8"
            >
              {showForm ? 'Abbrechen' : '➕ Neue Transaktion'}
            </motion.button>
          )}

          {/* Add Transaction Form */}
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
                setShowForm(false);
              }}
              className="glass-lg rounded-3xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Neue Transaktion</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Typ</label>
                  <select className="input-glass">
                    <option value="INCOME">Einnahme</option>
                    <option value="EXPENSE">Ausgabe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Betrag</label>
                  <input type="number" placeholder="0.00" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Beschreibung
                  </label>
                  <textarea placeholder="..." className="input-glass" />
                </div>
                <button type="submit" className="btn-glass w-full">
                  Speichern
                </button>
              </div>
            </motion.form>
          )}

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-lg rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Transaktionen</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/80">Datum</th>
                    <th className="text-left py-3 px-4 text-white/80">Beschreibung</th>
                    <th className="text-left py-3 px-4 text-white/80">Typ</th>
                    <th className="text-left py-3 px-4 text-white/80">Betrag</th>
                    <th className="text-left py-3 px-4 text-white/80">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-3 px-4 text-white/80">
                        {new Date(tx.createdAt).toLocaleDateString('de-DE')}
                      </td>
                      <td className="py-3 px-4 text-white/80">{tx.description}</td>
                      <td className="py-3 px-4">
                        <span className={tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}>
                          {tx.type === 'INCOME' ? '➕' : '➖'} {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        €{Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === 'APPROVED'
                              ? 'bg-green-500/30 text-green-200'
                              : tx.status === 'REJECTED'
                              ? 'bg-red-500/30 text-red-200'
                              : 'bg-yellow-500/30 text-yellow-200'
                          }`}
                        >
                          {tx.status === 'PENDING' && 'Ausstehend'}
                          {tx.status === 'APPROVED' && 'Genehmigt'}
                          {tx.status === 'REJECTED' && 'Abgelehnt'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
