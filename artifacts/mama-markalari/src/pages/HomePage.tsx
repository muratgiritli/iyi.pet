import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronRight, Info, Globe, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { StarRating } from "@/components/StarRating";
import { BrandLogo } from "@/components/BrandLogo";
import { useData, FullBrand } from "@/contexts/DataContext";
import { categories, sortOptions } from "@/data/brands";

function RankBadge({ rank }: { rank: number }) {
  const base = "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0";
  if (rank === 1) return <div className={`${base} bg-green-600`}><span className="text-white text-xs font-bold">1</span></div>;
  if (rank === 2) return <div className={`${base} bg-gray-400`}><span className="text-white text-xs font-bold">2</span></div>;
  if (rank === 3) return <div className={`${base} bg-amber-600`}><span className="text-white text-xs font-bold">3</span></div>;
  return <div className={`${base}`}><span className="text-gray-500 text-sm font-medium">{rank}</span></div>;
}

function FilterDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white hover:bg-gray-50 font-medium text-gray-700 whitespace-nowrap"
        data-testid="button-filter"
      >
        <span>{current?.label}</span>
        <ChevronDown size={12} className="text-gray-500 flex-shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
            {options.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${opt.value === value ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"}`}
                data-testid={`option-filter-${opt.value}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BrandRow({ brand, rank }: { brand: FullBrand; rank: number }) {
  return (
    <Link
      href={`/marka/${brand.slug}`}
      className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
      data-testid={`row-brand-${brand.id}`}
    >
      <RankBadge rank={rank} />
      <BrandLogo brand={brand} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm truncate">{brand.name}</span>
          {brand.verified && (
            <span className="inline-flex items-center gap-0.5 text-xs text-green-700 font-medium bg-green-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
              ✓ Doğrulandı
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 sm:hidden">
          <StarRating rating={brand.rating} size={13} />
          <span className="text-gray-900 font-bold text-xs">{brand.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({brand.reviewCount.toLocaleString("tr-TR")})</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <StarRating rating={brand.rating} size={15} />
        <span className="text-gray-900 font-bold text-sm w-7 text-right">{brand.rating.toFixed(1)}</span>
      </div>
      <div className="hidden sm:block text-gray-400 text-sm w-16 text-right flex-shrink-0">({brand.reviewCount.toLocaleString("tr-TR")})</div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
    </Link>
  );
}

type OriginTab = "all" | "global" | "local";

export function HomePage() {
  const { brands } = useData();
  const [location] = useLocation();
  const searchQuery = new URLSearchParams(window.location.search).get("q") ?? "";

  const [originTab, setOriginTab] = useState<OriginTab>("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating_desc");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    document.title = "Mama Markaları Sıralaması – iyi.pet";
  }, []);

  const filtered = useMemo(() => {
    let list = brands.filter((b) => {
      if (originTab !== "all" && b.origin !== originTab) return false;
      if (category !== "all" && b.category !== category) return false;
      if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    list.sort((a, b) => {
      switch (sortBy) {
        case "rating_desc": return b.rating - a.rating;
        case "rating_asc": return a.rating - b.rating;
        case "reviews_desc": return b.reviewCount - a.reviewCount;
        case "name_asc": return a.name.localeCompare(b.name, "tr");
        default: return b.rating - a.rating;
      }
    });
    return list;
  }, [brands, originTab, category, sortBy, searchQuery]);

  const displayed = showAll ? filtered : filtered.slice(0, 10);

  const originTabs = [
    { value: "all" as OriginTab, label: "Tümü", icon: null },
    { value: "global" as OriginTab, label: "Global Markalar", icon: <Globe size={13} className="flex-shrink-0" /> },
    { value: "local" as OriginTab, label: "Yerel Markalar", icon: <MapPin size={13} className="flex-shrink-0" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {searchQuery ? `"${searchQuery}" için sonuçlar` : "Mama Markaları"}
          </h1>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `${filtered.length} marka bulundu.`
              : "Gerçek pet sahiplerinin yorumlarına göre en iyi mama markaları sıralaması."}
          </p>
        </div>

        {!searchQuery && (
          <div className="flex items-center gap-2 mb-4">
            {originTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setOriginTab(tab.value); setShowAll(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${originTab === tab.value ? "bg-green-600 text-white border-green-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                data-testid={`tab-origin-${tab.value}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <FilterDropdown value={category} onChange={setCategory} options={categories} />
            <FilterDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
          </div>
          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 flex-shrink-0" data-testid="button-ranking-info">
            <Info size={12} />
            <span className="hidden sm:inline">Sıralama nasıl belirlenir?</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <div className="w-7 flex-shrink-0"><span className="text-xs font-semibold text-gray-400">#</span></div>
            <div className="w-16 flex-shrink-0" />
            <div className="flex-1"><span className="text-xs font-semibold text-gray-400">Marka</span></div>
            <div className="hidden sm:block flex-shrink-0 pr-7"><span className="text-xs font-semibold text-gray-400">Puan</span></div>
            <div className="hidden sm:block w-16 text-right flex-shrink-0"><span className="text-xs font-semibold text-gray-400">Yorum</span></div>
          </div>

          {displayed.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
              <span className="text-sm">Bu filtreyle marka bulunamadı.</span>
            </div>
          ) : (
            displayed.map((brand, index) => <BrandRow key={brand.id} brand={brand} rank={index + 1} />)
          )}
        </div>

        {!showAll && filtered.length > 10 && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button onClick={() => setShowAll(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-all bg-white shadow-sm"
              data-testid="button-show-all">
              Tüm markaları inceleyin ({filtered.length - 10} daha)
            </button>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        )}

        {showAll && (
          <div className="mt-4 flex justify-center">
            <button onClick={() => setShowAll(false)} className="text-sm text-gray-500 hover:text-gray-700" data-testid="button-show-less">
              Daha az göster
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
