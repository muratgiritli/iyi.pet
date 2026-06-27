import { Link } from "wouter";
import { Tag, MessageSquare, Star, Clock, PlusCircle, Eye, Settings, ExternalLink, MoreVertical } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { useData } from "@/contexts/DataContext";
import { useEffect } from "react";

export function AdminDashboardPage() {
  const { brands, reviews, settings, saveSettings } = useData();

  useEffect(() => {
    document.title = "Admin Paneli – iyi.pet";
  }, []);

  const totalBrands = brands.length;
  const totalReviews = reviews.length;
  const avgRating = brands.length > 0
    ? (brands.filter((b) => b.rating > 0).reduce((s, b) => s + b.rating, 0) / brands.filter((b) => b.rating > 0).length).toFixed(1)
    : "0.0";
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;

  const statCards = [
    { label: "Toplam Marka", value: totalBrands, sub: "Tüm markalar", icon: Tag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Toplam Yorum", value: totalReviews.toLocaleString("tr-TR"), sub: "Tüm zamanlar", icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
    { label: "Ortalama Puan", value: avgRating, sub: "Tüm markalar", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Onay Bekleyen", value: pendingReviews, sub: "İnceleme gerekli", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const quickActions = [
    { label: "Yeni Marka Ekle", desc: "Mama markası ekleyin", icon: PlusCircle, color: "text-green-600", bg: "bg-green-50", href: "/admin/markalar" },
    { label: "Yorumları Görüntüle", desc: "Gelen yorumları inceleyin", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/yorumlar" },
    { label: "Yorum Ayarları", desc: "Yorum ayarlarını düzenleyin", icon: Settings, color: "text-orange-500", bg: "bg-orange-50", href: "/admin/yorum-ayarlari" },
    { label: "Siteyi Görüntüle", desc: "Siteyi yeni sekmede açın", icon: ExternalLink, color: "text-purple-600", bg: "bg-purple-50", href: "/" },
  ];

  const recentReviews = reviews.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Genel Bakış</h1>
          <p className="text-sm text-gray-500 mt-0.5">Yönetim paneline hoş geldiniz.</p>
        </div>

        {pendingReviews > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Clock size={18} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">{pendingReviews} yorum onay bekliyor</p>
              <p className="text-xs text-amber-600">Yorumları inceleyip onaylayın veya reddedin.</p>
            </div>
            <Link href="/admin/yorumlar" className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors flex-shrink-0">
              İncele
            </Link>
          </div>
        )}

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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, color, bg, href }) => (
              <Link key={label} href={href}
                className="flex flex-col items-start gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                data-testid={`quick-action-${label}`}>
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Son Yorumlar</h2>
            <Link href="/admin/yorumlar" className="text-sm text-green-600 font-medium hover:text-green-700">Tümünü Gör</Link>
          </div>
          <div className="space-y-0">
            {recentReviews.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Henüz yorum yok.</p>}
            {recentReviews.map((review) => {
              const brand = brands.find((b) => b.id === review.brandId);
              return (
                <div key={review.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0" data-testid={`recent-review-${review.id}`}>
                  <div className="w-10 h-8 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ backgroundColor: brand?.logoBg, color: brand?.logoColor, fontSize: "8px" }}>
                    {brand?.logoText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{review.author}</span>
                      <StarRating rating={review.rating} size={11} />
                      <span className="text-xs text-gray-400">· {review.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{review.text}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${review.status === "approved" ? "bg-green-100 text-green-700" : review.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                    {review.status === "approved" ? "Onaylı" : review.status === "pending" ? "Bekliyor" : "Reddedildi"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-2">© 2025 iyi.pet · Tüm hakları saklıdır.</p>
      </div>
    </AdminLayout>
  );
}
