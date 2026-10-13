"""Validate local HTML/CSS/JS references and content-versioned comparator module."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import hashlib, re
ROOT = Path(__file__).resolve().parents[1] / "public"
class Refs(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = []
    def handle_starttag(self, tag, attrs):
        self.refs.extend(v for k,v in attrs if k in ("href", "src") and v)
count = 0
for p in ROOT.rglob("*"):
    if not p.is_file(): continue
    refs = []
    if p.suffix == ".html":
        parser = Refs(); parser.feed(p.read_text()); refs = parser.refs
    elif p.suffix == ".css":
        refs = re.findall(r"url\(['\"]?([^)'\"]+)", p.read_text())
    elif p.suffix == ".js":
        refs = re.findall(r"from ['\"]([^'\"]+)['\"]", p.read_text())
    for ref in refs:
        parsed = urlparse(ref)
        if parsed.scheme or parsed.netloc or ref.startswith("#"): continue
        target = (ROOT / unquote(parsed.path).lstrip("/") if parsed.path.startswith("/") else p.parent / unquote(parsed.path)).resolve()
        assert target.is_relative_to(ROOT.resolve()) and target.exists(), (p.name, ref)
        count += 1
module = ROOT / "compare/app.js"
hash_value = hashlib.sha256(module.read_bytes()).hexdigest()[:12]
assert f"app.js?v={hash_value}" in (ROOT / "compare/index.html").read_text()
print(f"Static references checked: {count}; comparator content hash matches")
