"use client";

import { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import Papa from 'papaparse';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function JsonToCsvPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(input);
      const jsonArray = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
      const csv = Papa.unparse(jsonArray);
      setOutput(csv);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format. Please check your structure.');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const sampleFaqs = [
    {
      question: `How does the browser handle ${overrideTitle || 'JSON to CSV'} modifications?`,
      answer:
        'All calculation work occurs entirely on your device local storage sandbox. No string streams cross outside network connections.',
    },
    {
      question: 'Can I use file-based inputs instead of text arrays?',
      answer:
        'Yes, copying and pasting data structures directly provides low memory footprints and reduces load latency constraints completely.',
    },
  ];

  return (
    <ToolLayout
      title={overrideTitle || 'JSON to CSV Converter'}
      description={
        overrideDescription ||
        'Transform JSON data structures into clean, standard CSV formats instantaneously inside your browser. Safe, localized, and ready for spreadsheet use.'
      }
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paste JSON Data</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='[\n  {"id": 1, "name": "Alice", "role": "Dev"},\n  {"id": 2, "name": "Bob", "role": "Designer"}\n]'
              className="font-mono text-sm p-4 h-64 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated CSV Output</label>
            <textarea
              readOnly
              value={output}
              placeholder="id,name,role&#10;1,Alice,Dev&#10;2,Bob,Designer"
              className="font-mono text-sm p-4 h-64 bg-zinc-950/90 text-emerald-400 rounded-lg border border-border focus:outline-none resize-none shadow-inner select-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg font-medium">
            Error: {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleConvert}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            Run Conversion
          </button>

          {output && (
            <button
              onClick={copyToClipboard}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              Copy CSV Data
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
