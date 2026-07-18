import { useMemo, useState } from "react";
import { Sparkles, Save, Download, FileJson, Eraser, AlertTriangle, Loader2, Star, CalendarDays } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import {
  useListBrands,
  useGenerateReviews,
  getListBrandsQueryKey,
  getListReviewsQueryKey,
  getListPublicReviewsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import type { GeneratedReview } from "@workspace/api-client-react";
import { getApiErrorMessage } from "@/lib/apiError";

type LengthOption = "short" | "medium" | "long" | "mixed";

const LENGTH_LABELS: Record<LengthOption, string> = {
  short: "Kısa (1–2 cümle)",
  medium: "Orta (3–4 cümle)",
  long: "Uzun (5–7 cümle)",
  mixed: "Karışık (rastgele dağıt)",
};

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "bugün";
  if (days === 1) return "dün";
  if (days < 7) return `${days} gün önce`;
  if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
      ))}
    </span>
  );
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(reviews: GeneratedReview[]): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = "brandSlug,firstName,lastNameInitial,displayName,rating,petType,product,comment,createdAt,helpfulCount,notHelpfulCount";
  const rows = reviews.map((r) =>
    [r.brandSlug, r.firstName, r.lastNameInitial, r.displayName, r.rating, r.petType, r.product, r.comment, r.createdAt, r.helpfulCount, r.notHelpfulCount]
      .map(esc)
      .join(","),
  );
  return "\uFEFF" + [header, ...rows].join("\n");
}

export function AdminGeneratorPage() {
  const queryClient = useQueryClient();
  const { data: brands } = useListBrands();
  const generate = useGenerateReviews();

  const [brandId, setBrandId] = useState<number | "">("");
  const [petType, setPetType] = useState<"Kedi" | "Köpek">("Kedi");
  const [count, setCount] = useState(50);
  const [goodPercent, setGoodPercent] = useState(70);
  const [midPercent, setMidPercent] = useState(20);
  const [badPercent, setBadPercent] = useState(10);
  const [length, setLength] = useState<LengthOption>("mixed");

  const [results, setResults] = useState<GeneratedReview[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pendingMode, setPendingMode] = useState<"preview" | "save" | null>(null);

  const total = goodPercent + midPercent + badPercent;
  const totalOk = total === 100;
  const clampedCount = Math.min(500, Math.max(1, Math.floor(count) || 1));

  const previewCounts = useMemo(() => {
    const good = Math.floor((clampedCount * goodPercent) / 100);
    const mid = Math.floor((clampedCount * midPercent) / 100);
    const bad = clampedCount - good - mid;
    return { good, mid, bad };
  }, [clampedCount, goodPercent, midPercent]);

  const formReady = brandId !== "" && totalOk && !generate.isPending;
  const selectedBrand = brands?.find((b) => b.id === brandId);

  function run(mode: "preview" | "save") {
    if (brandId === "") return;
    setError("");
    setSavedCount(null);
    setPendingMode(mode);
    generate.mutate(
      {
        data: {
          brandId,
          petType,
          count: mode === "preview" ? 5 : clampedCount,
          goodPercent,
          midPercent,
          badPercent,
          length,
          save: mode === "save",
        },
      },
      {
        onSuccess: (res) => {
          setResults(res.reviews);
          setIsPreview(mode === "preview");
          setPendingMode(null);
          if (mode === "save") {
            setSavedCount(res.saved);
            queryClient.invalidateQueries({ queryKey: getListBrandsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListPublicReviewsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          }
        },
        onError: (err) => {
          setPendingMode(null);
          setError(getApiErrorMessage(err, "Yorum üretimi başarısız oldu. Lütfen tekrar deneyin."));
        },
      },
    );
  }

  function reset() {
    setBrandId("");
    setPetType("Kedi");
    setCount(50);
    setGoodPercent(70);
    setMidPercent(20);
    setBadPercent(10);
    setLength("mixed");
    setResults([]);
    setIsPreview(false);
    setSavedCount(null);
    setError("");
  }

  const slug = selectedBrand?.slug ?? "yorumlar";

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorum Üretici</h1>
          <p className="text-sm text-gray-500 mt-0.5">Seçilen marka için gerçekçi Türkçe yorumlar üretin ve kaydedin.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          {/* Brand */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mama Markası</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              data-testid="select-brand"
            >
              <option value="">Marka seçin…</option>
              {brands?.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Pet type */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Hayvan Türü</label>
            <div className="flex gap-4">
              {(["Kedi", "Köpek"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="petType" checked={petType === t} onChange={() => setPetType(t)}
                    className="accent-green-600" data-testid={`radio-pettype-${t.toLowerCase()}`} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Yorum Adedi</label>
            <input type="number" min={1} max={500} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-32 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              data-testid="input-count" />
            <span className="text-xs text-gray-400 ml-2">1–500 arası</span>
          </div>

          {/* Star distribution */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">Yıldız Dağılımı (%)</label>
            {[
              { label: "İyi (4–5 ★)", value: goodPercent, set: setGoodPercent, id: "good" },
              { label: "Orta (3 ★)", value: midPercent, set: setMidPercent, id: "mid" },
              { label: "Kötü (1–2 ★)", value: badPercent, set: setBadPercent, id: "bad" },
            ].map((g) => (
              <div key={g.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 flex-shrink-0">{g.label}</span>
                <input type="range" min={0} max={100} value={g.value}
                  onChange={(e) => g.set(Number(e.target.value))}
                  className="flex-1 accent-green-600" data-testid={`slider-${g.id}`} />
                <input type="number" min={0} max={100} value={g.value}
                  onChange={(e) => g.set(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  data-testid={`input-${g.id}-percent`} />
              </div>
            ))}
            {totalOk ? (
              <p className="text-xs text-green-700 font-medium" data-testid="text-distribution-preview">
                {previewCounts.good} İyi · {previewCounts.mid} Orta · {previewCounts.bad} Kötü
              </p>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium" data-testid="text-distribution-error">
                  Toplam %{total} — dağılım toplamı %100 olmalı.
                </p>
              </div>
            )}
          </div>

          {/* Length */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Yorum Uzunluğu</label>
            <select value={length} onChange={(e) => setLength(e.target.value as LengthOption)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              data-testid="select-length">
              {(Object.keys(LENGTH_LABELS) as LengthOption[]).map((k) => (
                <option key={k} value={k}>{LENGTH_LABELS[k]}</option>
              ))}
            </select>
          </div>

          {/* Date info */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-600">Tarihler: son 3 ay içinde rastgele dağıtılır.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium" data-testid="text-generate-error">{error}</p>
            </div>
          )}
          {savedCount !== null && (
            <p className="text-xs text-green-700 font-medium" data-testid="text-save-success">
              ✓ {savedCount} yorum üretildi ve kaydedildi. Çeviriler arka planda hazırlanıyor.
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => run("preview")} disabled={!formReady}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-white border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              data-testid="button-preview">
              {pendingMode === "preview" ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              Önizleme Üret
            </button>
            <button onClick={() => run("save")} disabled={!formReady}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              data-testid="button-generate-save">
              {pendingMode === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Yorumları Üret ve Kaydet
            </button>
            <button onClick={() => downloadFile(`${slug}-yorumlar.csv`, toCsv(results), "text/csv;charset=utf-8")}
              disabled={results.length === 0}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
              data-testid="button-download-csv">
              <Download size={15} /> CSV İndir
            </button>
            <button onClick={() => downloadFile(`${slug}-yorumlar.json`, JSON.stringify(results, null, 2), "application/json")}
              disabled={results.length === 0}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
              data-testid="button-download-json">
              <FileJson size={15} /> JSON İndir
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
              data-testid="button-reset">
              <Eraser size={15} /> Temizle
            </button>
          </div>
          {generate.isPending && (
            <p className="text-xs text-gray-500">
              Yorumlar yapay zekâ ile üretiliyor{pendingMode === "save" && clampedCount > 50 ? " — yüksek adetlerde bu birkaç dakika sürebilir" : ""}…
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              {isPreview ? "Önizleme (kaydedilmedi)" : `Üretilen Yorumlar (${results.length})`}
            </h2>
            <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
              {(isPreview ? results : results.slice(0, 50)).map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3.5" data-testid={`card-generated-review-${i}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{r.displayName}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <span className="text-xs text-gray-400">{relativeDate(r.createdAt)} · {r.petType}</span>
                  </div>
                  <p className="text-xs text-green-700 font-medium mt-1">{r.product}</p>
                  <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1.5">👍 {r.helpfulCount} · 👎 {r.notHelpfulCount}</p>
                </div>
              ))}
              {!isPreview && results.length > 50 && (
                <p className="text-xs text-gray-400">… ve {results.length - 50} yorum daha (tamamı CSV/JSON indirmelerinde).</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
