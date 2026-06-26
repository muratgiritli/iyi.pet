import { useState } from "react";
import { Link } from "wouter";
import { Tag, MessageSquare, Star, CheckCircle, PlusCircle, Eye, Settings, ExternalLink, ShieldCheck, MoreVertical } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { brands } from "@/data/brands";
import { reviews } from "@/data/reviews";

const totalBrands = brands.length;
const totalReviews = brands.reduce((s, b) => s + b.reviewCount, 0);
const avgRating = (brands.reduce((s, b) => s + b.rating, 0) / brands.length).toFixed(1);
const approvedReviews = 892;

const statCards = [
  { label: "Toplam Marka", value: totalBrands, sub: "Tüm markalar", icon: Tag, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Toplam Yorum", value: totalReviews.toLocaleString("tr-TR"), sub: "Tüm zamanlar", icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
  { label: "Ortalama Puan", value: avgRating, sub: "Tüm markalar", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Onaylanmış Yorum", value: approvedReviews.toLocaleString("tr-TR"), sub: "Yayında olanlar", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
];

const quickActions = [
  { label: "Yeni Marka Ekle", desc: "Mam markası ekleyin", icon: PlusCircle, color: "text-green-600", bg: "bg-green-50", href: "/admin/markalar" },
  { label: "Yorumları Görüntüle", desc: "Gelen yorumları inceleyin", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/yorumlar" },
  { label: "Yorum Ayarları", desc: "Yorum ayarlarını düzenleyin", icon: Settings, color: "text-orange-500", bg: "bg-orange-50", href: "/admin/yorum-ayarlari" },
  { label: "Siteyi Görüntüle", desc: "Siteyi yeni sekmede açın", icon: ExternalLink, color: "text-purple-600", bg: "bg-purple-50", href: "/" },
];

type ReviewStatus = "approved" | "pending";
const recentReviews: { review: (typeof reviews)[0]; brand: (typeof brands)[0]; status: ReviewStatus }[] = reviews
  .slice(0, 5)
  .map((r, i) => ({
    review: r,
    brand: brands.find((b) => b.id === r.brandId) ?? brands[0],
    status: (i === 3 ? "pending" : "approved") as ReviewStatus,
  }));

export function AdminDashboardPage() {
  const [reviewsEnabled, setReviewsEnabled] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Genel Bakış</h1>
          <p className="text-sm text-gray-500 mt-0.5">Yönetim paneline hoş geldiniz.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm" data-testid={`stat-${label}`}>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm font-medium text-gray-700 mt-0.5">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, color, bg, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-start gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                data-testid={`quick-action-${label}`}
              >
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Review settings toggle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Yorum Ayarları</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Yorum Yazma</p>
              <p className="text-xs text-gray-500 mt-0.5">Ziyaretçilerin yorum yazmasına izin verin.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewsEnabled(!reviewsEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${reviewsEnabled ? "bg-green-500" : "bg-gray-300"}`}
                data-testid="toggle-reviews-enabled"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${reviewsEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-sm font-medium ${reviewsEnabled ? "text-green-600" : "text-gray-400"}`}>
                {reviewsEnabled ? "Açık" : "Kapalı"}
              </span>
            </div>
          </div>
          {reviewsEnabled && (
            <div className="mt-3 flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <ShieldCheck size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-green-700">Yorum yazma şu anda AÇIK durumda.</p>
                <p className="text-xs text-green-600 mt-0.5">Ziyaretçiler markalar için yorum yazabilir.</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Son Yorumlar</h2>
            <Link href="/admin/yorumlar" className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-0">
            {recentReviews.map(({ review, brand, status }) => (
              <div key={review.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0" data-testid={`recent-review-${review.id}`}>
                <div
                  className="w-10 h-8 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ backgroundColor: brand.logoBg, color: brand.logoColor, fontSize: "8px" }}
                >
                  {brand.logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{review.author}</span>
                    <StarRating rating={review.rating} size={11} />
                    <span className="text-xs text-gray-400">· {review.timeAgo}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{review.text}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {status === "approved" ? "Onaylandı" : "Onay Bekliyor"}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors" data-testid={`button-review-more-${review.id}`}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Kısayollar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Markalar", desc: "Tüm markaları yönet", icon: Tag, href: "/admin/markalar" },
              { label: "Yorumlar", desc: "Yorumları listele ve yönet", icon: MessageSquare, href: "/admin/yorumlar" },
              { label: "Yorum Ayarları", desc: "Yorum ayarlarını düzenle", icon: Settings, href: "/admin/yorum-ayarlari" },
            ].map(({ label, desc, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                data-testid={`shortcut-${label}`}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-2">© 2024 iyi.pet · Tüm hakları saklıdır.</p>
      </div>
    </AdminLayout>
  );
}
