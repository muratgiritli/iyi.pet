<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="tr">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Site Haritası (Sitemap) — JETGO.PET</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #f6fafb; color: #0f172a; line-height: 1.5; }
          .hdr { background: linear-gradient(135deg, #001b39 0%, #063b52 100%); color: #fff; padding: 26px 18px; border-bottom: 4px solid #ffb800; }
          .wrap { max-width: 1080px; margin: 0 auto; }
          .badge { display: inline-block; background: #ffb800; color: #001b39; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px; }
          h1 { margin: 0 0 6px; font-size: clamp(20px, 3vw, 28px); }
          .hdr p { margin: 0; font-size: 14px; color: #e2e8f0; }
          .hdr a { color: #ffb800; font-weight: 700; text-decoration: none; }
          .card { background: #fff; border: 1px solid #dbe5ee; border-radius: 14px; margin: 20px auto; overflow: hidden; box-shadow: 0 4px 16px rgba(0,27,57,.05); }
          .meta-bar { padding: 12px 18px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13.5px; font-weight: 700; color: #334155; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
          th, td { text-align: left; padding: 11px 16px; border-bottom: 1px solid #eef2f6; overflow-wrap: anywhere; }
          th { background: #f1f5f9; color: #001b39; font-weight: 800; font-size: 12.5px; text-transform: uppercase; letter-spacing: .03em; }
          tr:hover td { background: #f8fafc; }
          td a { color: #006b6b; font-weight: 700; text-decoration: none; display: inline-block; min-height: 24px; }
          td a:hover { text-decoration: underline; }
          .num { color: #64748b; font-weight: 700; width: 52px; }
          .dt { color: #475569; white-space: nowrap; font-variant-numeric: tabular-nums; }
          @media (max-width: 640px) {
            table, thead, tbody, tr, th, td { display: block; width: 100%; }
            thead { display: none; }
            tr { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
            td { padding: 3px 0; border: 0; }
            .num { display: none; }
            .dt { font-size: 12px; color: #64748b; }
          }
        </style>
      </head>
      <body>
        <div class="hdr">
          <div class="wrap">
            <span class="badge">JETGO.PET · XML SITEMAP YAPISI</span>
            <h1>Arama Motoru ve Yapay Zeka XML Site Haritası</h1>
            <p>Bu standart <code>sitemaps.org 0.9</code> XML haritası Google, Bing, Yandex ve AI arama botları için kategorik olarak yapılandırılmıştır. <a href="https://www.jetgo.pet/">Ana Sayfaya Dön</a> · <a href="/sitemap.xml">Sitemap İndeksi</a></p>
          </div>
        </div>
        <div class="wrap">
          <xsl:if test="s:sitemapindex">
            <div class="card">
              <div class="meta-bar">
                <span>Ana Sitemap İndeksi (Kategorik Alt Haritalar)</span>
                <span>Toplam Alt Harita: <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/></span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th class="num">#</th>
                    <th>Alt Sitemap Dosyası (URL)</th>
                    <th>Son Güncelleme (ISO-8601)</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:sitemapindex/s:sitemap">
                    <tr>
                      <td class="num"><xsl:value-of select="position()"/></td>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="dt"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
          <xsl:if test="s:urlset">
            <div class="card">
              <div class="meta-bar">
                <span>Sayfa Dizini (<a href="/sitemap.xml" style="color:#006b6b">← Sitemap İndeksine Dön</a>)</span>
                <span>Bu Haritadaki Toplam URL: <xsl:value-of select="count(s:urlset/s:url)"/></span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th class="num">#</th>
                    <th>Sayfa Adresi (Canonical URL)</th>
                    <th>Görsel</th>
                    <th>Son Güncelleme</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:urlset/s:url">
                    <tr>
                      <td class="num"><xsl:value-of select="position()"/></td>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td class="dt"><xsl:value-of select="count(image:image)"/> görsel</td>
                      <td class="dt"><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
