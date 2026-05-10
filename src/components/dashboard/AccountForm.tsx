'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lock, Eye, EyeOff, Info } from 'lucide-react';
import { PROP_FIRMS, ACCOUNT_SIZES, CHALLENGE_PHASES, PLATFORMS } from '@/lib/utils';
import { toast } from 'sonner';

const schema = z.object({
  prop_firm: z.string().min(1, 'Select a prop firm'),
  account_size: z.string().min(1, 'Select account size'),
  challenge_phase: z.string().min(1, 'Select challenge phase'),
  trading_platform: z.string().min(1, 'Select platform'),
  login_id: z.string().min(1, 'Login ID is required'),
  password: z.string().min(1, 'Password is required'),
  server: z.string().min(1, 'Server name is required'),
  investor_password: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AccountFormProps {
  onSuccess: () => void;
}

export default function AccountForm({ onSuccess }: AccountFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      toast.success('Account submitted successfully!');
      reset();
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary relative z-10 flex items-center gap-2 text-sm px-5 py-2.5"
      >
        <Plus className="w-4 h-4" />
        Submit Account
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Submit Account</h2>
                  <p className="text-sm text-slate-400 mt-0.5">All credentials are encrypted end-to-end</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-green-500/5 border border-green-500/15 mb-6">
                <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-300/80 leading-relaxed">
                  Your credentials are encrypted using AES-256. Only our trading desk can access them, and only during active challenge work. We recommend changing your password after receiving your funded account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Prop Firm */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Prop Firm *</label>
                    <select {...register('prop_firm')} className="input-dark">
                      <option value="">Select firm...</option>
                      {PROP_FIRMS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    {errors.prop_firm && <p className="mt-1 text-xs text-red-400">{errors.prop_firm.message}</p>}
                  </div>

                  {/* Account Size */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Account Size *</label>
                    <select {...register('account_size')} className="input-dark">
                      <option value="">Select size...</option>
                      {ACCOUNT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.account_size && <p className="mt-1 text-xs text-red-400">{errors.account_size.message}</p>}
                  </div>

                  {/* Challenge Phase */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Challenge Phase *</label>
                    <select {...register('challenge_phase')} className="input-dark">
                      <option value="">Select phase...</option>
                      {CHALLENGE_PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.challenge_phase && <p className="mt-1 text-xs text-red-400">{errors.challenge_phase.message}</p>}
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Trading Platform *</label>
                    <select {...register('trading_platform')} className="input-dark">
                      <option value="">Select platform...</option>
                      {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.trading_platform && <p className="mt-1 text-xs text-red-400">{errors.trading_platform.message}</p>}
                  </div>
                </div>

                {/* Login credentials */}
                <div className="pt-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Account Credentials
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Login ID */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Login ID / Account # *</label>
                      <input
                        {...register('login_id')}
                        type="text"
                        placeholder="e.g. 12345678"
                        className="input-dark"
                        autoComplete="off"
                      />
                      {errors.login_id && <p className="mt-1 text-xs text-red-400">{errors.login_id.message}</p>}
                    </div>

                    {/* Server */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Server *
                        <span className="ml-1 text-xs text-slate-500">(e.g. FTMO-Server2)</span>
                      </label>
                      <input
                        {...register('server')}
                        type="text"
                        placeholder="e.g. FTMO-Server2"
                        className="input-dark"
                        autoComplete="off"
                      />
                      {errors.server && <p className="mt-1 text-xs text-red-400">{errors.server.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
                      <div className="relative">
                        <input
                          {...register('password')}
                          type={showPass ? 'text' : 'password'}
                          placeholder="Account password"
                          className="input-dark pr-10"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                    </div>

                    {/* Investor Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Investor Password
                        <span className="ml-1 text-xs text-slate-500">(read-only, optional)</span>
                      </label>
                      <input
                        {...register('investor_password')}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Optional"
                        className="input-dark"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Additional Notes
                    <span className="ml-1 text-xs text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any specific rules, target dates, or special requirements..."
                    className="input-dark resize-none"
                  />
                </div>

                {/* Info */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300/80">
                    After submitting, you will receive a payment link within minutes. Trading begins immediately after payment is confirmed on-chain.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 rounded-xl glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary relative z-10 flex items-center justify-center gap-2 py-3"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Submit Account'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
