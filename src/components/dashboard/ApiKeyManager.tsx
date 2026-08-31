import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useAppStore } from '@/store/useAppStore';
import { Key, Plus, Copy, Trash2, ShieldAlert, Check, Code2 } from 'lucide-react';

export const ApiKeyManager: React.FC = () => {
  const { data: apiKeys = [], isLoading, createApiKey, isCreating, revokeApiKey } = useApiKeys();
  const { addToast } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      const res = await createApiKey({ name: keyName });
      setGeneratedSecret(res.secretKey);
      setKeyName('');
      addToast({
        title: 'API Key Created',
        description: 'Copy and store your secret key securely. It will not be shown again.',
        type: 'success',
      });
    } catch {
      addToast({
        title: 'Creation Failed',
        description: 'Unable to generate new API key.',
        type: 'error',
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Copied to Clipboard',
      description: 'API key copied to clipboard.',
      type: 'info',
    });
  };

  const handleRevoke = async (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? Any applications using it will immediately lose access.')) {
      try {
        await revokeApiKey(keyId);
        addToast({
          title: 'Key Revoked',
          description: 'API key has been deactivated.',
          type: 'info',
        });
      } catch {
        addToast({
          title: 'Error',
          description: 'Failed to revoke API key.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-lg font-bold text-text-primary">Developer REST API Keys</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-card-elevated text-text-muted font-mono">
              {apiKeys.length}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Authenticate programmatic background removal requests directly from your server or backend.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setGeneratedSecret(null);
            setIsModalOpen(true);
          }}
        >
          Generate New Key
        </Button>
      </div>

      {/* Keys List */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-text-muted">Loading API keys...</div>
      ) : apiKeys.length > 0 ? (
        <Card variant="default" className="divide-y divide-border-subtle p-0 overflow-hidden">
          {apiKeys.map((k) => (
            <div key={k.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-text-primary">{k.name}</h4>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                  <span>Prefix: <span className="text-text-secondary">{k.key_prefix}...</span></span>
                  <span>•</span>
                  <span>Created: {new Date(k.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-status-error" />}
                  onClick={() => handleRevoke(k.id)}
                  className="text-status-error hover:bg-status-error/10"
                >
                  Revoke Key
                </Button>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card variant="default" className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-card-elevated border border-border mx-auto flex items-center justify-center text-text-muted">
            <Key className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-base font-bold text-text-primary">No API keys created</h4>
            <p className="text-xs text-text-muted">
              Generate a secret API key to automate background removal in your Shopify, WooCommerce, or custom app.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            Create First Key
          </Button>
        </Card>
      )}

      {/* Code Integration Preview Box */}
      <Card variant="default" className="p-6 space-y-4 border-brand-cyan/20">
        <div className="flex items-center gap-2 text-brand-cyan">
          <Code2 className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Quick Integration Snippet</h4>
        </div>
        <pre className="p-4 rounded-xl bg-black/80 font-mono text-xs text-text-secondary overflow-x-auto border border-border-subtle leading-relaxed">
{`curl -X POST https://api.clearcut.ai/v1/remove-background \\
  -H "x-api-key: sc_live_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://your-site.com/product.jpg"}'`}
        </pre>
      </Card>

      {/* Create Key Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
          <Card variant="elevated" className="w-full max-w-md p-6 space-y-6 border-border shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">
                {generatedSecret ? 'Save Your Secret API Key' : 'Generate New API Key'}
              </h3>
              <p className="text-xs text-text-muted">
                {generatedSecret
                  ? 'Please copy your key now. For your security, it will never be displayed again.'
                  : 'Give your key a descriptive name to track its usage.'}
              </p>
            </div>

            {generatedSecret ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 flex items-start gap-2.5 text-xs text-status-warning">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Treat this key like a password. Do not commit it to public repositories.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Secret API Token</label>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-black/80 border border-border font-mono text-xs text-brand-cyan">
                    <span className="truncate flex-1">{generatedSecret}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                      onClick={() => handleCopy(generatedSecret)}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    setIsModalOpen(false);
                    setGeneratedSecret(null);
                  }}
                >
                  I Have Saved My Secret Key
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-5">
                <Input
                  label="Key Name"
                  placeholder="e.g. My Online Store App"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  required
                  autoFocus
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="gradient" size="md" type="submit" isLoading={isCreating}>
                    Generate Token
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
