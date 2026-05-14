"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { ShieldCheck, Copy, Check, RefreshCw } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function Base64Page({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [autoFixPadding, setAutoFixPadding] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text: string, currentMode = mode, urlSafe = isUrlSafe) => {
    setInput(text);
    setError('');

    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        // Universal UTF-8 safe base64 encoding strategy
        let encoded = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));

        if (urlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setOutput(encoded);
      } else {
        let cleanText = text.trim();
        
        // Handle URL-safe decoding variants
        cleanText = cleanText.replace(/-/g, '+').replace(/_/g, '/');

        // Fix invalid Base64 padding automatically if requested (common in AWS Lambda logs)
        if (autoFixPadding) {
          while (cleanText.length % 4) {
            cleanText += '=';
          }
        }

        // Universal UTF-8 safe base64 decoding strategy
        const decoded = decodeURIComponent(atob(cleanText).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setOutput(decoded);
      }
    } catch (err) {
      if (currentMode === 'decode') {
        setError('Invalid Base64 string framework configuration. Check character bits or padding alignment.');
      } else {
        setError('Failed to process string execution data.');
      }
      setOutput('');
    }
  };

  const toggleMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    if (output && !error) {
      const oldOutput = output;
      handleProcess(oldOutput, newMode, isUrlSafe);
    } else {
      handleProcess(input, newMode, isUrlSafe);
    }
  };

  const handleUrlSafeToggle = (checked: boolean) => {
    setIsUrlSafe(checked);
    handleProcess(input, mode, checked);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleFaqs = [
    {
      question: "What causes an 'Invalid Base64 Padding' error in AWS Lambda or API Gateway?",
      answer: "Systems often strip the trailing equals signs (=) from Base64 encoded outputs to clean up text payloads. Turning on our 'Auto-Fix Padding' switch automatically appends missing block bits to guarantee a clean decode cycle."
    },
    {
      question: "What is the difference between standard Base64 and URL-Safe Base64?",
      answer: "Standard encoding uses the plus (+) and forward-slash (/) symbols, which break browser URL fields. URL-safe replacements substitute them with dashes (-) and underscores (_) to keep link queries clean."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "Base64 Enterprise Encoder & Decoder"}
      description={overrideDescription || "Convert raw text inputs into clean Base64 format representations, or parse complex system bit configurations safely. Configured for high-volume developer platforms."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Workspace Configurations */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => toggleMode('encode')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'encode' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Encode Mode
            </button>
            <button
              onClick={() => toggleMode('decode')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'decode' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Decode Mode
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {mode === 'encode' ? (
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium">
                <input
                  type="checkbox"
                  checked={isUrlSafe}
                  onChange={(e) => handleUrlSafeToggle(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary/40"
                />
                URL-Safe Encoding (- and _)
              </label>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium">
                <input
                  type="checkbox"
                  checked={autoFixPadding}
                  onChange={(e) => { setAutoFixPadding(e.target.checked); setOutput(''); setInput(''); }}
                  className="rounded border-border text-primary focus:ring-primary/40"
                />
                Auto-Fix Missing Padding (==)
              </label>
            )}
          </div>
        </div>

        {/* Input/Output Workspace panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === 'encode' ? 'Raw UTF-8 String Data' : 'Base64 Hash / URL String Input'}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleProcess(e.target.value)}
              placeholder={mode === 'encode' ? 'Paste clean API payload keys or configuration files here...' : 'YWhyMGNobXM2bHk5amNtbDJaUzVuYjI5bmIyeGxkeTVqYjIwdmRHOXM='}
              className="font-mono text-sm p-4 h-64 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Processed Transformation Output</label>
            <textarea
              readOnly
              value={output}
              placeholder={mode === 'encode' ? 'Resulting hash values will render here...' : 'Plain text human-readable string values...'}
              className="font-mono text-sm p-4 h-64 bg-zinc-950/90 text-violet-400 rounded-lg border border-border focus:outline-none resize-none shadow-inner select-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs md:text-sm rounded-lg font-mono">
            Error: {error}
          </div>
        )}

        {output && (
          <div className="pt-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy String Output'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}