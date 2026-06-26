import { Brand } from "@/data/brands";

interface BrandLogoProps {
  brand: Brand;
}

export function BrandLogo({ brand }: BrandLogoProps) {
  return (
    <div
      className="w-16 h-12 rounded-md flex items-center justify-center border border-gray-100 overflow-hidden flex-shrink-0"
      style={{ backgroundColor: brand.logoBg }}
    >
      <span
        className="text-xs font-bold text-center leading-tight px-1"
        style={{
          color: brand.logoColor,
          fontSize: brand.logoText.length > 8 ? "9px" : "11px",
        }}
      >
        {brand.logoText}
      </span>
    </div>
  );
}
