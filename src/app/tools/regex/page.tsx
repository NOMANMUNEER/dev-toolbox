"use client";

import React, { useState, useCallback } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

type Language = 'javascript' | 'python' | 'java' | 'php' | 'csharp' | 'go' | 'ruby' | 'nginx';

const LANGUAGE_FLAGS: Record<Language, { label: string; flags: string[] }> = {
  javascript: { label: 'JavaScript', flags: ['g', 'i', 'm', 's', 'u'] },
  python:     { label: 'Python',     flags: ['I', 'M', 'S', 'X'] },
  java:       { label: 'Java',       flags: ['CASE_INSENSITIVE', 'MULTILINE', 'DOTALL'] },
  php:        { label: 'PHP',        flags: ['i', 'm', 's', 'x'] },
  csharp:     { label: 'C#',         flags: ['IgnoreCase', 'Multiline', 'Singleline'] },
  go:         { label: 'Go',         flags: ['i', 'm', 's'] },
  ruby:       { label: 'Ruby',       flags: ['i', 'm', 'x'] },
  nginx:      { label: 'Nginx',      flags: ['i'] },
};

const JS_FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];

const FLAG_DESCRIPTIONS: Record<string, string> = {
  g: 'Global — find all matches',
  i: 'Case insensitive',
  m: 'Multiline — ^ and $ match line start/end',
  s: 'Dotall — dot matches newline',
  u: 'Unicode mode',
  y: 'Sticky — match from lastIndex',
};

const sampleFaqs = [
  {
    question: "What is the difference between a regex tester and a regex debugger?",
    answer: "A tester checks if your pattern matches a string and shows results. A debugger steps through the matching process to show why a pattern succeeds or fails at each character position."
  },
  {
    question: "Why does my JavaScript regex work differently than Python?",
    answer: "Each language implements its own regex engine with subtle differences in syntax, flag names, and supported features like lookaheads, named groups, and Unicode handling."
  },
  {
    question: "How do I test an Nginx location block regex?",
    answer: "Nginx uses PCRE syntax. The case-insensitive flag (~*) maps to the 'i' flag. Use this tool with Nginx mode selected and test your location path patterns safely."
  },
  {
    question: "What does the 'g' global flag do in JavaScript regex?",
    answer: "The global flag tells the engine to find every match in the string instead of stopping at the first one. Without it, only the first match is returned."
  }
];

export default function RegexPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [pattern, setPattern]       = useState('');
  const [testString, setTestString] = useState('');
  const [language, setLanguage]     = useState<Language>('javascript');
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(['g', 'i']));
  const [copied, setCopied]         = useState(false);
  const [error, setError]           = useState('');

  const toggleFlag = (flag: string) => {
    setActiveFlags(prev => {
      const next = new Set(prev);
      next.has(flag) ? next.delete(flag) : next.add(flag);
      return next;
    });
  };

  const getMatches = useCallback(() => {
    if (!pattern || !testString) return { matches: [], highlighted: '', groups: [] };
    setError('');
    try {
      // Always run with JS regex engine; apply 'g' for all matches
      const jsFlags = Array.from(activeFlags).filter(f => JS_FLAGS.includes(f)).join('');
      const flagStr = jsFlags.includes('g') ? jsFlags : jsFlags + 'g';
      const re = new RegExp(pattern, flagStr);
      const matches: RegExpExecArray[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(testString)) !== null) {
        matches.push(m);
        if (!flagStr.includes('g')) break;
      }

      // Build highlighted HTML
      let highlighted = '';
      let cursor = 0;
      const colors = ['bg-violet-500/30 border-b border-violet-400', 'bg-sky-500/30 border-b border-sky-400', 'bg-emerald-500/30 border-b border-emerald-400'];
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        highlighted += escapeHtml(testString.slice(cursor, match.index));
        highlighted += `<mark class="${colors[i % colors.length]} px-0.5 rounded-sm" title="Match ${i + 1}: ${escapeHtml(match[0])}">${escapeHtml(match[0])}</mark>`;
        cursor = match.index! + match[0].length;
      }
      highlighted += escapeHtml(testString.slice(cursor));

      const groups = matches.flatMap((match, mi) =>
        match.slice(1).map((g, gi) => ({ match: mi + 1, group: gi + 1, value: g ?? 'undefined' }))
      );

      return { matches, highlighted, groups };
    } catch (e: any) {
      setError(e.message);
      return { matches: [], highlighted: escapeHtml(testString), groups: [] };
    }
  }, [pattern, testString, activeFlags]);

  const { matches, highlighted, groups } = getMatches();

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${Array.from(activeFlags).join('')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableFlags = LANGUAGE_FLAGS[language]?.flags ?? JS_FLAGS;

  return (
    <ToolLayout
      title={overrideTitle || "Regex Tester & Debugger"}
      description={overrideDescription || "Test, debug, and validate regular expressions live with match highlighting, group extraction, and multi-language flag support. 100% client-side — no data leaves your browser."}
      faqs={sampleFaqs}
    >
      <div className="space-y-5">

        {/* Language Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language / Engine</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LANGUAGE_FLAGS) as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setActiveFlags(new Set(['g', 'i'])); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  language === lang
                    ? 'bg-violet-600 border-violet-500 text-white shadow-sm shadow-violet-900'
                    : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-zinc-600'
                }`}
              >
                {LANGUAGE_FLAGS[lang].label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Regex Pattern</label>
          <div className="flex items-center gap-0">
            <span className="px-3 py-3 bg-zinc-900 border border-r-0 border-border rounded-l-lg text-muted-foreground font-mono text-sm select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
              className="flex-1 font-mono text-sm px-3 py-3 bg-zinc-950 text-violet-300 border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-zinc-700"
            />
            <span className="px-3 py-3 bg-zinc-900 border border-l-0 border-r-0 border-border text-muted-foreground font-mono text-sm select-none">/</span>
            <span className="px-3 py-3 bg-zinc-900 border border-l-0 border-border rounded-r-lg text-emerald-400 font-mono text-sm select-none min-w-[3rem]">
              {Array.from(activeFlags).filter(f => availableFlags.includes(f) || JS_FLAGS.includes(f)).join('')}
            </span>
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flags</label>
          <div className="flex flex-wrap gap-2">
            {JS_FLAGS.map(flag => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                title={FLAG_DESCRIPTIONS[flag]}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-md border transition-all ${
                  activeFlags.has(flag)
                    ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
                    : 'bg-muted border-border text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {flag}
                <span className="ml-1.5 font-sans font-normal text-[10px] opacity-60">{FLAG_DESCRIPTIONS[flag]?.split('—')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Test String */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test String</label>
          <textarea
            value={testString}
            onChange={e => setTestString(e.target.value)}
            placeholder={"Paste your test string here...\nuser@example.com\ncontact@devtoolbox.io"}
            rows={5}
            className="w-full font-mono text-sm p-4 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-800/40 text-red-400 text-xs rounded-lg font-mono">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Match Highlight Output */}
        {testString && pattern && !error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Match Visualization
                <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-900/50 border border-violet-700 text-violet-300 text-[10px]">
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </span>
              </label>
              <button
                onClick={copyPattern}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-border hover:border-zinc-600"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy pattern'}
              </button>
            </div>
            <div
              className="font-mono text-sm p-4 bg-zinc-950/80 rounded-lg border border-border leading-relaxed whitespace-pre-wrap break-all text-zinc-300"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        {/* Match Details */}
        {matches.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Match Details</label>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-zinc-900 border-b border-border">
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">#</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Match</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Index</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-2 text-zinc-600">{i + 1}</td>
                      <td className="px-4 py-2 text-violet-300 max-w-[200px] truncate">{m[0]}</td>
                      <td className="px-4 py-2 text-sky-400">{m.index}</td>
                      <td className="px-4 py-2 text-emerald-400">{m[0].length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Capture Groups */}
        {groups.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capture Groups</label>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-zinc-900 border-b border-border">
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Match</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Group</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-2 text-zinc-600">{g.match}</td>
                      <td className="px-4 py-2 text-amber-400">Group {g.group}</td>
                      <td className="px-4 py-2 text-emerald-300">{g.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}