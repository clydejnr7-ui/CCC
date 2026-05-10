'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Clock, CheckCircle2, AlertCircle,
  TrendingUp, Wallet, Bell
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AccountForm from '@/components/dashboard/AccountForm';
import AccountTable from '@/components/dashboard/AccountTable';
import type { AccountSubmission, Profile } from '@/types/database';

interface Props {
  user: Partial<Profile> & { id: string; email: string };
  initialAccounts: AccountSubmission[];
}

export default function DashboardClient({ user, initialAccounts }: Props) {
  const [accounts, setAccounts] = useState<AccountSubmission[]>(initialAccounts);

  const refreshAccounts = useCallback(async () => {
    const res = await fetch('/api/accounts');
    if (res.ok) {
      const data = await res.json();
      setAccounts(data.accounts ?? []);
    }
  }, []);

  const stats = {
    total: accounts.length,
    inProgress: accounts.filter((a) => a.status === 'in_progress').length,
    passed: accounts.filter((a) => a.status === 'passed').length,
    pending: accounts.filter((a) => a.status === 'pending').length,
    awaitingPayment: accounts.filter((a) => a.status === 'payment_pending').length,
  };

  const STAT_CARDS = [
    { label: 'Total Submissions', value: stats.total, icon: LayoutDashboard, color: 'text-slate-400', bg: 'bg-slate-400/10' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Passed', value: stats.passed, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Awaiting Payment', value: stats.awaitingPayment, icon: Wallet, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const firstName = user.full_name?.split(' ')[0] ?? 'Trader';

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar isLoggedIn />

      {/* Header */}
      <div className="border-b border-white/5 bg-dark-800/50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Active Dashboard</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-white">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            </div>
            <AccountForm onSuccess={refreshAccounts} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4 border border-white/5"
            >
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Payment notification banner */}
        {stats.awaitingPayment > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 mb-6"
          >
            <Bell className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <p className="text-sm text-orange-300">
              You have <strong>{stats.awaitingPayment}</strong> submission{stats.awaitingPayment !== 1 ? 's' : ''} awaiting payment. Click on an account below to pay and start trading.
            </p>
          </motion.div>
        )}

        {/* Passed banner */}
        {stats.passed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20 mb-6"
          >
            <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">
              🎉 Congratulations! <strong>{stats.passed}</strong> of your accounts have been passed. Check your email for funded account details.
            </p>
          </motion.div>
        )}

        {/* How it works for new users */}
        {accounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-white/5 mb-8"
          >
            <h3 className="font-display font-bold text-white mb-4 text-lg">How to Get Started</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { n: '1', title: 'Submit Your Account', desc: 'Click "Submit Account" above and fill in your prop firm login credentials.' },
                { n: '2', title: 'Pay with Crypto', desc: 'After review, you\'ll receive a payment link. We accept BTC, ETH, USDT and 50+ coins.' },
                { n: '3', title: 'Get Funded', desc: 'Our experts trade your account. Watch the progress below. Most pass in 3-5 days.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Accounts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-white">My Accounts</h2>
          </div>
          <AccountTable accounts={accounts} onRefresh={refreshAccounts} />
        </div>
      </div>
    </div>
  );
}
