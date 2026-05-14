import JsonToCsvPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const slugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'convert-json-to-csv': {
    title: 'Convert JSON to CSV Online',
    desc: 'Free browser-based app to convert JSON to CSV formats instantly. No installation required.',
  },
  'json-array-to-csv': {
    title: 'JSON Array to CSV Converter',
    desc: 'Easily parse structured JSON arrays or nested tables into standardized comma-separated rows.',
  },
  'json-to-excel-csv': {
    title: 'JSON to Excel CSV Tool',
    desc: 'Format your raw JSON strings into Excel-compatible CSV exports with proper delimiter encoding.',
  },
  'json-file-converter': {
    title: 'JSON File Converter to CSV',
    desc: 'A privacy-first desktop utility alternative to turn text or script outputs into structured documents.',
  },
};

export default async function ProgrammaticToolPage({ params }: PageProps) {
  const { slug } = await params;
  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = slugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Fast, client-side browser tool optimized for "${humanizedSlug}" actions. 100% private and secure processing.`,
  };

  return (
    <JsonToCsvPage overrideTitle={seoData.title} overrideDescription={seoData.desc} />
  );
}
