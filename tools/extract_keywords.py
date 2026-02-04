#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAMMAR_DIR = ROOT

KW_RE = re.compile(r"\bkw\(\s*(['\"])([^'\"]+)\1\s*(?:,\s*([^)]*))?\)")
ALIAS_CALL_RE = re.compile(r"\balias\(")
TOKEN_RE = re.compile(r"\btoken\(\s*/([^/]+)/i\s*\)")


def split_top_level(s: str, sep: str = "|") -> list[str]:
    parts = []
    buf = []
    depth = 0
    in_class = False
    escape = False
    for ch in s:
        if escape:
            buf.append(ch)
            escape = False
            continue
        if ch == "\\":
            buf.append(ch)
            escape = True
            continue
        if in_class:
            buf.append(ch)
            if ch == "]":
                in_class = False
            continue
        if ch == "[":
            in_class = True
            buf.append(ch)
            continue
        if ch == "(":
            depth += 1
            buf.append(ch)
            continue
        if ch == ")":
            depth = max(depth - 1, 0)
            buf.append(ch)
            continue
        if ch == sep and depth == 0 and not in_class:
            parts.append("".join(buf))
            buf = []
            continue
        buf.append(ch)
    parts.append("".join(buf))
    return parts


def expand_optional_suffix(part: str) -> set[str]:
    part = re.sub(r"\[[^\]]*\]", "", part)
    part = part.strip("^$")
    if not part:
        return set()

    match = re.fullmatch(r"([A-Za-z0-9_-]+)\(([^()]+)\)\?", part)
    if match:
        base, opt = match.groups()
        out = {base}
        for option in opt.split("|"):
            if re.fullmatch(r"[A-Za-z0-9_-]+", option):
                out.add(base + option)
        return out

    if re.search(r"[\\.^$+*?{}()|]", part):
        return set()
    if re.fullmatch(r"[A-Za-z0-9_-]+", part):
        return {part}
    return set()


def extract_from_regex(regex_src: str) -> set[str]:
    if re.search(r"\s", regex_src):
        return set()
    regex_src = regex_src.replace(r"\-", "-")

    out = set()
    for part in split_top_level(regex_src, "|"):
        out |= expand_optional_suffix(part)
    return out


def main() -> int:
    paths = [GRAMMAR_DIR / "grammar.js"]
    paths.extend(sorted((GRAMMAR_DIR / "grammar").rglob("*.js")))

    keywords = set()
    for path in paths:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        aliased = set()
        for alias_match in ALIAS_CALL_RE.finditer(text):
            start = alias_match.end()
            depth = 1
            i = start
            while i < len(text) and depth > 0:
                ch = text[i]
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    depth -= 1
                i += 1
            if depth != 0:
                continue
            alias_body = text[start : i - 1]
            for match in KW_RE.finditer(alias_body):
                aliased.add(match.group(2))

        for match in KW_RE.finditer(text):
            keyword = match.group(2)
            options = match.group(3) or ""
            if re.search(r"\balias\b\s*:", options):
                continue
            if keyword in aliased:
                continue
            keywords.add(keyword)
        for match in TOKEN_RE.finditer(text):
            keywords.update(extract_from_regex(match.group(1)))

    for keyword in sorted(keywords, key=str.upper):
        print(f"\"{keyword}\"")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
