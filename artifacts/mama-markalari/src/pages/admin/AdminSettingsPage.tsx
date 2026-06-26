import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AdminLayout } from "./AdminLayout";

export function AdminSettingsPage() {
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [minChars, setMinChars] = useState(20);
  const [requireRating, setRequireRating] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorum Ayarları</h1>
          <p className="text-sm text-gray-500 mt-0.5">Yorum sistemini yapılandırın.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <ToggleRow
            label="Yorum Yazma"
            desc="Ziyaretçilerin yorum yazmasına izin verin."
            checked={reviewsEnabled}
            onChange={setReviewsEnabled}
            testId="toggle-reviews"
          />
          {reviewsEnabled && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <ShieldCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-green-700">Yorum yazma şu anda AÇIK durumda.</p>
                <p className="text-xs text-green-600 mt-0.5">Ziyaretçiler markalar için yorum yazabilir.</p>
              </div>
            </div>
          )}
          <hr className="border-gray-100" />
          <ToggleRow
            label="Otomatik Onay"
            desc="Yeni yorumları incelemeden otomatik olarak yayınlayın."
            checked={autoApprove}
            onChange={setAutoApprove}
            testId="toggle-auto-approve"
          />
          <hr className="border-gray-100" />
          <ToggleRow
            label="Puan Zorunlu"
            desc="Yorum gönderirken yıldız puanı zorunlu olsun."
            checked={requireRating}
            onChange={setRequireRating}
            testId="toggle-require-rating"
          />
          <hr className="border-gray-100" />
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">Minimum Karakter Sayısı</label>
            <p className="text-xs text-gray-500 mb-2">Yorumun en az kaç karakter içermesi gerektiğini belirleyin.</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minChars}
                onChange={(e) => setMinChars(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={500}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="input-min-chars"
              />
              <span className="text-sm text-gray-500">karakter</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            data-testid="button-save-settings"
          >
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function ToggleRow({ label, desc, checked, onChange, testId }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; testId: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-green-500" : "bg-gray-300"}`}
        data-testid={testId}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
