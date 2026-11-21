<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="tr">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Site Haritası (sitemap.xml) | Jetgo Market Atakum</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            background: #f4f7fb; color: #001a3f; line-height: 1.5; padding: 24px 14px 48px;
          }
          .wrap { max-width: 1080px; margin: 0 auto; }
          .hdr {
            background: #001a3f; color: #fff; border-radius: 16px; padding: 22px 24px;
            border-bottom: 4px solid #ffb400; margin-bottom: 18px;
          }
          .hdr h1 { font-size: clamp(1.2rem, 2.8vw, 1.65rem); font-weight: 800; }
          .hdr p { font-size: 0.875rem; opacity: 0.92; margin-top: 6px; }
          .hdr a { color: #ffb400; text-decoration: underline; font-weight: 700; }
          .meta-bar {
            display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; font-size: 0.8125rem; font-weight: 700;
          }
          .badge {
            background: #fff; border: 1px solid #d5dfe9; border-radius: 999px; padding: 6px 14px;
          }
          .card {
            background: #fff; border: 1px solid #d8e1ec; border-radius: 16px; overflow: hidden;
            box-shadow: 0 6px 18px rgba(0,26,63,0.06);
          }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th {
            background: #06244e; color: #fff; font-size: 0.78rem; font-weight: 800;
            padding: 13px 14px; letter-spacing: 0.02em;
          }
          td {
            padding: 12px 14px; border-bottom: 1px solid #e6edf5; font-size: 0.84rem;
            overflow-wrap: anywhere; vertical-align: middle;
          }
          tr:last-child td { border-bottom: 0; }
          tr:hover td { background: #f8fafc; }
          td a { color: #b84500; font-weight: 700; text-decoration: underline; }
          .prio {
            display: inline-block; background: #eef5fb; color: #001a3f; font-weight: 800;
            padding: 3px 9px; border-radius: 999px; font-size: 0.75rem;
          }
          @media (max-width: 720px) {
            thead { display: none; }
            table, tbody, tr, td { display: block; width: 100%; }
            tr { padding: 14px; border-bottom: 2px solid #e2e8f0; }
            td { padding: 4px 0; border-bottom: 0; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="hdr">
            <h1>Jetgo Market — XML Site Haritası (sitemap.xml)</h1>
            <p>Arama motorları (Google, Bing, Yandex) ve yapay zekâ dizinleyicileri için yapılandırılmış resmi site haritası. Ana sayfa: <a href="https://www.jetgomarket.com/">www.jetgomarket.com</a></p>
          </div>
          <div class="meta-bar">
            <span class="badge">Toplam Kanonik Sayfa: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
            <span class="badge">Görsel (Image Sitemap) Kaydı: <xsl:value-of select="count(sitemap:urlset/sitemap:url/image:image)"/></span>
            <span class="badge">Çok Dilli Hreflang: TR · EN · DE</span>
          </div>
          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kanonik Sayfa Adresi (URL)</th>
                  <th>Öncelik</th>
                  <th>Tarama Sıklığı</th>
                  <th>Görsel</th>
                  <th>Son Güncelleme (UTC+3)</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><b><xsl:value-of select="position()"/></b></td>
                    <td>
                      <xsl:variable name="u" select="sitemap:loc"/>
                      <a href="{$u}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td><span class="prio"><xsl:value-of select="sitemap:priority"/></span></td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="count(image:image)"/> adet</td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
