import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Code2, ArrowLeft, Key, Terminal, Zap } from 'lucide-react';

interface ApiPageProps {
  onNavigate?: (route: string) => void;
}

export const ApiPage: React.FC<ApiPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
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

      {/* Header */}
      <div className="space-y-4">
        <Badge variant="gradient">RESTful Developer API v1</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          ClearCut AI <span className="text-gradient">Developer API Reference</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
          Integrate high-speed, automated image background removal directly into your Node.js, Python, PHP, or Next.js applications.
        </p>
      </div>

      {/* Authentication Section */}
      <Card variant="elevated" className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-lg font-bold text-text-primary">Authentication</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          Pass your secret API key in the <code className="px-2 py-0.5 rounded bg-card text-brand-cyan font-mono text-xs">x-api-key</code> HTTP header for every request.
        </p>
        <div className="p-4 rounded-xl bg-black/80 font-mono text-xs text-text-muted">
          x-api-key: sc_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </div>
      </Card>

      {/* Endpoint: Remove Background */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-status-success/20 text-status-success font-bold font-mono text-xs">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">/v1/remove-background</span>
          </div>
          <Badge variant="default">Rate Limit: 60 req/min</Badge>
        </div>

        {/* cURL Example */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-blue" />
            <span>cURL Request Example</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/80 text-brand-cyan font-mono text-xs overflow-x-auto leading-relaxed border border-border-subtle">
{`curl -X POST https://api.clearcut.ai/v1/remove-background \\
  -H "x-api-key: sc_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/ecommerce-product.jpg",
    "format": "png"
  }'`}
          </pre>
        </div>

        {/* Node.js Example */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-pink" />
            <span>JavaScript / Node.js (Fetch)</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/80 text-text-secondary font-mono text-xs overflow-x-auto leading-relaxed border border-border-subtle">
{`const response = await fetch('https://api.clearcut.ai/v1/remove-background', {
  method: 'POST',
  headers: {
    'x-api-key': 'sc_live_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/ecommerce-product.jpg',
    format: 'png'
  })
});

const data = await response.json();
console.log(data.output_url); // Direct transparent PNG URL`}
          </pre>
        </div>

        {/* Response JSON */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Zap className="w-4 h-4 text-status-success" />
            <span>Success Response (200 OK)</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/80 text-status-success font-mono text-xs overflow-x-auto leading-relaxed border border-border-subtle">
{`{
  "success": true,
  "job_id": "job_9821a7c0",
  "output_url": "https://res.cloudinary.com/.../cutout.png",
  "credits_remaining": 283,
  "duration_ms": 1420,
  "expires_in_hours": 24
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
};
