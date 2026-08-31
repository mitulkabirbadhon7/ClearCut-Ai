import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Play, Sparkles, CheckCircle2, Clock, Layers, Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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
      const totalTime = duration + 380;
      setLatency(totalTime);
      setStatusCode(200);
      setResponse({
        success: true,
        status: 'completed',
        job_id: `job_api_${Date.now()}`,
        format: format,
        processed_image_url: imageUrl,
        duration_ms: totalTime,
        credits_remaining: 294,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      setIsLoading(false);
      addToast({
        title: '200 OK — Request Completed',
        description: `Simulated API execution finished in ${totalTime}ms.`,
        type: 'success',
      });
    }, 850);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'JSON Copied',
      description: 'API response payload copied to clipboard.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full min-w-0">
        {/* Left Column: Request Builder */}
        <div className="lg:col-span-6 space-y-4 w-full max-w-full min-w-0">
          <Card variant="default" className="p-4 sm:p-6 space-y-5 border-border-subtle shadow-md w-full max-w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="gradient" size="sm">POST</Badge>
                <span className="font-mono text-xs sm:text-sm font-bold text-text-primary break-all">
                  /v1/remove-background
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-card-elevated text-text-muted font-mono">
                JSON
              </span>
            </div>

            {/* API Key Header */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Header: x-api-key</label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sc_live_..."
                className="font-mono text-xs w-full"
              />
            </div>

            {/* Request Body: image_url */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Body: image_url</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://your-domain.com/photo.jpg"
                className="font-mono text-xs w-full"
              />

              {/* Sample Shortcuts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-text-muted block">Sample test URLs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_API_IMAGES.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(s.url)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-card-elevated hover:bg-card-hover border border-border-subtle text-text-secondary hover:text-brand-cyan transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Format Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Body: format</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'png'}
                    onChange={() => setFormat('png')}
                    className="accent-brand-cyan w-4 h-4"
                  />
                  <span>png (lossless alpha cutout)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === 'webp'}
                    onChange={() => setFormat('webp')}
                    className="accent-brand-cyan w-4 h-4"
                  />
                  <span>webp (compressed web)</span>
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
        <div className="lg:col-span-6 space-y-4 w-full max-w-full min-w-0">
          <Card variant="default" className="p-0 overflow-hidden border-border-subtle h-full flex flex-col justify-between shadow-xl w-full max-w-full min-w-0">
            {/* Response Status Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-card-elevated border-b border-border-subtle w-full max-w-full min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary">Response:</span>
                {statusCode ? (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    <span>{statusCode} OK</span>
                  </Badge>
                ) : (
                  <span className="text-[11px] text-text-muted font-mono">Awaiting Execution</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {latency && (
                  <div className="flex items-center gap-1 text-[11px] text-text-muted font-mono">
                    <Clock className="w-3 h-3 text-brand-cyan" />
                    <span>{latency}ms</span>
                  </div>
                )}
                {response && (
                  <button
                    onClick={handleCopyResponse}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors"
                    title="Copy JSON"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Response Body Viewer */}
            <div className="p-4 sm:p-5 flex-1 bg-[#0a0f1d] overflow-x-auto min-h-[180px] sm:min-h-[220px] w-full max-w-full min-w-0">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-10 text-center">
                  <div className="w-7 h-7 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-text-muted">Processing cutout via AI gateway...</p>
                </div>
              ) : response ? (
                <pre className="font-mono text-[11px] sm:text-xs text-brand-cyan leading-relaxed overflow-x-auto w-full max-w-full min-w-0 block">
                  <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-text-muted">
                  <Layers className="w-7 h-7 text-text-muted/40" />
                  <p className="text-xs">Click &quot;Send Test Request&quot; to inspect JSON response &amp; headers.</p>
                </div>
              )}
            </div>

            {/* Quick Preview Thumbnail */}
            {response?.processed_image_url && (
              <div className="p-3.5 bg-card-elevated border-t border-border-subtle flex items-center gap-3 w-full max-w-full min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-checkerboard border border-border-subtle overflow-hidden flex items-center justify-center shrink-0">
                  <img src={response.processed_image_url} alt="Result" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>Cutout Rendered Successfully</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-text-muted font-mono truncate">{response.processed_image_url}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
