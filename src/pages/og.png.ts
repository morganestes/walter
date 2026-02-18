import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const MONO_URL =
  'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff';
const MONO_SEMI_URL =
  'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-600-normal.woff';
const MONO_ITALIC_URL =
  'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-italic.woff';

// Render at 2x for sharper text and smoother gradients, downscale final output
const S = 2;
const W = 1200 * S;
const H = 630 * S;

// Dark mode tokens — computed from OKLCH via culori
const c = {
  surface: '#0b0907',
  elevated: '#14110e',
  text1: '#e2ddd7',
  text2: '#837f7b',
  text3: '#4f4d4a',
  accent: '#e6ad00',
  accentAlt: '#43b2e1',
  border: '#45423e',
  borderSub: '#1c1a18',
  dotClose: '#e85854',
  dotMin: '#e6ad00',
  dotMax: '#4eb068',
  logo: '#e2ddd7'
};

function loadLogoSvg(): string {
  const raw = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Logo.astro'), 'utf-8');
  const match = raw.match(/<svg[\s\S]*?<\/svg>/);
  if (!match) throw new Error('Could not extract SVG from Logo.astro');
  return match[0]
    .replace(/class:list=\{[^}]+\}/, '')
    .replace(/fill="var\(--logo\)"/g, `fill="${c.logo}"`)
    .replace(/<svg/, '<svg width="668" height="158"');
}

async function renderLogo(): Promise<string> {
  const svg = loadLogoSvg();
  const png = await sharp(Buffer.from(svg))
    .resize(340 * S)
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

// Moonlight glow overlay — generated with float-precision dithering
// Matches Background.astro dark mode:
// radial-gradient(ellipse at 45% 33%, oklch(0.22 0.01 250/0.3), oklch(0.19 0.005 250/0.12) 35%, transparent 60%)
function generateGlow(): Buffer {
  // Gradient stops: [offset, r, g, b, alpha]
  const stops: [number, number, number, number, number][] = [
    [0, 23, 27, 31, 76.5], // #171b1f @ 0.3
    [0.47, 18, 20, 22, 30.6], // #121416 @ 0.12
    [0.8, 0, 0, 0, 0] // transparent
  ];

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function sample(t: number): [number, number, number, number] {
    if (t >= 0.8) return [0, 0, 0, 0];
    let i = 0;
    while (i < stops.length - 1 && stops[i + 1][0] < t) i++;
    if (i >= stops.length - 1) return [0, 0, 0, 0];
    const [t0, r0, g0, b0, a0] = stops[i];
    const [t1, r1, g1, b1, a1] = stops[i + 1];
    const f = (t - t0) / (t1 - t0);
    return [lerp(r0, r1, f), lerp(g0, g1, f), lerp(b0, b1, f), lerp(a0, a1, f)];
  }

  const data = Buffer.alloc(W * H * 4);
  const cx = 0.45,
    cy = 0.33,
    r = 0.75;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W - cx;
      const ny = y / H - cy;
      const dist = Math.sqrt(nx * nx + ny * ny) / r;
      const [rf, gf, bf, af] = sample(dist);

      // Triangular dither: ±0.5 LSB noise before quantization
      const dither = (Math.random() + Math.random() - 1) * 0.5;
      const offset = (y * W + x) * 4;
      data[offset] = Math.max(0, Math.min(255, Math.round(rf + dither)));
      data[offset + 1] = Math.max(0, Math.min(255, Math.round(gf + dither)));
      data[offset + 2] = Math.max(0, Math.min(255, Math.round(bf + dither)));
      data[offset + 3] = Math.max(0, Math.min(255, Math.round(af + dither)));
    }
  }
  return data;
}

function dot(color: string) {
  return {
    type: 'div',
    props: {
      style: {
        width: `${10 * S}px`,
        height: `${10 * S}px`,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.6
      }
    }
  };
}

function chrome() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: `${7 * S}px`,
        padding: `${12 * S}px ${18 * S}px`,
        borderBottom: `${1 * S}px solid ${c.borderSub}`,
        backgroundColor: c.elevated
      },
      children: [
        dot(c.dotClose),
        dot(c.dotMin),
        dot(c.dotMax),
        {
          type: 'div',
          props: {
            style: {
              fontSize: `${13 * S}px`,
              fontFamily: 'JetBrains Mono',
              color: c.text3,
              marginLeft: `${8 * S}px`
            },
            children: 'https://walter.cooking'
          }
        }
      ]
    }
  };
}

function footer() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${10 * S}px ${18 * S}px`,
        borderTop: `${1 * S}px solid ${c.borderSub}`,
        backgroundColor: c.elevated,
        fontSize: `${13 * S}px`,
        fontFamily: 'JetBrains Mono'
      },
      children: [
        {
          type: 'div',
          props: {
            style: { color: c.accentAlt, fontWeight: 600 },
            children: '99.1% pure'
          }
        },
        {
          type: 'div',
          props: {
            style: { color: c.text3 },
            children: 'GitHub \u00b7 Apache 2.0'
          }
        }
      ]
    }
  };
}

function word(text: string, style?: Record<string, unknown>) {
  return {
    type: 'span',
    props: {
      style: style ?? {},
      children: text
    }
  };
}

function introBlock() {
  const text =
    'Install me and your agent learns to scope the problem, break it down, build incrementally, verify against intent, and adapt to changes.';
  const nbsp = '\u00a0';
  return {
    type: 'div',
    props: {
      style: {
        color: c.text2,
        marginTop: `${14 * S}px`,
        lineHeight: 1.75,
        display: 'flex',
        flexWrap: 'wrap' as const
      },
      children: [
        ...text.split(' ').map((w) => word(w + nbsp)),
        word('No' + nbsp, { color: c.accentAlt, fontStyle: 'italic' }),
        word('half' + nbsp, { color: c.accentAlt, fontStyle: 'italic' }),
        word('measures.', { color: c.accentAlt, fontStyle: 'italic' })
      ]
    }
  };
}

function terminalBody(logoUri: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        padding: `${28 * S}px`,
        fontFamily: 'JetBrains Mono',
        fontSize: `${16 * S}px`,
        lineHeight: 1.6
      },
      children: [
        {
          type: 'img',
          props: {
            src: logoUri,
            width: 340 * S,
            style: { marginBottom: `${8 * S}px` }
          }
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: `${14 * S}px`,
              color: c.text2,
              letterSpacing: '0.04em'
            },
            children: 'v1.0.0 \u00b7 1 skill \u00b7 9 commands \u00b7 6 agents'
          }
        },
        {
          type: 'div',
          props: {
            style: {
              color: c.text1,
              marginTop: `${18 * S}px`
            },
            children:
              'Hi, I\u2019m Walter. I give your preferred AI coding harness engineering discipline, not just code generation.'
          }
        },
        introBlock()
      ]
    }
  };
}

export const GET: APIRoute = async () => {
  const [monoData, monoSemiData, monoItalicData, logoUri] = await Promise.all([
    fetch(MONO_URL).then((r) => r.arrayBuffer()),
    fetch(MONO_SEMI_URL).then((r) => r.arrayBuffer()),
    fetch(MONO_ITALIC_URL).then((r) => r.arrayBuffer()),
    renderLogo()
  ]);

  // Render terminal overlay with satori at 2x
  const overlaySvg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: `${660 * S}px`,
                display: 'flex',
                flexDirection: 'column' as const,
                backgroundColor: c.surface,
                borderRadius: `${6 * S}px`,
                border: `${1 * S}px solid ${c.border}`,
                boxShadow: `${6 * S}px ${8 * S}px 0 rgba(0,0,0,0.7)`,
                overflow: 'hidden'
              },
              children: [chrome(), terminalBody(logoUri), footer()]
            }
          }
        ]
      }
    },
    {
      width: W,
      height: H,
      fonts: [
        { name: 'JetBrains Mono', data: monoData, weight: 400, style: 'normal' as const },
        { name: 'JetBrains Mono', data: monoSemiData, weight: 600, style: 'normal' as const },
        { name: 'JetBrains Mono', data: monoItalicData, weight: 400, style: 'italic' as const }
      ]
    }
  );

  const overlayPng = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

  // Load desert background at 2x
  const bgPng = await sharp(path.resolve(process.cwd(), 'public/assets/bg/desert-dark.jpg'))
    .resize(W, H, { fit: 'cover' })
    .png()
    .toBuffer();

  // Generate moonlight glow with dithered gradient
  const glowPng = await sharp(generateGlow(), {
    raw: { width: W, height: H, channels: 4 }
  })
    .png()
    .toBuffer();

  // Composite at 2x: desert bg → glow → terminal
  const composed = await sharp(bgPng)
    .composite([
      { input: glowPng, top: 0, left: 0 },
      { input: overlayPng, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  // Downscale to 1200×630
  const final = await sharp(composed).resize(1200, 630).png().toBuffer();

  return new Response(new Uint8Array(final), {
    headers: { 'Content-Type': 'image/png' }
  });
};
