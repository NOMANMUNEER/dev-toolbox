"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Database, Copy, Check } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function SqlFormatterPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tableName, setTableName] = useState('users');
  const [mode, setMode] = useState<'beautify' | 'json-to-sql'>('beautify');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text = input, currentMode = mode) => {
    setInput(text);
    setError('');

    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'beautify') {
        // Safe token-based regex rule to capitalize common SQL keywords cleanly
        const keywords = /\b(select|from|where|insert|into|values|update|set|delete|join|left|right|inner|outer|on|group|by|order|having|limit|and|or|as)\b/gi;
        let formatted = text.replace(keywords, (match) => match.toUpperCase());
        
        // Add minor alignment line breaks for readability before common keywords
        formatted = formatted.replace(/\b(FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|VALUES|SET)\b/g, '\n$1');
        setOutput(formatted.trim());
      } else {
        // Convert JSON arrays to SQL INSERT queries safely
        const parsed = JSON.parse(text.trim());
        const records = Array.isArray(parsed) ? parsed : [parsed];
        
        if (records.length === 0) {
          setOutput('-- Empty JSON array provided.');
          return;
        }

        const keys = Object.keys(records[0]);
        const columns = keys.map(k => `\`${k}\``).join(', ');
        
        const sqlRows = records.map(row => {
          const values = keys.map(key => {
            const val = row[key];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? '1' : '0';
            return val;
          }).join(', ');
          return `(${values})`;
        }).join(',\n');

        const insertScript = `INSERT INTO ${tableName.trim()} (${columns})\nVALUES\n${sqlRows};`;
        setOutput(insertScript);
      }
    } catch (err: any) {
      setError(currentMode === 'json-to-sql' ? 'Invalid JSON format. Provide an object or array of flat items.' : err.message);
      setOutput('');
    }
  };

  const toggleMode = (newMode: 'beautify' | 'json-to-sql') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleFaqs = [
    {
      question: "Can I generate production SQL insertion queries from my JSON arrays?",
      answer: "Yes. This utility maps data types cleanly, escapes quotes to prevent broken string sequences, and groups rows within a high-performance transactional batch layout."
    },
    {
      question: "Is my proprietary schema format safe using this local workspace tool?",
      answer: "Completely. Because the calculation pipeline functions 100% within your client browser instance, your table structures, keys, and values are never exposed across network domains."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "SQL Query Formatter & Generator"}
      description={overrideDescription || "Beautify cluttered database queries or transform local JSON payloads into safe, highly optimized SQL INSERT statements instantly inside your browser memory."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Toggle Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => toggleMode('beautify')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'beautify' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Beautify SQL Query
            </button>
            <button
              onClick={() => toggleMode('json-to-sql')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'json-to-sql' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              JSON to SQL Converter
            </button>
          </div>

          {mode === 'json-to-sql' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Target Table:</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => { setTableName(e.target.value); handleProcess(input); }}
                className="px-3 py-1 bg-zinc-950 text-xs text-zinc-100 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          )}
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === 'beautify' ? 'Raw SQL Query Input' : 'Source JSON Data'}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleProcess(e.target.value)}
              placeholder={mode === 'beautify' ? "select * from users where id = 10 group by role" : "[\n  { \"id\": 10, \"name\": \"Noman\", \"role\": \"Dev\" }\n]"}
              className="font-mono text-sm p-4 h-64 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated Output</label>
            <textarea
              readOnly
              value={output}
              placeholder={mode === 'beautify' ? "SELECT *\nFROM users\nWHERE id = 10\nGROUP BY role" : "INSERT INTO users (`id`, `name`, `role`)\nVALUES\n(10, 'Noman', 'Dev');"}
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
              {copied ? 'Copied!' : 'Copy Script Result'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}