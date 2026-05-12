'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface BurgerMenuProps {
  onToggle?: (isOpen: boolean) => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ onToggle }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const line1Variants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: 45,
      y: 10,
    },
  };

  const line2Variants = {
    closed: {
      opacity: 1,
    },
    open: {
      opacity: 0,
    },
  };

  const line3Variants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: -45,
      y: -10,
    },
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-6 left-6 z-40 p-2 rounded-full hover:bg-white/5 transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-center gap-1.5">
          <motion.div
            variants={line1Variants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
            className="w-full h-0.5 bg-white origin-center"
          />
          <motion.div
            variants={line2Variants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
            className="w-full h-0.5 bg-white"
          />
          <motion.div
            variants={line3Variants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
            className="w-full h-0.5 bg-white origin-center"
          />
        </div>
      </button>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/50 z-30"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: isOpen ? 0 : -400 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 w-80 h-screen sidebar-glass z-35 overflow-y-auto"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="p-8 pt-20">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">ABI 2029</h1>
            <p className="text-white/60 text-sm">Maria-Wächtler Gymnasium</p>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2 mb-8">
            <NavLink href="/" onClick={() => setIsOpen(false)}>
              🏠 Startseite
            </NavLink>
            <NavLink href="/calendar" onClick={() => setIsOpen(false)}>
              📅 Kalender
            </NavLink>
            <NavLink href="/news" onClick={() => setIsOpen(false)}>
              📰 Neuigkeiten
            </NavLink>
            {session && (
              <>
                <NavLink href="/dashboard" onClick={() => setIsOpen(false)}>
                  📊 Dashboard
                </NavLink>
                {(session.user?.role === 'ADMIN' || session.user?.role === 'ROOT') && (
                  <NavLink href="/admin" onClick={() => setIsOpen(false)}>
                    ⚙️ Admin
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Auth Button */}
          <div className="absolute bottom-8 left-8 right-8">
            {session ? (
              <div className="space-y-3">
                <div className="glass-sm p-4">
                  <p className="text-xs text-white/60">Angemeldet als</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user?.name || session.user?.username}
                  </p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="btn-glass w-full text-sm"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  router.push('/login');
                  setIsOpen(false);
                }}
                className="btn-glass block w-full text-center text-sm"
              >
                Anmelden
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

interface NavLinkProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, onClick, children }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.push(href);
        onClick?.();
      }}
      className="block w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors text-white/80 hover:text-white"
    >
      {children}
    </button>
  );
};
