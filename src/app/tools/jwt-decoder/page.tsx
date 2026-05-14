"use client";

import { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

interface StatusState {
  type: 'idle' | 'success' | 'error';
  message: string;
}

export default function JwtDecoderPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [status, setStatus] = useState<StatusState>({ type: 'idle', message: '' });

  const setErrorState = (msg: string) => {
    setHeader('');
    setPayload('');
    setStatus({ type: 'error', message: msg });
  };

  const handleDecode = (rawToken: string) => {
    setToken(rawToken);
    const cleanToken = rawToken.trim();

    if (!cleanToken) {
      setHeader('');
      setPayload('');
      setStatus({ type: 'idle', message: '' });
      return;
    }

    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      setErrorState('Invalid JWT format. A valid JSON Web Token must contain exactly 3 sections separated by dots.');
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));

      if (decodedPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > decodedPayload.exp) {
          setStatus({
            type: 'error',
            message: `Token parsed successfully but expired on ${new Date(decodedPayload.exp * 1000).toLocaleString()}`,
          });
          return;
        }
      }

      setStatus({ type: 'success', message: 'Token structural payload parsed cleanly.' });
    } catch (err) {
      setErrorState('Failed to decode token segments. Please confirm string is base64 encoded properly.');
    }
  };

  const sampleFaqs = [
    {
      question: 'Is it safe to paste live production tokens into this JWT decoder?',
      answer:
        'Yes. Unlike generic web utilities, this decoder operates completely client-side in your secure browser instance. The data is parsed directly in your runtime memory and never sent over the internet.',
    },
    {
      question: 'Does this tool verify the cryptographic signature?',
      answer:
        'This tool is a frontend decoder meant for reading payload properties quickly. Cryptographic signature verification requires checking against your private key or public JWKS endpoint on a backend server system.',
    },
  ];

  return (
    <ToolLayout
      title={overrideTitle || 'JWT Decoder & Verifier'}
      description={
        overrideDescription ||
        'Decode JSON Web Tokens safely on your local client machine. Inspect token headers, algorithmic configurations, expiration data, and core payload claims instantly.'
      }
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Encoded JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ..."
            className="font-mono text-xs md:text-sm p-4 h-28 bg-zinc-950 text-amber-500 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner tracking-tight break-all"
          />
        </div>

        {status.type !== 'idle' && (
          <div
            className={`p-3 border rounded-lg text-sm font-medium flex items-center gap-2 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header (Algorithm & Type)</label>
            <div className="font-mono text-sm p-4 h-56 bg-zinc-950/90 text-red-400 rounded-lg border border-border overflow-y-auto whitespace-pre">
              {header || '// Decode a token to view headers'}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payload (Data Claims)</label>
            <div className="font-mono text-sm p-4 h-56 bg-zinc-950/90 text-cyan-400 rounded-lg border border-border overflow-y-auto whitespace-pre">
              {payload || '// Decode a token to view payload claims'}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
