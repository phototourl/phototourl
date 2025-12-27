import { siteUrl } from "@/app/seo-metadata";

/**
 * 生成 FAQ Schema（多语言支持）
 */
export function generateFAQSchema(
  faqItems: Array<{ question: string; answer: string }>,
  locale: string = "en"
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/${locale === "en" ? "" : `${locale}/`}#faq`,
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

/**
 * 生成 HowTo Schema（多语言支持）
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  locale: string = "en"
) {
  const url = `${siteUrl}/${locale === "en" ? "" : `${locale}/`}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    "name": name,
    "description": description,
    "image": `${siteUrl}/og-image.png`,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image }),
    })),
  };
}

/**
 * 生成 SoftwareApplication Schema（工具站标识）
 */
export function generateSoftwareApplicationSchema(
  name: string,
  description: string,
  applicationCategory: string = "UtilitiesApplication",
  featureList: string[] = [],
  locale: string = "en"
) {
  const url = `${siteUrl}/${locale === "en" ? "" : `${locale}/`}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#webapp`,
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    ...(featureList.length > 0 && { "featureList": featureList }),
    "screenshot": `${siteUrl}/og-image.png`,
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01T00:00:00Z",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Photo To URL",
      "url": siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Photo To URL",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icons/light_58x58.png`,
      },
    },
  };
}

/**
 * 生成所有结构化数据的组合
 */
export function generateStructuredData(
  locale: string,
  translations: {
    faq: Array<{ question: string; answer: string }>;
    howTo: {
      name: string;
      description: string;
      steps: Array<{ name: string; text: string; image?: string }>;
    };
    softwareApplication: {
      name: string;
      description: string;
      featureList: string[];
    };
  }
) {
  const schemas = [
    generateFAQSchema(translations.faq, locale),
    generateHowToSchema(
      translations.howTo.name,
      translations.howTo.description,
      translations.howTo.steps,
      locale
    ),
    generateSoftwareApplicationSchema(
      translations.softwareApplication.name,
      translations.softwareApplication.description,
      "UtilitiesApplication",
      translations.softwareApplication.featureList,
      locale
    ),
  ];

  return schemas;
}

