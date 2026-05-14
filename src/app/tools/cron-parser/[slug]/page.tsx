"use html"
"use client";

import React, { use } from 'react';
import CronParserPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const comprehensiveCronMap: Record<string, { title: string; desc: string }> = {
  'cron-expression-generator': {
    title: 'Free Cron Expression Generator & Schedule Builder',
    desc: 'Generate valid cron expressions with an interactive UI. Easily output standard, Quartz, or Spring Boot schedule strings.'
  },
  'aws-cron-expression-builder': {
    title: 'AWS EventBridge & Lambda Cron Expression Builder',
    desc: 'Create and validate 6-field AWS cron schedules. Avoid invocation errors with proper day-of-week and year alignment rules.'
  },
  'cron-expression-evaluator-online': {
    title: 'Cron Expression Evaluator & Decoder Online',
    desc: 'Decode complex cron schedules into human-readable plain text sentences. Supports 5-field Linux and 6-field formats.'
  },
  'cron-expression-every-5-minutes': {
    title: 'Cron Generator: Every 5 Minutes Schedule Syntax',
    desc: 'Instantly build cron formats executing on intervals like every 5 minutes, hourly, or every 30 minutes.'
  },
  'airflow-cron-expression-generator': {
    title: 'Apache Airflow Cron Expression Generator',
    desc: 'Generate schedule intervals for your Airflow DAGs. Ensure reliable cross-platform pipeline execution structures.'
  },
  'cron-expression-generator-quartz': {
    title: 'Quartz Cron Expression Generator & Tester',
    desc: 'Build 6-field or 7-field Quartz scheduler cron rows with support for specific character triggers like L, W, and #.'
  },
  'cron-expression-generator-spring-boot': {
    title: 'Spring Boot Cron Expression Generator Online',
    desc: 'Quickly output Java Spring framework compatible @Scheduled cron parameters with inline safety checks.'
  }
};

export default function ProgrammaticCronPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = `${humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1)}`;

  const seoData = comprehensiveCronMap[slug] || {
    title: `${defaultTitle} - Local Cron Tool`,
    desc: `Generate, evaluate, and test cron scheduling expressions for "${humanizedSlug}" environments locally.`
  };

  return (
    <CronParserPage 
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}