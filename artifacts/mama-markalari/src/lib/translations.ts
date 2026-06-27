export type Lang = "tr" | "en";

type Dict = Record<string, string>;

const tr: Dict = {
  // Header / nav
  "header.searchPlaceholder": "Marka ara...",
  "nav.brands": "Mama Markaları",
  "nav.guide": "Evcil Hayvan Rehberi",
  "nav.findVet": "Veteriner Bul",
  "nav.blog": "Blog",
  "nav.about": "Hakkımızda",
  "common.soon": "(yakında)",
  "common.verified": "Doğrulandı",

  // Home
  "home.brandsTitle": "Mama Markaları",
  "home.resultsFor": '"{q}" için sonuçlar',
  "home.subtitle": "Gerçek pet sahiplerinin yorumlarına göre en iyi mama markaları sıralaması.",
  "home.brandsFound": "{n} marka bulundu.",
  "home.tab.all": "Tümü",
  "home.tab.global": "Global Markalar",
  "home.tab.local": "Yerel Markalar",
  "home.rankingInfo": "Sıralama nasıl belirlenir?",
  "home.col.rank": "#",
  "home.col.brand": "Marka",
  "home.col.rating": "Puan",
  "home.col.reviews": "Yorum",
  "home.noBrands": "Bu filtreyle marka bulunamadı.",
  "home.showAll": "Tüm markaları inceleyin ({n} daha)",
  "home.showLess": "Daha az göster",

  // Categories
  "cat.all": "Tüm Kategoriler",
  "cat.premium": "Premium",
  "cat.standard": "Standart",
  "cat.veterinary": "Veteriner",

  // Brand sort (home)
  "sort.rating_desc": "En Yüksek Puan",
  "sort.rating_asc": "En Düşük Puan",
  "sort.reviews_desc": "En Çok Yorum",
  "sort.name_asc": "A-Z",

  // Brand page
  "brand.breadcrumbHome": "Ana Sayfa",
  "brand.verifiedBrand": "Doğrulanmış Marka",
  "brand.reviewsCount": "{n} yorum",
  "brand.website": "Web Sitesi",
  "brand.allProducts": "Tüm Ürünleri",
  "brand.writeReview": "Yorum Yaz",
  "brand.reviewsByStars": "Yıldız Puanına Göre Yorumlar",
  "brand.all": "Tümü",
  "brand.reviews": "Yorumlar",
  "brand.noReviews": "Bu filtreyle yorum bulunamadı.",
  "brand.notFoundTitle": "Marka bulunamadı",
  "brand.notFoundText": "Aradığınız marka sistemde kayıtlı değil.",
  "brand.backHome": "Ana Sayfaya Dön",
  "brand.defaultDesc": "{name}, evcil hayvanlar için kaliteli mama ürünleri sunan güvenilir bir markadır.",

  // Review sort (brand page)
  "rsort.newest": "En Yeniler",
  "rsort.highest": "En Yüksek Puan",
  "rsort.lowest": "En Düşük Puan",
  "rsort.most_liked": "En Çok Beğenilen",

  // Review card
  "review.helpful": "Yararlı",
  "review.unhelpful": "Yararsız",
  "review.report": "Şikayet Et",
  "review.reported": "Raporlandı",
  "review.reportThanks": "Yorum raporlandı. Teşekkürler!",
  "review.pending": "İnceleme bekliyor",
  "review.photoAlt": "Yorum fotoğrafı",

  // Review modal
  "modal.title": "Yorum Yaz — {brand}",
  "modal.submitted": "Yorumunuz gönderildi!",
  "modal.submittedDesc": "İnceleme sürecinden sonra yayınlanacaktır.",
  "modal.close": "Kapat",
  "modal.personalInfo": "Kişisel Bilgiler",
  "modal.privacyA": "Kişisel bilgileriniz",
  "modal.privacyBold": "kimse ile paylaşılmayacaktır.",
  "modal.privacyB": "Yalnızca yorum doğrulama amacıyla kullanılır.",
  "modal.firstName": "Ad",
  "modal.firstNamePh": "Adınız",
  "modal.lastName": "Soyad",
  "modal.lastNamePh": "Soyadınız",
  "modal.phone": "Telefon",
  "modal.selectRating": "Puanınızı seçin",
  "modal.yourRating": "Puanınız",
  "modal.titleLabel": "Başlık",
  "modal.optional": "(isteğe bağlı)",
  "modal.titlePh": "Kısa bir başlık ekleyin",
  "modal.commentLabel": "Yorumunuz",
  "modal.commentPh": "Ürün hakkındaki deneyiminizi paylaşın...\n(Enerji, tüy yapısı, sindirim, iştah vb.)",
  "modal.petLabel": "Evcil hayvanınız",
  "modal.petSelect": "Tür seçin",
  "pet.cat": "Kedi",
  "pet.dog": "Köpek",
  "pet.bird": "Kuş",
  "pet.other": "Diğer",
  "modal.photoLabel": "Fotoğraf ekleyin",
  "modal.photoHint": "Fotoğraf seçin veya buraya sürükleyin",
  "modal.photoFormats": "jpg, png (maks. 5MB)",
  "modal.fileTooBig": "Dosya 5MB'den büyük olamaz.",
  "modal.termsA": "Yorumların",
  "modal.termsLink": "yayınlanma kurallarını",
  "modal.termsB": "kabul ediyorum.",
  "modal.cancel": "İptal",
  "modal.submit": "Yorumumu Gönder",
  "modal.submitting": "Gönderiliyor...",
  "modal.errorDefault": "Yorum gönderilemedi. Lütfen tekrar deneyin.",

  // SEO
  "seo.homeTitle": "Mama Markaları Sıralaması – iyi.pet",
  "seo.homeDesc": "Gerçek pet sahiplerinin yorumlarına göre en iyi kedi ve köpek mama markaları sıralaması. Marka puanlarını karşılaştırın, yorum yazın.",
  "seo.brandTitle": "{name} Yorumları ve Puanı – iyi.pet",
  "seo.brandDesc": "{name} hakkında {n} gerçek kullanıcı yorumu ve {rating}/5 ortalama puan. Pet sahiplerinin deneyimlerini okuyun.",
  "seo.notFoundTitle": "Marka Bulunamadı – iyi.pet",
};

const en: Dict = {
  // Header / nav
  "header.searchPlaceholder": "Search brands...",
  "nav.brands": "Pet Food Brands",
  "nav.guide": "Pet Care Guide",
  "nav.findVet": "Find a Vet",
  "nav.blog": "Blog",
  "nav.about": "About Us",
  "common.soon": "(soon)",
  "common.verified": "Verified",

  // Home
  "home.brandsTitle": "Pet Food Brands",
  "home.resultsFor": 'Results for "{q}"',
  "home.subtitle": "The best pet food brands ranked by reviews from real pet owners.",
  "home.brandsFound": "{n} brands found.",
  "home.tab.all": "All",
  "home.tab.global": "Global Brands",
  "home.tab.local": "Local Brands",
  "home.rankingInfo": "How is the ranking determined?",
  "home.col.rank": "#",
  "home.col.brand": "Brand",
  "home.col.rating": "Rating",
  "home.col.reviews": "Reviews",
  "home.noBrands": "No brands found with this filter.",
  "home.showAll": "Browse all brands ({n} more)",
  "home.showLess": "Show less",

  // Categories
  "cat.all": "All Categories",
  "cat.premium": "Premium",
  "cat.standard": "Standard",
  "cat.veterinary": "Veterinary",

  // Brand sort (home)
  "sort.rating_desc": "Highest Rated",
  "sort.rating_asc": "Lowest Rated",
  "sort.reviews_desc": "Most Reviewed",
  "sort.name_asc": "A-Z",

  // Brand page
  "brand.breadcrumbHome": "Home",
  "brand.verifiedBrand": "Verified Brand",
  "brand.reviewsCount": "{n} reviews",
  "brand.website": "Website",
  "brand.allProducts": "All Products",
  "brand.writeReview": "Write a Review",
  "brand.reviewsByStars": "Reviews by Star Rating",
  "brand.all": "All",
  "brand.reviews": "Reviews",
  "brand.noReviews": "No reviews found with this filter.",
  "brand.notFoundTitle": "Brand not found",
  "brand.notFoundText": "The brand you are looking for is not in our system.",
  "brand.backHome": "Back to Home",
  "brand.defaultDesc": "{name} is a trusted brand offering quality pet food products for your pets.",

  // Review sort (brand page)
  "rsort.newest": "Newest",
  "rsort.highest": "Highest Rated",
  "rsort.lowest": "Lowest Rated",
  "rsort.most_liked": "Most Liked",

  // Review card
  "review.helpful": "Helpful",
  "review.unhelpful": "Not helpful",
  "review.report": "Report",
  "review.reported": "Reported",
  "review.reportThanks": "Review reported. Thank you!",
  "review.pending": "Awaiting review",
  "review.photoAlt": "Review photo",

  // Review modal
  "modal.title": "Write a Review — {brand}",
  "modal.submitted": "Your review has been submitted!",
  "modal.submittedDesc": "It will be published after the moderation process.",
  "modal.close": "Close",
  "modal.personalInfo": "Personal Information",
  "modal.privacyA": "Your personal information",
  "modal.privacyBold": "will not be shared with anyone.",
  "modal.privacyB": "It is used only to verify your review.",
  "modal.firstName": "First Name",
  "modal.firstNamePh": "Your first name",
  "modal.lastName": "Last Name",
  "modal.lastNamePh": "Your last name",
  "modal.phone": "Phone",
  "modal.selectRating": "Select your rating",
  "modal.yourRating": "Your rating",
  "modal.titleLabel": "Title",
  "modal.optional": "(optional)",
  "modal.titlePh": "Add a short title",
  "modal.commentLabel": "Your review",
  "modal.commentPh": "Share your experience with the product...\n(Energy, coat condition, digestion, appetite, etc.)",
  "modal.petLabel": "Your pet",
  "modal.petSelect": "Select type",
  "pet.cat": "Cat",
  "pet.dog": "Dog",
  "pet.bird": "Bird",
  "pet.other": "Other",
  "modal.photoLabel": "Add a photo",
  "modal.photoHint": "Select a photo or drag it here",
  "modal.photoFormats": "jpg, png (max. 5MB)",
  "modal.fileTooBig": "File cannot be larger than 5MB.",
  "modal.termsA": "I accept the",
  "modal.termsLink": "review publishing rules",
  "modal.termsB": ".",
  "modal.cancel": "Cancel",
  "modal.submit": "Submit My Review",
  "modal.submitting": "Submitting...",
  "modal.errorDefault": "Review could not be submitted. Please try again.",

  // SEO
  "seo.homeTitle": "Pet Food Brand Rankings – iyi.pet",
  "seo.homeDesc": "The best cat and dog food brands ranked by reviews from real pet owners. Compare brand ratings and write reviews.",
  "seo.brandTitle": "{name} Reviews and Rating – iyi.pet",
  "seo.brandDesc": "{n} real user reviews and a {rating}/5 average rating for {name}. Read pet owners' experiences.",
  "seo.notFoundTitle": "Brand Not Found – iyi.pet",
};

const dicts: Record<Lang, Dict> = { tr, en };

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  let s = dicts[lang][key] ?? dicts.tr[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
