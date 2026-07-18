import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { ChevronRight, Globe, Package, PenLine, ThumbsUp, ThumbsDown, MoreVertical, ChevronLeft, ChevronDown, BadgeCheck, Flag } from "lucide-react";
import { Header } from "@/components/Header";
import { StarRating } from "@/components/StarRating";
import { ReviewModal } from "@/components/ReviewModal";
import { useData } from "@/contexts/DataContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSeo } from "@/lib/useSeo";
import { useListPublicReviews, type Review } from "@workspace/api-client-react";
import { formatTimeAgo } from "@/lib/time";
import { brandDescriptions } from "@/data/brands";

const REVIEWS_PER_PAGE = 5;
const avatarColors = ["bg-green-600","bg-blue-600","bg-purple-600","bg-orange-500","bg-rose-600","bg-teal-600","bg-amber-600","bg-indigo-600"];
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const TRANSLATION_TABS = [
  { lang: "en", label: "EN" },
  { lang: "ar", label: "AR" },
  { lang: "fr", label: "FR" },
  { lang: "es", label: "ES" },
] as const;

function ReviewTranslations({ translations, reviewId }: { translations: NonNullable<Review["translations"]>; reviewId: number }) {
  const [show, setShow] = useState(false);
  const available = TRANSLATION_TABS.filter((tab) => translations[tab.lang]);
  const [activeLang, setActiveLang] = useState<string>(available[0]?.lang ?? "en");
  if (available.length === 0) return null;
  const active = available.find((tab) => tab.lang === activeLang) ?? available[0];
  return (
    <div className="mt-2">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        data-testid={`button-translations-${reviewId}`}
      >
        <Globe size={12} />
        {show ? "Çevirileri gizle" : "Çevirileri göster"}
        <ChevronDown size={12} className={`transition-transform ${show ? "rotate-180" : ""}`} />
      </button>
      {show && (
        <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            {available.map((tab) => (
              <button
                key={tab.lang}
                onClick={() => setActiveLang(tab.lang)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${active.lang === tab.lang ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                data-testid={`tab-translation-${tab.lang}-${reviewId}`}
              >
                {tab.label}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-gray-400 uppercase tracking-wide">Otomatik çeviri</span>
          </div>
          <p
            className="text-gray-700 text-sm leading-relaxed"
            dir={active.lang === "ar" ? "rtl" : "ltr"}
            data-testid={`text-translation-${reviewId}`}
          >
            {translations[active.lang]}
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { getVote, vote, report, hasReported } = useData();
  const { t } = useLanguage();
  const [showReport, setShowReport] = useState(false);
  const currentVote = getVote(review.id);
  const reported = hasReported(review.id);
  const timeAgo = formatTimeAgo(review.createdAt);

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
              <span className="text-gray-400 text-xs">· {timeAgo}</span>
              {review.petType && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{review.petType}</span>}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => vote(review.id, "helpful")}
                className={`flex items-center gap-1 text-xs transition-colors ${currentVote === "helpful" ? "text-green-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
                title={t("review.helpful")}
                data-testid={`button-helpful-${review.id}`}
              >
                <ThumbsUp size={13} fill={currentVote === "helpful" ? "currentColor" : "none"} />
                <span>{review.helpfulCount}</span>
              </button>
              <button
                onClick={() => vote(review.id, "unhelpful")}
                className={`flex items-center gap-1 text-xs transition-colors ${currentVote === "unhelpful" ? "text-red-500 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
                title={t("review.unhelpful")}
                data-testid={`button-unhelpful-${review.id}`}
              >
                <ThumbsDown size={13} fill={currentVote === "unhelpful" ? "currentColor" : "none"} />
                <span>{review.unhelpfulCount}</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid={`button-more-${review.id}`}
                >
                  <MoreVertical size={15} />
                </button>
                {showReport && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowReport(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                      <button
                        onClick={() => { if (!reported) report(review.id); setShowReport(false); }}
                        disabled={reported}
                        className={`w-full text-left px-3 py-2.5 text-xs rounded-lg flex items-center gap-2 ${reported ? "text-gray-400 cursor-default" : "text-red-600 hover:bg-red-50"}`}
                        data-testid={`button-report-${review.id}`}
                      >
                        <Flag size={12} />
                        {reported ? t("review.reported") : t("review.report")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {review.title && <p className="text-sm font-semibold text-gray-800 mb-0.5">{review.title}</p>}
          <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
          {review.translations && <ReviewTranslations translations={review.translations} reviewId={review.id} />}
          {review.photoBase64 && (
            <div className="mt-2">
              <img src={review.photoBase64} alt={t("review.photoAlt")} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
          {review.status === "pending" && (
            <p className="text-xs text-amber-600 mt-1 font-medium">⏳ {t("review.pending")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const sortOpts = [
  { value: "newest" },
  { value: "highest" },
  { value: "lowest" },
  { value: "most_liked" },
];

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = sortOpts.find((o) => o.value === value);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50" data-testid="button-sort">
        {t(`rsort.${current?.value ?? "newest"}`)}<ChevronDown size={13} className="text-gray-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
            {sortOpts.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${opt.value === value ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"}`}
                data-testid={`option-sort-${opt.value}`}>
                {t(`rsort.${opt.value}`)}
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
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }
  return (
    <div className="flex items-center justify-center gap-1 pt-4 pb-2" data-testid="pagination">
      <button onClick={() => onChange(current - 1)} disabled={current === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed" data-testid="button-prev-page">
        <ChevronLeft size={16} />
      </button>
      {pages.map((page, idx) => page === "..." ? (
        <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
      ) : (
        <button key={page} onClick={() => onChange(page as number)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${current === page ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          data-testid={`button-page-${page}`}>
          {page}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed" data-testid="button-next-page">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function BrandPage() {
  const [, params] = useRoute("/marka/:slug");
  const slug = params?.slug;
  const { brands } = useData();
  const { t } = useLanguage();
  const { data: reviews = [] } = useListPublicReviews();

  const brand = brands.find((b) => b.slug === slug);

  const allReviews = useMemo(() => {
    if (!brand) return [];
    return reviews.filter((r) => r.brandId === brand.id);
  }, [brand, reviews]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const distribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });
    return dist;
  }, [allReviews]);

  const filtered = useMemo(() => {
    let list = [...allReviews];
    if (starFilter !== null) list = list.filter((r) => r.rating === starFilter);
    switch (sortBy) {
      case "highest": list.sort((a, b) => b.rating - a.rating); break;
      case "lowest": list.sort((a, b) => a.rating - b.rating); break;
      case "most_liked": list.sort((a, b) => b.helpfulCount - a.helpfulCount); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.id - a.id); break;
    }
    return list;
  }, [allReviews, starFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / REVIEWS_PER_PAGE));
  const paged = filtered.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  const handleStarFilter = (star: number | null) => { setStarFilter(star); setPage(1); };
  const totalReviewCount = allReviews.length || brand?.reviewCount || 0;

  const brandJsonLd = useMemo(() => {
    if (!brand) return undefined;
    const d = brand.description || brandDescriptions[brand.name] || t("brand.defaultDesc", { name: brand.name });
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: brand.name,
      description: d,
      ...(totalReviewCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: brand.rating.toFixed(1),
              reviewCount: totalReviewCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    };
  }, [brand, totalReviewCount, t]);

  useSeo({
    title: brand ? t("seo.brandTitle", { name: brand.name }) : t("seo.notFoundTitle"),
    description: brand
      ? t("seo.brandDesc", { name: brand.name, n: totalReviewCount, rating: brand.rating.toFixed(1) })
      : t("brand.notFoundText"),
    jsonLd: brandJsonLd,
  });

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("brand.notFoundTitle")}</h1>
          <p className="text-gray-500 mb-6">{t("brand.notFoundText")}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            {t("brand.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  const desc = brand.description || brandDescriptions[brand.name] || `${brand.name}, evcil hayvanlar için kaliteli mama ürünleri sunan güvenilir bir markadır.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" data-testid="breadcrumb">
          <Link href="/" className="hover:text-gray-700">{t("brand.breadcrumbHome")}</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link href="/" className="hover:text-gray-700">{t("nav.brands")}</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-green-600 font-medium">{brand.name}</span>
        </nav>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-20 h-16 rounded-lg border border-gray-100 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: brand.logoBg }}>
              <span className="font-bold text-center leading-tight px-1" style={{ color: brand.logoColor, fontSize: brand.logoText.length > 8 ? "10px" : "13px" }}>
                {brand.logoText}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{brand.name}</h1>
                {brand.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={12} />
                    {t("brand.verifiedBrand")}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{brand.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">/ 5</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={brand.rating} size={16} />
                <span className="text-xs text-gray-400">({t("brand.reviewsCount", { n: totalReviewCount.toLocaleString("tr-TR") })})</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {brand.websiteUrl ? (
                <a href={brand.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-green-600 transition-colors" data-testid="link-website">
                  <Globe size={13} /><span>{t("brand.website")}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-300" data-testid="link-website"><Globe size={13} /><span>{t("brand.website")}</span></span>
              )}
              <span className="text-gray-300">|</span>
              {brand.productsUrl ? (
                <a href={brand.productsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-green-600 transition-colors" data-testid="link-products">
                  <Package size={13} /><span>{t("brand.allProducts")}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-300" data-testid="link-products"><Package size={13} /><span>{t("brand.allProducts")}</span></span>
              )}
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              data-testid="button-write-review"
            >
              <PenLine size={14} />
              {t("brand.writeReview")}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">{t("brand.reviewsByStars")}</h2>
          <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
            <button onClick={() => handleStarFilter(null)}
              className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium flex-shrink-0 min-w-[70px] ${starFilter === null ? "border-green-600 bg-white text-green-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
              data-testid="button-filter-all">
              <span className="font-semibold">{t("brand.all")}</span>
              <span className="text-xs text-gray-400 mt-0.5">{totalReviewCount.toLocaleString("tr-TR")}</span>
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button key={star} onClick={() => handleStarFilter(star)}
                className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium flex-shrink-0 min-w-[70px] ${starFilter === star ? "border-green-600 bg-white text-green-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                data-testid={`button-filter-star-${star}`}>
                <div className="flex items-center gap-1"><span className="font-semibold">{star}</span><span className="text-amber-400 text-xs">★</span></div>
                <span className="text-xs text-gray-400 mt-0.5">{(distribution[star] ?? 0).toLocaleString("tr-TR")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">{t("brand.reviews")} <span className="text-gray-400 font-normal">({filtered.length.toLocaleString("tr-TR")})</span></h2>
            <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} />
          </div>

          {paged.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">{t("brand.noReviews")}</div>
          ) : (
            paged.map((review) => <ReviewCard key={review.id} review={review} />)
          )}

          {totalPages > 1 && (
            <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}
        </div>
      </main>

      {showReviewModal && (
        <ReviewModal brandName={brand.name} brandId={brand.id} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
}
