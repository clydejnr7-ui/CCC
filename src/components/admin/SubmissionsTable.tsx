'use client';

import { useState } from 'react';
import { formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';
import type { AccountSubmission } from '@/types/database';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Save, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_STATUSES = ['pending', 'in_progress', 'passed', 'failed', 'payment_pending', 'paid'] as const;

interface SubmissionsTableProps {
  submissions: (AccountSubmission & { profiles?: { email: string; full_name: string | null } })[];
  onRefresh: () => void;
}

function SubmissionRow({
  submission,
  onUpdate,
}: {
  submission: AccountSubmission & { profiles?: { email: string; full_name: string | null } };
  onUpdate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showCreds, setShowCreds] = useState(false);
  const [status, setStatus] = useState(submission.status);
  const [adminNotes, setAdminNotes] = useState(submission.admin_notes ?? '');
  const [price, setPrice] = useState(submission.price_usd?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submission.id,
          status,
          admin_notes: adminNotes,
          price_usd: price ? parseFloat(price) : null,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Submission updated');
      onUpdate();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/5 last:border-0"
    >
      {/* Row */}
      <div
        className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white">{submission.prop_firm}</span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 text-xs">{submission.account_size}</span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 text-xs">{submission.challenge_phase}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {submission.profiles?.email ?? 'Unknown'} · {formatDate(submission.created_at)}
          </p>
        </div>
        <span className={`status-badge ${STATUS_COLORS[submission.status]}`}>
          {STATUS_LABELS[submission.status]}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
        )}
      </div>

      {/* Expanded */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4"
        >
          {/* Credentials */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Platform', value: submission.trading_platform },
              { label: 'Server', value: submission.server },
              { label: 'Login ID', value: submission.login_id },
              { label: 'Password', value: submission.password, secret: true },
              { label: 'Investor Pass', value: submission.investor_password ?? '—', secret: true },
              { label: 'User', value: submission.profiles?.full_name ?? submission.profiles?.email ?? '—' },
            ].map(({ label, value, secret }) => (
              <div key={label} className="bg-white/[0.02] rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-white font-mono">
                  {secret && !showCreds ? '••••••••' : value}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCreds(!showCreds)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {showCreds ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showCreds ? 'Hide' : 'Reveal'} credentials
          </button>

          {submission.notes && (
            <div>
              <p className="text-xs text-slate-500 mb-1">User notes</p>
              <p className="text-sm text-slate-300">{submission.notes}</p>
            </div>
          )}

          {/* Admin controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="input-dark text-sm"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 299"
                className="input-dark text-sm"
              />
            </div>

            {/* Save */}
            <div className="flex items-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Admin Notes (visible to user)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Update visible to the user in their dashboard..."
              className="input-dark resize-none text-sm"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SubmissionsTable({ submissions, onRefresh }: SubmissionsTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = submissions.filter((s) => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      s.prop_firm.toLowerCase().includes(term) ||
      s.profiles?.email.toLowerCase().includes(term) ||
      s.login_id.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by firm, email, login..."
          className="input-dark flex-1 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-dark sm:w-48 text-sm"
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No submissions match your filters</p>
          </div>
        ) : (
          filtered.map((s) => (
            <SubmissionRow key={s.id} submission={s} onUpdate={onRefresh} />
          ))
        )}
      </div>

      <p className="text-xs text-slate-600 mt-3">
        Showing {filtered.length} of {submissions.length} total submissions
      </p>
    </div>
  );
}
