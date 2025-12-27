import { getTranslations } from "next-intl/server";
import {
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/structured-data";

interface StructuredDataProps {
  locale: string;
}

export async function StructuredData({ locale }: StructuredDataProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tLongform = await getTranslations({ locale, namespace: "home.longform" });
  const tSeo = await getTranslations({ locale, namespace: "seo.home" });

  // FAQ Schema
  const faqItems = [
    {
      question: tLongform("faq.items.1.q"),
      answer: tLongform("faq.items.1.a"),
    },
    {
      question: tLongform("faq.items.2.q"),
      answer: tLongform("faq.items.2.a"),
    },
    {
      question: tLongform("faq.items.3.q"),
      answer: tLongform("faq.items.3.a"),
    },
    {
      question: tLongform("faq.items.4.q"),
      answer: tLongform("faq.items.4.a"),
    },
    {
      question: tLongform("faq.items.5.q"),
      answer: tLongform("faq.items.5.a"),
    },
  ];

  // HowTo Schema
  const howToSteps = [
    {
      name: t("process.steps.1.title"),
      text: t("process.steps.1.desc"),
    },
    {
      name: t("process.steps.2.title"),
      text: t("process.steps.2.desc"),
    },
    {
      name: t("process.steps.3.title"),
      text: t("process.steps.3.desc"),
    },
  ];

  // SoftwareApplication Schema
  const featureList = [
    t("features.items.cdn.title"),
    t("features.items.save.title"),
    t("features.items.clipboard.title"),
    t("features.items.nosignup.title"),
  ];

  const faqSchema = generateFAQSchema(faqItems, locale);
  const howToSchema = generateHowToSchema(
    t("how.title"),
    t("how.note"),
    howToSteps,
    locale
  );
  const softwareSchema = generateSoftwareApplicationSchema(
    tSeo("title"),
    tSeo("description"),
    "UtilitiesApplication",
    featureList,
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  );
}

