# -*- coding: utf-8 -*-
"""Build jetgo.shop product-content pages. Buy CTA -> enuygunpetshop.com."""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parent / "public"
SRC = Path(r"C:\Users\HUAWEİ\Projects\jet1\client\src\lib\keyword-pages.ts")
SHOP = "https://www.enuygunpetshop.com"

def slugify(s: str) -> str:
    s = s.replace("İ", "i").replace("I", "i").replace("ı", "i")
    s = s.replace("Ç", "c").replace("ç", "c")
    s = s.replace("Ğ", "g").replace("ğ", "g")
    s = s.replace("Ö", "o").replace("ö", "o")
    s = s.replace("Ş", "s").replace("ş", "s")
    s = s.replace("Ü", "u").replace("ü", "u")
    s = s.replace("â", "a").replace("î", "i").replace("û", "u")
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s)

def tr_title(s: str) -> str:
    parts = []
    for w in s.split():
        if not w:
            continue
        parts.append(w[0].upper() + w[1:] if len(w) > 1 else w.upper())
    return " ".join(parts)

text = SRC.read_text(encoding="utf-8")
m = re.search(r"const KEYWORDS: string\[\] = \[(.*?)\];", text, re.S)
raw = m.group(1)
kws = re.findall(r'"([^"]+)"', raw)

# Extra product-content topics Google-style URLs used on the old jetgo.shop corpus
extra = [
    "atakum petshop", "samsun petshop", "jetgo petshop",
    "kedi maması", "köpek maması", "kedi kumu",
    "royal canin kedi maması", "royal canin köpek maması",
    "pro plan kedi maması", "pro plan köpek maması",
    "hills kedi maması", "n&d kedi maması", "reflex kedi maması",
    "yavru kedi maması", "steril kedi maması", "tahılsız kedi maması",
    "yavru köpek maması", "büyük ırk köpek maması", "küçük ırk köpek maması",
    "topaklanan kedi kumu", "silika kedi kumu", "bentonit kedi kumu",
    "kedi konservesi", "köpek konservesi", "ödül maması",
    "kedi tırmalama tahtası", "köpek tasması", "kedi kumu küreği",
]
att = Path(r"C:\Users\HUAWEİ\Projects\jet1\attached_assets\Pasted-domain-ad-https-www-jetgo-pet-sitemap-ve-keywords-sayfa_1775864463194.txt")
if att.exists():
    for line in att.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip().lstrip("- ").strip()
        if 8 < len(line) < 80 and "http" not in line.lower() and not line.startswith("["):
            extra.append(line)
for e in extra:
    if e not in kws:
        kws.append(e)

# Dedup by slug
seen = set()
topics = []
for kw in kws:
    sl = slugify(kw)
    if not sl or sl in seen:
        continue
    seen.add(sl)
    topics.append((kw, sl))

def shop_href(kw: str) -> str:
    k = kw.lower()
    if "kopek" in slugify(kw) or "köpek" in k:
        return SHOP + "/kategori/kopek"
    if "kus" in slugify(kw) or "kuş" in k or "muhabbet" in k:
        return SHOP + "/kategori/kus"
    if "akvaryum" in k or "balik" in slugify(kw) or "balık" in k:
        return SHOP + "/kategori/akvaryum"
    if "kedi" in k or "kum" in k:
        return SHOP + "/kategori/kedi"
    return SHOP

def facts(kw: str, slug: str):
    h = int(hashlib.md5(slug.encode()).hexdigest(), 16)
    k = kw.lower()
    mama = "mama" in k
    kum = "kum" in k
    kedi = "kedi" in k
    kopek = "köpek" in k or "kopek" in slug
    marka = any(x in k for x in ["royal", "pro plan", "proplan", "hills", "hill's", "reflex", "n&d", "nd ", "lavital", "brit", "prochoice", "acana", "whiskas", "felix", "pedigree"])
    yavru = "yavru" in k
    steril = "steril" in k
    tahilsiz = "tahılsız" in k or "tahilsiz" in slug
    yas = "yaş mama" in k or "konserve" in k
    odul = "ödül" in k or "odul" in slug

    if kum:
        p1 = f"{tr_title(kw)} aramasında asıl soru kumun türüdür: bentonit topaklanır ve küreme kolaydır; silika düşük toz arayan evlerde tercih edilir. Koku çoğu zaman kum markasından çok geç küremeden gelir."
        p2 = "İçerik tarafında bentonit kil, koku tutucu katkı ve tanecik boyutu ayrılır. Parfümlü kumlar hassas kedide kaçışa yol açabilir; kokusuz hatlar tuvalet alışkanlığını bozmaz."
        p3 = "Kap hacmi, kedi sayısı ve küreme sıklığı tüketimi belirler. İnce taneli kum yapışır; iri taneli daha az dağılır. Satın alma jetgo.shop üzerinden yapılmaz."
    elif mama and kedi:
        p1 = f"{tr_title(kw)} seçiminde protein kaynağı, yağ oranı ve yaşam evresi etiketini birlikte okuyun. Tavuk, balık veya hidrolize protein satırları farklı mide profillerine gider."
        p2 = "Kuru mamada nem düşüktür; yaş mama su katkısı taşır. Steril hatlar kalori kısıtlar, yavru hatları büyüme mineralleri ekler. Tahılsız iddia nişastayı başka karbonhidrata kaydırabilir — etiket yine belirleyicidir."
        p3 = "Geçiş 7–10 günde karıştırılarak yapılır. Ani marka değişimi yumuşak dışkı yapar. Bu sayfa içerik anlatır; stok ve sepet enuygunpetshop.com’dadır."
    elif mama and kopek:
        p1 = f"{tr_title(kw)} için vücut ağırlığı ve günlük hareket, protein yüzdesinden önce gelir. Küçük ırk çiğneme boyutu, maxi hatlar eklem destek cümlesi taşır."
        p2 = "Et unu, taze et ve tahıl satırları farklı formülasyonlardır. Glukozamin, omega-3 ve prebiyotik maddeler içerik listesinde ayrı satırdır; reklam cümlesi değildir."
        p3 = "Çuvalın ilk ve son kullanım tarihi, saklama (serin, kapalı kap) mama kalitesini korur. Satın alma bu sitede yok."
    elif odul:
        p1 = f"{tr_title(kw)} eğitim ve ara öğün içindir; ana öğünün yerini tutmaz. Kalori, tuz ve şeker satırına bakın."
        p2 = "Yumuşak ödül çiğnemeyi kolaylaştırır; kuru ödül diş mekaniğine yardım iddiası taşır ama fırçanın yerine geçmez."
        p3 = "Günlük mama kalorisinin küçük bir dilimini ödülden düşünün. Sipariş enuygunpetshop.com’da."
    elif yas:
        p1 = f"{tr_title(kw)} yüksek nem içerir. Böbrek yükü ve su içmeyen kedilerde pratik destek olabilir; etiket yine yaşa göre okunur."
        p2 = "Açılmış kutu buzdolabında kısa süre durur. Konserve ve pouch aynı kategori değildir; porsiyon farklıdır."
        p3 = "Kuru mama ile dönüşümlü kullanılabilir. Satın alma mağaza sitesindedir."
    elif marka:
        p1 = f"{tr_title(kw)} bir marka aramasıdır. Aynı markanın yavru, yetişkin, steril ve veteriner diyet hatları birbirinin yerine geçmez."
        p2 = "İçerik tablosunda ilk üç madde formülün omurgasıdır. Analitik bileşenler (protein, yağ, kül, lif) karşılaştırmayı somutlar."
        p3 = "Veteriner diyetleri reçetesiz ‘daha iyi mama’ değildir; endikasyon yazısına bakın. Satın alma enuygunpetshop.com üzerinden."
    else:
        p1 = f"{tr_title(kw)} başlığı altında evcil hayvan ürününün ne işe yaradığı ve etiketinin nasıl okunacağı anlatılır. Bu sayfa vitrin değil, içerik notudur."
        p2 = "Mama, kum, aksesuar ve yem gruplarında ortak kural: yaş, tür ve kullanım amacı. Yanlış grup (ör. köpek maması kediye) içerik olarak da uygun değildir."
        p3 = "Atakum ve Samsun aramalarında yerel ihtiyaç aynı ürün ailelerine iner. Satın almak için enuygunpetshop.com kullanılır."

    if yavru:
        p2 += " Yavru formülleri kalsiyum-fosfor dengesini büyüme için ayarlar; yetişkin mamaya erken geçiş önerilmez."
    if steril:
        p2 += " Kısır hatlarda enerji düşer; serbest yedirme kilo aldırır."
    if tahilsiz:
        p2 += " Tahılsız ifade, tahıl yok demektir; patates/bezelye gibi nişasta kaynakları formülde kalabilir."

    bits = [p1, p2, p3]
    # light rotation so neighboring slugs don't open identical
    if h % 2:
        bits[0], bits[1] = bits[1], bits[0]
    return bits

HEAD = """<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <link rel="canonical" href="https://jetgo.shop/{slug}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header class="top">
    <div class="wrap top-inner">
      <a class="mark" href="/">JETGO</a>
      <nav class="nav">
        <a href="/">Başlangıç</a>
        <a href="/kedi-mamasi">Kedi maması</a>
        <a href="/kopek-mamasi">Köpek maması</a>
        <a href="/kedi-kumu">Kedi kumu</a>
        <a href="/iletisim">İletişim</a>
      </nav>
    </div>
  </header>
  <article class="page wrap">
    <p class="kicker">Ürün içeriği · JETGO</p>
    <h1>{h1}</h1>
"""

FOOT_TMPL = """
    <div class="buy">
      <p>Bu sayfa ürünü anlatır; sepet burada yok.</p>
      <a class="buy-btn" href="{href}">Satın almak için enuygunpetshop.com</a>
    </div>
    <p class="more">İlgili: {links}</p>
  </article>
  <footer class="foot">
    <div class="wrap foot-inner">
      <span>© JETGO · jetgo.shop</span>
      <a href="{href}">Satın al</a>
    </div>
  </footer>
</body>
</html>
"""

def related(i: int):
    out = []
    n = len(topics)
    for d in (1, 7, 13, 21):
        kw, sl = topics[(i + d) % n]
        out.append(f'<a href="/{sl}">{tr_title(kw)}</a>')
    return " · ".join(out)

ROOT.mkdir(exist_ok=True)
# keep existing neighborhood pages; overwrite product ones
written = []
for i, (kw, sl) in enumerate(topics):
    if sl in {"iletisim"}:
        continue
    title = f"{tr_title(kw)} içeriği | JETGO"
    desc = f"{tr_title(kw)} nedir, etiketinde ne aranır, kim için uygundur. Satın alma www.enuygunpetshop.com üzerinden."
    p1, p2, p3 = facts(kw, sl)
    href = shop_href(kw)
    html = HEAD.format(title=title, desc=desc, slug=sl, h1=tr_title(kw))
    html += f"<p>{p1}</p><p>{p2}</p><p>{p3}</p>"
    html += f"<h2>Satın alma</h2><p>{tr_title(kw)} için stok, fiyat ve sepet <a href=\"{href}\">www.enuygunpetshop.com</a> adresindedir. jetgo.shop yalnızca ürün ve içerik anlatır.</p>"
    html += FOOT_TMPL.format(href=href, links=related(i))
    (ROOT / f"{sl}.html").write_text(html, encoding="utf-8")
    written.append(sl)

# sitemap
urls = [""] + written + ["iletisim"]
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for s in urls:
    loc = "https://jetgo.shop/" if s == "" else f"https://jetgo.shop/{s}"
    sm.append(f"  <url><loc>{loc}</loc></url>")
sm.append("</urlset>")
(ROOT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
print("pages", len(written))
