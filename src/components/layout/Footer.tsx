import Link from 'next/link';
import { TrendingUp, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-base">
                <span className="text-white">PropFirm</span>
                <span className="gradient-text">Passing</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Professional prop firm challenge passing service. We trade your account with expert precision to get you funded — in as little as 7 days.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://t.me/propfirmpassing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/propfirmpassing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/30 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {['Challenge Passing', 'Phase 1 & 2', 'Funded Account', 'All Prop Firms'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Sign Up', href: '/signup' },
                { label: 'Sign In', href: '/login' },
                { label: 'Contact', href: 'mailto:support@propfirmpassing.online' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} PropFirmPassing. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Risk Disclaimer: Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
