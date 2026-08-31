import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Play, Sparkles, CheckCircle2, Clock, Layers } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const SAMPLE_API_IMAGES = [
  { label: 'E-commerce Shoe', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Portrait Model', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Product Bottle', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
];

export const ApiPlayground: React.FC = () => {
  const [apiKey, setApiKey] = useState('sc_live_demo_982348a8b1c');
  const [imageUrl, setImageUrl] = useState(SAMPLE_API_IMAGES[0].url);
  const [format, setFormat] = useState<'png' | 'webp'>('png');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const { addToast } = useAppStore();

  const handleSendRequest = async () => {
    if (!imageUrl.trim()) {
      addToast({
        title: 'Missing Image URL',
        description: 'Please provide a valid public image URL to process.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setStatusCode(null);
    const startTime = Date.now();

    // High-fidelity sandbox simulation for API explorer
    setTimeout(() => {
      const duration = Date.now() - startTime;
      setLatency(duration + 450);
      setStatusCode(200);
      setResponse({
        success: true,
        status: 'completed',
        job_id: `job_api_${Date.now()}`,
        format: format,
        processed_image_url: imageUrl,
        duration_ms: duration + 450,
        credits_remaining: 294,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      setIsLoading(false);
      addToast({
        title: '200 OK — Request Completed',
        description: `Simulated API execution finished in ${duration + 450}ms.`,
        type: 'success',
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Builder */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="default" className="p-6 space-y-5 border-border-subtle">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="gradient" size="sm">POST</Badge>
                <span className="font-mono text-xs font-bold text-text-primary">/v1/remove-background</span>
              </div>
              <span className="text-[11px] text-text-muted font-mono">REST JSON</span>
            </div>

            {/* API Key Header */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Header: x-api-key</label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sc_live_..."
                className="font-mono text-xs"
              />
            </div>

            {/* Request Body: image_url */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Body: image_url</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://your-domain.com/photo.jpg"
                className="font-mono text-xs"
              />

              {/* Sample Shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-text-muted">Sample URLs:</span>
                {SAMPLE_API_IMAGES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    className="text-[11px] px-2 py-0.5 rounded bg-card-elevated hover:bg-card-hover border border-border-subtle text-text-secondary hover:text-brand-cyan transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Body: format</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'png'}
                    onChange={() => setFormat('png')}
                    className="accent-brand-cyan"
                  />
                  <span>png (lossless alpha)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'webp'}
                    onChange={() => setFormat('webp')}
                    className="accent-brand-cyan"
                  />
                  <span>webp (compact web)</span>
                </label>
              </div>
            </div>

            {/* Execute Button */}
            <Button
              variant="gradient"
              size="md"
              className="w-full justify-center shadow-lg shadow-brand-blue/20"
              leftIcon={<Play className="w-4 h-4" />}
              onClick={handleSendRequest}
              isLoading={isLoading}
            >
              Send Test Request
            </Button>
          </Card>
        </div>

        {/* Right Column: Response Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="default" className="p-0 overflow-hidden border-border-subtle h-full flex flex-col justify-between shadow-xl">
            {/* Response Status Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-card-elevated border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-text-primary">Response:</span>
                {statusCode ? (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    <span>{statusCode} OK</span>
                  </Badge>
                ) : (
                  <span className="text-xs text-text-muted font-mono">Awaiting Execution</span>
                )}
              </div>

              {latency && (
                <div className="flex items-center gap-1 text-xs text-text-muted font-mono">
                  <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{latency}ms</span>
                </div>
              )}
            </div>

            {/* Response Body Viewer */}
            <div className="p-5 flex-1 bg-[#0a0f1d] overflow-x-auto min-h-[220px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center space-y-3 py-12 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-text-muted">Calling ClearCut AI REST Gateway...</p>
                </div>
              ) : response ? (
                <pre className="font-mono text-xs text-brand-cyan leading-relaxed">
                  <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-text-muted">
                  <Layers className="w-8 h-8 text-text-muted/40" />
                  <p className="text-xs">Click &quot;Send Test Request&quot; to inspect JSON response &amp; headers.</p>
                </div>
              )}
            </div>

            {/* Quick Preview Thumbnail */}
            {response?.processed_image_url && (
              <div className="p-4 bg-card-elevated border-t border-border-subtle flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-checkerboard border border-border-subtle overflow-hidden flex items-center justify-center shrink-0">
                  <img src={response.processed_image_url} alt="Result" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Cutout Rendered Successfully</span>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono truncate">{response.processed_image_url}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
