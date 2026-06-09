export const languages = [
  { name: "JavaScript", slug: "javascript" },
  { name: "Python", slug: "python" },
  { name: "Java", slug: "java" },
  { name: "C++", slug: "cpp" },
  { name: "C#", slug: "csharp" },
];

export const javascriptCategories = [
  { name: "Backend", slug: "backend" },
  { name: "Frontend", slug: "frontend" },
];

export function getLanguageBySlug(slug) {
  return languages.find((language) => language.slug === slug);
}

export function getCategoryBySlug(language, slug) {
  if (language?.name === "JavaScript") {
    return javascriptCategories.find((category) => category.slug === slug);
  }

  return slug === "general" ? { name: "General", slug: "general" } : undefined;
}

export function getTemplatePath(language, category) {
  const languageData = languages.find((item) => item.name === language);
  const categorySlug = category.toLowerCase();

  return `/${languageData?.slug ?? "javascript"}/${categorySlug}`;
}
