import { useState } from "react";
import { Check, X, Search, Trash2, Flag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { useData } from "@/contexts/DataContext";
import {
  useListReviews,
  useUpdateReviewStatus,
  useDeleteReview,
  useBulkReviewAction,
  getListReviewsQueryKey,
  getListPublicReviewsQueryKey,
  getListBrandsQueryKey,
  getGetStatsQueryKey,
  type AdminReview,
} from "@workspace/api-client-react";
import { formatTimeAgo } from "@/lib/time";

type StatusFilter = "all" | "approved" | "pending" | "rejected" | "reported";

export function AdminReviewsPage() {
  const { brands } = useData();
  const queryClient = useQueryClient();
  const { data: reviews = [] } = useListReviews();
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  const bulkAction = useBulkReviewAction();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListPublicReviewsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListBrandsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
  }

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true : filter === "reported" ? r.reportCount > 0 : r.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: reviews.length,
    approved: reviews.filter((r) => r.status === "approved").length,
    pending: reviews.filter((r) => r.status === "pending").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    reported: reviews.filter((r) => r.reportCount > 0).length,
  };

  const filterTabs: { value: StatusFilter; label: string }[] = [
    { value: "all", label: `Tümü (${counts.all})` },
    { value: "approved", label: `Onaylı (${counts.approved})` },
    { value: "pending", label: `Bekleyen (${counts.pending})` },
    { value: "rejected", label: `Reddedilen (${counts.rejected})` },
    { value: "reported", label: `Şikayetli (${counts.reported})` },
  ];

  const filteredIds = filtered.map((r) => r.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      if (filteredIds.every((id) => prev.has(id))) {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...filteredIds]);
    });
  }

  function handleStatus(id: number, status: "approved" | "rejected") {
    updateStatus.mutate({ id, data: { status } }, { onSettled: invalidate });
  }

  function handleDelete(review: AdminReview) {
    if (deleteConfirm === review.id) {
      deleteReview.mutate(
        { id: review.id },
        {
          onSettled: () => {
            invalidate();
            setSelected((prev) => {
              const next = new Set(prev);
              next.delete(review.id);
              return next;
            });
          },
        },
      );
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(review.id);
    }
  }

  function handleBulk(action: "approve" | "reject" | "delete") {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (action === "delete" && !confirm(`${ids.length} yorumu silmek istediğinize emin misiniz?`)) return;
    bulkAction.mutate(
      { data: { ids, action } },
      {
        onSettled: () => {
          invalidate();
          setSelected(new Set());
        },
      },
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tüm kullanıcı yorumlarını yönetin.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" placeholder="Yorum ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="input-search-reviews" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {filterTabs.map((tab) => (
                <button key={tab.value} onClick={() => setFilter(tab.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === tab.value ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  data-testid={`filter-${tab.value}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk toolbar */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-3 flex-wrap bg-gray-50/60">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                data-testid="checkbox-select-all" />
              Tümünü seç
            </label>
            {selected.size > 0 && (
              <>
                <span className="text-xs text-gray-500">{selected.size} seçili</span>
                <div className="flex gap-1.5 ml-auto">
                  <button onClick={() => handleBulk("approve")} disabled={bulkAction.isPending}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors"
                    data-testid="bulk-approve">
                    <Check size={12} /> Onayla
                  </button>
                  <button onClick={() => handleBulk("reject")} disabled={bulkAction.isPending}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 transition-colors"
                    data-testid="bulk-reject">
                    <X size={12} /> Reddet
                  </button>
                  <button onClick={() => handleBulk("delete")} disabled={bulkAction.isPending}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
                    data-testid="bulk-delete">
                    <Trash2 size={12} /> Sil
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">Yorum bulunamadı.</div>
            )}
            {filtered.map((review) => {
              const brand = brands.find((b) => b.id === review.brandId) ?? brands[0];
              return (
                <div key={review.id} className="flex items-start gap-3 px-4 py-3.5" data-testid={`review-row-${review.id}`}>
                  <input type="checkbox" checked={selected.has(review.id)} onChange={() => toggleSelect(review.id)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
                    data-testid={`checkbox-${review.id}`} />
                  <div className="w-9 h-7 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: brand?.logoBg, color: brand?.logoColor, fontSize: "7px", fontWeight: 700 }}>
                    {brand?.logoText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{review.author}</span>
                      <StarRating rating={review.rating} size={11} />
                      <span className="text-xs text-gray-400">· {formatTimeAgo(review.createdAt)}</span>
                      <span className="text-xs text-gray-400">· {brand?.name}</span>
                      {review.reportCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full" data-testid={`report-badge-${review.id}`}>
                          <Flag size={10} /> {review.reportCount}
                        </span>
                      )}
                    </div>
                    {review.title && <p className="text-xs font-semibold text-gray-700 mb-0.5">{review.title}</p>}
                    <p className="text-xs text-gray-600 line-clamp-2">{review.text}</p>
                    {review.phone && (
                      <p className="text-xs text-gray-400 mt-0.5">📞 {review.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${review.status === "approved" ? "bg-green-100 text-green-700" : review.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                      {review.status === "approved" ? "Onaylı" : review.status === "pending" ? "Bekliyor" : "Reddedildi"}
                    </span>
                    {review.status !== "approved" && (
                      <button onClick={() => handleStatus(review.id, "approved")}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="Onayla" data-testid={`button-approve-${review.id}`}>
                        <Check size={12} />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button onClick={() => handleStatus(review.id, "rejected")}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                        title="Reddet" data-testid={`button-reject-${review.id}`}>
                        <X size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${deleteConfirm === review.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"}`}
                      title={deleteConfirm === review.id ? "Onaylamak için tekrar tıkla" : "Sil"}
                      data-testid={`button-delete-${review.id}`}>
                      <Trash2 size={11} />
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
