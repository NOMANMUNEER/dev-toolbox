"use html"
"use client";

import React, { useState } from 'react';
import {Fingerprint,ScanSearch, Code2,Database,RefreshCw,Braces,Clock,Search, FileJson, ShieldAlert, Binary, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';

interface ToolItem {
  name: string;
  slug: string;
  description: string;
  category: 'Data Conversions' | 'Security & Auth' | 'Encoding utilities'|'Developer Utilities';
  icon: React.ReactNode;
  tags: string[];
}

const TOOL_DIRECTORY: ToolItem[] = [
  {
    name: "JSON to CSV Converter",
    slug: "/tools/json-to-csv",
    description: "Transform raw JSON arrays or structured configuration objects into spreadsheet-compatible CSV documents.",
    category: "Data Conversions",
    icon: <FileJson className="w-5 h-5 text-indigo-400" />,
    tags: ["json", "csv", "excel", "convert"]
  },
  {
    name: "JWT Decoder & Claims Inspector",
    slug: "/tools/jwt-decoder",
    description: "Inspect JSON Web Token headers, cryptographic payloads, expiration timelines, and claims safely on your device.",
    category: "Security & Auth",
    icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
    tags: ["jwt", "token", "decode", "auth"]
  },
  {
  name: "UUID Generator",
  slug: "/tools/uuid",
  description: "Generate RFC 4122 compliant UUIDs instantly. Supports v1, v4, and v5 with bulk export, format options, and code snippets for 9 languages.",
  category: "Developer Utilities",
  icon: <Fingerprint className="w-5 h-5 text-cyan-400" />,
  tags: ["uuid", "guid", "unique", "id", "generator", "v4", "random", "identifier"]
},
  {
    name: "Base64 Encoder & Decoder",
    slug: "/tools/base64",
    description: "Translate strings into standardized Base64 ASCII encoding schemas or switch encoded characters back to plain text.",
    category: "Encoding utilities",
    icon: <Binary className="w-5 h-5 text-violet-400" />,
    tags: ["base64", "encode", "decode", "string"]
  },
  // Place this inside the TOOL_DIRECTORY array inside src/app/page.tsx
{
  name: "Cron Expression Parser",
  slug: "/tools/cron-parser",
  description: "Decode complex cron expression configurations into plain-English runtime schedule formats instantly.",
  category: "Data Conversions",
  icon: <Clock className="w-5 h-5 text-emerald-400" />,
  tags: ["cron", "crontab", "schedule", "parse", "linux"]
},
// Insert directly into the TOOL_DIRECTORY array inside src/app/page.tsx
{
  name: "JSON Formatter & Pretty Printer",
  slug: "/tools/json-formatter",
  description: "Lint, organize, beautify, and compress raw JSON data payloads cleanly inside your local browser layout context.",
  category: "Data Conversions",
  icon: <Braces className="w-5 h-5 text-sky-400" />,
  tags: ["json", "formatter", "minify", "pretty", "reader"]
},
// Insert inside the TOOL_DIRECTORY array inside src/app/page.tsx
{
  name: "XML / CSV to JSON Cross-Converter",
  slug: "/tools/cross-converter",
  description: "Map tabular sheet layouts or legacy configuration tags into formatted JSON objects cleanly on your client desktop.",
  category: "Data Conversions",
  icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
  tags: ["xml", "csv", "excel", "json", "converter"]
},// Place into the TOOL_DIRECTORY array in src/app/page.tsx
{
  name: "SQL Formatter & Script Generator",
  slug: "/tools/sql-formatter",
  description: "Beautify raw relational query logs or map nested JSON variables directly into standard SQL insert strings safely.",
  category: "Data Conversions",
  icon: <Database className="w-5 h-5 text-violet-400" />,
  tags: ["json", "sql", "formatter", "beautify", "database"]
},// Append directly inside the TOOL_DIRECTORY matrix array in src/app/page.tsx
{
  name: "JSON to TypeScript Schema Generator",
  slug: "/tools/json-to-ts",
  description: "Recursively crawl sample JSON response data objects to produce strongly typed TypeScript interface models.",
  category: "Encoding utilities",
  icon: <Code2 className="w-5 h-5 text-sky-400" />,
  tags: ["json", "ts", "typescript", "interface", "type"]
},{
  name: "Regex Tester & Debugger",
  slug: "/tools/regex",
  description: "Test, debug, and validate regular expressions live with match highlighting, group extraction, and language-specific flag support.",
  category: "Developer Utilities",
  icon: <ScanSearch className="w-5 h-5 text-rose-400" />,
  tags: ["regex", "regexp", "pattern", "tester", "javascript", "python", "java", "debugger"]
}
];

export default function HomeDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOL_DIRECTORY.filter(tool => {
    const matchString = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
    return matchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Dynamic Background Mesh Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <header className="border-b border-border bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary via-violet-400 to-indigo-500 bg-clip-text text-transparent">
            DevToolbox<span className="text-foreground">.</span>
          </span>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full border border-border">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Driven Architecture
          </span>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="max-w-4xl mx-auto w-full px-4 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Phase 1 Live: Over 10+ Programmatic Slugs
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
          Fast, Lean Developer Tools.<br />
          <span className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Zero Tracking. Pure Performance.
          </span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          An open ecosystem of single-page developer utility blocks. Processes 100% locally on your computer—no server leaks, no high operational hosting overhead.
        </p>

        {/* Real-time Interactive Search Bar */}
        <div className="max-w-lg mx-auto relative group pt-4">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground pt-4">
            <Search className="w-4 h-4 group-focus-within:text-foreground transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools... (e.g., jwt, csv, base64)"
            className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-sm font-medium rounded-xl border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-border transition-all shadow-lg"
          />
        </div>
      </section>

      {/* Structured Utilities Directory Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 pb-20 flex-1">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No modular utility utilities match your filter parameter.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Categorized Slices dynamically mapping arrays */}
            {['Data Conversions', 'Security & Auth', 'Encoding utilities','Developer Utilities'].map((cat) => {
              const categoryItems = filteredTools.filter(i => i.category === cat);
              if (categoryItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1">
                    {cat}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((tool) => (
                      <a
                        key={tool.slug}
                        href={tool.slug}
                        className="group relative bg-card/40 hover:bg-card border border-border/80 hover:border-border p-5 rounded-xl flex flex-col justify-between transition-all hover:shadow-md shadow-sm overflow-hidden"
                      >
                        <div className="space-y-3">
                          <div className="w-9 h-9 bg-zinc-950 rounded-lg flex items-center justify-center border border-border/60">
                            {tool.icon}
                          </div>
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors flex items-center gap-1">
                            {tool.name}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-foreground pt-5 mt-auto transition-colors">
                          Open Utility <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Global Bottom Trust Anchors */}
      <section className="border-t border-border bg-muted/20 py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Compilation
            </h4>
            <p className="text-muted-foreground text-xs">Static compilation structures run directly in-memory safely.</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Absolute Compliance
            </h4>
            <p className="text-muted-foreground text-xs">No user values stream across third-party analytics networks.</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              &copy; {new Date().getFullYear()} DevToolbox
            </h4>
            <p className="text-muted-foreground text-xs">Built clean with Next.js App Router and Tailwind CSS.</p>
          </div>
        </div>
      </section>
    </div>
  );
}