import { useState, useRef, useEffect } from "react";
import { Search, Globe, Menu, X, PawPrint } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useData } from "@/contexts/DataContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [location, navigate] = useLocation();
  const { brands } = useData();
  const { lang, toggleLang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.trim().length >= 1
    ? brands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  function doSearch(q: string) {
    if (!q.trim()) return;
    setShowSuggestions(false);
    setQuery("");
    navigate(`/?q=${encodeURIComponent(q.trim())}`);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.closest(".search-wrapper")?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0" data-testid="link-logo">
          <span className="text-xl font-bold text-green-700">iyi</span>
          <span className="text-xl font-bold text-gray-800">.pet</span>
          <PawPrint size={14} className="text-green-600 ml-0.5 -mt-1" />
        </Link>

        <div className="flex-1 relative search-wrapper">
          <input
            ref={inputRef}
            type="search"
            placeholder={t("header.searchPlaceholder")}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(query); }}
            className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            data-testid="input-search"
          />
          <button
            onClick={() => doSearch(query)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Search size={16} />
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {suggestions.map((b) => (
                <button
                  key={b.id}
                  onMouseDown={() => { navigate(`/marka/${b.slug}`); setQuery(""); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  data-testid={`suggestion-${b.slug}`}
                >
                  <div
                    className="w-8 h-6 rounded border border-gray-100 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: b.logoBg }}
                  >
                    <span style={{ color: b.logoColor, fontSize: "7px", fontWeight: 700 }}>{b.logoText}</span>
                  </div>
                  <span className="font-medium text-gray-800">{b.name}</span>
                  <span className="text-gray-400 text-xs ml-auto">{b.rating.toFixed(1)} ★</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleLang} className="flex items-center gap-1 text-sm text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100" data-testid="button-language">
            <Globe size={16} className="text-gray-500" />
            <span className="font-medium">{lang.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            data-testid="button-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="max-w-3xl mx-auto px-4 pb-4 border-t border-gray-100 bg-white">
          <nav className="pt-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              data-testid="link-menu-mama-markaları">
              {t("nav.brands")}
            </Link>
            {[
              { key: "nav.guide", id: "guide" },
              { key: "nav.findVet", id: "find-vet" },
              { key: "nav.blog", id: "blog" },
              { key: "nav.about", id: "about" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-400 text-left rounded-lg cursor-default"
                data-testid={`link-menu-${item.id}`}
              >
                {t(item.key)} <span className="text-xs">{t("common.soon")}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
