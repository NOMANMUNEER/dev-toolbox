"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Code2, Copy, Check } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function JsonToTsPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('RootObject');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTsInterfaces = (jsonObj: any, baseName: string): string => {
    let interfaces: string[] = [];
    
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    const getType = (val: any, keyName: string): string => {
      if (val === null) return 'any';
      if (typeof val === 'string') return 'string';
      if (typeof val === 'number') return 'number';
      if (typeof val === 'boolean') return 'boolean';
      
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        const sampleElement = val[0];
        if (typeof sampleElement === 'object' && sampleElement !== null) {
          const nestedName = capitalize(keyName) + 'Item';
          parseObject(sampleElement, nestedName);
          return `${nestedName}[]`;
        }
        return `${typeof sampleElement}[]`;
      }
      
      if (typeof val === 'object') {
        const nestedName = capitalize(keyName);
        parseObject(val, nestedName);
        return nestedName;
      }
      
      return 'any';
    };

    const parseObject = (obj: any, name: string) => {
      let fields = '';
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const typeStr = getType(obj[key], key);
          // Handle keys with spaces or dashes cleanly
          const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          fields += `  ${validKey}: ${typeStr};\n`;
        }
      }
      
      const interfaceStr = `export interface ${name} {\n${fields}}`;
      // Prevent duplication of interface definitions
      if (!interfaces.some(i => i.startsWith(`export interface ${name} `))) {
        interfaces.push(interfaceStr);
      }
    };

    parseObject(jsonObj, capitalize(baseName));
    return interfaces.reverse().join('\n\n');
  };

  const handleConvert = (text = input, name = rootName) => {
    setInput(text);
    setError('');

    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(text.trim());
      const tsCode = generateTsInterfaces(parsed, name || 'RootObject');
      setOutput(tsCode);
    } catch (err: any) {
      setError('Invalid JSON format. Check for broken commas or unclosed brackets.');
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
      question: "How does the converter handle arrays of items?",
      answer: "The code looks at the first item of the array as a prototype sample. If it encounters a collection of nested objects, it will recursively generate a companion schema interface suffix named 'Item' for clean type safety."
    },
    {
      question: "Are my API secrets or payload data fields private using this web app?",
      answer: "Absolutely. The generation engine parses data completely locally inside your browser virtual memory stream. No analytical reporting tracking is performed on your raw text inputs."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "JSON to TypeScript Interface Converter"}
      description={overrideDescription || "Instantly transform any valid JSON response payload into a type-safe, strongly declared collection of TypeScript interfaces code blocks local to your machine."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Workspace Configurations */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wider">Root Interface Name:</label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => { setRootName(e.target.value); handleConvert(input, e.target.value); }}
              placeholder="RootObject"
              className="px-3 py-1.5 bg-zinc-950 text-sm font-mono text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/45"
            />
          </div>
        </div>

        {/* Editor Split Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source JSON Data Payload</label>
            <textarea
              value={input}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder={'{\n  "userId": 101,\n  "username": "nom_dev",\n  "isActive": true,\n  "profile": {\n    "avatarUrl": "https://img.link"\n  }\n}'}
              className="font-mono text-sm p-4 h-64 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated TypeScript Interfaces</label>
            <textarea
              readOnly
              value={output}
              placeholder={"export interface Profile {\n  avatarUrl: string;\n}\n\nexport interface RootObject {\n  userId: number;\n  username: string;\n  isActive: boolean;\n  profile: Profile;\n}"}
              className="font-mono text-sm p-4 h-64 bg-zinc-950/90 text-sky-400 rounded-lg border border-border focus:outline-none resize-none shadow-inner select-all"
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
              {copied ? 'Copied!' : 'Copy Code Output'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}