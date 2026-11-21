import os, sys, time
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import paramiko
from pathlib import Path

local = Path(os.environ["USERPROFILE"]) / "Projects" / "jetgo.shop"
assert (local / "public" / "index.html").exists()

host = "2.29.9.147"
password = "4ECmussfcuft"
remote = "/opt/jetgo.shop"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username="root", password=password, timeout=25, allow_agent=False, look_for_keys=False)

def run(cmd, timeout=600):
    print(">>>", cmd[:180].replace("\n", " | "))
    _in, out, err = client.exec_command(cmd, timeout=timeout)
    text = (out.read() + err.read()).decode("utf-8", errors="replace")
    print(text[-4000:])
    return text

run("dig +short jetgo.shop A; echo ---www---; dig +short www.jetgo.shop A; echo ---old---; getent hosts jetgo.shop || true")
run(f"mkdir -p {remote}/public")

sftp = client.open_sftp()

def put_dir(src: Path, dst: str):
    for p in src.rglob("*"):
        if p.name in {".git", "generate.py", "build_pages.py", "harvest_google.py", "peek_google.py", "verify.py", "deploy.py"} or p.suffix in {".pyc", ".py"}:
            continue
        rel = p.relative_to(src).as_posix()
        rpath = f"{dst}/{rel}"
        if p.is_dir():
            try:
                sftp.mkdir(rpath)
            except Exception:
                pass
        else:
            parent = str(Path(rpath).parent).replace("\\", "/")
            try:
                sftp.mkdir(parent)
            except Exception:
                pass
            sftp.put(str(p), rpath)
            print("put", rel)

put_dir(local, remote)
sftp.close()

caddy = """jetgo.shop, www.jetgo.shop {
	encode gzip
	reverse_proxy 127.0.0.1:5003
}
"""
run("cat > /etc/caddy/sites/jetgo.shop.caddy << 'EOF'\n" + caddy + "EOF")
run("cd /opt/jetgo.shop && docker compose up -d --build", timeout=300)
run("caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy")
time.sleep(4)
run("docker ps --format 'table {{.Names}}\\t{{.Ports}}\\t{{.Status}}' | sed -n '1,20p'")
run("curl -sS -o /dev/null -w 'local:%{http_code}\\n' -H 'Host: jetgo.shop' http://127.0.0.1:5003/")
run("curl -sS -o /dev/null -w 'https:%{http_code} redir:%{redirect_url}\\n' -I --max-time 20 https://jetgo.shop/ || true")
run("journalctl -u caddy -n 25 --no-pager")
client.close()
print("DONE")
