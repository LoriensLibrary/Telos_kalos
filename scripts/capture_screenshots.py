"""Capture README screenshots for Telos via Playwright.

Hits the local Vite dev server at http://127.0.0.1:5181 and saves PNGs into
docs/screenshots/. Run with the dev server already running:

    npm run dev          # in one terminal
    python scripts/capture_screenshots.py

Re-runnable: overwrites existing PNGs, idempotent.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5181"
OUT = Path(__file__).resolve().parent.parent / "docs" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

# Each shot: (filename, route, post-nav setup function, viewport)
DESKTOP = {"width": 1440, "height": 900}
TABLET = {"width": 900, "height": 1200}


def _wait_visible(page, selector: str, timeout: int = 5000) -> None:
    page.wait_for_selector(selector, state="visible", timeout=timeout)


def shot_overview(page):
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    time.sleep(0.6)
    page.screenshot(path=str(OUT / "01-overview.png"), full_page=False)


def shot_member_dexa_with_mode(page, mode_label: str, file_suffix: str):
    page.goto(f"{BASE}/member")
    page.wait_for_load_state("networkidle")
    time.sleep(0.5)
    # Click the "DEXA Report" tab. Member app has multiple tabs.
    tabs = page.locator("button, a").all()
    for t in tabs:
        try:
            txt = (t.text_content() or "").strip()
            if "DEXA" in txt and "Report" in txt:
                t.click()
                break
        except Exception:
            continue
    time.sleep(0.6)
    # Click the requested module chip.
    chips = page.locator('[role="tab"]').all()
    found = False
    for chip in chips:
        try:
            if (chip.text_content() or "").strip() == mode_label:
                chip.click()
                found = True
                break
        except Exception:
            continue
    if not found:
        print(f"  [warn] mode chip {mode_label!r} not found", file=sys.stderr)
    time.sleep(0.7)  # transition + redraw
    # Scroll the body SVG into view.
    page.evaluate(
        """
        const svg = document.querySelector('svg[viewBox="0 0 240 520"]');
        if (svg) {
          svg.scrollIntoView({ block: 'center', behavior: 'instant' });
          window.scrollBy(0, -80);
        }
        """
    )
    time.sleep(0.4)
    page.screenshot(
        path=str(OUT / f"03-dexa-{file_suffix}.png"),
        full_page=False,
    )


def shot_performance_ai_inbox(page):
    page.goto(f"{BASE}/performance")
    page.wait_for_load_state("networkidle")
    time.sleep(0.6)
    # Click "AI Inbox" tab
    tabs = page.locator("button, a").all()
    for t in tabs:
        try:
            txt = (t.text_content() or "").strip()
            if "AI Inbox" in txt:
                t.click()
                break
        except Exception:
            continue
    time.sleep(0.7)
    page.screenshot(path=str(OUT / "04-ai-inbox.png"), full_page=False)


def shot_cama_proof(page):
    page.goto(f"{BASE}/cama")
    page.wait_for_load_state("networkidle")
    time.sleep(0.8)
    page.screenshot(path=str(OUT / "05-cama-proof.png"), full_page=False)


def main() -> int:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            context = browser.new_context(
                viewport=DESKTOP,
                device_scale_factor=2,  # crisper for retina-feel screenshots
            )
            page = context.new_page()

            print("[1/6] overview")
            shot_overview(page)

            print("[2/6] dexa composite")
            shot_member_dexa_with_mode(page, "COMPOSITE", "composite")

            print("[3/6] dexa visceral")
            shot_member_dexa_with_mode(page, "VISCERAL", "visceral")

            print("[4/6] dexa bone")
            shot_member_dexa_with_mode(page, "BONE", "bone")

            print("[5/6] ai inbox")
            shot_performance_ai_inbox(page)

            print("[6/6] cama proof")
            shot_cama_proof(page)

            print()
            print("Saved screenshots:")
            for p_path in sorted(OUT.glob("*.png")):
                print(f"  {p_path.name}  ({p_path.stat().st_size:,} bytes)")
        finally:
            browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
