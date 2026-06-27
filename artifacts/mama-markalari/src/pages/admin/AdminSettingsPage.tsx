import { useState } from "react";
import { ShieldCheck, Save, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { useData } from "@/contexts/DataContext";

function ToggleRow({ label, desc, checked, onChange, testId }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; testId: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-green-500" : "bg-gray-300"}`}
        data-testid={testId}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export function AdminSettingsPage() {
  const { settings, saveSettings } = useData();

  const [requireApproval, setRequireApproval] = useState(settings.requireApproval);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  function handleSave() {
    saveSettings({ ...settings, requireApproval });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePasswordChange() {
    setPwError("");
    setPwSuccess(false);
    if (currentPassword !== settings.adminPassword) {
      setPwError("Mevcut şifre yanlış.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Yeni şifreler eşleşmiyor.");
      return;
    }
    saveSettings({ ...settings, adminPassword: newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorum Ayarları</h1>
          <p className="text-sm text-gray-500 mt-0.5">Yorum sistemi ve güvenlik ayarlarını yapılandırın.</p>
        </div>

        {/* Review settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide text-xs text-gray-400">Yorum Ayarları</h2>
          <ToggleRow
            label="Onay Gerekli"
            desc="Yeni yorumlar yayınlanmadan önce admin onayı beklesin."
            checked={requireApproval}
            onChange={setRequireApproval}
            testId="toggle-require-approval"
          />
          {!requireApproval && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <ShieldCheck size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Otomatik onay açık — yorumlar admin onayı olmadan yayınlanır.</p>
            </div>
          )}
          {requireApproval && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <ShieldCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-700">Manuel onay açık — yeni yorumlar admin onayından sonra yayınlanır.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave}
            className={`flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors ${saved ? "bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
            data-testid="button-save-settings">
            <Save size={15} />
            {saved ? "Kaydedildi ✓" : "Ayarları Kaydet"}
          </button>
        </div>

        {/* Password change */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Şifre Değiştir</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mevcut Şifre</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="input-current-password" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Yeni Şifre</label>
              <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="input-new-password" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Şifre Tekrar</label>
              <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar girin"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="input-confirm-password" />
            </div>
          </div>
          {pwError && <p className="text-xs text-red-600 font-medium">{pwError}</p>}
          {pwSuccess && <p className="text-xs text-green-600 font-medium">✓ Şifre başarıyla değiştirildi.</p>}
          <div className="flex justify-end">
            <button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword}
              className="text-sm font-semibold px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg transition-colors"
              data-testid="button-change-password">
              Şifreyi Değiştir
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
