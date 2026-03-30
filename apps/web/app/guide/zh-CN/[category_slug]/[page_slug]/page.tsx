import { renderGuidePage } from "../../../guide-page-view";

export default async function ChineseGuideChildPage({ params }: { params: Promise<{ category_slug: string; page_slug: string }> }) {
  const { category_slug, page_slug } = await params;
  return renderGuidePage("zh-CN", category_slug, page_slug);
}
