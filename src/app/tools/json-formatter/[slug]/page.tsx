"use html"
"use client";

import React, { use } from 'react';
import JsonFormatterPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const jsonFormatterSlugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'json-formatter-online': {
    title: 'Best JSON Formatter Online (100% Private)',
    desc: 'Clean, pretty-print, and tree-format complex JSON strings instantly. Completely local processing to protect your keys.'
  },
  'json-reader-online': {
    title: 'JSON Reader Online Widget',
    desc: 'Load or paste messy api payloads into a clear hierarchical block structure. Easy reading for debugging workflows.'
  },
  'json-view': {
    title: 'Interactive JSON Viewer Panel',
    desc: 'An aesthetic formatting canvas alternative to Raycast and Vercel styles. Evaluate byte parameters cleanly.'
  },
  'best-json-formatter': {
    title: 'Cleanest Developer JSON Formatter Utility',
    desc: 'Highly responsive client-side interface optimized for speed, low data footprint, and massive payloads.'
  }
};

export default function ProgrammaticJsonFormatterPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = jsonFormatterSlugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Format, validate, and analyze structural elements matching your "${humanizedSlug}" requirements.`
  };

  return (
    <JsonFormatterPage 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}