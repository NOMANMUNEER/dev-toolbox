"use client";

import React, { use } from 'react';
import RegexPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const comprehensiveRegexMap: Record<string, { title: string; desc: string }> = {
  // Generic
  'regex-tester':               { title: 'Regex Tester Online — Live Match Highlighter', desc: 'Test regular expressions instantly with live match highlighting, group extraction, and flag controls. Runs 100% in your browser.' },
  'regex-tester-online':        { title: 'Online Regex Tester — Free & Instant', desc: 'Paste your pattern and test string to see matches highlighted in real time. No signup. No server. Zero data leaks.' },
  'regex-generator':            { title: 'Regex Generator & Pattern Builder', desc: 'Build and validate regular expression patterns visually. Inspect match groups, indices, and lengths live in your browser.' },
  'regex-generator-online':     { title: 'Online Regex Generator — Build Patterns Fast', desc: 'Generate and test regex patterns instantly. Supports global, case-insensitive, multiline, and dotall flags.' },
  'regex-builder-online':       { title: 'Regex Builder Online — Visual Pattern Editor', desc: 'Construct complex regular expressions with a visual builder and real-time match feedback. Free developer tool.' },
  'regex-debugger':             { title: 'Regex Debugger — Step-Through Pattern Inspector', desc: 'Debug your regular expressions with live match visualization, capture group tables, and error detection.' },
  'regex-debugger-online':      { title: 'Online Regex Debugger — Free Pattern Debugger', desc: 'Identify why your regex fails with instant error messages and match-by-match breakdowns.' },
  'regex-checker':              { title: 'Regex Checker — Validate Patterns Instantly', desc: 'Check if your regular expression matches your test string. See every match, index, and group in a clean table.' },
  'regex-validator':            { title: 'Regex Validator — Test Pattern Validity Online', desc: 'Validate regex syntax and match behavior in real time. Supports multiple language flag modes.' },
  'regex-online':               { title: 'Regex Online — Browser-Based Pattern Tester', desc: 'Run regex tests directly in your browser with zero latency. Match highlight, group inspector, and flag switcher included.' },
  'online-regex-tester':        { title: 'Online Regex Tester — Free Dev Utility', desc: 'The fastest online regex tester. Live highlighting, capture group tables, and multi-flag support.' },
  'regex-pattern-tester':       { title: 'Regex Pattern Tester — Match & Validate Online', desc: 'Test any regex pattern against a sample string. View all matches, positions, and capture groups instantly.' },
  'regex-simulator':            { title: 'Regex Simulator — Visualize Pattern Matching', desc: 'Simulate how your regular expression processes a string step by step with live match visualization.' },
  'regex-editor':               { title: 'Regex Editor — Online Pattern Workspace', desc: 'Edit and test regex patterns with real-time match feedback and a clean developer workspace.' },
  'regex-expression-tester':    { title: 'Regular Expression Tester — Online Tool', desc: 'Test full regular expressions against multi-line strings. See match counts, indices, and groups instantly.' },
  'regex-email-tester':         { title: 'Regex Email Pattern Tester', desc: 'Validate email regex patterns against real address strings. Find matching and non-matching addresses instantly.' },
  'regex-analyzer':             { title: 'Regex Analyzer — Pattern Breakdown Tool', desc: 'Analyze your regex pattern structure and match behavior. Inspect groups, positions, and flag effects live.' },

  // JavaScript
  'javascript-regex-tester':         { title: 'JavaScript Regex Tester Online', desc: 'Test JS regex patterns with g, i, m, s, u, y flag support. See all matches, groups, and indices in real time.' },
  'javascript-regex-tester-online':  { title: 'JavaScript Regex Tester Online — Free Tool', desc: 'Run JavaScript RegExp patterns live in your browser. Full ES2024 flag support including dotAll and Unicode.' },
  'javascript-regex-online':         { title: 'JavaScript Regex Online — Live RegExp Tester', desc: 'Test JavaScript regular expressions instantly. Supports all JS flags and returns match arrays with full group data.' },
  'javascript-regex-debugger':       { title: 'JavaScript Regex Debugger — Fix Broken Patterns', desc: 'Debug JavaScript RegExp issues. Spot invalid syntax, missing flags, and unexpected match behavior instantly.' },
  'javascript-regex-generator-online':{ title: 'JavaScript Regex Generator Online', desc: 'Build and generate JavaScript-compatible regex patterns with live testing and flag support.' },
  'javascript-regex-test':           { title: 'JavaScript Regex Test — Match String Validator', desc: 'Run .test() and .exec() equivalent regex operations live in your browser for JavaScript patterns.' },
  'js-regex-tester':                 { title: 'JS Regex Tester — Quick JavaScript Pattern Tool', desc: 'Fast JS regex testing with live match highlights, group tables, and all standard JavaScript flags.' },
  'online-javascript-regex-tester':  { title: 'Online JavaScript Regex Tester', desc: 'Test JavaScript regex patterns online. Live highlighting with match index, length, and group inspection.' },

  // Python
  'python-regex-tester':         { title: 'Python Regex Tester Online — re Module Simulator', desc: 'Test Python regex patterns with re module flag equivalents. Simulate re.findall(), re.match(), and re.search() results live.' },
  'python-regex-debugger':       { title: 'Python Regex Debugger — Fix re Module Errors', desc: 'Debug Python regular expressions. Identify pattern errors and match failures before running your script.' },
  'python-regex-generator':      { title: 'Python Regex Generator Online', desc: 'Generate and test Python-compatible regex patterns live. Supports IGNORECASE, MULTILINE, DOTALL flag modes.' },
  'online-python-regex-tester':  { title: 'Online Python Regex Tester — Free Tool', desc: 'Simulate Python re module behavior in your browser. Test patterns with match highlighting and group extraction.' },
  'python-re-tester':            { title: 'Python re Tester — re.compile Pattern Validator', desc: 'Validate re.compile() patterns online. See match objects, groups, and spans without running Python locally.' },
  'regex-tester-python-online':  { title: 'Regex Tester Python Online — re Module Tool', desc: 'Test Python regex patterns online with I, M, S, X flag support and live match visualization.' },
  'python-regex-test':           { title: 'Python Regex Test — Online re.fullmatch Simulator', desc: 'Check if your Python regex matches the full string or find all occurrences with live results.' },
  'python3-regex-online':        { title: 'Python 3 Regex Online Tester', desc: 'Test Python 3 regex patterns with live match output. Supports raw string notation and Python flag modes.' },

  // Java
  'java-regex-tester':           { title: 'Java Regex Tester Online — Pattern.compile Simulator', desc: 'Test Java regular expressions with Pattern.compile() behavior simulation. See matcher groups and match indices live.' },
  'java-regex-tester-online':    { title: 'Java Regex Tester Online — Free Tool', desc: 'Validate Java regex patterns without running a JVM. Supports CASE_INSENSITIVE, MULTILINE, and DOTALL flags.' },
  'java-regex-online':           { title: 'Java Regex Online — Pattern Matcher Tester', desc: 'Test Java Pattern and Matcher behavior online. View match groups, start/end positions, and flag effects instantly.' },
  'java-regex-debugger':         { title: 'Java Regex Debugger — Fix Pattern Errors', desc: 'Debug Java regular expression failures. Identify syntax errors and unexpected match behavior before deployment.' },
  'java-regex-pattern-tester':   { title: 'Java Regex Pattern Tester — Compile & Match Tool', desc: 'Simulate Java Pattern.compile() and matcher.find() operations online with live match output.' },
  'regex-tester-for-java':       { title: 'Regex Tester for Java Developers', desc: 'Dedicated Java regex testing tool. Test patterns with Java flag equivalents and match group inspection.' },
  'java-matches-regex-tester':   { title: 'Java .matches() Regex Tester Online', desc: 'Test String.matches() behavior online. Check if your Java regex matches the entire input string.' },

  // PHP
  'php-regex-online':            { title: 'PHP Regex Online — preg_match Tester', desc: 'Test PHP preg_match() and preg_match_all() patterns online. See match arrays and capture groups instantly.' },
  'php-regex-test':              { title: 'PHP Regex Test — PCRE Pattern Tester', desc: 'Validate PHP PCRE regex patterns live. Simulate preg_match behavior without a server.' },
  'php-regex-generator':         { title: 'PHP Regex Generator Online', desc: 'Generate PHP-compatible PCRE regex patterns and test them live with full capture group support.' },

  // C#
  'csharp-regex-tester':         { title: 'C# Regex Tester Online — .NET RegEx Validator', desc: 'Test C# and .NET regular expressions online. Simulate Regex.Matches() with IgnoreCase, Multiline, and Singleline options.' },
  'c-sharp-regex-tester':        { title: 'C# .NET Regex Tester — System.Text.RegularExpressions', desc: 'Validate C# regex patterns with .NET flag equivalents. See matches and groups without a compiler.' },
  'net-regex-tester':            { title: '.NET Regex Tester Online — C# Pattern Validator', desc: 'Test .NET regular expressions online. Supports IgnoreCase, Multiline, and Singleline flag modes.' },

  // Platform-specific
  'nginx-regex-tester':          { title: 'Nginx Regex Tester Online — Location Block Validator', desc: 'Test Nginx location block regex patterns. Validate PCRE patterns used in server configuration files safely.' },
  'nginx-regex-tester-online':   { title: 'Online Nginx Regex Tester — Server Config Validator', desc: 'Validate Nginx regex location directives (~, ~*) without restarting your server. Test patterns safely in browser.' },
  'aws-regex-tester':            { title: 'AWS Regex Tester — API Gateway Pattern Validator', desc: 'Test regex patterns used in AWS API Gateway routes, CloudWatch log filters, and Lambda event processing.' },
  'cloudflare-regex-tester':     { title: 'Cloudflare Regex Tester — WAF Rule Validator', desc: 'Test regex patterns for Cloudflare WAF rules and firewall expressions safely in your browser.' },
  'gitlab-regex-tester':         { title: 'GitLab Regex Tester — CI/CD Pipeline Rule Tester', desc: 'Validate GitLab CI regex patterns for only/except rules, branch matchers, and trigger conditions.' },
  'kubernetes-regex-tester':     { title: 'Kubernetes Regex Tester — Selector Pattern Validator', desc: 'Test regex patterns used in Kubernetes annotations, label selectors, and admission webhook configurations.' },
  'splunk-regex-tester':         { title: 'Splunk Regex Tester — SPL rex Command Validator', desc: 'Validate Splunk rex and regex SPL command patterns. Test field extraction rules without running a search.' },
  'elasticsearch-regex-tester':  { title: 'Elasticsearch Regex Tester — Query DSL Validator', desc: 'Test Elasticsearch regexp query patterns. Validate Lucene regex syntax for field matching in ES indices.' },
  'salesforce-regex-tester':     { title: 'Salesforce Regex Tester — Apex Pattern Validator', desc: 'Test Salesforce Apex regex patterns using Pattern.compile() behavior simulation online.' },
  'snowflake-regex-tester':      { title: 'Snowflake Regex Tester — RLIKE Pattern Validator', desc: 'Validate Snowflake RLIKE and REGEXP_LIKE patterns. Test SQL regex syntax for column matching queries.' },

  // Other languages
  'golang-regex-tester':         { title: 'Go Regex Tester Online — regexp Package Simulator', desc: 'Test Go regex patterns with RE2 syntax online. Simulate regexp.MustCompile() and FindAllString behavior.' },
  'ruby-regex-tester':           { title: 'Ruby Regex Tester Online — Oniguruma Pattern Tester', desc: 'Test Ruby regex patterns with i, m, x flag support. Simulate match data and scan results online.' },
  'perl-regex-tester':           { title: 'Perl Regex Tester Online — PCRE Pattern Validator', desc: 'Test Perl-compatible regular expressions online. Full match group and flag support.' },
  'abap-regex-tester':           { title: 'ABAP Regex Tester Online', desc: 'Test ABAP regular expression patterns used in FIND and REPLACE statements with live match output.' },
};

export default function ProgrammaticRegexPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1);

  const seoData = comprehensiveRegexMap[slug] || {
    title: `${defaultTitle} — Online Regex Tool`,
    desc: `Test and debug "${humanizedSlug}" patterns with live match highlighting, capture group inspection, and multi-language flag support.`,
  };

  return (
    <RegexPage
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}