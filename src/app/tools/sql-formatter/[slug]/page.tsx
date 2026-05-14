"use html"
"use client";

import React, { use } from 'react';
import SqlFormatterPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const sqlSlugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'json-to-sql': {
    title: 'Convert JSON to SQL Script Online',
    desc: 'Parse and compile raw JSON configuration blocks or arrays into valid SQL standard insertion rows natively inside your browser window.'
  },
  'sql-beautifier': {
    title: 'SQL Code Beautifier Tool',
    desc: 'Format messy SQL statements automatically with consistent indents and unified uppercase keywords.'
  }
};

export default function ProgrammaticSqlPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = sqlSlugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Clean client-side processing workspace configured to resolve "${humanizedSlug}" actions natively.`
  };

  return (
    <SqlFormatterPage 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}