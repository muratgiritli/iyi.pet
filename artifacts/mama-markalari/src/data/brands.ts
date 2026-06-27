export interface Brand {
  id: number;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  category: string;
  origin: "global" | "local";
  logoText: string;
  logoColor: string;
  logoBg: string;
}

export const brands: Brand[] = [
  { id: 1, name: "Royal Canin", slug: "royal-canin", rating: 4.6, reviewCount: 1248, category: "premium", origin: "global", logoText: "ROYAL CANIN", logoColor: "#c8102e", logoBg: "#fff" },
  { id: 2, name: "Orijen", slug: "orijen", rating: 4.6, reviewCount: 421, category: "premium", origin: "global", logoText: "Orijen", logoColor: "#c8102e", logoBg: "#fff" },
  { id: 3, name: "Acana", slug: "acana", rating: 4.5, reviewCount: 378, category: "premium", origin: "global", logoText: "ACANA", logoColor: "#1a1a1a", logoBg: "#fff" },
  { id: 4, name: "Pro Plan", slug: "pro-plan", rating: 4.4, reviewCount: 982, category: "premium", origin: "global", logoText: "PRO PLAN", logoColor: "#003087", logoBg: "#fff" },
  { id: 5, name: "Hill's", slug: "hills", rating: 4.2, reviewCount: 756, category: "veterinary", origin: "global", logoText: "Hill's", logoColor: "#e31837", logoBg: "#fff" },
  { id: 6, name: "N&D", slug: "nd", rating: 4.1, reviewCount: 612, category: "premium", origin: "global", logoText: "N&D", logoColor: "#8b6914", logoBg: "#fff" },
  { id: 7, name: "Brit Care", slug: "brit-care", rating: 4.0, reviewCount: 532, category: "premium", origin: "global", logoText: "Brit care", logoColor: "#fff", logoBg: "#e91e8c" },
  { id: 8, name: "Advance", slug: "advance", rating: 4.3, reviewCount: 321, category: "premium", origin: "global", logoText: "ADVANCE", logoColor: "#fff", logoBg: "#003087" },
  { id: 9, name: "Purina One", slug: "purina-one", rating: 4.3, reviewCount: 291, category: "standard", origin: "global", logoText: "ONE", logoColor: "#1a1a1a", logoBg: "#fff" },
  { id: 10, name: "Monge", slug: "monge", rating: 4.2, reviewCount: 256, category: "premium", origin: "global", logoText: "monge", logoColor: "#c8102e", logoBg: "#fff" },
  { id: 11, name: "Iams", slug: "iams", rating: 3.9, reviewCount: 198, category: "standard", origin: "global", logoText: "iams", logoColor: "#e31837", logoBg: "#fff" },
  { id: 12, name: "Whiskas", slug: "whiskas", rating: 3.7, reviewCount: 445, category: "standard", origin: "global", logoText: "Whiskas", logoColor: "#6a0dad", logoBg: "#fff" },
  { id: 13, name: "Felix", slug: "felix", rating: 3.5, reviewCount: 312, category: "standard", origin: "global", logoText: "felix", logoColor: "#ff6600", logoBg: "#fff" },
  { id: 14, name: "Pedigree", slug: "pedigree", rating: 3.6, reviewCount: 523, category: "standard", origin: "global", logoText: "Pedigree", logoColor: "#003087", logoBg: "#fff" },
  { id: 15, name: "Friskies", slug: "friskies", rating: 3.4, reviewCount: 287, category: "standard", origin: "global", logoText: "friskies", logoColor: "#e31837", logoBg: "#fff" },
  { id: 16, name: "Provet", slug: "provet", rating: 4.1, reviewCount: 334, category: "veterinary", origin: "local", logoText: "PROVET", logoColor: "#1a6e3c", logoBg: "#fff" },
  { id: 17, name: "Puffy", slug: "puffy", rating: 3.8, reviewCount: 218, category: "standard", origin: "local", logoText: "Puffy", logoColor: "#f57c00", logoBg: "#fff" },
  { id: 18, name: "Gimcat", slug: "gimcat", rating: 3.9, reviewCount: 176, category: "premium", origin: "local", logoText: "GimCat", logoColor: "#2e7d32", logoBg: "#fff" },
  { id: 19, name: "Puffins", slug: "puffins", rating: 3.7, reviewCount: 143, category: "standard", origin: "local", logoText: "Puffins", logoColor: "#1565c0", logoBg: "#fff" },
];

export const categories = [
  { value: "all", label: "Tüm Kategoriler" },
  { value: "premium", label: "Premium" },
  { value: "standard", label: "Standart" },
  { value: "veterinary", label: "Veteriner" },
];

export const sortOptions = [
  { value: "rating_desc", label: "En Yüksek Puan" },
  { value: "rating_asc", label: "En Düşük Puan" },
  { value: "reviews_desc", label: "En Çok Yorum" },
  { value: "name_asc", label: "A-Z" },
];

export const brandDescriptions: Record<string, string> = {
  "Royal Canin": "1968 yılında kurulan Royal Canin, evcil hayvanların yaş, ırk, yaşam tarzı ve özel ihtiyaçlarına göre bilimsel olarak geliştirilmiş beslenme çözümleri sunar.",
  "Orijen": "Kanada'dan gelen Orijen, taze ve bölgesel malzemelerle üretilen, tahılsız, yüksek proteinli premium mama markasıdır.",
  "Acana": "Orijen'in kardeş markası olan Acana, aynı kalite anlayışıyla daha erişilebilir fiyat noktasında premium mama üretmektedir.",
  "Pro Plan": "Purina Pro Plan, veterinerler ve beslenme uzmanlarıyla işbirliği içinde geliştirilmiş, bilimsel temelli beslenme formülleri sunar.",
  "Hill's": "Hill's Pet Nutrition, 85 yılı aşkın deneyimiyle veteriner onaylı, hassas ve reçeteli mama serileriyle öne çıkan köklü bir markadır.",
  "N&D": "İtalyan markası Farmina tarafından üretilen N&D, tahılsız, doğal ve yüksek kaliteli ingredientlerle hazırlanan premium mama serisidir.",
  "Brit Care": "Çek Cumhuriyeti kökenli Brit Care, tahılsız formülleri ve yüksek et oranıyla Avrupa'nın önde gelen premium mama markalarından biridir.",
  "Advance": "İspanyol kökenli Advance, veteriner diyetleri ve günlük beslenme ürünleriyle geniş bir yelpazede kaliteli mama çözümleri sunmaktadır.",
  "Purina One": "Purina One, bilimsel formülleri ve uygun fiyatıyla her bütçeye hitap eden, köpek ve kediler için dengeli beslenme çözümleri sunar.",
  "Monge": "İtalya'nın saygın mama markası Monge, doğal ve kaliteli ingredientlerle evcil hayvanların sağlıklı yaşamını destekleyen ürünler üretmektedir.",
  "Provet": "Türkiye kökenli Provet, veteriner onaylı formülleriyle yerel ihtiyaçlara uygun, kaliteli ve uygun fiyatlı mama seçenekleri sunmaktadır.",
  "Puffy": "Puffy, Türk evcil hayvan sahiplerine yönelik üretilen, uygun fiyatlı ve besin değeri yüksek mama ürünleri sunan yerel bir markadır.",
  "Gimcat": "GimCat, kedi beslenmesi ve bakımı konusunda uzmanlaşmış, Türkiye'de geniş ürün yelpazesiyle tanınan güvenilir bir markadır.",
  "Puffins": "Puffins, doğal ingredientlere dayanan formülleriyle köpek ve kediler için dengeli beslenme sağlayan Türk pet gıda markasıdır.",
};
