import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    "2.29.9.147",
    username="root",
    password="4ECmussfcuft",
    timeout=20,
    allow_agent=False,
    look_for_keys=False,
)
cmd = r"""
python3 - <<'PY'
import re, urllib.parse, urllib.request, ssl
urls = [
  "https://www.google.com/search?q=site%3Ajetgo.shop&num=100&hl=tr",
  "https://www.google.com/search?q=site%3Ajetgo.shop+mama&num=50&hl=tr",
  "https://www.google.com/search?q=site%3Awww.jetgo.shop&num=50&hl=tr",
]
ctx = ssl.create_default_context()
found = []
for u in urls:
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=25) as r:
            html = r.read().decode("utf-8", "replace")
        print("FETCH", u, "len", len(html), "blocked" if "unusual traffic" in html.lower() or "captcha" in html.lower() else "ok")
        for m in re.finditer(r"https?://(?:www\.)?jetgo\.shop/([a-z0-9\-/]+)", html, re.I):
            found.append(m.group(0).split("#")[0].rstrip("/"))
        for m in re.finditer(r"/url\?q=(https?://(?:www\.)?jetgo\.shop[^&]+)", html):
            found.append(urllib.parse.unquote(m.group(1)))
    except Exception as e:
        print("ERR", u, e)
print("---URLS---")
uniq = []
for x in found:
    x = x.split("&")[0]
    if x not in uniq:
        uniq.append(x)
for x in uniq[:200]:
    print(x)
print("COUNT", len(uniq))
PY
"""
_in, out, err = client.exec_command(cmd, timeout=90)
print((out.read() + err.read()).decode("utf-8", "replace"))
client.close()
