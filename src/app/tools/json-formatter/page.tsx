"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Braces, Copy, FileCode, Check } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function JsonFormatterPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ size: '0 B', lines: 0 });

  const formatJson = (spaces: number) => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      setStats({ size: '0 B', lines: 0 });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutput(formatted);
      
      // Calculate real-time local statistics
      const bytes = new Blob([formatted]).size;
      const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} Bytes`;
      const lineCount = formatted.split('\n').length;
      
      setStats({ size: sizeStr, lines: lineCount });
    } catch (err: any) {
      setError(`Invalid JSON structure: ${err.message}`);
      setOutput('');
    }
  };

  const minifyJson = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStats({
        size: `${new Blob([minified]).size} Bytes`,
        lines: 1
      });
    } catch (err: any) {
      setError(`Invalid JSON structure: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleFaqs = [
    {
      question: "Why should I use this offline JSON formatter over other online tools?",
      answer: "Most tools send your pasted JSON data to a backend server for parsing, which can leak sensitive tokens, API responses, or user database records. This tool handles everything 100% locally in your browser workspace memory."
    },
    {
      question: "Does it detect trailing commas or missing escape brackets?",
      answer: "Yes. The system interceptor evaluates structural syntax instantly and prints the precise line offset error directly below your input grid to simplify code debugging."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "JSON Formatter & Validator"}
      description={overrideDescription || "Beautify, clean, lint, minify, and analyze raw JSON data structures instantly. Completely secure offline browser validation."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Input & Output Split Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Block */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Braces className="w-3.5 h-3.5 text-zinc-400" /> Raw JSON Input
              </label>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"id":1,"meta":{"status":"active"},"items":[true,false]}'
              className="font-mono text-sm p-4 h-72 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          {/* Output Block */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-zinc-400" /> Formatted Result
              </label>
              {output && (
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  {stats.size} | {stats.lines} lines
                </span>
              )}
            </div>
            <textarea
              readOnly
              value={output}
              placeholder='{\n  "id": 1,\n  "meta": {\n    "status": "active"\n  }\n}'
              className="font-mono text-sm p-4 h-72 bg-zinc-950/90 text-sky-400 rounded-lg border border-border focus:outline-none resize-none shadow-inner select-all"
            />
          </div>
        </div>

        {/* Catching Validation Strings */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs md:text-sm rounded-lg font-mono">
            {error}
          </div>
        )}

        {/* Toolbar Trigger Interfaces */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => formatJson(2)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm"
            >
              Beautify (2 Spaces)
            </button>
            <button
              onClick={() => formatJson(4)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm"
            >
              Beautify (4 Spaces)
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 border border-border font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm"
            >
              Minify / Compact
            </button>
          </div>

          {output && (
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}