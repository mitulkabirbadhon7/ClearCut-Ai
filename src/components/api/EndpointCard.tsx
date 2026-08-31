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
    <Card variant="default" className="p-6 sm:p-8 space-y-6 border-border-subtle shadow-lg">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={method === 'POST' ? 'gradient' : method === 'GET' ? 'success' : 'outline'}
            size="md"
          >
            {method}
          </Badge>
          <span className="font-mono text-sm sm:text-base font-bold text-text-primary">{path}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-text-primary">{title}</h3>
        <p className="text-xs sm:text-sm text-text-secondary">{description}</p>
      </div>

      {/* Headers Table */}
      {headers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Request Headers</h4>
          <div className="overflow-x-auto rounded-xl border border-border-subtle bg-card">
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

      {/* Body Parameters Table */}
      {bodyParams.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Request Body (JSON)</h4>
          <div className="overflow-x-auto rounded-xl border border-border-subtle bg-card">
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
        <pre className="p-4 rounded-xl bg-[#0a0f1d] font-mono text-xs text-brand-cyan overflow-x-auto border border-border-subtle">
          <code>{JSON.stringify(responseExample, null, 2)}</code>
        </pre>
      </div>
    </Card>
  );
};
