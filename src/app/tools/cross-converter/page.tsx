"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { RefreshCw, Copy, Check } from 'lucide-react';
import Papa from 'papaparse';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

type ConvertMode = 'xml-to-json' | 'csv-to-json';

export default function CrossConverterPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConvertMode>('csv-to-json');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const parseXmlToJson = (xmlString: string): string => {
    // Client-side lightweight native XML parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Check for XML parsing errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      throw new Error(parseError[0].textContent || "Invalid XML syntax format.");
    }

    const elementToObject = (element: Element): any => {
      const obj: any = {};
      
      // Handle attributes
      if (element.attributes.length > 0) {
        obj["_attributes"] = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          obj["_attributes"][attr.name] = attr.value;
        }
      }

      // Handle child nodes
      if (element.hasChildNodes()) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as Element;
            const childName = childElement.nodeName;
            const childValue = elementToObject(childElement);

            if (obj[childName] === undefined) {
              obj[childName] = childValue;
            } else {
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childValue);
            }
          } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
            return child.nodeValue.trim();
          }
        }
      }
      return Object.keys(obj).length === 0 ? "" : obj;
    };

    if (!xmlDoc.documentElement) return "{}";
    const result: any = {};
    result[xmlDoc.documentElement.nodeName] = elementToObject(xmlDoc.documentElement);
    return JSON.stringify(result, null, 2);
  };

  const handleConvert = (text = input, currentMode = mode) => {
    setInput(text);
    setError('');

    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'csv-to-json') {
        const parsed = Papa.parse(text.trim(), { header: true, skipEmptyLines: true });
        if (parsed.errors.length > 0) {
          throw new Error(parsed.errors[0].message);
        }
        setOutput(JSON.stringify(parsed.data, null, 2));
      } else if (currentMode === 'xml-to-json') {
        const jsonResult = parseXmlToJson(text.trim());
        setOutput(jsonResult);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse incoming structure safely.');
      setOutput('');
    }
  };

  const changeMode = (newMode: ConvertMode) => {
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
      question: "Can I convert large CSV or spreadsheets data grids here safely?",
      answer: "Yes. Processing takes place completely within your local browser memory sandbox. There are no size limits enforced by networks or payload configurations because zero files leave your hard drive."
    },
    {
      question: "How does the XML translator parse attributes?",
      answer: "Tag attributes are grouped cleanly into an internal nested object flag labeled `_attributes` so you don't lose key structural parameters during data transformations."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "Structural Data Cross-Converter"}
      description={overrideDescription || "Parse and convert raw XML schemas or CSV spreadsheet strings into structured JSON objects instantaneously. Privacy-focused browser processing."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Converter Selector Toggles */}
        <div className="flex bg-muted p-1 rounded-lg w-fit border border-border">
          <button
            onClick={() => changeMode('csv-to-json')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'csv-to-json' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            CSV / Excel to JSON
          </button>
          <button
            onClick={() => changeMode('xml-to-json')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'xml-to-json' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            XML to JSON
          </button>
        </div>

        {/* Core Code Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input block */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === 'csv-to-json' ? 'Source CSV String' : 'Source XML Document'}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder={mode === 'csv-to-json' ? "name,role,level\nAlice,Engineer,L4\nBob,Designer,L3" : "<user><name>Alice</name><role>Engineer</role></user>"}
              className="font-mono text-sm p-4 h-64 bg-zinc-950 text-zinc-100 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
            />
          </div>

          {/* Output block */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Converted JSON Output</label>
            <textarea
              readOnly
              value={output}
              placeholder="[\n  {\n    'name': 'Alice',\n    'role': 'Engineer'\n  }\n]"
              className="font-mono text-sm p-4 h-64 bg-zinc-950/90 text-amber-400 rounded-lg border border-border focus:outline-none resize-none shadow-inner select-all"
            />
          </div>
        </div>

        {/* Parsing Error Box */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs md:text-sm rounded-lg font-mono">
            Error: {error}
          </div>
        )}

        {/* Toolbar Triggers */}
        {output && (
          <div className="pt-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs md:text-sm rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy JSON Result'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}