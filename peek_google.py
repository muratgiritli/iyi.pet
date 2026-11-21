import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("2.29.9.147", username="root", password="4ECmussfcuft", timeout=20, allow_agent=False, look_for_keys=False)
cmd = r"""
python3 - <<'PY'
import urllib.request, ssl, re
u = "https://www.google.com/search?q=site%3Ajetgo.shop&num=20&hl=tr"
req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"})
ctx = ssl.create_default_context()
html = urllib.request.urlopen(req, context=ctx, timeout=25).read().decode("utf-8", "replace")
open("/tmp/g.html","w",encoding="utf-8").write(html)
print("jetgo count", html.lower().count("jetgo"))
print("cite count", html.count("<cite"))
# print unique-ish tokens around jetgo
for m in re.finditer(r'.{0,80}jetgo.{0,80}', html, re.I):
    print("CTX", m.group(0).replace("\n"," ")[:200])
    if m.start() > 4000:
        break
print("---HREFS sample---")
hrefs = re.findall(r'href="([^"]{10,120})"', html)
print("hrefs", len(hrefs))
for h in hrefs[:40]:
    if "google" not in h or "jetgo" in h:
        print(h)
print("---TITLE-ish---")
for m in re.finditer(r'<h3[^>]*>(.*?)</h3>', html):
    print("H3", re.sub('<[^>]+>','', m.group(1))[:120])
PY
"""
_in, out, err = client.exec_command(cmd, timeout=40)
print((out.read()+err.read()).decode("utf-8","replace")[-8000:])
client.close()
