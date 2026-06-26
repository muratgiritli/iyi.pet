import { useState } from "react";
import { MoreVertical, Check, X, Search } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { reviews } from "@/data/reviews";
import { brands } from "@/data/brands";

type Status = "approved" | "pending" | "rejected";
const initialStatuses: Record<number, Status> = Object.fromEntries(
  reviews.map((r, i) => [r.id, i % 5 === 3 ? "pending" : "approved"])
);

export function AdminReviewsPage() {
  const [statuses, setStatuses] = useState<Record<number, Status>>(initialStatuses);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  const setStatus = (id: number, status: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const filtered = reviews.filter((r) => {
    const matchSearch = r.author.toLowerCase().includes(search.toLowerCase()) || r.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || statuses[r.id] === filter;
    return matchSearch && matchFilter;
  });

  const filterTabs: { value: Status | "all"; label: string }[] = [
    { value: "all", label: `Tümü (${reviews.length})` },
    { value: "approved", label: `Onaylı (${Object.values(statuses).filter((s) => s === "approved").length})` },
    { value: "pending", label: `Bekleyen (${Object.values(statuses).filter((s) => s === "pending").length})` },
    { value: "rejected", label: `Reddedilen (${Object.values(statuses).filter((s) => s === "rejected").length})` },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tüm kullanıcı yorumlarını yönetin.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Yorum ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="input-search-reviews"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === tab.value ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  data-testid={`filter-${tab.value}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">Yorum bulunamadı.</div>
            )}
            {filtered.map((review) => {
              const brand = brands.find((b) => b.id === review.brandId) ?? brands[0];
              const status = statuses[review.id];
              return (
                <div key={review.id} className="flex items-start gap-3 px-4 py-3.5" data-testid={`review-row-${review.id}`}>
                  <div
                    className="w-9 h-7 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: brand.logoBg, color: brand.logoColor, fontSize: "7px", fontWeight: 700 }}
                  >
                    {brand.logoText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{review.author}</span>
                      <StarRating rating={review.rating} size={11} />
                      <span className="text-xs text-gray-400">· {review.timeAgo}</span>
                      <span className="text-xs text-gray-400">· {brand.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{review.text}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status === "approved" ? "bg-green-100 text-green-700" : status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                      {status === "approved" ? "Onaylı" : status === "pending" ? "Bekliyor" : "Reddedildi"}
                    </span>
                    {status !== "approved" && (
                      <button
                        onClick={() => setStatus(review.id, "approved")}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="Onayla"
                        data-testid={`button-approve-${review.id}`}
                      >
                        <Check size={12} />
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        onClick={() => setStatus(review.id, "rejected")}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                        title="Reddet"
                        data-testid={`button-reject-${review.id}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors" data-testid={`button-more-${review.id}`}>
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
