import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { ChevronRight, Globe, Package, PenLine, ThumbsUp, MoreVertical, ChevronLeft, ChevronDown } from "lucide-react";
import { Header } from "@/components/Header";
import { StarRating } from "@/components/StarRating";
import { BrandLogo } from "@/components/BrandLogo";
import { brands } from "@/data/brands";
import { getReviewsByBrandId, getRatingDistribution, Review } from "@/data/reviews";

const REVIEWS_PER_PAGE = 5;

const avatarColors = [
  "bg-green-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-rose-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-indigo-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function ReviewCard({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0" data-testid={`review-card-${review.id}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(review.author)}`}>
          <span className="text-white text-sm font-semibold">{review.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
              <StarRating rating={review.rating} size={13} />
              <span className="text-gray-400 text-xs">· {review.timeAgo}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  if (!liked) {
                    setLiked(true);
                    setLikes(likes + 1);
                  } else {
                    setLiked(false);
                    setLikes(likes - 1);
                  }
                }}
                className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-green-600" : "text-gray-400 hover:text-gray-600"}`}
                data-testid={`button-like-${review.id}`}
              >
                <ThumbsUp size={13} />
                <span>{likes}</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" data-testid={`button-more-${review.id}`}>
                <MoreVertical size={15} />
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
        </div>
      </div>
    </div>
  );
}

const sortOptions = [
  { value: "newest", label: "En Yeniler" },
  { value: "highest", label: "En Yüksek Puan" },
  { value: "lowest", label: "En Düşük Puan" },
  { value: "most_liked", label: "En Çok Beğenilen" },
];

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = sortOptions.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors"
        data-testid="button-sort"
      >
        {current?.label}
        <ChevronDown size={13} className="text-gray-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${opt.value === value ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"}`}
                data-testid={`option-sort-${opt.value}`}
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

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-4 pb-2" data-testid="pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        data-testid="button-prev-page"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${current === page ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            data-testid={`button-page-${page}`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        data-testid="button-next-page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function BrandPage() {
  const [, params] = useRoute("/marka/:slug");
  const slug = params?.slug;

  const brand = brands.find((b) => b.slug === slug);

  const allReviews = brand ? getReviewsByBrandId(brand.id) : [];
  const distribution = brand ? getRatingDistribution(brand.id) : {};

  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...allReviews];
    if (starFilter !== null) list = list.filter((r) => r.rating === starFilter);
    switch (sortBy) {
      case "highest": list.sort((a, b) => b.rating - a.rating); break;
      case "lowest": list.sort((a, b) => a.rating - b.rating); break;
      case "most_liked": list.sort((a, b) => b.likes - a.likes); break;
      default: break;
    }
    return list;
  }, [allReviews, starFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / REVIEWS_PER_PAGE));
  const paged = filtered.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  const handleStarFilter = (star: number | null) => {
    setStarFilter(star);
    setPage(1);
  };

  const totalReviews = brand?.reviewCount ?? allReviews.length;

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg">Marka bulunamadı.</p>
          <Link href="/" className="mt-4 inline-block text-green-600 hover:underline">Ana sayfaya dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" data-testid="breadcrumb">
          <Link href="/" className="hover:text-gray-700 transition-colors">Ana Sayfa</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link href="/" className="hover:text-gray-700 transition-colors">Mama Markaları</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-green-600 font-medium">{brand.name}</span>
        </nav>

        {/* Brand card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
          <div className="flex gap-4">
            <div
              className="w-28 h-24 rounded-lg border border-gray-100 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: brand.logoBg }}
            >
              <span
                className="font-bold text-center leading-tight px-2"
                style={{
                  color: brand.logoColor,
                  fontSize: brand.logoText.length > 8 ? "12px" : "15px",
                }}
              >
                {brand.logoText}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{brand.name}</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                {getBrandDescription(brand.name)}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-green-600 transition-colors" data-testid="link-website">
                  <Globe size={13} />
                  <span>Web Sitesi</span>
                </button>
                <span className="text-gray-300">|</span>
                <button className="flex items-center gap-1.5 hover:text-green-600 transition-colors" data-testid="link-products">
                  <Package size={13} />
                  <span>Tüm Ürünleri</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {brand.rating.toFixed(1)}<span className="text-lg font-normal text-gray-400"> / 5</span>
                </div>
                <StarRating rating={brand.rating} size={20} />
                <p className="text-xs text-gray-400 mt-1">({totalReviews.toLocaleString("tr-TR")} yorum)</p>
              </div>
              <button
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full justify-center"
                data-testid="button-write-review"
              >
                <PenLine size={14} />
                Yorum Yaz
              </button>
            </div>
          </div>
        </div>

        {/* Star distribution */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Yıldız Puanına Göre Yorumlar</h2>
          <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleStarFilter(null)}
              className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all flex-shrink-0 min-w-[70px] ${starFilter === null ? "border-green-600 bg-white text-green-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
              data-testid="button-filter-all"
            >
              <span className="font-semibold">Tümü</span>
              <span className="text-xs text-gray-400 mt-0.5">{totalReviews.toLocaleString("tr-TR")}</span>
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => handleStarFilter(star)}
                className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all flex-shrink-0 min-w-[70px] ${starFilter === star ? "border-green-600 bg-white text-green-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                data-testid={`button-filter-star-${star}`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{star}</span>
                  <span className="text-amber-400 text-xs">★</span>
                </div>
                <span className="text-xs text-gray-400 mt-0.5">{(distribution[star] ?? 0).toLocaleString("tr-TR")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">
              Yorumlar{" "}
              <span className="text-gray-400 font-normal">({filtered.length.toLocaleString("tr-TR")})</span>
            </h2>
            <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} />
          </div>

          {paged.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Bu filtreyle yorum bulunamadı.
            </div>
          ) : (
            paged.map((review) => <ReviewCard key={review.id} review={review} />)
          )}

          {totalPages > 1 && (
            <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}
        </div>
      </main>
    </div>
  );
}

function getBrandDescription(name: string): string {
  const descriptions: Record<string, string> = {
    "Royal Canin": "1968 yılında kurulan Royal Canin, evcil hayvanların yaş, ırk, yaşam tarzı ve özel ihtiyaçlarına göre bilimsel olarak geliştirilmiş beslenme çözümleri sunar.",
    "Orijen": "Kanada'dan gelen Orijen, taze ve bölgesel malzemelerle üretilen, tahılsız, yüksek proteinli premium mama markasıdır.",
    "Acana": "Orijen'in kardeş markası olan Acana, aynı kalite anlayışıyla daha erişilebilir fiyat noktasında premium mama üretmektedir.",
    "Pro Plan": "Purina Pro Plan, veterinerler ve beslenme uzmanlarıyla işbirliği içinde geliştirilmiş, bilimsel temelli beslenme formülleri sunar.",
    "Hill's": "Hill's Pet Nutrition, 85 yılı aşkın deneyimiyle veteriner onaylı, hassas ve reçeteli mama serileriyle öne çıkan köklü bir markadır.",
    "N&D": "İtalyan markası Farmina tarafından üretilen N&D, tahılsız, doğal ve yüksek kaliteli ingredientlerle hazırlanan premium mama serisidir.",
    "Brit Care": "Çek Cumhuriyeti kökenli Brit Care, tahılsız formülleri ve yüksek et oranıyla Avrupa'nın önde gelen premium mama markalarından biridir.",
    "Advance": "İspanyol kökenli Advance, veteriner diyetleri ve günlük beslenme ürünleriyle geniş bir yelpazede kaliteli mama çözümleri sunmaktadır.",
    "Purina One": "Purina One, bilimsel formülleri ve uygun fiyatıyla her bütçeye hitap eden, köpek ve kediler için dengeli beslenme çözümleri sunar.",
    "Monge": "İtalya'nın saygın mama markası Monge, doğal ve kaliteli ingredientlerle evcil hayvanların sağlıklı yaşamını destekleyen ürünler üretmektedir.",
  };
  return descriptions[name] ?? `${name}, evcil hayvanlar için kaliteli ve dengeli beslenme ürünleri sunan güvenilir bir mama markasıdır.`;
}
