import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Tag, MessageSquare, Settings, Users, LogOut, PawPrint, Menu, X, ChevronDown, User, Sparkles } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const navItems = [
  { href: "/admin", label: "Genel Bakış", icon: Home },
  { href: "/admin/markalar", label: "Markalar", icon: Tag },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare },
  { href: "/admin/yorum-uretici", label: "Yorum Üretici", icon: Sparkles },
  { href: "/admin/yorum-ayarlari", label: "Yorum Ayarları", icon: Settings },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
];

function NavItem({ href, label, Icon }: { href: string; label: string; Icon: React.ComponentType<{size?: number; className?: string}> }) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-green-50 text-green-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Icon size={16} className={isActive ? "text-green-600" : "text-gray-400"} />
      {label}
    </Link>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center gap-1.5 px-5 py-4 border-b border-gray-100">
          <span className="text-xl font-bold text-green-700">iyi</span>
          <span className="text-xl font-bold text-gray-800">.pet</span>
          <PawPrint size={13} className="text-green-600 -mt-1" />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <NavItem key={href} href={href} label={label} Icon={Icon} />
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            data-testid="button-logout"
          >
            <LogOut size={16} className="text-gray-400" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            data-testid="button-sidebar-toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block" />

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              data-testid="button-user-menu"
            >
              <User size={16} className="text-gray-400" />
              <span className="font-medium">Merhaba, Admin</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                    data-testid="button-user-logout"
                  >
                    <LogOut size={14} />
                    Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
