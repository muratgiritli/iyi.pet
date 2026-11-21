<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="tr">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Site Haritası | Atakum Pet (atakumpet.com)</title>
        <style>
          :root { --bg:#f8fafc; --card:#ffffff; --ink:#0f172a; --muted:#475569; --accent:#0f766e; --border:#e2e8f0; }
          * { box-sizing:border-box; }
          body { margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--ink); line-height:1.5; padding:16px; }
          .wrap { max-width:1100px; margin:0 auto; }
          .hdr { background:linear-gradient(135deg,#0f172a,#134e4a); color:#fff; border-radius:14px; padding:20px 24px; margin-bottom:18px; }
          .hdr h1 { margin:0 0 6px; font-size:clamp(1.2rem,3vw,1.65rem); }
          .hdr p { margin:0; color:#cbd5e1; font-size:0.92rem; }
          .hdr a { color:#5eead4; text-decoration:underline; }
          .stats { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
          .badge { background:rgba(255,255,255,0.12); padding:5px 12px; border-radius:999px; font-size:0.83rem; font-weight:600; }
          .card { background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(15,23,42,0.05); }
          table { width:100%; border-collapse:collapse; font-size:0.9rem; }
          th { background:#f1f5f9; color:#334155; text-align:left; padding:12px 14px; font-weight:700; border-bottom:1px solid var(--border); }
          td { padding:10px 14px; border-bottom:1px solid var(--border); word-break:break-word; }
          tr:last-child td { border-bottom:none; }
          tr:hover td { background:#f8fafc; }
          a.loc { color:var(--accent); text-decoration:none; font-weight:500; }
          a.loc:hover { text-decoration:underline; }
          .meta { color:var(--muted); font-size:0.82rem; white-space:nowrap; }
          @media (max-width:640px) {
            table, thead, tbody, tr, td { display:block; width:100%; }
            thead { display:none; }
            tr { padding:10px 12px; border-bottom:1px solid var(--border); }
            td { padding:3px 0; border:none; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="hdr">
            <h1>Atakum Pet — Yapılandırılmış XML Site Haritası</h1>
            <p>Bu XML site haritası Google, Bing, Yandex ve yapay zeka arama motorlarının (<a href="https://www.atakumpet.com/">www.atakumpet.com</a>) sayfalarını kategorik ve hızlı biçimde taraması için oluşturulmuştur.</p>
            <div class="stats">
              <xsl:if test="sitemap:sitemapindex">
                <span class="badge">Alt Harita Sayısı: <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></span>
              </xsl:if>
              <xsl:if test="sitemap:urlset">
                <span class="badge">Bu Haritadaki Kanonik URL: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
                <a href="/sitemap.xml" style="color:#fff;text-decoration:none;" class="badge">← Ana Sitemap İndeksine Dön</a>
              </xsl:if>
            </div>
          </div>
          <div class="card">
            <xsl:if test="sitemap:sitemapindex">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kategori Site Haritası (XML)</th>
                    <th>Son Güncelleme</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td class="meta"><xsl:value-of select="position()"/></td>
                      <td><a class="loc" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                      <td class="meta"><xsl:value-of select="sitemap:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:if>
            <xsl:if test="sitemap:urlset">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kanonik Sayfa Adresi (URL)</th>
                    <th>Görsel</th>
                    <th>Dil</th>
                    <th>Son Güncelleme</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td class="meta"><xsl:value-of select="position()"/></td>
                      <td><a class="loc" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                      <td class="meta"><xsl:value-of select="count(image:image)"/></td>
                      <td class="meta"><xsl:value-of select="count(xhtml:link)"/></td>
                      <td class="meta"><xsl:value-of select="sitemap:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:if>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
