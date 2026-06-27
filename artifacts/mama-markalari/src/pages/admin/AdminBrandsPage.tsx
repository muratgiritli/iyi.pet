import { useState } from "react";
import { Plus, Search, ExternalLink, Pencil, Trash2, BadgeCheck, X, Save, Pin } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { useData } from "@/contexts/DataContext";
import {
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  getListBrandsQueryKey,
  getGetStatsQueryKey,
  type Brand,
  type BrandInput,
} from "@workspace/api-client-react";

interface BrandFormData {
  name: string;
  slug: string;
  category: string;
  origin: "global" | "local";
  logoText: string;
  logoColor: string;
  logoBg: string;
  websiteUrl: string;
  productsUrl: string;
  verified: boolean;
  description: string;
}

const empty: BrandFormData = {
  name: "", slug: "", category: "standard", origin: "global",
  logoText: "", logoColor: "#1a1a1a", logoBg: "#ffffff",
  websiteUrl: "", productsUrl: "", verified: false, description: "",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function BrandModal({ brand, onClose, onSave, saving }: {
  brand: Brand | null;
  onClose: () => void;
  onSave: (data: BrandFormData) => void;
  saving: boolean;
}) {
  const isEdit = !!brand;
  const [form, setForm] = useState<BrandFormData>(brand ? {
    name: brand.name, slug: brand.slug, category: brand.category,
    origin: (brand.origin === "local" ? "local" : "global"),
    logoText: brand.logoText, logoColor: brand.logoColor,
    logoBg: brand.logoBg, websiteUrl: brand.websiteUrl || "", productsUrl: brand.productsUrl || "",
    verified: brand.verified, description: brand.description || "",
  } : empty);

  const set = (k: keyof BrandFormData, v: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "name" && !isEdit) next.slug = slugify(v as string);
      if (k === "name" && !f.logoText) next.logoText = (v as string).toUpperCase().slice(0, 8);
      return next;
    });
  };

  const canSave = form.name.trim() && form.slug.trim() && form.logoText.trim();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">{isEdit ? "Markayı Düzenle" : "Yeni Marka Ekle"}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"><X size={18} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Marka Adı *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Örn: Royal Canin"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="royal-canin"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="standard">Standart</option>
                  <option value="premium">Premium</option>
                  <option value="veterinary">Veteriner</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Köken</label>
                <select value={form.origin} onChange={(e) => set("origin", e.target.value as "global" | "local")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="global">Global</option>
                  <option value="local">Yerel</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Logo Metni *</label>
                <input value={form.logoText} onChange={(e) => set("logoText", e.target.value)} placeholder="BRAND"
                  maxLength={12}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 uppercase" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Yazı Rengi</label>
                <div className="flex gap-1.5">
                  <input type="color" value={form.logoColor} onChange={(e) => set("logoColor", e.target.value)} className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
                  <input value={form.logoColor} onChange={(e) => set("logoColor", e.target.value)} className="flex-1 px-2 py-2 text-xs border border-gray-300 rounded-lg font-mono" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Arka Plan</label>
                <div className="flex gap-1.5">
                  <input type="color" value={form.logoBg} onChange={(e) => set("logoBg", e.target.value)} className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
                  <input value={form.logoBg} onChange={(e) => set("logoBg", e.target.value)} className="flex-1 px-2 py-2 text-xs border border-gray-300 rounded-lg font-mono" />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-16 h-12 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: form.logoBg }}>
                <span className="font-bold text-center px-1 leading-tight" style={{ color: form.logoColor, fontSize: form.logoText.length > 8 ? "8px" : "10px" }}>{form.logoText || "?"}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{form.name || "Marka Adı"}</p>
                <p className="text-xs text-gray-400">/marka/{form.slug || "slug"}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Web Sitesi URL</label>
              <input value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Ürünler URL</label>
              <input value={form.productsUrl} onChange={(e) => set("productsUrl", e.target.value)} placeholder="https://example.com/urunler"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Açıklama</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Marka hakkında kısa açıklama..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => set("verified", !form.verified)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.verified ? "bg-green-600 border-green-600" : "border-gray-300"}`}>
                {form.verified && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm font-medium text-gray-700">Doğrulanmış Marka rozeti ver</span>
            </label>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">İptal</button>
            <button onClick={() => canSave && onSave(form)} disabled={!canSave || saving}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5">
              <Save size={14} />{isEdit ? "Kaydet" : "Marka Ekle"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminBrandsPage() {
  const { brands } = useData();
  const queryClient = useQueryClient();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [search, setSearch] = useState("");
  const [editBrand, setEditBrand] = useState<Brand | null | "new">(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListBrandsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
  }

  const sorted = [...brands].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.pinned && b.pinned) return a.pinnedRank - b.pinnedRank;
    return b.rating - a.rating;
  });
  const filtered = sorted.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  const maxRank = brands.reduce((m, b) => (b.pinned ? Math.max(m, b.pinnedRank) : m), 0);

  function handleSave(data: BrandFormData) {
    const body: BrandInput = {
      name: data.name, slug: data.slug, category: data.category,
      origin: data.origin, logoText: data.logoText, logoColor: data.logoColor,
      logoBg: data.logoBg, websiteUrl: data.websiteUrl, productsUrl: data.productsUrl,
      verified: data.verified, description: data.description,
    };
    if (editBrand === "new") {
      createBrand.mutate({ data: body }, { onSuccess: () => { invalidate(); setEditBrand(null); } });
    } else if (editBrand) {
      updateBrand.mutate({ id: editBrand.id, data: body }, { onSuccess: () => { invalidate(); setEditBrand(null); } });
    }
  }

  function togglePin(brand: Brand) {
    const next: BrandInput = brand.pinned
      ? { name: brand.name, slug: brand.slug, logoText: brand.logoText, pinned: false, pinnedRank: 0 }
      : { name: brand.name, slug: brand.slug, logoText: brand.logoText, pinned: true, pinnedRank: maxRank + 1 };
    updateBrand.mutate({ id: brand.id, data: next }, { onSettled: invalidate });
  }

  function handleDelete(brand: Brand) {
    if (deleteConfirm === brand.id) {
      deleteBrand.mutate({ id: brand.id }, { onSettled: invalidate });
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(brand.id);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Markalar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tüm mama markalarını yönetin. Sabitlenen markalar ana sayfada en üstte gösterilir.</p>
          </div>
          <button onClick={() => setEditBrand("new")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            data-testid="button-add-brand">
            <Plus size={15} />Marka Ekle
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" placeholder="Marka ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="input-search-brands" />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && <div className="py-10 text-center text-sm text-gray-400">Marka bulunamadı.</div>}
            {filtered.map((brand, i) => (
              <div key={brand.id} className="flex items-center gap-3 px-4 py-3" data-testid={`brand-row-${brand.id}`}>
                <span className="text-sm text-gray-400 w-6 text-center">{i + 1}</span>
                <div className="w-12 h-9 rounded border border-gray-100 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: brand.logoBg }}>
                  <span className="font-bold text-center px-1 leading-none" style={{ color: brand.logoColor, fontSize: brand.logoText.length > 8 ? "7px" : "9px" }}>{brand.logoText}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{brand.name}</span>
                    {brand.verified && <BadgeCheck size={14} className="text-green-600 flex-shrink-0" />}
                    {brand.pinned && <span className="flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium"><Pin size={9} /> Sabit</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={brand.rating} size={11} />
                    <span className="text-xs text-gray-500">{brand.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({brand.reviewCount.toLocaleString("tr-TR")} yorum)</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full hidden sm:inline-block ${brand.category === "premium" ? "bg-blue-100 text-blue-700" : brand.category === "veterinary" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                  {brand.category === "premium" ? "Premium" : brand.category === "veterinary" ? "Veteriner" : "Standart"}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => togglePin(brand)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${brand.pinned ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "hover:bg-gray-100 text-gray-400 hover:text-amber-600"}`}
                    title={brand.pinned ? "Sabiti kaldır" : "Sabitle"}
                    data-testid={`button-pin-${brand.id}`}>
                    <Pin size={13} fill={brand.pinned ? "currentColor" : "none"} />
                  </button>
                  <a href={`/marka/${brand.slug}`} target="_blank" rel="noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    data-testid={`button-view-${brand.id}`}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => setEditBrand(brand)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                    data-testid={`button-edit-${brand.id}`}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(brand)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${deleteConfirm === brand.id ? "bg-red-600 text-white" : "hover:bg-red-50 text-gray-400 hover:text-red-600"}`}
                    title={deleteConfirm === brand.id ? "Tekrar tıkla" : "Sil"}
                    data-testid={`button-delete-${brand.id}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editBrand !== null && (
        <BrandModal
          brand={editBrand === "new" ? null : editBrand}
          onClose={() => setEditBrand(null)}
          onSave={handleSave}
          saving={createBrand.isPending || updateBrand.isPending}
        />
      )}
    </AdminLayout>
  );
}
