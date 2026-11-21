#!/usr/bin/env python3
"""Getir Carsi isletme acik/kapali anahtari. Saatler Europe/Istanbul."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta

LOCALS = "https://locals-api-gateway.artisan.getirapi.com"
API = "https://api-gateway.artisan.getirapi.com"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
STATUS_OPEN = 100
STATUS_BUSY = 200
STATUS_CLOSED = 300
IST = timezone(timedelta(hours=3), name="Europe/Istanbul")


def load_env_file(path: str) -> None:
    if not os.path.isfile(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            val = val.strip().strip("'").strip('"')
            os.environ.setdefault(key, val)


def now_istanbul() -> datetime:
    return datetime.now(IST)


def log(msg: str) -> None:
    ts = now_istanbul().strftime("%Y-%m-%d %H:%M:%S %Z")
    print(f"[{ts}] {msg}", flush=True)


def req(method: str, url: str, body=None, headers=None, timeout=30):
    data = None if body is None else json.dumps(body).encode("utf-8")
    h = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Language": "tr",
        "User-Agent": UA,
        "Origin": "https://panel.getircarsi.com",
        "Referer": "https://panel.getircarsi.com/",
    }
    if headers:
        h.update(headers)
    request = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        return e.code, raw


def login(email: str, password: str) -> dict:
    status, raw = req(
        "POST",
        f"{LOCALS}/auth/login",
        {"username": email, "password": password},
    )
    if status >= 400:
        raise RuntimeError(f"login failed {status}: {raw[:400]}")
    data = json.loads(raw)
    if not data.get("accessToken"):
        raise RuntimeError("login response missing accessToken")
    return data


def auth_headers(token: str, shop_id: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "oauthenabled": "1",
        "token": "dummy",
        "shopid": shop_id,
    }


def get_shop(headers: dict, shop_id: str) -> dict:
    status, raw = req("GET", f"{LOCALS}/shops/{shop_id}", headers=headers)
    if status >= 400:
        raise RuntimeError(f"shop get failed {status}: {raw[:400]}")
    return json.loads(raw)


def can_open(headers: dict, shop_id: str) -> dict:
    status, raw = req("GET", f"{LOCALS}/shops/{shop_id}/can-open", headers=headers)
    if status >= 400:
        raise RuntimeError(f"can-open failed {status}: {raw[:400]}")
    return json.loads(raw)


def status_name(code: int) -> str:
    return {STATUS_OPEN: "ACIK", STATUS_BUSY: "MESGUL", STATUS_CLOSED: "KAPALI"}.get(
        code, f"BILINMIYOR({code})"
    )


def is_weekend(dt: datetime) -> bool:
    return dt.weekday() >= 5


def open_shop(headers: dict, shop_id: str) -> None:
    body = {"strategy": {"type": "INDEFINITE"}, "timeOffAmount": 0}
    status, raw = req(
        "POST",
        f"{API}/shops/{shop_id}/status/open",
        body,
        headers=headers,
    )
    if status >= 400:
        raise RuntimeError(f"open failed {status}: {raw[:500]}")
    log(f"open ok {status} {raw[:200]}")


def close_shop(headers: dict, shop_id: str) -> None:
    body = {"timeOffAmount": 0}
    status, raw = req(
        "POST",
        f"{API}/shops/{shop_id}/status/closed",
        body,
        headers=headers,
    )
    if status >= 400:
        raise RuntimeError(f"close failed {status}: {raw[:500]}")
    log(f"close ok {status} {raw[:200]}")


def main() -> int:
    here = os.path.dirname(os.path.abspath(__file__))
    load_env_file(os.path.join(here, ".env"))
    load_env_file("/opt/getir-shop-hours/.env")

    action = (sys.argv[1] if len(sys.argv) > 1 else "").strip().lower()
    if action not in {"open", "close", "status"}:
        print("kullanim: getir-shop-toggle.py open|close|status", file=sys.stderr)
        return 2

    email = os.environ.get("GETIR_EMAIL", "").strip()
    password = os.environ.get("GETIR_PASSWORD", "")
    shop_id = os.environ.get("GETIR_SHOP_ID", "6a55d0376227f408372a7259").strip()
    if not email or not password:
        log("GETIR_EMAIL / GETIR_PASSWORD eksik")
        return 2

    now = now_istanbul()
    session = login(email, password)
    shop_id = shop_id or (session.get("profile") or {}).get("lastShop") or shop_id
    headers = auth_headers(session["accessToken"], shop_id)
    shop = get_shop(headers, shop_id)
    current = int(shop.get("status") or 0)
    log(f"magaza={shop.get('name')} durum={status_name(current)} eylem={action}")

    if action == "status":
        info = can_open(headers, shop_id)
        log(
            f"canOpen={info.get('shopCanOpen')} messages={info.get('messages')} "
            f"strategies={len(info.get('strategies') or [])}"
        )
        return 0

    if action == "open":
        if is_weekend(now):
            log("hafta sonu: acilmaz, magaza kapali kalir")
            if current != STATUS_CLOSED:
                close_shop(headers, shop_id)
            return 0
        if current in (STATUS_OPEN, STATUS_BUSY):
            log("zaten acik, islem yok")
            return 0
        info = can_open(headers, shop_id)
        if not info.get("shopCanOpen"):
            log(f"can-open reddetti: {info}")
            return 1
        strategies = info.get("strategies") or []
        messages = info.get("messages") or []
        if strategies or messages:
            log(f"mesai disi veya uyari, acilmadi: {info}")
            return 1
        open_shop(headers, shop_id)
        return 0

    if current == STATUS_CLOSED:
        log("zaten kapali, islem yok")
        return 0
    close_shop(headers, shop_id)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        log(f"HATA: {exc}")
        raise SystemExit(1)
