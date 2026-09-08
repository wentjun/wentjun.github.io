import { layers } from './layer-data';
export type Point = [number, number];
export const VIEW_BOX = '0 35 900 700';
export const definitions =
  '<defs>\n   <linearGradient id="glass" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#e4f5f5" stop-opacity=".97"/><stop offset=".33" stop-color="#a5c6d1" stop-opacity=".88"/><stop offset=".7" stop-color="#c7e2e7" stop-opacity=".94"/><stop offset="1" stop-color="#789ba9"/></linearGradient>\n   <linearGradient id="glass-edge" gradientUnits="userSpaceOnUse" x1="190" y1="0" x2="760" y2="0"><stop stop-color="#658a94"/><stop offset=".48" stop-color="#9cbec5"/><stop offset="1" stop-color="#6e939d"/></linearGradient>\n   <linearGradient id="ceramic" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#fffcf0"/><stop offset=".56" stop-color="#e7e0d0"/><stop offset="1" stop-color="#c6bdab"/></linearGradient>\n   <linearGradient id="ceramic-edge" gradientUnits="userSpaceOnUse" x1="190" y1="0" x2="760" y2="0"><stop stop-color="#a99f8d"/><stop offset=".5" stop-color="#d3cbbc"/><stop offset="1" stop-color="#b5aa97"/></linearGradient>\n   <linearGradient id="graphite" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#647171"/><stop offset=".3" stop-color="#343f40"/><stop offset="1" stop-color="#172327"/></linearGradient>\n   <linearGradient id="graphite-edge" gradientUnits="userSpaceOnUse" x1="190" y1="0" x2="760" y2="0"><stop stop-color="#283537"/><stop offset=".55" stop-color="#435353"/><stop offset="1" stop-color="#263638"/></linearGradient>\n   <linearGradient id="metal" x1="0" y1="0" x2="1" y2=".75"><stop stop-color="#9ba7a7"/><stop offset=".48" stop-color="#d1dad5"/><stop offset="1" stop-color="#abb6b2"/></linearGradient>\n   <linearGradient id="metal-edge" gradientUnits="userSpaceOnUse" x1="190" y1="0" x2="760" y2="0"><stop stop-color="#748481"/><stop offset=".5" stop-color="#b9c5bd"/><stop offset="1" stop-color="#879792"/></linearGradient>\n   <linearGradient id="copper"><stop stop-color="#613a2b"/><stop offset=".3" stop-color="#c17e56"/><stop offset=".5" stop-color="#f0c5a0"/><stop offset=".66" stop-color="#c18c65"/><stop offset="1" stop-color="#744a33"/></linearGradient>\n   <radialGradient id="ground"><stop stop-color="#536266" stop-opacity=".21"/><stop offset="1" stop-color="#536266" stop-opacity="0"/></radialGradient>\n   <filter id="soft-shadow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>\n  </defs>';

// Pure, authored SVG geometry: the same deterministic markup is rendered at build time and in the browser.
export function createSculpture(
  spread: number,
  angle: number,
  selected: number
) {
  const names = layers.map((layer) => layer.name);
  const materials = ['glass', 'ceramic', 'graphite', 'metal'];
  const f = (n: number) => Number(n.toFixed(2));
  function project(x: number, y: number, z: number): Point {
    const a = -0.53 + (angle * Math.PI) / 180,
      c = Math.cos(a),
      s = Math.sin(a);
    return [
      f(472 + (x * c + z * s) * 1.11),
      f(
        392 +
          (1 - spread) * 72 +
          (-x * s + z * c) * (0.48 + (1 - spread) * 0.2) -
          y * 0.92
      ),
    ];
  }
  function path(points: Point[], close = true) {
    return (
      points.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join('') +
      (close ? 'Z' : '')
    );
  }
  function rounded(w: number, d: number, r: number) {
    const p: Point[] = [];
    for (const [cx, cz, start] of [
      [w - r, d - r, 0],
      [-w + r, d - r, 90],
      [-w + r, -d + r, 180],
      [w - r, -d + r, 270],
    ])
      for (let j = 0; j <= 10; j++) {
        const a = ((start + j * 9) * Math.PI) / 180;
        p.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
      }
    return p;
  }
  const outer = rounded(235, 144, 35),
    apertures = [
      rounded(92, 82, 66),
      rounded(115, 53, 15),
      rounded(68, 64, 12),
    ],
    baseOuter = rounded(243, 151, 30);
  function line(a: Point, b: Point, attrs: string) {
    return `<path d="${path([a, b], false)}" ${attrs}/>`;
  }

  let out = `<ellipse cx="467" cy="${568 + spread * 120}" rx="306" ry="${45 + spread * 38}" fill="url(#ground)" pointer-events="none"/>`;
  const anchors: Point[] = [];
  const levels = [
    47 + spread * 140,
    19 + spread * 47,
    -9 - spread * 47,
    -37 - spread * 140,
  ];
  const pinXs = [-181, 181];
  const pinZ = -101;
  const pinCircle = (x: number, y: number, radius: number) =>
    Array.from({ length: 32 }, (_, index) => {
      const angle = (index * Math.PI) / 16;
      return project(
        x + Math.cos(angle) * radius,
        y,
        pinZ + Math.sin(angle) * radius
      );
    });
  for (let i = 3; i >= 0; i--) {
    const y = levels[i],
      t = i === 3 ? 24 : i === 2 ? 18 : 12,
      shape = i === 3 ? baseOuter : outer,
      inner = apertures[i] || apertures[0];
    const tp = shape.map(([x, z]) => project(x, y, z)),
      bp = shape.map(([x, z]) => project(x, y - t, z));
    // Cast shadows travel with each plate, rather than scaling a flattened image.
    if (i < 3 && spread > 0.15) {
      const shadow = shape.map(([x, z]) =>
        project(x + 13, levels[i + 1] + 1, z + 8)
      );
      out += `<path d="${path(shadow)}" fill="#344a49" opacity="${0.045 + spread * 0.035}" filter="url(#soft-shadow)" pointer-events="none"/>`;
    }
    out += `<g data-sculpture-layer="${i}">`;
    const apertureBottom = inner.map(([x, z]) => project(x, y - t, z));
    const pinHoles = pinXs.map((x) => pinCircle(x, y, 9.5));
    const pinBottoms = pinXs.map((x) => pinCircle(x, y - t, 9.5));
    out += `<path d="${path(bp) + (i < 3 ? path(apertureBottom) : '') + pinBottoms.map((hole) => path(hole)).join('')}" fill="url(#${materials[i]}-edge)" fill-rule="evenodd"/>`;
    for (let j = 0; j < tp.length; j++) {
      const k = (j + 1) % tp.length;
      out += `<path d="${path([tp[j], tp[k], bp[k], bp[j]])}" fill="url(#${materials[i]}-edge)" stroke="url(#${materials[i]}-edge)" stroke-width=".6"/>`;
    }
    const hole = inner.map(([x, z]) => project(x, y, z)),
      holeBottom = inner.map(([x, z]) => project(x, y - t, z));
    const face =
      path(tp) +
      (i < 3 ? path(hole) : '') +
      pinHoles.map((hole) => path(hole)).join('');
    out += `<path data-object-layer="${i}" d="${face}" fill="url(#${materials[i]})" fill-rule="evenodd" stroke="${['#adc5c9', '#d9d6c9', '#5c6c6d', '#cbd5d0'][i]}" stroke-width="1.1"><title>${names[i]} — select this layer</title></path>`;
    if (i < 3) {
      // Inner rear wall gives the aperture real thickness while leaving it open.
      for (let j = 0; j < hole.length; j++) {
        const k = (j + 1) % hole.length;
        if (hole[j][1] < project(0, y, 0)[1])
          out += `<path d="${path([hole[j], hole[k], holeBottom[k], holeBottom[j]])}" fill="url(#${materials[i]}-edge)" stroke="url(#${materials[i]}-edge)" stroke-width=".35" pointer-events="none"/>`;
      }
      out += `<path d="${path(hole)}" fill="none" stroke="${i === 2 ? '#1b292c' : '#8eaaa9'}" stroke-width="1" opacity=".6" pointer-events="none"/>`;
    }
    // Authored material detail: graphite fins, metal brushing and pin collars.
    const ink = selected === i ? '#ad532e' : i === 2 ? '#a8b7ad' : '#697b78';
    const detail = (points: Point[], width = 2) =>
      `<path d="${path(
        points.map(([x, z]) => project(x, y + 1, z)),
        false
      )}" fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>`;
    const node = (x: number, z: number, filled = false, radius = 5) => {
      const ring = Array.from({ length: 24 }, (_, k) => {
        const a = (k * Math.PI) / 12;
        return project(
          x + Math.cos(a) * radius,
          y + 1,
          z + Math.sin(a) * radius
        );
      });
      return `<path d="${path(ring)}" fill="${filled ? ink : 'none'}" stroke="${ink}" stroke-width="1.6" pointer-events="none"/>`;
    };
    const check = (x: number, z: number) =>
      detail(
        [
          [x - 8, z],
          [x - 1, z + 8],
          [x + 12, z - 10],
        ],
        2.6
      );
    // Each drawing shares an entry and an outcome. Only its middle changes.
    // All details are in plate coordinates, so they stay registered during rotation.
    if (i === 0) {
      out +=
        node(-185, 108) +
        detail([
          [-174, 108],
          [-90, 108],
        ]);
      // A bounded status display makes otherwise invisible work visible.
      const display = rounded(54, 17, 8).map(([x, z]) =>
        project(x, y + 1, z + 108)
      );
      out += `<path d="${path(display)}" fill="none" stroke="${ink}" stroke-width="1.6" pointer-events="none"/>`;
      for (const x of [-26, 0, 26]) out += node(x, 108, x < 26, 4);
      out +=
        detail([
          [70, 108],
          [147, 108],
        ]) + check(177, 108);
    }
    if (i === 1) {
      out +=
        node(-185, 108) +
        detail([
          [-174, 108],
          [-104, 108],
        ]);
      // A returning branch rejoins the same request, rather than creating another output.
      out += detail(
        [
          [-104, 108],
          [-104, 76],
          [42, 76],
          [42, 108],
          [174, 108],
        ],
        2.4
      );
      out += detail(
        [
          [42, 108],
          [42, 129],
          [-104, 129],
          [-104, 108],
        ],
        1.5
      );
      out += detail(
        [
          [-91, 122],
          [-104, 129],
          [-91, 136],
        ],
        1.5
      );
      out +=
        node(-104, 108, true, 3) +
        node(42, 108, true, 3) +
        node(185, 108, true);
    }
    if (i === 2) {
      out +=
        node(-185, 108) +
        detail([
          [-174, 108],
          [-142, 108],
        ]);
      // The direct route and model stay on the visible front edge, including the model box.
      out += detail(
        [
          [-142, 108],
          [-120, 132],
          [112, 132],
          [142, 108],
        ],
        2.4
      );
      out += detail(
        [
          [-142, 108],
          [-120, 86],
          [-44, 86],
        ],
        1.5
      );
      out += detail(
        [
          [44, 86],
          [112, 86],
          [142, 108],
        ],
        1.5
      );
      const model = rounded(42, 16, 6).map(([x, z]) =>
        project(x, y + 1, z + 86)
      );
      out += `<path d="${path(model)}" fill="none" stroke="${ink}" stroke-width="1.6" pointer-events="none"/>`;
      for (const x of [-18, 0, 18])
        out += detail(
          [
            [x, 78],
            [x, 94],
          ],
          1.3
        );
      out +=
        check(149, 108) +
        detail([
          [165, 108],
          [174, 108],
        ]) +
        node(185, 108, true);
      out += node(-142, 108, true, 3);
    }
    if (i === 3) {
      for (let z = -133; z < 135; z += 6)
        out += line(
          project(-212, y + 0.1, z),
          project(212, y + 0.1, z),
          'stroke="#ebeee5" stroke-width=".4" opacity=".15" pointer-events="none"'
        );
      // An opening through a constraint, with a continuous path from idea to use.
      out +=
        node(-185, 108) +
        detail(
          [
            [-174, 108],
            [169, 108],
          ],
          2.8
        ) +
        node(185, 108, true, 7);
      out += detail(
        [
          [-18, 51],
          [-18, 92],
          [4, 92],
        ],
        2.4
      );
      out += detail(
        [
          [-18, 126],
          [-18, 141],
          [4, 141],
        ],
        2.4
      );
      out += detail(
        [
          [70, 98],
          [84, 108],
          [70, 118],
        ],
        2.4
      );
    }
    for (const [pin, x] of pinXs.entries()) {
      const opening = pinHoles[pin];
      const underside = pinBottoms[pin];
      const center = project(x, y, pinZ);
      // The rear bore wall and an open collar describe the plate thickness.
      out += `<defs><clipPath id="pin-bore-${i}-${pin}"><path d="${path(opening)}"/></clipPath></defs><g clip-path="url(#pin-bore-${i}-${pin})" pointer-events="none">`;
      for (let j = 0; j < opening.length; j++) {
        const k = (j + 1) % opening.length;
        if ((opening[j][1] + opening[k][1]) / 2 < center[1]) {
          out += `<path d="${path([opening[j], opening[k], underside[k], underside[j]])}" fill="#63594a" pointer-events="none"/>`;
        }
      }
      out += '</g>';
      out += `<path d="${path(pinCircle(x, y + 0.6, 12)) + path(pinCircle(x, y + 0.6, 9.5))}" fill="#b6a083" fill-rule="evenodd" stroke="#796145" stroke-width=".65" pointer-events="none"/>`;
    }
    anchors[i] = project(-211, y, 115);
    if (selected === i) {
      const a = project(-206, y - t, 144),
        b = project(-70, y - t, 144);
      out += line(
        a,
        b,
        'stroke="#a74425" stroke-width="2.4" stroke-linecap="round" pointer-events="none"'
      );
    }
    out += '</g>';
    // Interleave each exposed rod section with the plates. The next plate masks
    // the shaft except at its bore, and the top section emerges from its collar.
    for (const x of pinXs) {
      const start = project(x, y, pinZ);
      const endY = i > 0 ? levels[i - 1] : y + 25;
      const end = project(x, endY, pinZ);
      out += line(
        start,
        end,
        'stroke="#644735" stroke-width="11" stroke-linecap="butt" pointer-events="none"'
      );
      out += line(
        [start[0] + 1.2, start[1]],
        [end[0] + 1.2, end[1]],
        'stroke="#d5a780" stroke-width="4" stroke-linecap="butt" pointer-events="none"'
      );
      if (i === 0)
        out += `<path d="${path(pinCircle(x, endY, 5))}" fill="#ebc2a0" stroke="#796145" stroke-width=".65" pointer-events="none"/>`;
    }
  }

  const basePoints = baseOuter.map(([x, z]) => project(x, levels[3] - 24, z));
  const baseFront: Point = [
    project(0, levels[3], 0)[0],
    Math.max(...basePoints.map((p) => p[1])),
  ];
  return { markup: out, anchors, baseFront };
}
