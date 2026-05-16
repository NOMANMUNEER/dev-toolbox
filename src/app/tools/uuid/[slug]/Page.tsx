"use client";

import React, { use } from 'react';
import UUIDPage from '../page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const comprehensiveUUIDMap: Record<string, { title: string; desc: string }> = {
  // Generic
  'uuid-generator':              { title: 'UUID Generator — Free Online Tool', desc: 'Generate RFC 4122 compliant UUIDs instantly. Supports v1, v4, and v5 with bulk export and format options.' },
  'uuid-generator-online':       { title: 'Online UUID Generator — v1, v4 & v5', desc: 'Generate UUIDs online for free. Choose version, format (standard, uppercase, braces, URN), and export in bulk.' },
  'uuid-v4-generator':           { title: 'UUID v4 Generator — Random UUID Online', desc: 'Generate cryptographically random UUID v4 strings instantly. Bulk generation, copy, and download supported.' },
  'uuid-v4-generator-online':    { title: 'UUID v4 Generator Online — Free Tool', desc: 'Create random UUID v4 values in your browser. No server, no tracking. Format as standard, uppercase, or no-hyphens.' },
  'uuid-v4':                     { title: 'UUID v4 — Random UUID Generator', desc: 'Generate UUID version 4 random identifiers instantly. Supports bulk generation and multiple output formats.' },
  'online-uuid-generator':       { title: 'Online UUID Generator — Instant & Free', desc: 'The fastest online UUID generator. Supports v1, v4, v5, bulk export, and code snippets for 9 languages.' },
  'online-uuid-generator-v4':    { title: 'Online UUID v4 Generator — RFC 4122', desc: 'Generate RFC 4122 compliant UUID v4 strings online. Copy single or bulk export as .txt file.' },
  'random-uuid-generator':       { title: 'Random UUID Generator — Free Online', desc: 'Generate random UUID v4 strings instantly. One click, instant copy, bulk mode up to 100 UUIDs.' },
  'random-uuid-generator-online':{ title: 'Random UUID Generator Online', desc: 'Create random UUIDs in bulk online. Download as text file or copy all to clipboard instantly.' },
  'random-uuid-v4-generator':    { title: 'Random UUID v4 Generator Online', desc: 'Generate random RFC 4122 v4 UUIDs online. Bulk generation with standard, uppercase, and URN formats.' },
  'uuid-creator':                { title: 'UUID Creator — Online Identifier Generator', desc: 'Create unique identifiers instantly. Supports UUID v1, v4, v5 with format options and bulk export.' },
  'create-uuid-online':          { title: 'Create UUID Online — Free Generator', desc: 'Create UUIDs online without any tools or libraries. Instant generation with copy and download options.' },
  'uuid-gen':                    { title: 'UUID Gen — Quick UUID Generator', desc: 'Quick UUID generator online. One click to generate, one click to copy. Supports v1, v4, and v5.' },
  'uuid-online':                 { title: 'UUID Online — Browser-Based Generator', desc: 'Generate UUIDs directly in your browser. No installation needed. Supports all UUID versions and formats.' },
  'generate-uuid-online':        { title: 'Generate UUID Online — Free Tool', desc: 'Generate UUIDs online instantly. Supports v1, v4, v5, multiple formats, and bulk generation up to 100.' },
  'generate-uuid-v4':            { title: 'Generate UUID v4 — Random Identifier Tool', desc: 'Generate UUID v4 random identifiers instantly. Copy single values or export bulk lists as .txt.' },
  'generate-uuid-v4-online':     { title: 'Generate UUID v4 Online — Free', desc: 'Generate UUID v4 values online with format options: standard, uppercase, no-hyphens, braces, or URN.' },
  'uuid4-generator':             { title: 'UUID4 Generator — Online Tool', desc: 'Generate UUID4 (version 4) random identifiers. Bulk generation, multiple formats, instant copy.' },
  'uuid-v4-online':              { title: 'UUID v4 Online — Free Generator', desc: 'Generate UUID v4 strings online. Supports standard, uppercase, no-hyphen, and URN output formats.' },
  'online-guid-generator':       { title: 'Online GUID Generator — Free UUID Tool', desc: 'Generate GUIDs (UUIDs) online instantly. Supports standard, uppercase, and braces {} format for .NET and C# use.' },
  'random-uuid':                 { title: 'Random UUID — Instant Generator', desc: 'Generate random UUIDs (v4) instantly. One-click copy, bulk mode, and multiple format options.' },
  'random-uuid-online':          { title: 'Random UUID Online — Free Generator', desc: 'Generate random UUID strings online. Copy, download, and export in standard or custom formats.' },
  'get-uuid':                    { title: 'Get UUID — Free Online Generator', desc: 'Get a new UUID instantly. Click generate, click copy. Supports v1, v4, v5 and all common formats.' },
  'new-uuid':                    { title: 'New UUID Generator — Create Fresh Identifiers', desc: 'Create new UUIDs on demand. Supports random v4, time-based v1, and name-based v5 generation.' },
  'make-uuid':                   { title: 'Make UUID — Online Generator Tool', desc: 'Make UUIDs instantly online. Bulk generation, format options, and code snippets for 9 programming languages.' },
  'uuid-identifier':             { title: 'UUID Identifier Generator — RFC 4122', desc: 'Generate RFC 4122 compliant UUID identifiers. Supports all versions with standard and custom output formats.' },
  'uuid-identifier-online':      { title: 'UUID Identifier Online — Free Tool', desc: 'Create UUID identifiers online. v1, v4, v5 support with bulk export and code snippet generation.' },
  'uuid-random':                 { title: 'UUID Random Generator — v4 Tool', desc: 'Generate random UUID v4 strings instantly. Copy single or bulk export up to 100 UUIDs.' },
  'uuid-token-generator':        { title: 'UUID Token Generator — Secure Random IDs', desc: 'Generate UUID tokens for API keys, session IDs, and authentication flows. Bulk export supported.' },
  'uuid-password-generator':     { title: 'UUID as Password Generator — Random Strings', desc: 'Use UUID v4 as a secure random string for passwords, API keys, or secret tokens.' },
  'uuid-example':                { title: 'UUID Example — Format & Version Reference', desc: 'See UUID examples for v1, v4, and v5. Compare formats: standard, uppercase, no-hyphens, braces, URN.' },
  'uuid-code-generator':         { title: 'UUID Code Generator — Snippets for 9 Languages', desc: 'Get UUID generation code for JavaScript, Python, Java, PHP, C#, Go, Ruby, TypeScript, and Rust.' },
  'unique-id-generation':        { title: 'Unique ID Generation — UUID & GUID Tool', desc: 'Generate unique identifiers online. UUID v1, v4, v5 with bulk export, format options, and language snippets.' },
  'create-unique-id':            { title: 'Create Unique ID — Online UUID Generator', desc: 'Create unique IDs using UUID v4. Instant generation with copy, download, and code snippet support.' },
  'generate-uid-number':         { title: 'Generate UID Number — UUID Online Tool', desc: 'Generate unique ID numbers using UUID. Supports standard, numeric-only (no-hyphens), and bulk modes.' },
  'generator-uid':               { title: 'UID Generator — Online UUID Tool', desc: 'Generate UIDs online using the UUID v4 standard. One click to copy, bulk export, multiple formats.' },
  'uetr-generator':              { title: 'UETR Generator — Unique End-to-End Transaction Reference', desc: 'Generate UETR strings (UUID v4 format) for SWIFT payment messaging and ISO 20022 transactions.' },

  // JavaScript / Node
  'generate-uuid-javascript':    { title: 'Generate UUID in JavaScript — Code & Online Tool', desc: 'See how to generate UUIDs in JavaScript using the uuid npm package. Live generator + copy-ready code snippet.' },
  'generate-uuid-js':            { title: 'Generate UUID JS — JavaScript Code & Tool', desc: 'Generate UUIDs in JS with the uuid library. v4, v1, v5 code snippets with live online generator.' },
  'javascript-uuid':             { title: 'JavaScript UUID Generator — Code & Online Tool', desc: 'Generate UUIDs in JavaScript online. Full code snippet for uuidv4(), uuidv1(), and uuidv5() with the uuid package.' },
  'generate-uuid-node':          { title: 'Generate UUID Node.js — Code Snippet & Tool', desc: 'Generate UUIDs in Node.js with the uuid package. ES module and CommonJS examples included.' },
  'node-generate-uuid':          { title: 'Node.js Generate UUID — npm uuid Package', desc: 'Use the uuid npm package to generate UUIDs in Node.js. Copy-ready code snippet for v4, v1, and v5.' },
  'node-js-uuid-generator':      { title: 'Node.js UUID Generator — npm uuid Tool', desc: 'Generate UUIDs in Node.js instantly. Code snippet for uuid npm package + live online generator.' },
  'uuid-generator-node':         { title: 'UUID Generator Node — npm Package Snippet', desc: 'Node.js UUID generation with the uuid npm package. Generate v4, v1, v5 with copy-ready code.' },
  'uuid-generator-node-js':      { title: 'UUID Generator Node.js — Live Tool & Code', desc: 'Generate UUIDs in Node.js with live tool and ready-to-use code snippets for all UUID versions.' },
  'uuid-generator-npm':          { title: 'UUID Generator NPM — uuid Package Guide', desc: 'Use the uuid npm package to generate UUIDs. Install command, import syntax, and live generator included.' },
  'uuid-generator-react':        { title: 'UUID Generator React — useId & uuid Hook', desc: 'Generate UUIDs in React components. Code snippets for uuid package and React 18 useId hook.' },
  'react-generate-uuid':         { title: 'React Generate UUID — Component Code & Tool', desc: 'Generate UUIDs in React with the uuid package or crypto.randomUUID(). Copy-ready snippet included.' },
  'js-generate-uuid':            { title: 'JS Generate UUID — Browser & Node.js', desc: 'Generate UUIDs in JavaScript for browser and Node.js. Uses crypto.randomUUID() and uuid package examples.' },
  'uuid-node-js-express':        { title: 'UUID Node.js Express — Route ID Generator', desc: 'Use UUIDs in Express.js routes. Code snippet for generating UUID request IDs and database keys.' },

  // TypeScript
  'typescript-generate-uuid':    { title: 'TypeScript Generate UUID — Typed Code Snippet', desc: 'Generate UUIDs in TypeScript with full type annotations. Uses the uuid package with string type.' },

  // Python
  'generate-uuid-python':        { title: 'Generate UUID Python — uuid Module Guide', desc: 'Generate UUIDs in Python using the built-in uuid module. Code for uuid4(), uuid1(), uuid5() + live tool.' },
  'python-uuid-generator':       { title: 'Python UUID Generator — uuid Module Tool', desc: 'Use Python\'s uuid module to generate UUIDs. Copy-ready code for uuid4(), uuid1(), and uuid5().' },
  'python-uuid5':                { title: 'Python UUID5 — uuid.uuid5() Code & Tool', desc: 'Generate UUID v5 in Python using uuid.uuid5() with NAMESPACE_DNS. Deterministic name-based UUIDs.' },
  'python-generate-uuid':        { title: 'Python Generate UUID — uuid4() Tool', desc: 'Generate UUIDs in Python with uuid.uuid4(). Live tool + copy-ready Python code snippet.' },

  // Java
  'generate-uuid-java':          { title: 'Generate UUID Java — UUID.randomUUID() Tool', desc: 'Generate UUIDs in Java using UUID.randomUUID(). Code snippet + live generator for all UUID versions.' },

  // PHP
  'php-generate-uuid':           { title: 'PHP Generate UUID — Code & Online Tool', desc: 'Generate UUIDs in PHP with the ramsey/uuid package or native sprintf() approach. Copy-ready code included.' },

  // C# / .NET
  'auto-generate-unique-id-csharp': { title: 'Auto Generate Unique ID in C# — Guid.NewGuid()', desc: 'Generate unique IDs in C# using Guid.NewGuid(). Code for standard, braces, and no-hyphen formats.' },
  'c-sharp-generate-uuid':       { title: 'C# Generate UUID — Guid.NewGuid() Tool', desc: 'Generate GUIDs (UUIDs) in C# with Guid.NewGuid(). Format as B (braces), N (no hyphens), or D (standard).' },
  'new-guid-csharp-online':      { title: 'New GUID C# Online — Guid.NewGuid() Generator', desc: 'Generate new GUIDs for C# and .NET online. See formatted output in standard, braces, and no-hyphen styles.' },

  // Ruby / Go
  'ruby-generate-uuid':          { title: 'Ruby Generate UUID — SecureRandom.uuid Guide', desc: 'Generate UUIDs in Ruby using SecureRandom.uuid. No gem required. Copy-ready code snippet included.' },
  'golang-uuid-generator':       { title: 'Go UUID Generator — google/uuid Package', desc: 'Generate UUIDs in Go using the google/uuid package. Code snippet for UUID v4 + live generator.' },

  // SQL / Database
  'generate-uuid-sql':           { title: 'Generate UUID SQL — All Databases Guide', desc: 'Generate UUIDs in SQL for PostgreSQL, MySQL, SQL Server, MariaDB, CockroachDB, and Oracle. Ready-to-run queries.' },
  'generate-uuid-sql-server':    { title: 'Generate UUID SQL Server — NEWID() Guide', desc: 'Generate UUIDs in SQL Server using NEWID() or NEWSEQUENTIALID(). Use as UNIQUEIDENTIFIER column default.' },
  'sql-generate-uuid':           { title: 'SQL Generate UUID — Database Query Tool', desc: 'Generate UUIDs in SQL. See queries for PostgreSQL uuid_generate_v4(), SQL Server NEWID(), MySQL UUID().' },
  'sql-generate-guid':           { title: 'SQL Generate GUID — NEWID() & UUID()', desc: 'Generate GUIDs in SQL with NEWID() (SQL Server) or UUID() (MySQL/MariaDB). Ready-to-run SQL queries.' },
  'sql-new-guid':                { title: 'SQL New GUID — NEWID() Generator', desc: 'Generate new GUIDs in SQL Server with NEWID(). Schema example for UNIQUEIDENTIFIER primary keys.' },
  'sql-new-uuid':                { title: 'SQL New UUID — Database UUID Guide', desc: 'Generate new UUIDs in SQL across PostgreSQL, MySQL, SQL Server, and MariaDB with copy-ready queries.' },
  'sql-uuid-generator':          { title: 'SQL UUID Generator — Multi-DB Query Tool', desc: 'Generate UUIDs in SQL for any database. PostgreSQL, MySQL, SQL Server, MariaDB, CockroachDB queries included.' },
  'sql-server-generate-uuid':    { title: 'SQL Server Generate UUID — NEWID() Guide', desc: 'Use NEWID() or NEWSEQUENTIALID() in SQL Server to generate UUIDs. UNIQUEIDENTIFIER column examples included.' },
  'sql-server-uuid-generator':   { title: 'SQL Server UUID Generator — NEWID() Tool', desc: 'Generate UUIDs in SQL Server with NEWID(). Use as default column value for UNIQUEIDENTIFIER primary keys.' },
  'postgresql-uuid-generate-v4': { title: 'PostgreSQL uuid_generate_v4() — Guide & Tool', desc: 'Enable uuid-ossp and use uuid_generate_v4() in PostgreSQL. Schema examples for UUID primary keys.' },
  'create-uuid-sql':             { title: 'Create UUID SQL — All Databases', desc: 'Create UUIDs in SQL with database-specific functions. PostgreSQL, MySQL, SQL Server, MariaDB ready-to-run.' },
  'mariadb-generate-uuid':       { title: 'MariaDB Generate UUID — UUID() Function', desc: 'Generate UUIDs in MariaDB using the built-in UUID() function. Schema example for UUID primary keys.' },
  'cockroachdb-generate-uuid':   { title: 'CockroachDB Generate UUID — gen_random_uuid()', desc: 'Use gen_random_uuid() in CockroachDB to generate UUIDs. Schema example for UUID primary keys.' },
  'mongodb-uuid-generator':      { title: 'MongoDB UUID Generator — BSON UUID Tool', desc: 'Generate UUIDs in MongoDB using BSON UUID type or the uuid npm package. Insert example included.' },
  'mongodb-unique-id-generation':{ title: 'MongoDB Unique ID Generation — UUID & ObjectId', desc: 'Generate unique IDs in MongoDB. Compare ObjectId vs UUID approaches with ready-to-use code.' },

  // AWS / Platform
  'aws-uuid-generator':          { title: 'AWS UUID Generator — Lambda & API Gateway Tool', desc: 'Generate UUIDs for AWS Lambda functions, API Gateway request IDs, and DynamoDB partition keys.' },
  'ibeacon-uuid-generator':      { title: 'iBeacon UUID Generator — Proximity UUID Tool', desc: 'Generate Proximity UUIDs for Apple iBeacon configurations. Standard UUID v4 format required.' },
  'bluetooth-uuid-generator':    { title: 'Bluetooth UUID Generator — BLE Service UUID', desc: 'Generate UUIDs for Bluetooth Low Energy (BLE) service and characteristic definitions.' },
  'ble-uuid-generator':          { title: 'BLE UUID Generator — Bluetooth LE Service UUID', desc: 'Generate BLE UUIDs for custom Bluetooth Low Energy services and characteristics.' },
  'ios-uuid-generator':          { title: 'iOS UUID Generator — NSUUID & UIDevice Tool', desc: 'Generate UUIDs for iOS apps. See Swift code for NSUUID, UUID(), and UIDevice.identifierForVendor.' },
  'drupal-generate-uuid':        { title: 'Drupal Generate UUID — Entity UUID Tool', desc: 'Generate UUIDs for Drupal entities, configuration objects, and content migrations.' },
  'sap-uuid-generator':          { title: 'SAP UUID Generator — ABAP UUID Tool', desc: 'Generate UUIDs for SAP ABAP applications. Standard UUID v4 format compatible with SAP CL_SYSTEM_UUID.' },
  'talend-generate-uuid':        { title: 'Talend Generate UUID — tJavaRow UUID Component', desc: 'Generate UUIDs in Talend ETL jobs using tJavaRow with UUID.randomUUID(). Copy-ready Java code.' },
};

export default function ProgrammaticUUIDPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const humanizedSlug = slug.replace(/-/g, ' ');
  const defaultTitle = humanizedSlug.charAt(0).toUpperCase() + humanizedSlug.slice(1);

  const seoData = comprehensiveUUIDMap[slug] || {
    title: `${defaultTitle} — UUID Generator`,
    desc: `Generate UUIDs online for "${humanizedSlug}". Supports v1, v4, v5 with bulk export, format options, and code snippets.`,
  };

  return (
    <UUIDPage
      overrideTitle={seoData.title}
      overrideDescription={seoData.desc}
    />
  );
}