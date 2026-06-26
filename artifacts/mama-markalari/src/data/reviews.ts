export interface Review {
  id: number;
  brandId: number;
  author: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  text: string;
  likes: number;
}

export const reviews: Review[] = [
  // Royal Canin (id: 1)
  { id: 1, brandId: 1, author: "Ayşe N.", avatar: "A", rating: 5, timeAgo: "3 gün önce", text: "Kedim 2 yıldır sadece Royal Canin yiyor. Tüyleri çok parlak ve sindirimi çok iyi. Kesinlikle tavsiye ederim.", likes: 12 },
  { id: 2, brandId: 1, author: "Mehmet T.", avatar: "M", rating: 5, timeAgo: "1 hafta önce", text: "Yavru köpeğim için Mini Puppy kullanıyorum. Hem severek yiyor hem de gelişimi çok iyi. Teşekkürler Royal Canin.", likes: 8 },
  { id: 3, brandId: 1, author: "Selin K.", avatar: "S", rating: 3, timeAgo: "2 hafta önce", text: "Ürün içeriği oldukça kaliteli. Fiyatı diğer markalara göre biraz yüksek ama değer.", likes: 5 },
  { id: 4, brandId: 1, author: "Emre Y.", avatar: "E", rating: 5, timeAgo: "3 hafta önce", text: "İştahı az olan kedim için Gastrointestinal serisini kullanıyoruz. Çok memnun kaldık.", likes: 4 },
  { id: 5, brandId: 1, author: "Zeynep A.", avatar: "Z", rating: 4, timeAgo: "1 ay önce", text: "Royal Canin kalitesi tartışılmaz. Kısır kedim için Sterilised serisi harika oldu.", likes: 6 },
  { id: 6, brandId: 1, author: "Can B.", avatar: "C", rating: 5, timeAgo: "1 ay önce", text: "Veterinerim tarafından önerildi ve gerçekten çok iyi. Kedim büyük keyifle yiyor.", likes: 9 },
  { id: 7, brandId: 1, author: "Fatma D.", avatar: "F", rating: 4, timeAgo: "2 ay önce", text: "Fiyatı yüksek ama kalitesiyle orantılı. Uzun süredir kullanıyorum ve memnunum.", likes: 3 },
  { id: 8, brandId: 1, author: "Ali R.", avatar: "A", rating: 2, timeAgo: "2 ay önce", text: "Kedim beğenmedi maalesef. Birkaç hafta denedim ama yemedi. Para iadesi de zor oldu.", likes: 1 },
  { id: 9, brandId: 1, author: "Deniz Ö.", avatar: "D", rating: 5, timeAgo: "3 ay önce", text: "Tüy dökümü olan köpeğim için Dermacomfort aldım, 1 ayda fark etmeye başladım.", likes: 11 },
  { id: 10, brandId: 1, author: "Meral S.", avatar: "M", rating: 4, timeAgo: "3 ay önce", text: "Çok tercih edilen marka, kalitesi belli. Veteriner ödülü de ayrıca güven veriyor.", likes: 7 },
  // Orijen (id: 2)
  { id: 11, brandId: 2, author: "Hakan Y.", avatar: "H", rating: 5, timeAgo: "5 gün önce", text: "Tahılsız mama arayanlar için mükemmel. Kedim çok seviyor ve enerjisi arttı.", likes: 15 },
  { id: 12, brandId: 2, author: "Buse T.", avatar: "B", rating: 5, timeAgo: "2 hafta önce", text: "İçerik listesi muhteşem, tamamen doğal. Fiyatı yüksek ama hakediyor.", likes: 10 },
  { id: 13, brandId: 2, author: "Okan M.", avatar: "O", rating: 4, timeAgo: "1 ay önce", text: "Çok kaliteli ama fiyatına göre paket biraz küçük. İçerik olarak en iyi mamalardan biri.", likes: 6 },
  { id: 14, brandId: 2, author: "Ceren A.", avatar: "C", rating: 5, timeAgo: "2 ay önce", text: "Kedimde deri problemi vardı, Orijen'e geçtikten sonra düzeldi. Harika bir marka.", likes: 13 },
  { id: 15, brandId: 2, author: "Yusuf K.", avatar: "Y", rating: 4, timeAgo: "3 ay önce", text: "Yüksek protein içeriği sayesinde kaslarım köpeğim çok güçlü. Kesinlikle öneriyorum.", likes: 8 },
  // Acana (id: 3)
  { id: 16, brandId: 3, author: "Neslihan B.", avatar: "N", rating: 5, timeAgo: "1 hafta önce", text: "Orijen ile birbirine yakın kalitede. Biraz daha uygun fiyatlı olması büyük artı.", likes: 9 },
  { id: 17, brandId: 3, author: "Tayfun E.", avatar: "T", rating: 4, timeAgo: "3 hafta önce", text: "Kedim çok seviyor, içeriği gayet iyi. Tahılsız mama arayanlar için ideal.", likes: 5 },
  { id: 18, brandId: 3, author: "Gülşen R.", avatar: "G", rating: 5, timeAgo: "2 ay önce", text: "Bölgemde zor bulunuyor ama online sipariş işe yarıyor. Kalitesi tartışılmaz.", likes: 7 },
  // Pro Plan (id: 4)
  { id: 19, brandId: 4, author: "Serkan H.", avatar: "S", rating: 4, timeAgo: "4 gün önce", text: "Veterinerim önerdi ve haklı. Köpeğim çok seviyor. Bilimsel formülü beni etkiliyor.", likes: 11 },
  { id: 20, brandId: 4, author: "Elif O.", avatar: "E", rating: 5, timeAgo: "1 hafta önce", text: "Purina Pro Plan'ı yıllardır kullanıyorum. Kedim çok sağlıklı ve mutlu.", likes: 6 },
  { id: 21, brandId: 4, author: "Burak Y.", avatar: "B", rating: 4, timeAgo: "1 ay önce", text: "Fiyat-kalite dengesi iyi. Özellikle hassas mideliler için sensitive ürünlerini deneyebilirsiniz.", likes: 4 },
  { id: 22, brandId: 4, author: "İpek M.", avatar: "İ", rating: 3, timeAgo: "2 ay önce", text: "Fiyatı biraz yükseldi son zamanlarda. İçerik iyi ama fiyat-performans düştü.", likes: 2 },
  // Hill's (id: 5)
  { id: 23, brandId: 5, author: "Volkan T.", avatar: "V", rating: 4, timeAgo: "6 gün önce", text: "Veteriner onaylı marka. Böbrek problemi olan kedim için prescription diyeti kullanıyoruz.", likes: 14 },
  { id: 24, brandId: 5, author: "Pınar K.", avatar: "P", rating: 5, timeAgo: "2 hafta önce", text: "Şişman kedim için perfect weight serisini aldım, harika sonuçlar verdi.", likes: 9 },
  { id: 25, brandId: 5, author: "Kerem L.", avatar: "K", rating: 3, timeAgo: "1 ay önce", text: "İçerik iyi ama kedim pek sevmedi. Başka serilerini de denedim ama sonuç aynı.", likes: 3 },
  // N&D (id: 6)
  { id: 26, brandId: 6, author: "Simge A.", avatar: "S", rating: 4, timeAgo: "1 hafta önce", text: "İtalyan kalitesi belli. Tahılsız ve yüksek proteinli. Kedim çok seviyor.", likes: 7 },
  { id: 27, brandId: 6, author: "Orhan B.", avatar: "O", rating: 5, timeAgo: "3 hafta önce", text: "N&D pumpkin serisi mide problemlerinde mucize gibi çalıştı. Çok memnunum.", likes: 12 },
  { id: 28, brandId: 6, author: "Tuba S.", avatar: "T", rating: 3, timeAgo: "2 ay önce", text: "Kaliteli bir marka ama fiyatı çok yüksek. Bütçe dostu değil.", likes: 2 },
  // Brit Care (id: 7)
  { id: 29, brandId: 7, author: "Kaan M.", avatar: "K", rating: 4, timeAgo: "4 gün önce", text: "Fiyat-kalite dengesi çok iyi. Kedim büyük keyifle yiyor. Kesinlikle tavsiye ederim.", likes: 8 },
  { id: 30, brandId: 7, author: "Eda C.", avatar: "E", rating: 4, timeAgo: "2 hafta önce", text: "Yeni denemeye başladım ama memnunum. İçerik listesi gayet iyi, fiyatı makul.", likes: 5 },
  // Advance (id: 8)
  { id: 31, brandId: 8, author: "Murat D.", avatar: "M", rating: 4, timeAgo: "1 hafta önce", text: "İspanyol markası ama oldukça iyi kalite. Veteriner diyetleri özellikle dikkat çekici.", likes: 6 },
  { id: 32, brandId: 8, author: "Yıldız E.", avatar: "Y", rating: 5, timeAgo: "1 ay önce", text: "Küçük ırk köpeğim için mini serisi mükemmel. Çok beğeniyor ve sağlıklı.", likes: 9 },
  // Purina One (id: 9)
  { id: 33, brandId: 9, author: "Ahmet F.", avatar: "A", rating: 4, timeAgo: "3 gün önce", text: "Bütçe dostu ve kaliteli. Sürekli kullanıcıyım, kedim sağlıklı ve enerjik.", likes: 7 },
  { id: 34, brandId: 9, author: "Leyla G.", avatar: "L", rating: 5, timeAgo: "2 hafta önce", text: "Fiyatı çok uygun. Bu kalitede bu fiyata başka marka yok. Çok memnunum.", likes: 4 },
  { id: 35, brandId: 9, author: "Rıza H.", avatar: "R", rating: 3, timeAgo: "1 ay önce", text: "Orta kalite, fiyatına göre iyi. Daha pahalı markalara kıyasla fark var elbette.", likes: 1 },
  // Monge (id: 10)
  { id: 36, brandId: 10, author: "Songül İ.", avatar: "S", rating: 4, timeAgo: "5 gün önce", text: "İtalyan markası. İçeriği iyi, kedim seviyor. Biraz bilinmez bir marka ama kaliteli.", likes: 6 },
  { id: 37, brandId: 10, author: "Tolga J.", avatar: "T", rating: 5, timeAgo: "3 hafta önce", text: "Monge grain free serisini tercih ediyorum. Kedimde allerji azaldı, çok memnunum.", likes: 10 },
];

export function getReviewsByBrandId(brandId: number): Review[] {
  return reviews.filter((r) => r.brandId === brandId);
}

export function getRatingDistribution(brandId: number): Record<number, number> {
  const brandReviews = getReviewsByBrandId(brandId);
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  brandReviews.forEach((r) => {
    dist[r.rating] = (dist[r.rating] || 0) + 1;
  });
  return dist;
}
