import type { Metadata, Viewport } from "next";
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "XingAI Engineering English Coach" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XingAI Engineering English Coach",
    description:
      "Communicate like a senior engineer — not just a fluent English speaker.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
      name: "Which languages are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UI supports English, Chinese, and Korean. Feedback can be English, Chinese, or bilingual.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an API key to try it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The app runs with a deterministic scenario bank and rule-based review out of the box. Configuring an Anthropic API key upgrades review quality automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Is this certified language assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It is communication practice only — not a certified exam or professional career advice. Verify suggested wording before sending it.",
      },
    },
  ],
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "XingAI Engineering English Coach",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Daily workplace English practice for non-native engineers — risk, decision, ownership, and next-step language.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  inLanguage: ["en", "zh", "ko"],
  publisher: { "@type": "Organization", name: "XingAI", url: "https://xingai.app" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          // Theme + locale boot before paint (no flash)
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("xingai_eec_theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var l=localStorage.getItem("xingai_eec_lang");if(l==="en"||l==="zh"||l==="ko")document.documentElement.lang=l==="zh"?"zh-Hans":l;}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
