"""Downsize screenshots to README-friendly widths.

Converts 2x-DPI PNGs into 1280px-wide optimized PNGs. Keeps the originals
in scripts/.originals/ in case we want to re-export.
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "docs" / "screenshots"
ORIGINALS = Path(__file__).resolve().parent / ".originals"

TARGET_WIDTH = 1280


def main() -> int:
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    files = sorted(OUT.glob("*.png"))
    if not files:
        print("no PNGs to optimize", file=sys.stderr)
        return 0
    total_before = 0
    total_after = 0
    for src in files:
        size_before = src.stat().st_size
        total_before += size_before

        # Stash original (skip if already stashed)
        dst_orig = ORIGINALS / src.name
        if not dst_orig.exists():
            shutil.copy2(src, dst_orig)

        img = Image.open(src)
        w, h = img.size
        if w > TARGET_WIDTH:
            new_h = int(h * TARGET_WIDTH / w)
            img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)

        img.save(src, format="PNG", optimize=True)
        size_after = src.stat().st_size
        total_after += size_after
        print(
            f"  {src.name:35s} {size_before:>10,}b -> {size_after:>10,}b  "
            f"({100 * size_after / size_before:.0f}%)"
        )

    print()
    print(
        f"total: {total_before:,}b -> {total_after:,}b  "
        f"({100 * total_after / total_before:.0f}%)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
