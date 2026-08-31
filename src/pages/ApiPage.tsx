import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiPlayground } from '@/components/api/ApiPlayground';
import { CodeSnippetViewer } from '@/components/api/CodeSnippetViewer';
import { EndpointCard } from '@/components/api/EndpointCard';
import { Key, Sparkles, Shield, Cpu, Zap, ArrowRight } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-card-elevated via-card to-card border border-brand-cyan/20 shadow-2xl">
        <div className="space-y-4 max-w-2xl">
          <Badge variant="gradient" size="md">REST API v1</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Developer API &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-pink">SDK Reference</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Integrate high-speed AI background removal directly into your e-commerce platform, mobile apps, or backend pipelines with simple HTTP requests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button
            variant="gradient"
            size="lg"
            leftIcon={<Key className="w-4 h-4" />}
            onClick={() => (onNavigate ? onNavigate('dashboard') : null)}
            className="shadow-xl shadow-brand-blue/20"
          >
            Get API Key
          </Button>
          <Button
            variant="outline"
            size="lg"
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
      <div id="playground-section" className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-brand-cyan" />
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Interactive API Playground</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Test real-time background removal payloads right from your browser.
        </p>

        <ApiPlayground />
      </div>

      {/* Multi-Language Code Snippets */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-brand-pink" />
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Code Examples &amp; Quickstarts</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Copy production-ready integration snippets in your favorite language or framework.
        </p>

        <CodeSnippetViewer />
      </div>

      {/* REST Endpoints Catalog */}
      <div className="space-y-8">
        <div className="flex items-center gap-2.5">
          <Zap className="w-6 h-6 text-brand-cyan" />
          <h2 className="text-2xl font-black text-text-primary tracking-tight">API Endpoints Specification</h2>
        </div>

        <div className="space-y-6">
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

      {/* Error Reference Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-status-warning" />
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Status &amp; Error Codes</h2>
        </div>

        <Card variant="default" className="p-0 overflow-hidden border-border-subtle shadow-xl">
          <div className="overflow-x-auto">
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
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-brand-blue" />
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Rate Limits &amp; Throughput Tiers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rateLimitTiers.map((t, i) => (
            <Card key={i} variant="default" className="p-6 space-y-4 border-border-subtle">
              <h3 className="text-lg font-bold text-text-primary">{t.tier}</h3>
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
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-card-elevated via-brand-blue/10 to-card border border-brand-cyan/20 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black text-text-primary">Ready to Automate Background Removals?</h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
          Generate an API key in seconds from your dashboard and start processing photos programmatically.
        </p>
        <Button
          variant="gradient"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => (onNavigate ? onNavigate('dashboard') : null)}
          className="shadow-xl"
        >
          Generate Your Secret Key
        </Button>
      </div>
    </div>
  );
};
