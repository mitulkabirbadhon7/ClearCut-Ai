import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ParamRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointCardProps {
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  headers?: { name: string; required: boolean; description: string }[];
  bodyParams?: ParamRow[];
  responseExample: any;
}

export const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  title,
  description,
  headers = [],
  bodyParams = [],
  responseExample,
}) => {
  return (
    <Card variant="default" className="p-4 sm:p-6 lg:p-8 space-y-6 border-border-subtle shadow-lg overflow-hidden">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge
            variant={method === 'POST' ? 'gradient' : method === 'GET' ? 'success' : 'outline'}
            size="md"
          >
            {method}
          </Badge>
          <span className="font-mono text-xs sm:text-base font-bold text-text-primary break-all">{path}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-text-primary">{title}</h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>

      {/* Headers Section: Responsive Mobile List & Desktop Table */}
      {headers.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Request Headers</h4>

          {/* Mobile View: Cards */}
          <div className="block sm:hidden space-y-2">
            {headers.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-card-elevated border border-border-subtle space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-cyan break-all">{h.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${h.required ? 'bg-status-error/15 text-status-error' : 'bg-card text-text-muted'}`}>
                    {h.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <p className="text-text-secondary text-[11px] leading-snug">{h.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-subtle bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Header</th>
                  <th className="py-2.5 px-4">Required</th>
                  <th className="py-2.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {headers.map((h, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4 font-bold text-brand-cyan">{h.name}</td>
                    <td className="py-3 px-4 text-text-muted">{h.required ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 text-text-secondary font-sans">{h.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Body Parameters Section: Responsive Mobile List & Desktop Table */}
      {bodyParams.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Request Body (JSON)</h4>

          {/* Mobile View: Cards */}
          <div className="block sm:hidden space-y-2">
            {bodyParams.map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-card-elevated border border-border-subtle space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-cyan">{p.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-card font-mono text-text-muted">{p.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.required ? 'bg-status-error/15 text-status-error' : 'bg-card text-text-muted'}`}>
                      {p.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                </div>
                <p className="text-text-secondary text-[11px] leading-snug">{p.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-subtle bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-card-elevated text-text-muted border-b border-border-subtle uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Field</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Required</th>
                  <th className="py-2.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {bodyParams.map((p, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4 font-bold text-brand-cyan">{p.name}</td>
                    <td className="py-3 px-4 text-text-muted">{p.type}</td>
                    <td className="py-3 px-4 text-text-muted">{p.required ? 'Yes' : 'Optional'}</td>
                    <td className="py-3 px-4 text-text-secondary font-sans">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Response Example */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Example 200 OK Response</h4>
        <pre className="p-3.5 sm:p-4 rounded-xl bg-[#0a0f1d] font-mono text-xs text-brand-cyan overflow-x-auto border border-border-subtle scrollbar-thin">
          <code>{JSON.stringify(responseExample, null, 2)}</code>
        </pre>
      </div>
    </Card>
  );
};
