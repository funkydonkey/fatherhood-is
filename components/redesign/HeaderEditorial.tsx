'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export function HeaderEditorial() {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAuthClick = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="py-10 border-b-[3px] border-black">
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="flex justify-between items-baseline">
            <Link href="/redesign" className="text-[42px] font-semibold italic text-black tracking-tight">
              Fatherhood Is
            </Link>

            <div className="flex items-baseline gap-10">
              <div className="text-[13px] text-gray-600 tracking-wider">
                Volume I, Issue 1 — 2026
              </div>
              <nav className="flex items-center gap-8">
                <Link href="/redesign" className="text-base hover:opacity-60 transition-opacity">
                  Stories
                </Link>
                <Link href="/" className="text-base hover:opacity-60 transition-opacity">
                  Original
                </Link>
                <Link href="/redesign/create" className="text-base hover:opacity-60 transition-opacity">
                  Create
                </Link>

                {loading ? (
                  <div className="w-16 h-8 bg-gray-200 animate-pulse rounded" />
                ) : user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-1 border-2 border-black hover:bg-black hover:text-white transition-all"
                    >
                      <span className="text-sm font-medium">{username}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black shadow-lg py-2 z-20">
                          <div className="px-4 py-2 border-b border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </>
  );
}
