import { db, brandsTable, reviewsTable, settingsTable } from "@workspace/db";
import { and, eq, or, sql } from "drizzle-orm";
import { logger } from "./logger";
import { EXTRA_BRANDS } from "./extraBrands";

interface SeedBrand {
  id: number;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  category: string;
  origin: string;
  logoText: string;
  logoColor: string;
  logoBg: string;
  description: string;
}

const DESCRIPTIONS: Record<string, string> = {
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
  "Iams": "Iams, dengeli ve uygun fiyatlı formülleriyle köpek ve kediler için günlük beslenme çözümleri sunan köklü bir markadır.",
  "Whiskas": "Whiskas, kediler için özel olarak geliştirilmiş, yaygın bulunabilen ve uygun fiyatlı yaş ve kuru mama ürünleri sunar.",
  "Felix": "Felix, kedilerin severek tükettiği lezzetli yaş mama çeşitleriyle tanınan, uygun fiyatlı bir markadır.",
  "Pedigree": "Pedigree, köpekler için dengeli beslenme sunan, dünya genelinde yaygın ve uygun fiyatlı bir mama markasıdır.",
  "Friskies": "Friskies, kediler için çeşitli lezzet seçenekleriyle ekonomik beslenme çözümleri sunan bir markadır.",
  "Provet": "Türkiye kökenli Provet, veteriner onaylı formülleriyle yerel ihtiyaçlara uygun, kaliteli ve uygun fiyatlı mama seçenekleri sunmaktadır.",
  "Puffy": "Puffy, Türk evcil hayvan sahiplerine yönelik üretilen, uygun fiyatlı ve besin değeri yüksek mama ürünleri sunan yerel bir markadır.",
  "Gimcat": "GimCat, kedi beslenmesi ve bakımı konusunda uzmanlaşmış, Türkiye'de geniş ürün yelpazesiyle tanınan güvenilir bir markadır.",
  "Puffins": "Puffins, doğal ingredientlere dayanan formülleriyle köpek ve kediler için dengeli beslenme sağlayan Türk pet gıda markasıdır.",
};

const SEED_BRANDS: SeedBrand[] = [
  { id: 1, name: "Royal Canin", slug: "royal-canin", rating: 4.6, reviewCount: 1248, category: "premium", origin: "global", logoText: "ROYAL CANIN", logoColor: "#c8102e", logoBg: "#fff", description: DESCRIPTIONS["Royal Canin"] },
  { id: 2, name: "Orijen", slug: "orijen", rating: 4.6, reviewCount: 421, category: "premium", origin: "global", logoText: "Orijen", logoColor: "#c8102e", logoBg: "#fff", description: DESCRIPTIONS["Orijen"] },
  { id: 3, name: "Acana", slug: "acana", rating: 4.5, reviewCount: 378, category: "premium", origin: "global", logoText: "ACANA", logoColor: "#1a1a1a", logoBg: "#fff", description: DESCRIPTIONS["Acana"] },
  { id: 4, name: "Pro Plan", slug: "pro-plan", rating: 4.4, reviewCount: 982, category: "premium", origin: "global", logoText: "PRO PLAN", logoColor: "#003087", logoBg: "#fff", description: DESCRIPTIONS["Pro Plan"] },
  { id: 5, name: "Hill's", slug: "hills", rating: 4.2, reviewCount: 756, category: "veterinary", origin: "global", logoText: "Hill's", logoColor: "#e31837", logoBg: "#fff", description: DESCRIPTIONS["Hill's"] },
  { id: 6, name: "N&D", slug: "nd", rating: 4.1, reviewCount: 612, category: "premium", origin: "global", logoText: "N&D", logoColor: "#8b6914", logoBg: "#fff", description: DESCRIPTIONS["N&D"] },
  { id: 7, name: "Brit Care", slug: "brit-care", rating: 4.0, reviewCount: 532, category: "premium", origin: "global", logoText: "Brit care", logoColor: "#fff", logoBg: "#e91e8c", description: DESCRIPTIONS["Brit Care"] },
  { id: 8, name: "Advance", slug: "advance", rating: 4.3, reviewCount: 321, category: "premium", origin: "global", logoText: "ADVANCE", logoColor: "#fff", logoBg: "#003087", description: DESCRIPTIONS["Advance"] },
  { id: 9, name: "Purina One", slug: "purina-one", rating: 4.3, reviewCount: 291, category: "standard", origin: "global", logoText: "ONE", logoColor: "#1a1a1a", logoBg: "#fff", description: DESCRIPTIONS["Purina One"] },
  { id: 10, name: "Monge", slug: "monge", rating: 4.2, reviewCount: 256, category: "premium", origin: "global", logoText: "monge", logoColor: "#c8102e", logoBg: "#fff", description: DESCRIPTIONS["Monge"] },
  { id: 11, name: "Iams", slug: "iams", rating: 3.9, reviewCount: 198, category: "standard", origin: "global", logoText: "iams", logoColor: "#e31837", logoBg: "#fff", description: DESCRIPTIONS["Iams"] },
  { id: 12, name: "Whiskas", slug: "whiskas", rating: 3.7, reviewCount: 445, category: "standard", origin: "global", logoText: "Whiskas", logoColor: "#6a0dad", logoBg: "#fff", description: DESCRIPTIONS["Whiskas"] },
  { id: 13, name: "Felix", slug: "felix", rating: 3.5, reviewCount: 312, category: "standard", origin: "global", logoText: "felix", logoColor: "#ff6600", logoBg: "#fff", description: DESCRIPTIONS["Felix"] },
  { id: 14, name: "Pedigree", slug: "pedigree", rating: 3.6, reviewCount: 523, category: "standard", origin: "global", logoText: "Pedigree", logoColor: "#003087", logoBg: "#fff", description: DESCRIPTIONS["Pedigree"] },
  { id: 15, name: "Friskies", slug: "friskies", rating: 3.4, reviewCount: 287, category: "standard", origin: "global", logoText: "friskies", logoColor: "#e31837", logoBg: "#fff", description: DESCRIPTIONS["Friskies"] },
  { id: 16, name: "Provet", slug: "provet", rating: 4.1, reviewCount: 334, category: "veterinary", origin: "local", logoText: "PROVET", logoColor: "#1a6e3c", logoBg: "#fff", description: DESCRIPTIONS["Provet"] },
  { id: 17, name: "Puffy", slug: "puffy", rating: 3.8, reviewCount: 218, category: "standard", origin: "local", logoText: "Puffy", logoColor: "#f57c00", logoBg: "#fff", description: DESCRIPTIONS["Puffy"] },
  { id: 18, name: "Gimcat", slug: "gimcat", rating: 3.9, reviewCount: 176, category: "premium", origin: "local", logoText: "GimCat", logoColor: "#2e7d32", logoBg: "#fff", description: DESCRIPTIONS["Gimcat"] },
  { id: 19, name: "Puffins", slug: "puffins", rating: 3.7, reviewCount: 143, category: "standard", origin: "local", logoText: "Puffins", logoColor: "#1565c0", logoBg: "#fff", description: DESCRIPTIONS["Puffins"] },
];

interface SeedReview {
  brandId: number;
  author: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  text: string;
  likes: number;
}

const SEED_REVIEWS: SeedReview[] = [
  { brandId: 1, author: "Ayşe N.", avatar: "A", rating: 5, timeAgo: "3 gün önce", text: "Kedim 2 yıldır sadece Royal Canin yiyor. Tüyleri çok parlak ve sindirimi çok iyi. Kesinlikle tavsiye ederim.", likes: 12 },
  { brandId: 1, author: "Mehmet T.", avatar: "M", rating: 5, timeAgo: "1 hafta önce", text: "Yavru köpeğim için Mini Puppy kullanıyorum. Hem severek yiyor hem de gelişimi çok iyi. Teşekkürler Royal Canin.", likes: 8 },
  { brandId: 1, author: "Selin K.", avatar: "S", rating: 3, timeAgo: "2 hafta önce", text: "Ürün içeriği oldukça kaliteli. Fiyatı diğer markalara göre biraz yüksek ama değer.", likes: 5 },
  { brandId: 1, author: "Emre Y.", avatar: "E", rating: 5, timeAgo: "3 hafta önce", text: "İştahı az olan kedim için Gastrointestinal serisini kullanıyoruz. Çok memnun kaldık.", likes: 4 },
  { brandId: 1, author: "Zeynep A.", avatar: "Z", rating: 4, timeAgo: "1 ay önce", text: "Royal Canin kalitesi tartışılmaz. Kısır kedim için Sterilised serisi harika oldu.", likes: 6 },
  { brandId: 1, author: "Can B.", avatar: "C", rating: 5, timeAgo: "1 ay önce", text: "Veterinerim tarafından önerildi ve gerçekten çok iyi. Kedim büyük keyifle yiyor.", likes: 9 },
  { brandId: 1, author: "Fatma D.", avatar: "F", rating: 4, timeAgo: "2 ay önce", text: "Fiyatı yüksek ama kalitesiyle orantılı. Uzun süredir kullanıyorum ve memnunum.", likes: 3 },
  { brandId: 1, author: "Ali R.", avatar: "A", rating: 2, timeAgo: "2 ay önce", text: "Kedim beğenmedi maalesef. Birkaç hafta denedim ama yemedi. Para iadesi de zor oldu.", likes: 1 },
  { brandId: 1, author: "Deniz Ö.", avatar: "D", rating: 5, timeAgo: "3 ay önce", text: "Tüy dökümü olan köpeğim için Dermacomfort aldım, 1 ayda fark etmeye başladım.", likes: 11 },
  { brandId: 1, author: "Meral S.", avatar: "M", rating: 4, timeAgo: "3 ay önce", text: "Çok tercih edilen marka, kalitesi belli. Veteriner ödülü de ayrıca güven veriyor.", likes: 7 },
  { brandId: 2, author: "Hakan Y.", avatar: "H", rating: 5, timeAgo: "5 gün önce", text: "Tahılsız mama arayanlar için mükemmel. Kedim çok seviyor ve enerjisi arttı.", likes: 15 },
  { brandId: 2, author: "Buse T.", avatar: "B", rating: 5, timeAgo: "2 hafta önce", text: "İçerik listesi muhteşem, tamamen doğal. Fiyatı yüksek ama hakediyor.", likes: 10 },
  { brandId: 2, author: "Okan M.", avatar: "O", rating: 4, timeAgo: "1 ay önce", text: "Çok kaliteli ama fiyatına göre paket biraz küçük. İçerik olarak en iyi mamalardan biri.", likes: 6 },
  { brandId: 2, author: "Ceren A.", avatar: "C", rating: 5, timeAgo: "2 ay önce", text: "Kedimde deri problemi vardı, Orijen'e geçtikten sonra düzeldi. Harika bir marka.", likes: 13 },
  { brandId: 2, author: "Yusuf K.", avatar: "Y", rating: 4, timeAgo: "3 ay önce", text: "Yüksek protein içeriği sayesinde köpeğim çok güçlü. Kesinlikle öneriyorum.", likes: 8 },
  { brandId: 3, author: "Neslihan B.", avatar: "N", rating: 5, timeAgo: "1 hafta önce", text: "Orijen ile birbirine yakın kalitede. Biraz daha uygun fiyatlı olması büyük artı.", likes: 9 },
  { brandId: 3, author: "Tayfun E.", avatar: "T", rating: 4, timeAgo: "3 hafta önce", text: "Kedim çok seviyor, içeriği gayet iyi. Tahılsız mama arayanlar için ideal.", likes: 5 },
  { brandId: 3, author: "Gülşen R.", avatar: "G", rating: 5, timeAgo: "2 ay önce", text: "Bölgemde zor bulunuyor ama online sipariş işe yarıyor. Kalitesi tartışılmaz.", likes: 7 },
  { brandId: 4, author: "Serkan H.", avatar: "S", rating: 4, timeAgo: "4 gün önce", text: "Veterinerim önerdi ve haklı. Köpeğim çok seviyor. Bilimsel formülü beni etkiliyor.", likes: 11 },
  { brandId: 4, author: "Elif O.", avatar: "E", rating: 5, timeAgo: "1 hafta önce", text: "Purina Pro Plan'ı yıllardır kullanıyorum. Kedim çok sağlıklı ve mutlu.", likes: 6 },
  { brandId: 4, author: "Burak Y.", avatar: "B", rating: 4, timeAgo: "1 ay önce", text: "Fiyat-kalite dengesi iyi. Özellikle hassas mideliler için sensitive ürünlerini deneyebilirsiniz.", likes: 4 },
  { brandId: 4, author: "İpek M.", avatar: "İ", rating: 3, timeAgo: "2 ay önce", text: "Fiyatı biraz yükseldi son zamanlarda. İçerik iyi ama fiyat-performans düştü.", likes: 2 },
  { brandId: 5, author: "Volkan T.", avatar: "V", rating: 4, timeAgo: "6 gün önce", text: "Veteriner onaylı marka. Böbrek problemi olan kedim için prescription diyeti kullanıyoruz.", likes: 14 },
  { brandId: 5, author: "Pınar K.", avatar: "P", rating: 5, timeAgo: "2 hafta önce", text: "Şişman kedim için perfect weight serisini aldım, harika sonuçlar verdi.", likes: 9 },
  { brandId: 5, author: "Kerem L.", avatar: "K", rating: 3, timeAgo: "1 ay önce", text: "İçerik iyi ama kedim pek sevmedi. Başka serilerini de denedim ama sonuç aynı.", likes: 3 },
  { brandId: 6, author: "Simge A.", avatar: "S", rating: 4, timeAgo: "1 hafta önce", text: "İtalyan kalitesi belli. Tahılsız ve yüksek proteinli. Kedim çok seviyor.", likes: 7 },
  { brandId: 6, author: "Orhan B.", avatar: "O", rating: 5, timeAgo: "3 hafta önce", text: "N&D pumpkin serisi mide problemlerinde mucize gibi çalıştı. Çok memnunum.", likes: 12 },
  { brandId: 6, author: "Tuba S.", avatar: "T", rating: 3, timeAgo: "2 ay önce", text: "Kaliteli bir marka ama fiyatı çok yüksek. Bütçe dostu değil.", likes: 2 },
  { brandId: 7, author: "Kaan M.", avatar: "K", rating: 4, timeAgo: "4 gün önce", text: "Fiyat-kalite dengesi çok iyi. Kedim büyük keyifle yiyor. Kesinlikle tavsiye ederim.", likes: 8 },
  { brandId: 7, author: "Eda C.", avatar: "E", rating: 4, timeAgo: "2 hafta önce", text: "Yeni denemeye başladım ama memnunum. İçerik listesi gayet iyi, fiyatı makul.", likes: 5 },
  { brandId: 8, author: "Murat D.", avatar: "M", rating: 4, timeAgo: "1 hafta önce", text: "İspanyol markası ama oldukça iyi kalite. Veteriner diyetleri özellikle dikkat çekici.", likes: 6 },
  { brandId: 8, author: "Yıldız E.", avatar: "Y", rating: 5, timeAgo: "1 ay önce", text: "Küçük ırk köpeğim için mini serisi mükemmel. Çok beğeniyor ve sağlıklı.", likes: 9 },
  { brandId: 9, author: "Ahmet F.", avatar: "A", rating: 4, timeAgo: "3 gün önce", text: "Bütçe dostu ve kaliteli. Sürekli kullanıcıyım, kedim sağlıklı ve enerjik.", likes: 7 },
  { brandId: 9, author: "Leyla G.", avatar: "L", rating: 5, timeAgo: "2 hafta önce", text: "Fiyatı çok uygun. Bu kalitede bu fiyata başka marka yok. Çok memnunum.", likes: 4 },
  { brandId: 9, author: "Rıza H.", avatar: "R", rating: 3, timeAgo: "1 ay önce", text: "Orta kalite, fiyatına göre iyi. Daha pahalı markalara kıyasla fark var elbette.", likes: 1 },
  { brandId: 10, author: "Songül İ.", avatar: "S", rating: 4, timeAgo: "5 gün önce", text: "İtalyan markası. İçeriği iyi, kedim seviyor. Biraz bilinmez bir marka ama kaliteli.", likes: 6 },
  { brandId: 10, author: "Tolga J.", avatar: "T", rating: 5, timeAgo: "3 hafta önce", text: "Monge grain free serisini tercih ediyorum. Kedimde allerji azaldı, çok memnunum.", likes: 10 },
];


export async function seedIfEmpty(): Promise<void> {
  const existing = await db.select({ id: brandsTable.id }).from(brandsTable).limit(1);

  if (existing.length === 0) {
    logger.info("Seeding brands");

    await db.insert(brandsTable).values(
      SEED_BRANDS.map((b) => ({
        name: b.name,
        slug: b.slug,
        rating: 0,
        reviewCount: 0,
        category: b.category,
        origin: b.origin,
        logoText: b.logoText,
        logoColor: b.logoColor,
        logoBg: b.logoBg,
        description: b.description,
      })),
    );

  }

  const settingsRow = await db.select({ id: settingsTable.id }).from(settingsTable).limit(1);
  if (settingsRow.length === 0) {
    await db.insert(settingsTable).values({ id: 1 });
  }

  if (EXTRA_BRANDS.length > 0) {
    const result = await db
      .insert(brandsTable)
      .values(
        EXTRA_BRANDS.map((b) => ({
          name: b.name,
          slug: b.slug,
          category: b.category,
          origin: b.origin,
          logoText: b.logoText,
          logoColor: b.logoColor,
          logoBg: b.logoBg,
        })),
      )
      .onConflictDoNothing({ target: brandsTable.slug })
      .returning({ id: brandsTable.id });
    if (result.length > 0) {
      logger.info({ count: result.length }, "Seeded missing brands");
    }
  }

  await cleanupDemoData();
}

async function cleanupDemoData(): Promise<void> {
  const flag = await db.select({ done: settingsTable.demoCleanupDone }).from(settingsTable).limit(1);
  if (flag.length > 0 && flag[0].done) {
    return;
  }

  const deleted = await db
    .delete(reviewsTable)
    .where(or(...SEED_REVIEWS.map((r) => and(eq(reviewsTable.author, r.author), eq(reviewsTable.text, r.text)))))
    .returning({ id: reviewsTable.id });
  if (deleted.length > 0) {
    logger.info({ count: deleted.length }, "Deleted demo reviews");
  }

  await db.execute(sql`
    UPDATE brands b SET
      review_count = agg.cnt,
      rating = agg.avg_rating
    FROM (
      SELECT b2.id,
             COALESCE(r.cnt, 0) AS cnt,
             COALESCE(r.avg_rating, 0) AS avg_rating
      FROM brands b2
      LEFT JOIN (
        SELECT brand_id, count(*)::int AS cnt, round(avg(rating)::numeric, 1)::float AS avg_rating
        FROM reviews
        WHERE status = 'approved'
        GROUP BY brand_id
      ) r ON r.brand_id = b2.id
    ) agg
    WHERE agg.id = b.id
      AND (b.review_count IS DISTINCT FROM agg.cnt OR b.rating IS DISTINCT FROM agg.avg_rating)
  `);

  await db.update(settingsTable).set({ demoCleanupDone: true });
  logger.info("Demo data cleanup completed");
}
