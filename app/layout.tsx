import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "https://engineering-coach.xingai.app";

export const metadata: Metadata = {
  title: {
    default: "XingAI Engineering Communication Coach",
    template: "%s · XingAI Engineering Communication Coach",
  },
  description:
    "Communicate like a senior engineer — not just a fluent English speaker. 14-day curriculum for trust, conflict, feedback, and leadership English in real Azure/.NET engineering scenarios.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  keywords: [
    "engineering English",
    "workplace communication",
    "software engineer English",
    "tech lead communication",
    "Azure .NET English practice",
    "XingAI",
  ],
  openGraph: {
    title: "XingAI Engineering Communication Coach",
    description:
      "14-day charisma & communication training for non-native engineers in real workplace scenarios.",
    url: SITE_URL,
    siteName: "XingAI Engineering Communication Coach",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XingAI Engineering Communication Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XingAI Engineering Communication Coach",
    description: "14-day charisma & communication training for non-native engineers.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        text: "Grammarly makes sentences grammatically correct. XingAI Engineering Communication Coach trains how senior engineers communicate trust, conflict, feedback, ownership, and next steps in real workplace scenarios.",
      },
    },
    {
      "@type": "Question",
      name: "How long does daily practice take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "About 10–15 minutes: one skill, one realistic engineering scenario, 5–10 sentences, then a structured review with Level 1/2/3 rewrites.",
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
        text: "No. The app runs with a 14-day deterministic scenario bank and rule-based review out of the box. Configuring an Anthropic API key upgrades review quality automatically.",
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
  name: "XingAI Engineering Communication Coach",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Daily engineering communication & charisma practice for non-native engineers — trust, conflict, feedback, and leadership English.",
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
