export const guideLocales = ["en", "zh-CN"] as const;
export const defaultGuideLocale = "en";

export type GuideLocale = (typeof guideLocales)[number];
type LocalizedText = Record<GuideLocale, string>;

type GuidePageDefinition = {
  slug: string;
  title: LocalizedText;
  children?: GuidePageDefinition[];
};

export type GuidePage = {
  title: string;
  slug: string;
  children?: GuidePage[];
};

type GuideUiText = {
  guideTitle: string;
  language: string;
  previous: string;
  next: string;
};

const guidePageDefinitions: GuidePageDefinition[] = [
  {
    title: { en: "Getting started", "zh-CN": "快速开始" },
    slug: "getting-started",
  },
  {
    title: { en: "Projects", "zh-CN": "项目" },
    slug: "projects",
    children: [
      {
        title: { en: "Creating a project", "zh-CN": "创建项目" },
        slug: "creating-a-project",
      },
    ],
  },
  {
    title: { en: "Environments", "zh-CN": "环境" },
    slug: "environments",
    children: [
      {
        title: { en: "Environment basics", "zh-CN": "环境基础" },
        slug: "environment-basics",
      },
      {
        title: { en: "Using environments", "zh-CN": "使用环境" },
        slug: "using-environments",
      },
      {
        title: { en: "Updating environments", "zh-CN": "更新环境" },
        slug: "updating-environments",
      },
      {
        title: { en: "Access control", "zh-CN": "访问控制" },
        slug: "access-control",
      },
      {
        title: { en: "Dev environments", "zh-CN": "开发环境" },
        slug: "dev-environments",
      },
      {
        title: { en: "Version history", "zh-CN": "版本历史" },
        slug: "version-history",
      },
    ],
  },
  {
    title: { en: "Organizations", "zh-CN": "组织" },
    slug: "organizations",
    children: [
      {
        title: { en: "Invite users", "zh-CN": "邀请用户" },
        slug: "invite-users",
      },
    ],
  },
  {
    title: { en: "Configuration", "zh-CN": "配置" },
    slug: "configuration",
    children: [
      {
        title: { en: "Local configuration", "zh-CN": "本地配置" },
        slug: "local-configuration",
      },
      {
        title: { en: "Workspaces", "zh-CN": "工作区" },
        slug: "workspaces",
      },
    ],
  },
  {
    title: { en: "Deploy with Envie", "zh-CN": "使用 Envie 部署" },
    slug: "deploy-with-envie",
    children: [
      {
        title: { en: "Access tokens", "zh-CN": "访问令牌" },
        slug: "access-tokens",
      },
    ],
  },
  {
    title: { en: "Self-hosting", "zh-CN": "自托管" },
    slug: "self-hosting",
    children: [
      {
        title: { en: "Host Envie with Docker", "zh-CN": "使用 Docker 部署 Envie" },
        slug: "host-with-docker",
      },
    ],
  },
];

const guideUiText: Record<GuideLocale, GuideUiText> = {
  en: {
    guideTitle: "Envie User Guide",
    language: "Language",
    previous: "Previous",
    next: "Next",
  },
  "zh-CN": {
    guideTitle: "Envie 用户指南",
    language: "语言",
    previous: "上一篇",
    next: "下一篇",
  },
};

function localizeGuidePage(page: GuidePageDefinition, locale: GuideLocale): GuidePage {
  return {
    title: page.title[locale],
    slug: page.slug,
    children: page.children?.map((child) => localizeGuidePage(child, locale)),
  };
}

export function getGuidePages(locale: GuideLocale): GuidePage[] {
  return guidePageDefinitions.map((page) => localizeGuidePage(page, locale));
}

export function getGuideUiText(locale: GuideLocale): GuideUiText {
  return guideUiText[locale];
}

export function getGuideLocaleLabel(locale: GuideLocale): string {
  return locale === "en" ? "English" : "简体中文";
}

export function isGuideLocale(value: string | undefined): value is GuideLocale {
  return !!value && guideLocales.includes(value as GuideLocale);
}

export function getGuideBasePath(locale: GuideLocale): string {
  return locale === defaultGuideLocale ? "/guide" : `/guide/${locale}`;
}

export function getGuideHref(locale: GuideLocale, ...segments: string[]): string {
  return [getGuideBasePath(locale), ...segments].join("/").replace(/\/+/g, "/");
}

export function getGuideLandingHref(locale: GuideLocale): string {
  const firstPage = getGuidePages(locale)[0];
  if (!firstPage) {
    return getGuideBasePath(locale);
  }
  if (!firstPage.children?.length) {
    return getGuideHref(locale, firstPage.slug);
  }

  const firstChild = firstPage.children[0];
  return firstChild
    ? getGuideHref(locale, firstPage.slug, firstChild.slug)
    : getGuideHref(locale, firstPage.slug);
}

export function getGuideLocaleFromPathname(pathname: string): GuideLocale {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "guide" && isGuideLocale(segments[1])
    ? segments[1]
    : defaultGuideLocale;
}

export function localizeGuidePathname(pathname: string, locale: GuideLocale): string {
  const segments = pathname.split("/").filter(Boolean);
  const guideSegments = segments[0] === "guide"
    ? isGuideLocale(segments[1])
      ? segments.slice(2)
      : segments.slice(1)
    : [];

  return getGuideHref(locale, ...guideSegments);
}
