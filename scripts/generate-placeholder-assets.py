"""
Generates the neutral placeholder imagery (SVG) and the sample PDF used in demo mode.
Run from the project root:  python scripts/generate-placeholder-assets.py
Replace these files (or point the CMS at real media) once official assets exist.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "images")
DOCS = os.path.join(ROOT, "public", "documents")
os.makedirs(IMG, exist_ok=True)
os.makedirs(DOCS, exist_ok=True)


def write(name, svg):
    with open(os.path.join(IMG, name), "w", encoding="utf-8") as f:
        f.write(svg.strip() + "\n")


def frame(bg, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><rect width="1200" height="800" fill="{bg}"/>{body}</svg>'


# ── Hero facade ──────────────────────────────────────────────
W, H = 1600, 1000
cols = []
for i in range(8):
    x = 760 + i * 100
    cols.append(f'<rect x="{x}" y="430" width="44" height="400" fill="url(#col)" stroke="#9fb6c8" stroke-opacity=".35"/>')
    for k in range(1, 4):
        cols.append(f'<line x1="{x + k * 11}" y1="436" x2="{x + k * 11}" y2="826" stroke="#0b1a2b" stroke-opacity=".35"/>')
    cols.append(f'<rect x="{x - 8}" y="414" width="60" height="16" fill="#1d4462"/><rect x="{x - 8}" y="830" width="60" height="14" fill="#1d4462"/>')
step_colors = ["#173651", "#14304a", "#112a42", "#0f263c"]
steps = "".join(f'<rect x="{700 - i * 30}" y="{844 + i * 26}" width="{860 + i * 60}" height="26" fill="{c}"/>' for i, c in enumerate(step_colors))
dentils = "".join(f'<rect x="{730 + i * 28}" y="404" width="12" height="8" fill="#2f6488" opacity=".7"/>' for i in range(29))
hero = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a2b"/><stop offset="1" stop-color="#183b56"/></linearGradient>
<linearGradient id="col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a5878"/><stop offset=".5" stop-color="#3a6d90"/><stop offset="1" stop-color="#21496a"/></linearGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern>
</defs>
<rect width="{W}" height="{H}" fill="url(#sky)"/>
<rect width="{W}" height="{H}" fill="url(#grid)"/>
<polygon points="700,380 1112,200 1560,380" fill="#1a3f5c" stroke="#b79a60" stroke-width="2"/>
<polygon points="760,366 1112,222 1500,366" fill="none" stroke="#9fb6c8" stroke-opacity=".3"/>
<circle cx="1112" cy="310" r="34" fill="none" stroke="#b79a60" stroke-opacity=".8" stroke-width="2"/>
<circle cx="1112" cy="310" r="24" fill="none" stroke="#9fb6c8" stroke-opacity=".35"/>
<rect x="700" y="380" width="860" height="22" fill="#21496a"/>
<rect x="716" y="402" width="828" height="12" fill="#1a3f5c"/>
{dentils}
{''.join(cols)}
<rect x="1060" y="600" width="100" height="230" fill="#0b1a2b" opacity=".55"/>
{steps}
<line x1="0" y1="948" x2="{W}" y2="948" stroke="#b79a60" stroke-opacity=".5"/>
</svg>"""
write("hero-facade.svg", hero)

# ── News illustrations ───────────────────────────────────────
# 1 colonnade in perspective
parts = []
for i in range(9):
    x = 140 + i * 115
    h = 420 - i * 18
    y = (800 - h) / 2 + 40
    parts.append(f'<rect x="{x}" y="{y}" width="{46 - i * 2.5}" height="{h}" fill="#2d5f82" opacity="{0.95 - i * 0.07:.2f}"/>')
write("news-1.svg", frame("#132c45",
    '<rect y="560" width="1200" height="240" fill="#0f2338"/><path d="M0 230 L1200 330" stroke="#b79a60" stroke-width="3"/>'
    '<path d="M0 250 L1200 345" stroke="#9fb6c8" stroke-opacity=".3"/>' + "".join(parts) +
    '<path d="M0 640 L1200 560" stroke="#9fb6c8" stroke-opacity=".25"/>'))

# 2 arcade
arches = "".join(f'<path d="M{110 + i * 200} 640 V380 A80 80 0 0 1 {270 + i * 200} 380 V640" fill="#e7ecf0" stroke="#183b56" stroke-width="3"/>' for i in range(5))
write("news-2.svg", frame("#f1f4f7",
    f'<rect x="60" y="250" width="1080" height="420" fill="#cdd7df"/>{arches}<rect x="60" y="230" width="1080" height="20" fill="#183b56"/>'
    '<rect x="40" y="670" width="1120" height="16" fill="#183b56"/><line x1="60" y1="700" x2="1140" y2="700" stroke="#b79a60" stroke-width="3"/>'))

# 3 stairs to portico
shades = ["#21496a", "#1d4462", "#193d5a", "#163651", "#132f48", "#10283f", "#0e2337"]
st = "".join(f'<rect x="{200 - i * 40}" y="{520 + i * 40}" width="{800 + i * 80}" height="40" fill="{shades[i]}"/>' for i in range(7))
pc = "".join(f'<rect x="{290 + i * 130}" y="260" width="40" height="260" fill="#3a6d90"/>' for i in range(5))
write("news-3.svg", frame("#0d2034",
    f'{st}<polygon points="250,250 600,130 950,250" fill="none" stroke="#b79a60" stroke-width="3"/><rect x="250" y="240" width="700" height="20" fill="#2a5878"/>{pc}'))

# 4 archive shelves
sh = []
widths = [26, 34, 22, 30, 40, 24]
heights = [96, 84, 100, 90, 78, 104]
colors = ["#245b7a", "#183b56", "#b79a60", "#5f7d95", "#2f6488", "#10243a"]
for r in range(4):
    y = 150 + r * 150
    sh.append(f'<rect x="120" y="{y + 110}" width="960" height="10" fill="#183b56"/>')
    x, k = 140, 0
    while x < 1040:
        wdt = widths[(k + r) % 6]
        h = heights[(k * 2 + r) % 6]
        sh.append(f'<rect x="{x}" y="{y + 110 - h}" width="{wdt}" height="{h}" fill="{colors[(k + r * 2) % 6]}"/>')
        x += wdt + 6
        k += 1
write("news-4.svg", frame("#e9eef2", "".join(sh)))

# 5 dome
drum = "".join(f'<rect x="{370 + i * 58}" y="494" width="22" height="106" fill="#3a6d90"/>' for i in range(9))
write("news-5.svg", frame("#1b4566",
    '<rect y="600" width="1200" height="200" fill="#163651"/><path d="M380 470 A220 220 0 0 1 820 470 Z" fill="#2f6488"/>'
    '<path d="M420 470 A180 180 0 0 1 780 470" fill="none" stroke="#9fb6c8" stroke-opacity=".4"/><rect x="590" y="215" width="20" height="40" fill="#b79a60"/>'
    '<rect x="340" y="470" width="520" height="24" fill="#21496a"/>' + drum +
    '<line x1="0" y1="620" x2="1200" y2="620" stroke="#b79a60" stroke-opacity=".6" stroke-width="2"/>'))

# 6 modern facade grid
cells = []
for r in range(8):
    for c in range(12):
        op = 0.18 + ((r * 7 + c * 3) % 5) * 0.12
        cells.append(f'<rect x="{150 + c * 76}" y="{90 + r * 76}" width="60" height="60" fill="#9fb6c8" opacity="{op:.2f}"/>')
write("news-6.svg", frame("#0b1a2b", f'<rect x="130" y="70" width="940" height="640" fill="#10243a"/>{"".join(cells)}<rect x="130" y="700" width="940" height="10" fill="#b79a60"/>'))

# ── Portrait placeholder ─────────────────────────────────────
write("portrait-placeholder.svg",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750"><defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1">'
    '<stop offset="0" stop-color="#f1f4f7"/><stop offset="1" stop-color="#d5dee6"/></linearGradient></defs>'
    '<rect width="600" height="750" fill="url(#p)"/><circle cx="300" cy="300" r="105" fill="#b4c3d0"/>'
    '<path d="M110 750 C120 560 200 470 300 470 C400 470 480 560 490 750 Z" fill="#b4c3d0"/>'
    '<path d="M262 470 L300 560 L338 470" fill="#9fb2c2"/><rect x="0" y="742" width="600" height="8" fill="#b79a60"/></svg>')

# ── Map placeholder ──────────────────────────────────────────
roads = "".join(f'<line x1="0" y1="{y}" x2="1200" y2="{y + dy}" stroke="#ffffff" stroke-width="{sw}"/>' for y, dy, sw in [(120, 40, 10), (300, -30, 18), (470, 20, 10), (640, -10, 14)])
roads += "".join(f'<line x1="{x}" y1="0" x2="{x + dx}" y2="800" stroke="#ffffff" stroke-width="{sw}"/>' for x, dx, sw in [(160, 60, 10), (420, -40, 14), (700, 30, 20), (980, -20, 10)])
blocks = "".join(f'<rect x="{x}" y="{y}" width="{wd}" height="{ht}" fill="#d9e1e8"/>' for x, y, wd, ht in
    [(190, 150, 200, 120), (460, 140, 210, 130), (740, 130, 220, 140), (190, 330, 200, 110), (470, 320, 200, 120),
     (760, 320, 190, 120), (200, 500, 180, 110), (470, 500, 200, 110), (760, 500, 190, 110)])
write("map-placeholder.svg",
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><rect width="1200" height="800" fill="#e8edf1"/>'
    f'{blocks}<path d="M0 720 C300 680 500 760 1200 700 L1200 800 L0 800Z" fill="#cfdde8"/>{roads}</svg>')

# ── Sample PDF (valid single page) ───────────────────────────
title = "Dokument demonstrues / Demonstration document"
sub = "Ky skedar zevendesohet me dokumentin zyrtar. / Placeholder for the official file."
stream = (
    f"BT /F1 20 Tf 72 760 Td ({title}) Tj ET\n"
    f"BT /F1 11 Tf 72 732 Td ({sub}) Tj ET\n"
    "0.718 0.604 0.376 RG 2 w 72 716 m 523 716 l S"
).encode("latin-1")
objs = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
]
pdf = bytearray(b"%PDF-1.4\n")
offsets = []
for i, o in enumerate(objs, 1):
    offsets.append(len(pdf))
    pdf += f"{i} 0 obj\n".encode() + o + b"\nendobj\n"
xref = len(pdf)
pdf += f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode()
for off in offsets:
    pdf += f"{off:010d} 00000 n \n".encode()
pdf += f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
with open(os.path.join(DOCS, "dokument-demonstrues.pdf"), "wb") as f:
    f.write(pdf)

print("Placeholder assets generated.")
