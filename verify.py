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
import urllib.request, ssl, re
ctx = ssl.create_default_context()
urls = [
  "https://jetgo.shop/",
  "https://jetgo.shop/atakum",
  "https://jetgo.shop/kedi-mamasi",
  "https://www.jetgo.shop/",
  "https://jetgo.shop/sitemap.xml",
]
for u in urls:
    try:
        with urllib.request.urlopen(u, context=ctx, timeout=15) as r:
            body = r.read().decode("utf-8", "replace")
            title = re.search(r"<title>(.*?)</title>", body)
            print(u, r.status, title.group(1) if title else "no-title", "enuygun" if "enuygun" in body.lower() else "clean")
    except Exception as e:
        print(u, "ERR", e)
PY
"""
_in, out, err = client.exec_command(cmd, timeout=40)
print((out.read() + err.read()).decode("utf-8", "replace"))
client.close()
