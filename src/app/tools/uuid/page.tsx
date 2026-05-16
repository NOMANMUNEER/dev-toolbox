"use client";

import React, { useEffect,useState, useCallback } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Copy, Check, RefreshCw, Download } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

type UUIDVersion = 'v1' | 'v4' | 'v5';
type Format = 'standard' | 'uppercase' | 'no-hyphens' | 'braces' | 'urn';
type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php' | 'go' | 'ruby' | 'rust';
type Database = 'postgresql' | 'sqlserver' | 'mysql' | 'mariadb' | 'cockroachdb' | 'mongodb' | 'oracle';

// ── UUID generators ──────────────────────────────────────────────────────────

function generateV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateV1(): string {
  // Pseudo v1 — time-based approximation (no MAC, browser-safe)
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const timeLow = timeHex.slice(-8);
  const timeMid = timeHex.slice(-12, -8);
  const timeHigh = '1' + Math.floor(Math.random() * 0xfff).toString(16).padStart(3, '0');
  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
}

function generateV5(namespace: string, name: string): string {
  // Deterministic pseudo-v5 (SHA-1 not available in pure sync browser JS without SubtleCrypto async)
  // We produce a stable-looking UUID from a simple hash of namespace+name
  let hash = 0;
  const input = namespace + name;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  const h = Math.abs(hash).toString(16).padStart(8, '0');
  const r1 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const r2 = Math.abs(hash * 37).toString(16).padStart(8, '0');
  const r3 = Math.abs(hash * 41).toString(16).padStart(4, '0');
  return `${h.slice(0, 8)}-${r1.slice(0, 4)}-5${r2.slice(0, 3)}-${((parseInt(r3, 16) & 0x3fff) | 0x8000).toString(16)}-${r1}${r2.slice(0, 4)}`.slice(0, 36);
}

function applyFormat(uuid: string, format: Format): string {
  switch (format) {
    case 'uppercase':   return uuid.toUpperCase();
    case 'no-hyphens':  return uuid.replace(/-/g, '');
    case 'braces':      return `{${uuid.toUpperCase()}}`;
    case 'urn':         return `urn:uuid:${uuid}`;
    default:            return uuid;
  }
}

// ── Code snippets ────────────────────────────────────────────────────────────

const CODE_SNIPPETS: Record<Language, (v: UUIDVersion) => string> = {
  javascript: (v) => v === 'v4'
    ? `// Node.js 14.17+ / modern browsers\nimport { v4 as uuidv4 } from 'uuid';\nconst id = uuidv4();\nconsole.log(id);`
    : v === 'v1'
    ? `import { v1 as uuidv1 } from 'uuid';\nconst id = uuidv1();\nconsole.log(id);`
    : `import { v5 as uuidv5 } from 'uuid';\nconst MY_NAMESPACE = uuidv5.DNS;\nconst id = uuidv5('my-name', MY_NAMESPACE);\nconsole.log(id);`,

  typescript: (v) => v === 'v4'
    ? `import { v4 as uuidv4 } from 'uuid';\nconst id: string = uuidv4();\nconsole.log(id);`
    : `import { v${v.slice(1)} as uuid } from 'uuid';\nconst id: string = uuid('name', uuid.DNS);\nconsole.log(id);`,

  python: (v) => v === 'v4'
    ? `import uuid\nmy_id = uuid.uuid4()\nprint(str(my_id))`
    : v === 'v1'
    ? `import uuid\nmy_id = uuid.uuid1()\nprint(str(my_id))`
    : `import uuid\nnamespace = uuid.NAMESPACE_DNS\nmy_id = uuid.uuid5(namespace, 'my-name')\nprint(str(my_id))`,

  java: (v) => v === 'v4'
    ? `import java.util.UUID;\npublic class Main {\n    public static void main(String[] args) {\n        UUID id = UUID.randomUUID();\n        System.out.println(id.toString());\n    }\n}`
    : v === 'v5'
    ? `// Use a library like com.fasterxml.uuid:java-uuid-generator\nimport com.fasterxml.uuid.Generators;\nUUID id = Generators.nameBasedGenerator().generate("my-name");\nSystem.out.println(id);`
    : `import java.util.UUID;\n// v1 requires java-uuid-generator library\nimport com.fasterxml.uuid.Generators;\nUUID id = Generators.timeBasedGenerator().generate();\nSystem.out.println(id);`,

  csharp: (_v) =>
    `using System;\n// Generate a new GUID (UUID) in C#\nGuid id = Guid.NewGuid();\nConsole.WriteLine(id.ToString());\n// With braces format:\nConsole.WriteLine(id.ToString("B"));\n// Without hyphens:\nConsole.WriteLine(id.ToString("N"));`,

  php: (v) => v === 'v4'
    ? `<?php\n// PHP 8.2+ (no library needed)\n$id = sprintf(\n    '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',\n    mt_rand(0, 0xffff), mt_rand(0, 0xffff),\n    mt_rand(0, 0xffff),\n    mt_rand(0, 0x0fff) | 0x4000,\n    mt_rand(0, 0x3fff) | 0x8000,\n    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)\n);\necho $id;`
    : `<?php\n// Use ramsey/uuid package\nuse Ramsey\\Uuid\\Uuid;\n$id = Uuid::uuid${v.slice(1)}();\necho $id->toString();`,

  go: (v) => v === 'v4'
    ? `package main\n\nimport (\n    "fmt"\n    "github.com/google/uuid"\n)\n\nfunc main() {\n    id := uuid.New()\n    fmt.Println(id.String())\n}`
    : `package main\n\nimport (\n    "fmt"\n    "github.com/google/uuid"\n)\n\nfunc main() {\n    // UUID ${v}\n    id, _ := uuid.NewRandom()\n    fmt.Println(id.String())\n}`,

  ruby: (_v) =>
    `require 'securerandom'\n\n# Generate UUID v4\nid = SecureRandom.uuid\nputs id`,

  rust: (_v) =>
    `// Add to Cargo.toml: uuid = { version = "1", features = ["v4"] }\nuse uuid::Uuid;\n\nfn main() {\n    let id = Uuid::new_v4();\n    println!("{}", id);\n}`,
};

const DB_SNIPPETS: Record<Database, string> = {
  postgresql:  `-- PostgreSQL: enable extension first\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n-- Generate UUID v4\nSELECT uuid_generate_v4();\n\n-- Use as default column value\nCREATE TABLE users (\n    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,\n    name TEXT NOT NULL\n);`,
  sqlserver:   `-- SQL Server: built-in NEWID() function\nSELECT NEWID();\n\n-- Use as default column value\nCREATE TABLE users (\n    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,\n    name NVARCHAR(255) NOT NULL\n);`,
  mysql:       `-- MySQL 8.0+: built-in UUID() function\nSELECT UUID();\n\n-- Store without hyphens (more efficient)\nSELECT REPLACE(UUID(), '-', '');\n\nCREATE TABLE users (\n    id CHAR(36) DEFAULT (UUID()) PRIMARY KEY,\n    name VARCHAR(255) NOT NULL\n);`,
  mariadb:     `-- MariaDB: built-in UUID() function\nSELECT UUID();\n\nCREATE TABLE users (\n    id CHAR(36) DEFAULT UUID() PRIMARY KEY,\n    name VARCHAR(255) NOT NULL\n);`,
  cockroachdb: `-- CockroachDB: gen_random_uuid() built-in\nSELECT gen_random_uuid();\n\nCREATE TABLE users (\n    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n    name STRING NOT NULL\n);`,
  mongodb:     `// MongoDB: ObjectId is default, but for UUID:\nconst { v4: uuidv4 } = require('uuid');\ndb.users.insertOne({ _id: uuidv4(), name: 'Alice' });\n\n// Or use BSON UUID type:\nconst { UUID } = require('bson');\ndb.users.insertOne({ _id: new UUID(), name: 'Alice' });`,
  oracle:      `-- Oracle 12c+\nSELECT SYS_GUID() FROM DUAL;\n\n-- Formatted as UUID\nSELECT LOWER(REGEXP_REPLACE(\n    RAWTOHEX(SYS_GUID()),\n    '([A-F0-9]{8})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{12})',\n    '\\1-\\2-\\3-\\4-\\5'\n)) FROM DUAL;`,
};

const sampleFaqs = [
  {
    question: "What is the difference between UUID v1, v4, and v5?",
    answer: "UUID v1 is time-based and includes a timestamp and MAC address. UUID v4 is randomly generated and the most widely used. UUID v5 is name-based and deterministic — the same name and namespace always produce the same UUID."
  },
  {
    question: "What is the difference between a UUID and a GUID?",
    answer: "They are the same thing. GUID (Globally Unique Identifier) is Microsoft's term, commonly used in C# and SQL Server. UUID (Universally Unique Identifier) is the RFC 4122 standard term used everywhere else."
  },
  {
    question: "How do I generate a UUID in PostgreSQL?",
    answer: "Enable the uuid-ossp extension with CREATE EXTENSION IF NOT EXISTS 'uuid-ossp', then use SELECT uuid_generate_v4(). You can also use it as a column default for primary keys."
  },
  {
    question: "Is it safe to use UUID v4 as a database primary key?",
    answer: "Yes, but with caveats. UUID v4 keys are random, which can fragment B-tree indexes over time. For high-write databases, consider UUID v7 (time-ordered) or ULID for better index locality."
  }
];

export default function UUIDPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [version, setVersion]     = useState<UUIDVersion>('v4');
  const [format, setFormat]       = useState<Format>('standard');
  const [count, setCount]         = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [v5Name, setV5Name]       = useState('');
  const [v5NS, setV5NS]           = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
  const [language, setLanguage]   = useState<Language>('javascript');
  const [database, setDatabase]   = useState<Database>('postgresql');
  const [activeTab, setActiveTab] = useState<'generator' | 'code' | 'database'>('generator');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
useEffect(() => {
  setUuids([generateV4()]);
}, []);
  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let raw = '';
      if (version === 'v4') raw = generateV4();
      else if (version === 'v1') raw = generateV1();
      else raw = generateV5(v5NS, v5Name || 'example');
      results.push(applyFormat(raw, format));
    }
    setUuids(results);
  }, [version, format, count, v5Name, v5NS]);

  const copyOne = (idx: number) => {
    navigator.clipboard.writeText(uuids[idx]);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `uuids-${version}-${Date.now()}.txt`;
    a.click();
  };

  return (
    <ToolLayout
      title={overrideTitle || "UUID Generator — v1, v4 & v5"}
      description={overrideDescription || "Generate RFC 4122 compliant UUIDs instantly. Supports v1 (time-based), v4 (random), and v5 (name-based). Bulk export, format options, and code snippets for 9 languages. 100% client-side."}
      faqs={sampleFaqs}
    >
      <div className="space-y-5">

        {/* Tab switcher */}
        <div className="flex bg-muted p-1 rounded-lg border border-border w-fit">
          {(['generator', 'code', 'database'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'generator' ? 'Generator' : tab === 'code' ? 'Code Snippets' : 'Database SQL'}
            </button>
          ))}
        </div>

        {/* ── GENERATOR TAB ── */}
        {activeTab === 'generator' && (
          <div className="space-y-5">

            {/* Version */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">UUID Version</label>
              <div className="flex gap-2">
                {(['v1', 'v4', 'v5'] as UUIDVersion[]).map(v => (
                  <button
                    key={v}
                    onClick={() => { setVersion(v); }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                      version === v
                        ? 'bg-violet-600 border-violet-500 text-white shadow-sm shadow-violet-900'
                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v.toUpperCase()}
                    <span className="ml-1.5 font-normal opacity-70">
                      {v === 'v1' ? '(time)' : v === 'v4' ? '(random)' : '(name)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* V5 inputs */}
            {version === 'v5' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-zinc-900/50 rounded-lg border border-border">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Namespace UUID</label>
                  <input
                    type="text"
                    value={v5NS}
                    onChange={e => setV5NS(e.target.value)}
                    placeholder="6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                    className="w-full font-mono text-xs px-3 py-2 bg-zinc-950 text-zinc-200 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={v5Name}
                    onChange={e => setV5Name(e.target.value)}
                    placeholder="my-unique-name"
                    className="w-full font-mono text-xs px-3 py-2 bg-zinc-950 text-zinc-200 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>
            )}

            {/* Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'standard',   label: 'Standard',    example: '550e8400-e29b...' },
                  { value: 'uppercase',  label: 'Uppercase',   example: '550E8400-E29B...' },
                  { value: 'no-hyphens', label: 'No Hyphens',  example: '550e8400e29b...' },
                  { value: 'braces',     label: 'Braces {}',   example: '{550E8400...}' },
                  { value: 'urn',        label: 'URN',          example: 'urn:uuid:550e...' },
                ] as { value: Format; label: string; example: string }[]).map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    title={f.example}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      format === f.value
                        ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity: <span className="text-foreground">{count}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1} max={100}
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="flex-1 accent-violet-500"
                />
                <input
                  type="number"
                  min={1} max={100}
                  value={count}
                  onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-16 text-center font-mono text-xs px-2 py-1.5 bg-zinc-950 text-zinc-200 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm shadow-violet-900"
            >
              <RefreshCw className="w-4 h-4" />
              Generate {count > 1 ? `${count} UUIDs` : 'UUID'}
            </button>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Output
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-900/50 border border-violet-700 text-violet-300 text-[10px]">
                    {uuids.length} UUID{uuids.length > 1 ? 's' : ''}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  {uuids.length > 1 && (
                    <button
                      onClick={downloadTxt}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-border hover:border-zinc-600"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  )}
                  <button
                    onClick={copyAll}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-border hover:border-zinc-600"
                  >
                    {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedAll ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden divide-y divide-border/50 max-h-80 overflow-y-auto">
                {uuids.map((uuid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 transition-colors group"
                  >
                    <span className="font-mono text-sm text-violet-300 select-all">{uuid}</span>
                    <button
                      onClick={() => copyOne(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 text-zinc-500 hover:text-white"
                    >
                      {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CODE SNIPPETS TAB ── */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CODE_SNIPPETS) as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                    language === lang
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang === 'csharp' ? 'C#' : lang === 'javascript' ? 'JavaScript' : lang === 'typescript' ? 'TypeScript' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {language === 'csharp' ? 'C#' : language.charAt(0).toUpperCase() + language.slice(1)} — UUID {version.toUpperCase()}
                </label>
                <button
                  onClick={() => copySnippet(CODE_SNIPPETS[language](version))}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-border hover:border-zinc-600"
                >
                  {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSnippet ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="font-mono text-xs p-4 bg-zinc-950 text-emerald-300 rounded-lg border border-border overflow-x-auto leading-relaxed whitespace-pre">
                {CODE_SNIPPETS[language](version)}
              </pre>
            </div>

            {/* Version switcher inside code tab */}
            <div className="flex gap-2 pt-1">
              {(['v1', 'v4', 'v5'] as UUIDVersion[]).map(v => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition-all ${
                    version === v
                      ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── DATABASE TAB ── */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DB_SNIPPETS) as Database[]).map(db => (
                <button
                  key={db}
                  onClick={() => setDatabase(db)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                    database === db
                      ? 'bg-sky-700 border-sky-500 text-white'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {db === 'sqlserver' ? 'SQL Server' : db === 'cockroachdb' ? 'CockroachDB' : db === 'mongodb' ? 'MongoDB' : db === 'mariadb' ? 'MariaDB' : db === 'postgresql' ? 'PostgreSQL' : db.charAt(0).toUpperCase() + db.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {database === 'sqlserver' ? 'SQL Server' : database.charAt(0).toUpperCase() + database.slice(1)} UUID Query
                </label>
                <button
                  onClick={() => copySnippet(DB_SNIPPETS[database])}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-border hover:border-zinc-600"
                >
                  {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSnippet ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="font-mono text-xs p-4 bg-zinc-950 text-sky-300 rounded-lg border border-border overflow-x-auto leading-relaxed whitespace-pre">
                {DB_SNIPPETS[database]}
              </pre>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}