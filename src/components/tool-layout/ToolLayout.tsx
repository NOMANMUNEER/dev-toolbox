import React from 'react';
import AdBlock from '@/components/ads/AdBlock';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  faqs: FAQItem[];
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, faqs, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16 md:pb-0">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            DevToolbox<span className="text-foreground">.</span>
          </a>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 w-full flex gap-8 py-8 flex-1">
        <main className="flex-1 max-w-4xl w-full mx-auto space-y-8">
          <section className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-base max-w-2xl">{description}</p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant browser execution
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> Works offline
              </span>
            </div>
          </section>

          <AdBlock type="horizontal" />

          <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-4 md:p-6">
            {children}
          </section>

          <AdBlock type="horizontal" />

          <section className="space-y-6 pt-4 border-t border-border">
            <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-5 bg-muted/30 rounded-lg border border-border/60">
                  <h3 className="font-semibold text-base mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="hidden xl:block w-[300px] shrink-0">
          <AdBlock type="sidebar" />
        </aside>
      </div>

      <AdBlock type="mobileSticky" />

      <footer className="border-t border-border mt-auto py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DevToolbox. No data is ever transmitted to our servers.
        </div>
      </footer>
    </div>
  );
}
