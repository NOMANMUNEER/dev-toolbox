"use html"
"use client";

import React, { useState } from 'react';
import ToolLayout from '@/components/tool-layout/ToolLayout';
import { Clock, Sliders, Eye, Copy, Check } from 'lucide-react';

interface BaseToolProps {
  overrideTitle?: string;
  overrideDescription?: string;
}

export default function CronParserPage({ overrideTitle, overrideDescription }: BaseToolProps) {
  const [formatType, setFormatType] = useState<'standard' | 'aws-quartz'>('standard');
  const [expression, setExpression] = useState('*/5 * * * *');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Generator Quick Preset values
  const [presetPreset, setPreset] = useState('every-5-min');

  const [explanation, setExplanation] = useState({
    minutes: 'Every 5 minutes',
    hours: 'Every hour',
    days: 'Every day of the month',
    months: 'Every month',
    weekdays: 'Every day of the week',
    years: ''
  });

  const parseSegment = (part: string, type: string): string => {
    if (!part || part === '*' || part === '?') return `Every ${type}`;
    if (part.startsWith('*/')) return `Every ${part.split('/')[1]} ${type}s`;
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      return `From ${type} ${start} through ${end}`;
    }
    if (part.includes(',')) return `At specific ${type}s: [${part}]`;
    return `At ${type} ${part}`;
  };

  const handleExpressionChange = (val: string, currentFormat = formatType) => {
    setExpression(val);
    setError('');

    const segments = val.trim().split(/\s+/);
    const expectedLength = currentFormat === 'standard' ? 5 : 6;

    if (segments.length !== expectedLength) {
      setError(`Format mismatch. Expected ${expectedLength} space-separated segments for this scheduler type.`);
      return;
    }

    try {
      if (currentFormat === 'standard') {
        setExplanation({
          minutes: parseSegment(segments[0], 'minute'),
          hours: parseSegment(segments[1], 'hour'),
          days: parseSegment(segments[2], 'day'),
          months: parseSegment(segments[3], 'month'),
          weekdays: parseSegment(segments[4], 'weekday'),
          years: ''
        });
      } else {
        setExplanation({
          minutes: parseSegment(segments[0], 'minute'),
          hours: parseSegment(segments[1], 'hour'),
          days: parseSegment(segments[2], 'day'),
          months: parseSegment(segments[3], 'month'),
          weekdays: parseSegment(segments[4], 'weekday'),
          years: parseSegment(segments[5], 'year')
        });
      }
    } catch {
      setError('Error reading structural cron segments.');
    }
  };

  const applyPreset = (presetKey: string, currentFormat = formatType) => {
    setPreset(presetKey);
    let newExpression = '';

    if (currentFormat === 'standard') {
      switch (presetKey) {
        case 'every-5-min': newExpression = '*/5 * * * *'; break;
        case 'hourly-9-5': newExpression = '0 9-17 * * 1-5'; break;
        case 'midnight-daily': newExpression = '0 0 * * *'; break;
        default: newExpression = '* * * * *';
      }
    } else {
      // AWS / Quartz 6-field mapping layout equivalents
      switch (presetKey) {
        case 'every-5-min': newExpression = '0/5 * * * * ?'; break;
        case 'hourly-9-5': newExpression = '0 0 9-17 * * MON-FRI'; break;
        case 'midnight-daily': newExpression = '0 0 0 * * ?'; break;
        default: newExpression = '0 * * * * ?';
      }
    }
    handleExpressionChange(newExpression, currentFormat);
  };

  const switchFormat = (newFormat: 'standard' | 'aws-quartz') => {
    setFormatType(newFormat);
    applyPreset(presetPreset, newFormat);
  };

  const copyExpression = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleFaqs = [
    {
      question: "What is the primary difference between Standard and AWS/Quartz cron syntax?",
      answer: "Standard cron (Linux/Cronjobs) relies on 5 field components (Minute to Day of Week). Enterprise engines like AWS EventBridge or Quartz utilize 6 or 7 fields, explicitly inserting Year metrics or character flags like '?' to bypass conflicts between Day-of-Month and Day-of-Week."
    },
    {
      question: "How do I configure interval patterns like 'Every 15 minutes'?",
      answer: "Using step operators like '*/15' or '0/15' in the initial minute index tells the runner environment engine to execute tasks at exact divisible offsets from baseline runtime markers."
    }
  ];

  return (
    <ToolLayout
      title={overrideTitle || "Interactive Cron Expression Generator & Parser"}
      description={overrideDescription || "Build custom task schedules visually or interpret raw cron parameters down to readable language strings. Clean, client-driven platform execution setup."}
      faqs={sampleFaqs}
    >
      <div className="space-y-6">
        {/* Format Selection Layout Blocks */}
        <div className="flex bg-muted p-1 rounded-lg w-fit border border-border">
          <button
            onClick={() => switchFormat('standard')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              formatType === 'standard' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Standard 5-Fields (Linux / Airflow)
          </button>
          <button
            onClick={() => switchFormat('aws-quartz')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              formatType === 'aws-quartz' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            6-Fields (AWS EventBridge / Quartz)
          </button>
        </div>

        {/* Visual click presets to instantly respond to target search queries */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Select Common Interval Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'every-5-min', name: 'Every 5 Minutes' },
              { id: 'hourly-9-5', name: 'Hourly Working Hours (9-5)' },
              { id: 'midnight-daily', name: 'Once a Day at Midnight' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`p-3 text-xs font-medium border rounded-lg transition-all text-center ${
                  presetPreset === preset.id 
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
                    : 'bg-zinc-950/40 border-border text-muted-foreground hover:text-foreground hover:bg-zinc-950'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Input Field Output Block */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Active Schedule String</span>
            <span className="font-mono text-[10px] text-zinc-500 lowercase">
              {formatType === 'standard' ? 'min hour day month weekday' : 'min hour day month weekday year'}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => handleExpressionChange(e.target.value)}
              className="flex-1 font-mono text-base p-4 bg-zinc-950 text-emerald-400 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
            />
            <button
              onClick={copyExpression}
              className="p-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg border border-zinc-700/80 transition-colors flex items-center justify-center shrink-0"
              title="Copy expression string"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg font-mono">
            Error: {error}
          </div>
        )}

        {/* Real-time Structural Interpreter Translation Grid */}
        {!error && (
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Live Token Evaluation Translator
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { label: 'Minute', desc: explanation.minutes },
                { label: 'Hour', desc: explanation.hours },
                { label: 'Day (Month)', desc: explanation.days },
                { label: 'Month', desc: explanation.months },
                { label: 'Day (Week)', desc: explanation.weekdays },
                ...(formatType === 'aws-quartz' ? [{ label: 'Year', desc: explanation.years }] : [])
              ].map((cell, idx) => (
                <div key={idx} className="bg-zinc-950 border border-border p-3 rounded-lg text-center space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{cell.label}</div>
                  <div className="text-xs font-semibold text-zinc-200 leading-snug">{cell.desc}</div>
                </div>
              ))}
            </div>

            {/* Compiled Summary Callout */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-3 shadow-inner">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                Summary: System execution logic triggers <span className="text-white font-bold">{explanation.minutes.toLowerCase()}</span>, <span className="text-white font-bold">{explanation.hours.toLowerCase()}</span>, <span className="text-white font-bold">{explanation.days.toLowerCase()}</span>, <span className="text-white font-bold">{explanation.months.toLowerCase()}</span>, and <span className="text-white font-bold">{explanation.weekdays.toLowerCase()}</span>{formatType === 'aws-quartz' && <>, <span className="text-white font-bold">{explanation.years.toLowerCase()}</span></>}.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}