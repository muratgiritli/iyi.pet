import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, Info, Globe, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { StarRating } from "@/components/StarRating";
import { BrandLogo } from "@/components/BrandLogo";
import { brands, categories, sortOptions, Brand } from "@/data/brands";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{rank}</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{rank}</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{rank}</span>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
      <span className="text-gray-500 text-sm font-medium">{rank}</span>
    </div>
  );
}

function FilterDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700 whitespace-nowrap"
        data-testid="button-filter"
      >
        <span>{current?.label}</span>
        <ChevronDown size={12} className="text-gray-500 flex-shrink-0" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  opt.value === value ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"
                }`}
                data-testid={`option-filter-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BrandRow({ brand, rank }: { brand: Brand; rank: number }) {
  return (
    <Link
      href={`/marka/${brand.slug}`}
      className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
      data-testid={`row-brand-${brand.id}`}
    >
      <RankBadge rank={rank} />
      <BrandLogo brand={brand} />
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-gray-900 text-sm block truncate">{brand.name}</span>
        <div className="flex items-center gap-1.5 mt-0.5 sm:hidden">
          <StarRating rating={brand.rating} size={13} />
          <span className="text-gray-900 font-bold text-xs">{brand.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({brand.reviewCount.toLocaleString("tr-TR")})</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <StarRating rating={brand.rating} size={15} />
        <span className="text-gray-900 font-bold text-sm w-7 text-right">
          {brand.rating.toFixed(1)}
        </span>
      </div>
      <div className="hidden sm:block text-gray-400 text-sm w-16 text-right flex-shrink-0">
        ({brand.reviewCount.toLocaleString("tr-TR")})
      </div>
      <ChevronRight
        size={16}
        className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
      />
    </Link>
  );
}

type OriginTab = "all" | "global" | "local";

export function HomePage() {
  const [originTab, setOriginTab] = useState<OriginTab>("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating_desc");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let list = [...brands];
    if (originTab !== "all") {
      list = list.filter((b) => b.origin === originTab);
    }
    if (category !== "all") {
      list = list.filter((b) => b.category === category);
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        case "reviews_desc":
          return b.reviewCount - a.reviewCount;
        case "name_asc":
          return a.name.localeCompare(b.name, "tr");
        default:
          return b.rating - a.rating;
      }
    });
    return list;
  }, [originTab, category, sortBy]);

  const displayed = showAll ? filtered : filtered.slice(0, 10);

  const originTabs: { value: OriginTab; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "Tümü", icon: null },
    { value: "global", label: "Global Markalar", icon: <Globe size={14} className="flex-shrink-0" /> },
    { value: "local", label: "Yerel Markalar", icon: <MapPin size={14} className="flex-shrink-0" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mama Markaları</h1>
          <p className="text-sm text-gray-500">
            Gerçek pet sahiplerinin yorumlarına göre en iyi mama markaları sıralaması.
          </p>
        </div>

        {/* Origin tabs */}
        <div className="flex items-center gap-2 mb-4">
          {originTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setOriginTab(tab.value);
                setShowAll(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${
                originTab === tab.value
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              data-testid={`tab-origin-${tab.value}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <FilterDropdown
              value={category}
              onChange={setCategory}
              options={categories}
            />
            <FilterDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
          </div>
          <button
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            data-testid="button-ranking-info"
          >
            <Info size={12} />
            <span className="hidden sm:inline">Sıralama nasıl belirlenir?</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <div className="w-7 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-400">#</span>
            </div>
            <div className="w-16 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-semibold text-gray-400">Marka</span>
            </div>
            <div className="hidden sm:block flex-shrink-0 pr-7">
              <span className="text-xs font-semibold text-gray-400">Puan</span>
            </div>
            <div className="hidden sm:block w-16 text-right flex-shrink-0">
              <span className="text-xs font-semibold text-gray-400">Yorum (Toplam)</span>
            </div>
          </div>

          {displayed.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
              <span className="text-sm">Bu kategoride marka bulunamadı.</span>
            </div>
          ) : (
            displayed.map((brand, index) => (
              <BrandRow key={brand.id} brand={brand} rank={index + 1} />
            ))
          )}
        </div>

        {!showAll && filtered.length > 10 && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-all bg-white shadow-sm"
              data-testid="button-show-all"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-green-600">
                <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 6h10M4 9h7M4 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Tüm markaları inceleyin
            </button>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        )}

        {showAll && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              data-testid="button-show-less"
            >
              Daha az göster
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
