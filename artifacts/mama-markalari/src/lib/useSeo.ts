import { useEffect } from "react";

type JsonLd = Record<string, unknown>;

interface SeoOptions {
  title: string;
  description: string;
  jsonLd?: JsonLd | JsonLd[];
}

const JSON_LD_ID = "seo-jsonld";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, jsonLd }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    const existing = document.getElementById(JSON_LD_ID);
    if (existing) existing.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSON_LD_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const node = document.getElementById(JSON_LD_ID);
      if (node) node.remove();
    };
  }, [title, description, jsonLd]);
}
