import { useState } from "react";
import { Search, Globe, Menu, X, PawPrint } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <a href="/" className="flex items-center gap-1.5 flex-shrink-0" data-testid="link-logo">
          <div className="flex items-center">
            <span className="text-xl font-bold text-green-700">iyi</span>
            <span className="text-xl font-bold text-gray-800">.pet</span>
            <PawPrint size={14} className="text-green-600 ml-0.5 -mt-1" />
          </div>
        </a>

        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Marka ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            data-testid="input-search"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
            data-testid="button-language"
          >
            <Globe size={16} className="text-gray-500" />
            <span className="font-medium">TR</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-gray-400">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            data-testid="button-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="max-w-3xl mx-auto px-4 pb-4 border-t border-gray-100 bg-white">
          <nav className="pt-3 flex flex-col gap-1">
            {["Mama Markaları", "Evcil Hayvan Rehberi", "Veteriner Bul", "Blog", "Hakkımızda"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                data-testid={`link-menu-${item.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
