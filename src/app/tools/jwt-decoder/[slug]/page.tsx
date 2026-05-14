import JwtDecoderPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const jwtSlugToHeadlineMap: Record<string, { title: string; desc: string }> = {
  'decode-jwt-online': {
    title: 'Decode JWT Online Free',
    desc: 'Instant browser utility to decode JSON Web Token header configurations and body values securely.',
  },
  'jwt-token-verifier': {
    title: 'JWT Token Claims Checker',
    desc: 'Analyze structural keys, signature types, user contexts, and expiry statuses inside active JSON Web Tokens.',
  },
  'jwt-string-reader': {
    title: 'JSON Web Token String Reader',
    desc: 'Break down raw encoded strings directly on your client computer layout. Private authentication inspection.',
  },
};

export default async function ProgrammaticJwtPage({ params }: PageProps) {
  const { slug } = await params;
  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = jwtSlugToHeadlineMap[slug] || {
    title: defaultTitle,
    desc: `Fast browser toolbox component designed to handle calculations matching "${humanizedSlug}" actions natively.`,
  };

  return (
    <JwtDecoderPage overrideTitle={seoData.title} overrideDescription={seoData.desc} />
  );
}
