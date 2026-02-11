#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAMMAR_DIR = ROOT

KW_CALL_RE = re.compile(r"\bkw\s*\(")
ALIAS_CALL_RE = re.compile(r"\balias\s*\(")
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


def parse_call_body(text: str, open_paren_index: int) -> int | None:
    depth = 1
    i = open_paren_index + 1
    in_single = False
    in_double = False
    in_template = False
    in_line_comment = False
    in_block_comment = False
    escape = False

    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""

        if in_line_comment:
            if ch == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            if ch == "*" and nxt == "/":
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue

        if in_single:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_single = False
            i += 1
            continue
        if in_double:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_double = False
            i += 1
            continue
        if in_template:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "`":
                in_template = False
            i += 1
            continue

        if ch == "/" and nxt == "/":
            in_line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            in_block_comment = True
            i += 2
            continue
        if ch == "'":
            in_single = True
            i += 1
            continue
        if ch == '"':
            in_double = True
            i += 1
            continue
        if ch == "`":
            in_template = True
            i += 1
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return None


def split_args(s: str) -> list[str]:
    parts = []
    buf = []
    depth = 0
    in_single = False
    in_double = False
    in_template = False
    in_line_comment = False
    in_block_comment = False
    escape = False

    i = 0
    while i < len(s):
        ch = s[i]
        nxt = s[i + 1] if i + 1 < len(s) else ""

        if in_line_comment:
            buf.append(ch)
            if ch == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            buf.append(ch)
            if ch == "*" and nxt == "/":
                buf.append(nxt)
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue

        if in_single:
            buf.append(ch)
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_single = False
            i += 1
            continue
        if in_double:
            buf.append(ch)
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_double = False
            i += 1
            continue
        if in_template:
            buf.append(ch)
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "`":
                in_template = False
            i += 1
            continue

        if ch == "/" and nxt == "/":
            buf.append(ch)
            buf.append(nxt)
            in_line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            buf.append(ch)
            buf.append(nxt)
            in_block_comment = True
            i += 2
            continue
        if ch == "'":
            in_single = True
            buf.append(ch)
            i += 1
            continue
        if ch == '"':
            in_double = True
            buf.append(ch)
            i += 1
            continue
        if ch == "`":
            in_template = True
            buf.append(ch)
            i += 1
            continue
        if ch in "([{":
            depth += 1
            buf.append(ch)
            i += 1
            continue
        if ch in ")]}":
            depth = max(depth - 1, 0)
            buf.append(ch)
            i += 1
            continue
        if ch == "," and depth == 0:
            parts.append("".join(buf).strip())
            buf = []
            i += 1
            continue
        buf.append(ch)
        i += 1
    parts.append("".join(buf).strip())
    return parts


def iter_calls(text: str, call_re: re.Pattern[str]) -> list[tuple[int, int, int]]:
    calls = []
    for match in call_re.finditer(text):
        call_start = match.start()
        open_paren = match.end() - 1
        close_paren = parse_call_body(text, open_paren)
        if close_paren is None:
            continue
        calls.append((call_start, open_paren, close_paren))
    return calls


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
    aliased_nodes = set()
    for path in paths:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        kw_calls_in_alias = set()
        for _, open_paren, close_paren in iter_calls(text, ALIAS_CALL_RE):
            alias_body = text[open_paren + 1 : close_paren]
            alias_args = split_args(alias_body)
            alias_target = alias_args[1].strip() if len(alias_args) > 1 else ""
            alias_first = alias_args[0].lstrip() if alias_args else ""

            for _, kw_open, kw_close in iter_calls(alias_body, KW_CALL_RE):
                kw_args = split_args(alias_body[kw_open + 1 : kw_close])
                if not kw_args:
                    continue
                kw_match = re.match(r"\s*(['\"])([^'\"]+)\1\s*$", kw_args[0])
                if not kw_match:
                    continue
                abs_kw_open = open_paren + 1 + kw_open
                abs_kw_close = open_paren + 1 + kw_close
                kw_calls_in_alias.add((abs_kw_open, abs_kw_close))

            # Capture direct alias(kw("..."), $.name) as a named query node.
            # We intentionally do not emit nodes for broad wrappers like alias(choice(...), $.identifier).
            target_match = re.fullmatch(r"\s*\$\.(\w+)\s*", alias_target)
            if target_match and alias_first.startswith("kw("):
                aliased_nodes.add(target_match.group(1))

        for _, kw_open, kw_close in iter_calls(text, KW_CALL_RE):
            if (kw_open, kw_close) in kw_calls_in_alias:
                continue
            kw_args = split_args(text[kw_open + 1 : kw_close])
            if not kw_args:
                continue
            kw_match = re.match(r"\s*(['\"])([^'\"]+)\1\s*$", kw_args[0])
            if not kw_match:
                continue
            keyword = kw_match.group(2)
            options = kw_args[1] if len(kw_args) > 1 else ""
            if re.search(r"\balias\b\s*:", options):
                continue
            keywords.add(keyword)
        for match in TOKEN_RE.finditer(text):
            keywords.update(extract_from_regex(match.group(1)))

    for node in sorted(aliased_nodes, key=str.upper):
        print(f"({node})")
    for keyword in sorted(keywords, key=str.upper):
        print(f"\"{keyword}\"")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
