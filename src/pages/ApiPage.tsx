import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiPlayground } from '@/components/api/ApiPlayground';
import { CodeSnippetViewer } from '@/components/api/CodeSnippetViewer';
import { EndpointCard } from '@/components/api/EndpointCard';
import { Key, Sparkles, Shield, Cpu, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface ApiPageProps {
  onNavigate?: (route: string) => void;
}

export const ApiPage: React.FC<ApiPageProps> = ({ onNavigate }) => {
  const errorCodes = [
    { code: '200 OK', meaning: 'Success', description: 'The image was processed and background removed successfully.' },
    { code: '400 Bad Request', meaning: 'Invalid Payload', description: 'Missing image_url or image format not supported.' },
    { code: '401 Unauthorized', meaning: 'Invalid API Key', description: 'Header x-api-key is missing or expired.' },
    { code: '402 Payment Required', meaning: 'Insufficient Credits', description: 'User account has 0 remaining credits.' },
    { code: '429 Too Many Requests', meaning: 'Rate Limit Exceeded', description: 'Request frequency exceeded tier limits.' },
    { code: '500 Server Error', meaning: 'Internal Failure', description: 'AI neural engine failover error. Credit is auto-refunded.' },
  ];

  const rateLimitTiers = [
    { tier: 'Free Tier', throughput: '10 requests / min', concurrency: '1 concurrent', resolution: '4000×4000px max' },
    { tier: 'Pro Monthly', throughput: '60 requests / min', concurrency: '5 concurrent', resolution: '6000×6000px max' },
    { tier: 'Enterprise', throughput: '600+ requests / min', concurrency: '25+ concurrent', resolution: 'Custom lossless pipeline' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-16 space-y-10 sm:space-y-16 overflow-x-hidden min-w-0">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => (onNavigate ? onNavigate('home') : null)}
        >
          Back to Home
        </Button>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 p-5 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-card-elevated via-card to-card border border-brand-cyan/20 shadow-2xl w-full max-w-full min-w-0">
        <div className="space-y-3 sm:space-y-4 max-w-2xl min-w-0">
          <Badge variant="gradient" size="md">REST API v1</Badge>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-tight break-words">
            Developer API &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-pink">
              SDK Reference
            </span>
          </h1>
          <p className="text-xs sm:text-base text-text-secondary leading-relaxed">
            Integrate studio-grade AI background removal into your e-commerce store, mobile app, or backend pipeline with standard HTTP requests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <Button
            variant="gradient"
            size="lg"
            leftIcon={<Key className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('dashboard') : null)}
            className="shadow-xl shadow-brand-blue/20 w-full sm:w-auto justify-center"
          >
            Get API Key
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto justify-center"
            onClick={() => {
              const el = document.getElementById('playground-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Interactive Sandbox
          </Button>
        </div>
      </div>

      {/* Interactive API Explorer Sandbox */}
      <div id="playground-section" className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cyan shrink-0" />
          <h2 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">Interactive API Playground</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Test real-time background removal payloads right from your browser.
        </p>

        <ApiPlayground />
      </div>

      {/* Multi-Language Code Snippets */}
      <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-pink shrink-0" />
          <h2 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">Code Examples &amp; Quickstarts</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Copy production-ready integration snippets in your favorite language or framework.
        </p>

        <CodeSnippetViewer />
      </div>

      {/* REST Endpoints Catalog */}
      <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cyan shrink-0" />
          <h2 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">API Endpoints Specification</h2>
        </div>

        <div className="space-y-6 w-full max-w-full min-w-0">
          <EndpointCard
            method="POST"
            path="/v1/remove-background"
            title="Remove Background from Image"
            description="Isolates the primary foreground subject and returns a transparent PNG or WEBP cutout URL."
            headers={[
              { name: 'x-api-key', required: true, description: 'Your secret API key starting with sc_live_...' },
              { name: 'Content-Type', required: true, description: 'Must be application/json' },
            ]}
            bodyParams={[
              { name: 'image_url', type: 'string', required: true, description: 'Publicly accessible URL of the image to process (JPG, PNG, WEBP).' },
              { name: 'format', type: 'string', required: false, description: 'Output format: png (lossless alpha) or webp. Defaults to png.' },
            ]}
            responseExample={{
              success: true,
              status: 'completed',
              job_id: 'job_8923a8bc71',
              processed_image_url: 'https://cdn.clearcut.ai/cutouts/2026/08/job_8923a8bc71.png',
              duration_ms: 1420,
              credits_remaining: 294,
              expires_at: '2026-09-01T12:00:00Z',
            }}
          />

          <EndpointCard
            method="GET"
            path="/v1/account/credits"
            title="Check Available Credit Wallet"
            description="Returns the authenticated user's free daily credits and purchased credit balances."
            headers={[
              { name: 'x-api-key', required: true, description: 'Your secret API key.' },
            ]}
            responseExample={{
              success: true,
              free_daily_remaining: 5,
              purchased_credits: 300,
              total_available: 305,
              resets_at: '2026-09-01T00:00:00+06:00',
            }}
          />
        </div>
      </div>

      {/* Error Reference: Mobile Cards & Desktop Table */}
      <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-status-warning shrink-0" />
          <h2 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">Status &amp; Error Codes</h2>
        </div>

        {/* Mobile View: Cards */}
        <div className="block sm:hidden space-y-2.5 w-full max-w-full min-w-0">
          {errorCodes.map((e, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-card-elevated border border-border-subtle space-y-1 w-full max-w-full min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-cyan">{e.code}</span>
                <span className="text-xs font-semibold text-text-primary">{e.meaning}</span>
              </div>
              <p className="text-xs text-text-secondary leading-snug">{e.description}</p>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <Card variant="default" className="hidden sm:block p-0 overflow-hidden border-border-subtle shadow-xl w-full max-w-full min-w-0">
          <div className="overflow-x-auto w-full max-w-full min-w-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Status Code</th>
                  <th className="py-3 px-4 sm:px-6">Meaning</th>
                  <th className="py-3 px-4 sm:px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {errorCodes.map((e, i) => (
                  <tr key={i} className="hover:bg-card-hover/50">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-brand-cyan">{e.code}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-text-primary font-sans font-semibold">{e.meaning}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-text-secondary font-sans">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Rate Limits & Tiers */}
      <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue shrink-0" />
          <h2 className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">Rate Limits &amp; Throughput Tiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0">
          {rateLimitTiers.map((t, i) => (
            <Card key={i} variant="default" className="p-4 sm:p-6 space-y-4 border-border-subtle shadow-md w-full max-w-full min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">{t.tier}</h3>
              <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Rate Limit:</span>
                  <span className="font-bold text-brand-cyan">{t.throughput}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Concurrency:</span>
                  <span className="font-bold text-text-primary">{t.concurrency}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Max Resolution:</span>
                  <span className="font-bold text-text-primary">{t.resolution}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="p-5 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-card-elevated via-brand-blue/10 to-card border border-brand-cyan/20 text-center space-y-4 w-full max-w-full min-w-0">
        <h3 className="text-lg sm:text-3xl font-black text-text-primary">Ready to Automate Background Removals?</h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Generate an API key in seconds from your dashboard and start processing photos programmatically.
        </p>
        <Button
          variant="gradient"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => (onNavigate ? onNavigate('dashboard') : null)}
          className="shadow-xl w-full sm:w-auto justify-center"
        >
          Generate Your Secret Key
        </Button>
      </div>
    </div>
  );
};
