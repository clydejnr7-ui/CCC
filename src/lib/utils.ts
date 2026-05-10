import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
}

export function getDaysRemaining(createdAt: string) {
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

export function getProgressPercent(createdAt: string) {
  const created = new Date(createdAt);
  const total = 7 * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - created.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export const PROP_FIRMS = [
  'FTMO', 'Funded Trader', 'MyForexFunds', 'The Funded Trader',
  'E8 Funding', 'Apex Trader Funding', 'TopStep', 'Funded Next',
  '5%ers', 'True Forex Funds', 'Hola Prime', 'Alpha Capital',
  'Instant Funding', 'City Traders Imperium', 'Audacity Capital', 'Other',
];

export const ACCOUNT_SIZES = [
  '$5,000', '$10,000', '$25,000', '$50,000',
  '$100,000', '$200,000', '$300,000', '$500,000',
];

export const CHALLENGE_PHASES = ['Phase 1', 'Phase 2', 'Verification', 'Funded Account'];

export const PLATFORMS = ['MT4', 'MT5', 'cTrader', 'DXTrade', 'TradeLocker', 'MatchTrader', 'Other'];

export const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  passed: 'text-green-400 bg-green-400/10 border-green-400/20',
  failed: 'text-red-400 bg-red-400/10 border-red-400/20',
  payment_pending: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  paid: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  in_progress: 'In Progress',
  passed: 'Passed',
  failed: 'Failed',
  payment_pending: 'Awaiting Payment',
  paid: 'Paid',
};
