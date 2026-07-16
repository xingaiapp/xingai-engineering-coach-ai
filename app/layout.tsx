import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "https://engineering-coach.xingai.app";

export const metadata: Metadata = {
  title: "XingAI Engineering English Coach",
  description:
    "Communicate like a senior engineer — not just a fluent English speaker. Daily realistic workplace scenarios, line-by-line review, and reusable phrases for non-native English-speaking engineers.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "XingAI Engineering English Coach",
    description:
      "Communicate like a senior engineer — not just a fluent English speaker.",
    url: SITE_URL,
    siteName: "XingAI Engineering English Coach",
    type: "website",
  },
};

// AEO: JSON-LD FAQPage, server-rendered — see xingai-global-standard.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is this different from Grammarly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Grammarly makes sentences grammatically correct. XingAI Engineering English Coach teaches how senior engineers communicate risk, decisions, impact, ownership, and next steps in real workplace scenarios.",
      },
    },
    {
      "@type": "Question",
      name: "How long does daily practice take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "About 10–15 minutes: one realistic engineering scenario, 5–10 sentences of writing, and a line-by-line review.",
      },
    },
    {
      "@type": "Question",
      name: "Which native languages are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Feedback can be delivered in English, Chinese, or bilingual, and the coach adapts explanations for common patterns from the user's native language.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an API key to try it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The app runs locally with a deterministic scenario bank and rule-based review out of the box. Configuring an Anthropic API key upgrades review quality automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Is my practice history saved anywhere else?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each review is recorded as a Decision row in the same shared ledger shape used across XingAI products, scoped to your local session.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
