import { StructuredData } from "./StructuredData";

interface HomeStructuredDataProps {
  locale: string;
}

/**
 * 首页结构化数据组件
 * 仅在首页显示，用于 SEO 和富摘要展示
 */
export async function HomeStructuredData({ locale }: HomeStructuredDataProps) {
  return await StructuredData({ locale });
}

