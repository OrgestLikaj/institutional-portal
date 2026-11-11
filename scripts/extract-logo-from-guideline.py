import pymupdf, sys, os

def hexc(c):
    return None if c is None else '#%02x%02x%02x' % tuple(round(v*255) for v in c[:3])

def to_svg(page_no, region, skip_fill=None, recolor=None):
    doc = pymupdf.open(sys.argv[1])
    page = doc[page_no-1]
    R = pymupdf.Rect(region)
    items = [d for d in page.get_drawings() if R.contains(d['rect']) or (R.intersects(d['rect']) and d['rect'].width < R.width)]
    out, bbox = [], None
    for d in items:
        fill = hexc(d.get('fill')); stroke = hexc(d.get('color'))
        if skip_fill and fill in skip_fill and d['rect'].width > R.width*0.8:
            continue
        if d['rect'].width < 6 and d['rect'].height > 60:
            continue  # divider bar: drawn by the site in CSS
        parts = []
        cur = [None]
        def mv(pt):
            if cur[0] is None or abs(cur[0].x - pt.x) > 0.01 or abs(cur[0].y - pt.y) > 0.01:
                parts.append(f'M{pt.x:.2f} {pt.y:.2f}')
        for it in d['items']:
            k = it[0]
            if k == 'l':
                a, b = it[1], it[2]; mv(a); parts.append(f'L{b.x:.2f} {b.y:.2f}'); cur[0] = b
            elif k == 'c':
                a, c1, c2, b = it[1:5]; mv(a); parts.append(f'C{c1.x:.2f} {c1.y:.2f} {c2.x:.2f} {c2.y:.2f} {b.x:.2f} {b.y:.2f}'); cur[0] = b
            elif k == 're':
                r = it[1]; parts.append(f'M{r.x0:.2f} {r.y0:.2f}H{r.x1:.2f}V{r.y1:.2f}H{r.x0:.2f}Z'); cur[0] = None
            elif k == 'qu':
                q = it[1]; parts.append(f'M{q.ul.x:.2f} {q.ul.y:.2f}L{q.ur.x:.2f} {q.ur.y:.2f}L{q.lr.x:.2f} {q.lr.y:.2f}L{q.ll.x:.2f} {q.ll.y:.2f}Z'); cur[0] = None
        # merge consecutive segments into a single path (drop redundant moveto when continuous)
        dstr = ''.join(parts)
        if d.get('closePath'): dstr += 'Z'
        if recolor:
            fill = recolor.get(fill, fill); stroke = recolor.get(stroke, stroke)
        attrs = []
        if d['type'] in ('f', 'fs') and fill: attrs.append(f'fill="{fill}"')
        else: attrs.append('fill="none"')
        if d['type'] in ('s', 'fs') and stroke:
            attrs.append(f'stroke="{stroke}" stroke-width="{d.get("width") or 1:.2f}" stroke-linecap="round" stroke-linejoin="round"')
        if d.get('even_odd'): attrs.append('fill-rule="evenodd"')
        out.append(f'<path d="{dstr}" {" ".join(attrs)}/>')
        bbox = d['rect'] if bbox is None else bbox | d['rect']
    pad = 0.5
    vb = f'{bbox.x0-pad:.2f} {bbox.y0-pad:.2f} {bbox.width+2*pad:.2f} {bbox.height+2*pad:.2f}'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + ''.join(out) + '</svg>', len(items), bbox

if __name__ == '__main__':
    d = sys.argv[2]
    for name, args, kw in [
        ('logo-icon', (3, (940, 300, 1120, 470)), {}),
        ('logo-icon-white', (6, (690, 440, 830, 570)), {'skip_fill': {'#7a1518', '#100c0d'}}),
    ]:
        svg, n, bbox = to_svg(*args, **kw)
        open(f"{d}/{name}.svg", 'w', encoding='utf-8').write(svg)
        print(name, n, 'items', len(svg), 'bytes')
