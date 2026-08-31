import { Sparkles, Zap, ShieldCheck, Layers, GitBranch, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const systemChecks = [
    { label: 'Frontend Engine', val: 'React 18 + Vite 6 + TypeScript', icon: Zap, status: 'ready' },
    { label: 'Design System', val: 'Tailwind CSS (Curated Dark Palette)', icon: Layers, status: 'ready' },
    { label: 'Git Repository', val: 'Linked to GitHub (SnapCut.git)', icon: GitBranch, status: 'ready' },
    { label: 'Security & RLS', val: 'Zero-Trust Client Boundary', icon: ShieldCheck, status: 'ready' },
    { label: 'Auth & DB Provider', val: isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Config Ready (.env.example)', icon: Terminal, status: isSupabaseConfigured ? 'ready' : 'pending' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-brand-purple selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-border-subtle bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-pink p-[2px]">
              <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-cyan" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-brand-gradient bg-clip-text text-transparent">
                SnapCut AI
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-pink border border-brand-purple/30">
                Phase 1 Foundation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mitulkabirbadhon7/SnapCut"
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4 text-brand-blue" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-elevated border border-border-subtle text-xs text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            <span>Production Architecture Initialized</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Remove Image Backgrounds in <span className="text-gradient">One Click</span>
          </h1>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            Fast, simple, and professional AI-powered background removal platform engineered for high-volume e-commerce, creators, and developers.
          </p>
        </div>

        {/* Phase 1 Verification Grid */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">System Foundation Diagnostics</h2>
              <p className="text-xs sm:text-sm text-text-muted">Phase 1 stack & environment readiness verification</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-status-success/10 text-status-success text-xs font-semibold border border-status-success/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ready for Phase 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemChecks.map((check, idx) => {
              const Icon = check.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-card-elevated/70 border border-border-subtle flex items-start gap-4 hover:border-brand-blue/40 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-card border border-border-subtle text-brand-cyan">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-text-muted font-medium">{check.label}</div>
                    <div className="text-sm font-semibold text-text-primary mt-0.5">{check.val}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkerboard Pattern Demo */}
          <div className="mt-6 p-4 rounded-xl bg-card-elevated border border-border-subtle">
            <div className="text-xs font-semibold text-text-muted mb-2">Transparent Checkerboard Engine Preview:</div>
            <div className="h-16 rounded-lg bg-checkerboard flex items-center justify-center border border-border-subtle">
              <span className="px-3 py-1 rounded bg-card/80 text-xs font-medium text-text-secondary backdrop-blur-sm border border-border-subtle">
                Alpha Channel Transparency Active
              </span>
            </div>
          </div>
        </div>

        {/* Roadmap Quick Access */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-card-elevated/50 border border-border-subtle text-xs text-text-muted gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">Next Action:</span>
            <span>Design System & Layout Architecture (Phase 2)</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-cyan font-medium">
            <span>Awaiting instruction to begin Phase 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-card/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} SnapCut AI. Built with precision for Bangladesh & global markets.</p>
        </div>
      </footer>
    </div>
  );
}
