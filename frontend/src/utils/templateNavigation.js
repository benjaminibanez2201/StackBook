export const languages = [
  { name: "JavaScript", slug: "javascript", icon: "javascript" },
  { name: "Python", slug: "python", icon: "python" },
  { name: "Java", slug: "java", icon: "java" },
  { name: "C++", slug: "cpp", icon: "cpp" },
  { name: "C#", slug: "csharp", icon: "cs" },
  { name: "SQL", slug: "sql", icon: "postgres" },
];

export const javascriptCategories = [
  { name: "Backend", slug: "backend" },
  { name: "Frontend", slug: "frontend" },
];

export const javascriptSubcategories = {
  backend: [
    "controllers",
    "services",
    "entities",
    "routes",
    "validations",
    "middlewares",
    "config",
  ],
  frontend: ["pages", "components", "hooks", "services", "styles"],
};

export function getLanguageBySlug(slug) {
  return languages.find((language) => language.slug === slug);
}

export function getCategoryBySlug(language, slug) {
  if (language?.name === "JavaScript") {
    return javascriptCategories.find((category) => category.slug === slug);
  }

  return slug === "general" ? { name: "General", slug: "general" } : undefined;
}

export function getSubcategories(language, category) {
  if (language === "JavaScript") {
    return javascriptSubcategories[category?.toLowerCase()] ?? [];
  }

  return ["general"];
}

export function getSubcategoryBySlug(language, category, slug) {
  return getSubcategories(language?.name, category?.name).find(
    (subcategory) => subcategory === slug,
  );
}

export function getTemplatePath(language, category, subcategory) {
  const languageData = languages.find((item) => item.name === language);
  const categorySlug = category.toLowerCase();
  const subcategorySlug = subcategory.toLowerCase();

  return `/${languageData?.slug ?? "javascript"}/${categorySlug}/${subcategorySlug}`;
}
