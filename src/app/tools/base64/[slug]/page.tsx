"use html"
"use client";

import React, { use } from 'react';
import Base64Page from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const comprehensiveBase64Map: Record<string, { title: string; desc: string }> = {
  'base64-decode-online': {
    title: 'Base64 Decode Online - 100% Secure & Fast',
    desc: 'Instantly decode Base64 encoded strings back into clean, readable text. Processes entirely in your browser memory for absolute privacy.'
  },
  'base64-encode-online': {
    title: 'Base64 Encode Online - Secure String Converter',
    desc: 'Convert any plain text or string variable into standard Base64 format. Ideal for basic auth strings and data transmissions.'
  },
  'kubernetes-secret-base64': {
    title: 'Kubernetes Secret Base64 Decoder/Encoder',
    desc: 'Quickly decode K8s yaml secret values or encode configuration variables into standard Base64 strings for direct deployment.'
  },
  'aws-lambda-base64-decoder': {
    title: 'AWS Lambda Base64 Payload Decoder',
    desc: 'Troubleshoot API Gateway and AWS Lambda event payloads. Decode invocation strings or fix invalid base64 padding errors locally.'
  },
  'asn1-decoder-online': {
    title: 'ASN.1 Syntax Decoder & Base64 Reader',
    desc: 'Parse abstract syntax notation structures (ASN.1) or cryptographic certificates from Base64 or Hex encoded formats.'
  },
  'base32-decode-online': {
    title: 'Base32 Decoder & Encoder Utility',
    desc: 'Translate alternate bitwise representations. Decode standard Base32 (RFC 4648) data strings cleanly without network latency.'
  },
  'base58-encode-javascript': {
    title: 'Base58 Encoder/Decoder for Web Developers',
    desc: 'Generate or parse Base58 alphanumeric strings safely—commonly used in blockchain, Bitcoin addresses, and short URL creation.'
  },
  'base64-url-decoder': {
    title: 'Base64 URL & Link Decoder Engine',
    desc: 'Safely decode raw base64 encoded web strings, cloud storage references (Mega/Drive), and complex API paths locally.'
  }
};

export default function ProgrammaticBase64Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Handle specific fallback matching for the raw encoded URL strings in your research
  let targetSlug = slug;
  if (slug.startsWith('ahr0chm')) {
    targetSlug = 'base64-url-decoder';
  }

  const humanizedSlug = targetSlug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = comprehensiveBase64Map[targetSlug] || {
    title: `${defaultTitle} - Local Dev Tool`,
    desc: `Perform high-speed client-side execution matching your specific "${humanizedSlug}" programming requirements safely.`
  };

  return (
    <Base64Page 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}