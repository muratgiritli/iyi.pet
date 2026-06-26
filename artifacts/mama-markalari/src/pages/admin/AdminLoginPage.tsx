import { useState } from "react";
import { useLocation } from "wouter";
import { PawPrint, Eye, EyeOff, Lock, User } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      setLocation("/admin");
    } else {
      setError("Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl font-bold text-green-700">iyi</span>
            <span className="text-2xl font-bold text-gray-800">.pet</span>
            <PawPrint size={16} className="text-green-600 -mt-2" />
          </div>
          <p className="text-sm text-gray-500">Yönetici Paneli</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mb-5">Yönetici hesabınızla giriş yapın.</p>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-admin-login">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  data-testid="input-username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  data-testid="input-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5" data-testid="error-login">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="button-login-submit"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Demo: <span className="font-mono text-gray-500">admin</span> / <span className="font-mono text-gray-500">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
