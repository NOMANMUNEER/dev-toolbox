"use html"
"use client";

import React, { use } from 'react';
import CrossConverterPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const converterSlugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'xml-to-json-converter': {
    title: 'XML to JSON Converter Online',
    desc: 'Transform verbose XML tags and hierarchies into clean, minimal JSON strings natively inside your browser window.'
  },
  'csv-to-json-converter': {
    title: 'CSV to JSON Converter Widget',
    desc: 'Parse comma-separated values instantly into array-based schema elements. No spreadsheet uploads required.'
  },
  'excel-to-json-converter': {
    title: 'Excel Tabular to JSON Parser',
    desc: 'Paste copied blocks directly from Microsoft Excel sheets and watch them convert into standard API structures.'
  }
};

export default function ProgrammaticConverterPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = converterSlugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Seamless local system translation interface for resolving "${humanizedSlug}" commands.`
  };

  return (
    <CrossConverterPage 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}