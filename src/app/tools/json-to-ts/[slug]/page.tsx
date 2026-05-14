"use html"
"use client";

import React, { use } from 'react';
import JsonToTsPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const tsSlugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'json-to-ts': {
    title: 'Convert JSON to TypeScript Interfaces Online',
    desc: 'Generate clean, recursive TypeScript models, interfaces, or class signatures directly from sample JSON data blocks locally.'
  },
  'json-to-typescript': {
    title: 'JSON to TypeScript Schema Type Generator',
    desc: 'Accelerate frontend API typing tasks. Paste any web response and generate secure interface types instantly.'
  }
};

export default function ProgrammaticTsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = tsSlugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Local application workspace dedicated to solving "${humanizedSlug}" programming scripts natively.`
  };

  return (
    <JsonToTsPage 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}