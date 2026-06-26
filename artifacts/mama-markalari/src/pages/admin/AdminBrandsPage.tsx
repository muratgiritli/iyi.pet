import { useState } from "react";
import { Plus, Search, MoreVertical, ExternalLink } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { StarRating } from "@/components/StarRating";
import { brands } from "@/data/brands";

export function AdminBrandsPage() {
  const [search, setSearch] = useState("");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Markalar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tüm mama markalarını yönetin.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            data-testid="button-add-brand"
          >
            <Plus size={15} />
            Marka Ekle
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Marka ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="input-search-brands"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">Marka bulunamadı.</div>
            )}
            {filtered.map((brand, i) => (
              <div key={brand.id} className="flex items-center gap-3 px-4 py-3" data-testid={`brand-row-${brand.id}`}>
                <span className="text-sm text-gray-400 w-6 text-center">{i + 1}</span>
                <div
                  className="w-12 h-9 rounded border border-gray-100 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: brand.logoBg }}
                >
                  <span className="font-bold text-center px-1 leading-none"
                    style={{ color: brand.logoColor, fontSize: brand.logoText.length > 8 ? "7px" : "9px" }}>
                    {brand.logoText}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{brand.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={brand.rating} size={11} />
                    <span className="text-xs text-gray-500">{brand.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({brand.reviewCount.toLocaleString("tr-TR")} yorum)</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${brand.category === "premium" ? "bg-blue-100 text-blue-700" : brand.category === "veterinary" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                  {brand.category === "premium" ? "Premium" : brand.category === "veterinary" ? "Veteriner" : "Standart"}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <a href={`/marka/${brand.slug}`} target="_blank" rel="noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    data-testid={`button-view-${brand.id}`}>
                    <ExternalLink size={13} />
                  </a>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" data-testid={`button-more-brand-${brand.id}`}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
