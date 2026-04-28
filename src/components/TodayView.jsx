// Today view — ranger / dam-operator glance.
//   Primary job-to-be-done: know total fish in the pond, the species
//   breakdown, and today's empty cadence.
//
//   Live operational rule: at 50 fish in the pond the ranger empties and
//   transports the natives that same day. Below 50, the pond is emptied
//   2-3× per week (seasonal).
//
//   Alignment rules (step 3 of the alignment pass):
//     - Hero row uses `grid-auto-rows: 1fr` so hero + cadence share bottom edges.
//     - BigStat pair likewise stretches to one shared height.
//     - Species columns share a single reference-board toggle at the top, so
//       the two columns never drift on "one open, one closed".
//     - Species rows lock to `minHeight: 52` on the name block so tip-only vs
//       tip+warning rows don't cause column-to-column baseline drift.

import { useState, useRef, useEffect } from 'preact/hooks';
import { Card, Eyebrow, StatusPill, Sparkline, FlagIssueButton } from './Primitives.jsx';
import { IconArrowUp, IconArrowDown, IconMinus, IconAlertTriangle } from './Icons.jsx';
import { SPECIES_NATIVE, SPECIES_PEST, THRESHOLD } from '../data/species.js';

// Demo targets — per-species counts the simulate button animates toward.
// Native lands at 80 (+8) and pest at 50 (+15) so the +23 pond rise is
// shared across both — natives still hold the dominant ratio (~2.25:1, per
// the species.js source note) while a clear pest uptick is also visible.
// Pond total settles at 130. Indices line up 1:1 with SPECIES_NATIVE /
// SPECIES_PEST in species.js.
const DEMO_NATIVE_TARGET = [23, 16, 13, 11, 7, 4, 3, 2, 1]; // sum 80
const DEMO_PEST_TARGET   = [13, 12, 10, 6, 4, 3, 1, 1];     // sum 50
const DEMO_TIMESTAMP     = '12:02 PM · 4 Apr 2026';
const DEFAULT_TIMESTAMP  = '10:00 AM · 20 Apr 2026';
const DEMO_DURATION_MS   = 14000;

export default function TodayView() {
  // Demo overlay: progress goes 0→1 over 14s each time the simulate button
  // fires. Re-clicking cancels any in-flight animation and restarts from
  // baseline. While progress > 0 the species counts and trails are linearly
  // interpolated toward DEMO_*_TARGET; timestamps flip to the demo-logged
  // moment for the duration. Untouched, every value falls through to the
  // baseline data — page is byte-for-byte identical until triggered.
  const [demoProgress, setDemoProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const startDemo = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDemoProgress(0);
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / DEMO_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDemoProgress(eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Trigger lives in the utility bar (Base.astro) on the "R. Atkinson · Ranger"
  // label — clicking it dispatches `seq:simulate-demo` on window. Listening
  // here keeps the static layout decoupled from Preact state.
  useEffect(() => {
    window.addEventListener('seq:simulate-demo', startDemo);
    return () => window.removeEventListener('seq:simulate-demo', startDemo);
  }, []);

  const lerp = (a, b, p) => a + (b - a) * p;
  // Pull baseline counts through the demo lerp. Each species also gets
  // its trail's last point updated, so the per-row sparkline reflects the
  // animated count as it moves.
  const speciesNative = SPECIES_NATIVE.map((f, i) => {
    const target = DEMO_NATIVE_TARGET[i] ?? f.count;
    const animated = Math.round(lerp(f.count, target, demoProgress));
    const trailOut = f.trail
      ? [...f.trail.slice(0, -1), animated]
      : f.trail;
    return { ...f, count: animated, trail: trailOut };
  });
  const speciesPest = SPECIES_PEST.map((f, i) => {
    const target = DEMO_PEST_TARGET[i] ?? f.count;
    const animated = Math.round(lerp(f.count, target, demoProgress));
    const trailOut = f.trail
      ? [...f.trail.slice(0, -1), animated]
      : f.trail;
    return { ...f, count: animated, trail: trailOut };
  });

  const nativeTotal = speciesNative.reduce((s, f) => s + f.count, 0);
  const pestTotal   = speciesPest.reduce((s, f) => s + f.count, 0);
  const pondTotal   = nativeTotal + pestTotal;
  const nativeYday  = SPECIES_NATIVE.reduce((s, f) => s + (f.yesterday || 0), 0);
  const pestYday    = SPECIES_PEST.reduce((s, f) => s + (f.yesterday || 0), 0);
  const pondYday    = nativeYday + pestYday;
  const overThresh  = pondTotal >= THRESHOLD;

  // Aggregate trails — past 13 days from baseline, today's bucket is the
  // animated total so the hero + breakdown sparklines tick up live.
  const nativeTrail = Array.from({ length: 14 }, (_, i) =>
    i === 13
      ? nativeTotal
      : SPECIES_NATIVE.reduce((s, f) => s + (f.trail?.[i] ?? 0), 0));
  const pestTrail = Array.from({ length: 14 }, (_, i) =>
    i === 13
      ? pestTotal
      : SPECIES_PEST.reduce((s, f) => s + (f.trail?.[i] ?? 0), 0));
  const pondTrail = nativeTrail.map((v, i) => v + pestTrail[i]);

  const heroTimestamp = demoProgress > 0 ? DEMO_TIMESTAMP : DEFAULT_TIMESTAMP;

  // Single shared toggle so both species columns open/close together.
  const [refOpen, setRefOpen] = useState(false);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 28px' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14,
        flexWrap: 'wrap', paddingBottom: 10, borderBottom: '1px solid #E5E8EC',
      }}>
        <div>
          <Eyebrow>Today &middot; Hinze Pond</Eyebrow>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#002C4D', letterSpacing: '-0.015em', margin: '3px 0 0', lineHeight: 1.15 }}>
            Fish Count, <span style={{ color: 'var(--sw-blue-500)' }}>Hinze Pond</span>
          </h1>
        </div>
        <FlagIssueButton subject="Today · Hinze Pond count" />
      </header>

      {/* Hero row — the two upper cards share a 1:1 grid so the vertical
          gridline sits dead-centre, matching the species columns below.
          The old BigStat row (Native + Pest sparkline cards) has been
          folded INTO the cadence card as a Breakdown block — that keeps
          the cadence card as the dashboard's decision hub and removes a
          whole row of visual noise.
          `grid-auto-rows: 1fr` stretches both cards to the taller
          sibling's height so the bottom edges lock. */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        gridAutoRows: '1fr', marginTop: 14,
      }}>
        {/* BAN 1: live pond total. Inline because the background is a photo
            with a gradient overlay + an optional hover video. */}
        <PondHero
          pondTotal={pondTotal} pondYday={pondYday}
          nativeTotal={nativeTotal} pestTotal={pestTotal}
          pondTrail={pondTrail} timestamp={heroTimestamp}
        />

        {/* BAN 2: cadence verdict + embedded native/pest breakdown. */}
        <div style={{
          background: overThresh ? '#FBE1DA' : '#E5F4E5',
          borderRadius: 16, padding: 18,
          boxShadow: '0 4px 12px rgba(0,44,77,0.14), 0 1px 3px rgba(0,44,77,0.08)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div>
            <Eyebrow>Today&rsquo;s cadence</Eyebrow>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#002C4D', marginTop: 5, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {overThresh ? 'Empty the pond daily.' : 'Empty the pond 2–3× per week.'}
            </div>
            <p style={{ fontSize: 12, color: '#475260', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
              {overThresh ? 'Staff up accordingly.' : 'Twice weekly is sufficient in cooler months.'}
            </p>
          </div>
          <div>
            <ThresholdBar value={pondTotal} threshold={THRESHOLD} />
            <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
              <StatusPill tone={overThresh ? 'alert' : 'good'}>{overThresh ? 'Daily Schedule' : 'Reduced Schedule'}</StatusPill>
              <StatusPill tone="neutral">Season · Autumn</StatusPill>
            </div>
            <div style={{ fontSize: 10, color: '#667281', marginTop: 7, letterSpacing: '0.02em' }}>
              Threshold &middot; {THRESHOLD} fish &middot; SEQ operating policy
            </div>
          </div>
          {/* Breakdown strip — two mini stats inside the card. Absorbs
              what used to be two separate BigStat cards on a row below. */}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(0,44,77,0.12)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Breakdown
                label="Native" value={nativeTotal} prior={nativeYday}
                color="#6BA43A" trail={nativeTrail}
              />
              <Breakdown
                label="Pest" value={pestTotal} prior={pestYday}
                color="#E07A1A" trail={pestTrail}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reference-board toggle — aligned with the Show/Hide button
          previously paired with a redundant eyebrow ("Species · native +
          pest"). The species columns right below are already labelled
          Native / Pest so the eyebrow was repetition. */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline',
        marginTop: 18, marginBottom: 8,
      }}>
        <button
          onClick={() => setRefOpen(v => !v)}
          style={{
            background: 'transparent', border: 'none', color: '#0A4C73',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline',
            fontFamily: 'inherit',
          }}>
          {refOpen ? 'Hide reference boards' : 'Show reference boards'}
        </button>
      </div>

      {refOpen && (
        <section style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          gridAutoRows: '1fr', marginBottom: 10,
        }}>
          <ReferenceBoard title="Native fish ID board" src="/assets/ref/native-board.jpg" />
          <ReferenceBoard title="Pest fish ID board"   src="/assets/ref/pest-board.jpg" />
        </section>
      )}

      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        gridAutoRows: '1fr',
      }}>
        <SpeciesColumn title="Native species" tone="native" species={speciesNative} />
        <SpeciesColumn title="Pest species"   tone="pest"   species={speciesPest} />
      </section>

      {/* Low-count callout — derived from animated species data so the
          banner reflects the live values rather than a frozen snapshot.
          Threshold is ≤2 fish on a native species, since "rare native"
          is the operationally interesting signal (low pest counts are
          good news, not an alert). Hidden when nothing qualifies. */}
      {(() => {
        const lows = speciesNative.filter(f => f.count <= 2);
        if (lows.length === 0) return null;
        return (
          <Card variant="content" style={{ marginTop: 12, padding: '8px 14px', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <IconAlertTriangle size={14} color="#B26410" />
            <div style={{ fontSize: 12, color: '#003A5D', fontWeight: 600 }}>
              Low counts {lows.map(f => `· ${f.name} ${f.count}`).join(' ')}
            </div>
          </Card>
        );
      })()}

      <div style={{
        marginTop: 12, fontSize: 10, color: '#8A95A2',
      }}>
        <span>Last data refresh &middot; {heroTimestamp.replace(' · ', ', ')} &middot; Source: automated count, verified by ranger on shift</span>
      </div>
    </div>
  );
}

// Pond hero card. Shows the still photograph by default; on hover / focus
// the pond video fades in and plays. Restored from the earlier iteration
// that was removed as "feature creep" — per the user's brief the video IS
// the decoration that makes the surface feel live, so we keep it but scope
// it (plays only on hover, no auto-loop when idle).
function PondHero({ pondTotal, pondYday, nativeTotal, pestTotal, pondTrail, timestamp }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const enter = () => {
      video.style.opacity = '1';
      video.play().catch(() => {});
    };
    const leave = () => {
      video.style.opacity = '0';
      video.pause();
    };
    root.addEventListener('mouseenter', enter);
    root.addEventListener('mouseleave', leave);
    root.addEventListener('focusin', enter);
    root.addEventListener('focusout', leave);
    return () => {
      root.removeEventListener('mouseenter', enter);
      root.removeEventListener('mouseleave', leave);
      root.removeEventListener('focusin', enter);
      root.removeEventListener('focusout', leave);
    };
  }, []);

  return (
    <div ref={rootRef} tabIndex={0} aria-label="Hinze Pond — hover to play live footage" style={{
      position: 'relative', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,44,77,0.14), 0 1px 3px rgba(0,44,77,0.08)',
      color: '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 280, outline: 'none',
      backgroundColor: '#002C4D',
    }}>
      {/* Still image + gradient overlay — base layer, always visible. */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(180deg, rgba(0,44,77,0.08) 0%, rgba(0,44,77,0.82) 100%), url(/assets/hinze-pond-hero.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}/>
      {/* Video, hidden until hover. Above the still image, below the text. */}
      <video
        ref={videoRef}
        src="/assets/hinze-pond.mp4"
        poster="/assets/hinze-pond-hero.png"
        muted loop playsInline preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0,
          transition: 'opacity 320ms cubic-bezier(0.2,0.8,0.2,1)',
          pointerEvents: 'none',
        }}
      />
      {/* Gradient overlay on top of video too so text stays legible when playing. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,44,77,0.08) 0%, rgba(0,44,77,0.82) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* Text content. Hero is scaled up — this is the visual keystone
          of the page, not a sibling to the cadence card. */}
      <div style={{ position: 'relative', padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, background: 'rgba(0,0,0,0.32)', padding: '4px 10px', borderRadius: 999 }}>
            Hinze Pond &middot; Live Count
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,0,0,0.32)', padding: '4px 10px', borderRadius: 999 }}>
            {timestamp}
          </span>
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total Fish In Pond</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.03em' }}>{pondTotal}</div>
            <EvolutionChip current={pondTotal} prior={pondYday} light />
          </div>
          <div style={{ fontSize: 13, opacity: 0.92, marginTop: 6 }}>
            <b>{nativeTotal}</b> native &middot; <b>{pestTotal}</b> pest &middot; vs yesterday ({pondYday})
          </div>
          <div style={{ marginTop: 10, opacity: 0.95 }}>
            <Sparkline data={pondTrail} threshold={THRESHOLD} w={320} h={36} color="#fff" thresholdColor="rgba(255,255,255,0.55)" strokeWidth={2} />
            <div style={{ fontSize: 10, opacity: 0.75, marginTop: 3 }}>Past fortnight &middot; hover for footage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, prior, color, trail, sub }) {
  return (
    <Card variant="stat" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: '#667281' }}>{label}</div>
        {prior != null && <EvolutionChip current={value} prior={prior} />}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, marginTop: 2, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#667281', marginTop: 3 }}>{sub}</div>
      {/* Sparkline pushed to the bottom so both BigStat cards share a baseline. */}
      {trail && (
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <Sparkline data={trail} color={color} h={22} />
        </div>
      )}
    </Card>
  );
}

// Breakdown — Native / Pest mini-stat inside the Cadence card. No
// surface (inherits the cadence card's background), just label + value
// + delta + sparkline. Kept compact so the pair feels like a single
// balanced strip rather than two nested cards.
function Breakdown({ label, value, prior, color, trail }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: '#475260' }}>{label}</div>
        {prior != null && <EvolutionChip current={value} prior={prior} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      </div>
      {trail && (
        <div style={{ marginTop: 3 }}>
          <Sparkline data={trail} color={color} h={22} w={200} strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}

function EvolutionChip({ current, prior, light }) {
  if (prior == null || prior === 0 || typeof current !== 'number') return null;
  const delta = current - prior;
  const pct = Math.round((delta / prior) * 100);
  const up = delta > 0;
  const flat = delta === 0;
  const bg = light
    ? 'rgba(255,255,255,0.18)'
    : (flat ? '#F0F2F4' : (up ? '#FCEBDB' : '#E8F1E8'));
  const fg = light
    ? '#fff'
    : (flat ? '#475260' : (up ? '#B26410' : '#2E7A2E'));
  const Arrow = flat ? IconMinus : (up ? IconArrowUp : IconArrowDown);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: bg, color: fg, fontSize: 10, fontWeight: 700,
      padding: '2px 6px', borderRadius: 999, whiteSpace: 'nowrap',
    }}>
      <Arrow size={11} /> {Math.abs(delta)} <span style={{ opacity: 0.7 }}>({up ? '+' : ''}{pct}%)</span>
      <span style={{ opacity: 0.6, fontWeight: 500, fontSize: 9, marginLeft: 1 }}>vs yday</span>
    </span>
  );
}

function ThresholdBar({ value, threshold }) {
  const max = Math.max(value, threshold) * 1.4;
  const pct = Math.min(100, (value / max) * 100);
  const thresholdPct = (threshold / max) * 100;
  const over = value >= threshold;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#667281', fontWeight: 600 }}>
        <span>0</span><span>{Math.round(max)}</span>
      </div>
      <div style={{ position: 'relative', height: 10, background: '#EEF0F2', borderRadius: 999, marginTop: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: over ? '#E07A1A' : 'var(--sw-green-600)',
          borderRadius: 999,
        }} />
        <div style={{ position: 'absolute', left: `${thresholdPct}%`, top: -2, bottom: -2, width: 2, background: 'var(--chart-threshold, #475260)' }} />
      </div>
    </div>
  );
}

function ReferenceBoard({ title, src }) {
  return (
    <Card variant="content" style={{ padding: 8 }}>
      <div style={{ marginBottom: 5 }}><Eyebrow>{title}</Eyebrow></div>
      {/* Source JPEGs were photographed upside-down; rotating 180° in CSS is
          cheaper than re-encoding the JPEG and keeps the original intact.
          A locked aspect-ratio + object-fit ensures both reference cards
          (native + pest, which have different natural aspect ratios) present
          at identical size — otherwise one card is visibly taller than the
          other when both are toggled open. */}
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: 6, overflow: 'hidden', background: '#F2F0EA' }}>
        <img src={src} alt={title} style={{
          width: '100%', height: '100%', display: 'block',
          objectFit: 'cover', objectPosition: 'center',
          transform: 'rotate(180deg)',
        }} />
      </div>
      <div style={{ fontSize: 10, color: '#8A95A2', marginTop: 5, fontStyle: 'italic' }}>
        Board as photographed at Hinze Pond &middot; 2026
      </div>
    </Card>
  );
}

function SpeciesColumn({ title, tone, species }) {
  const total = species.reduce((s, f) => s + f.count, 0);
  const col = tone === 'native' ? '#6BA43A' : '#E07A1A';
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <Eyebrow>{title}</Eyebrow>
        <div style={{ fontSize: 12, color: '#667281' }}>Total <b style={{ color: col }}>{total}</b></div>
      </div>
      <Card variant="content" style={{ padding: 4, flex: 1 }}>
        {species.map((f, i) => (
          <SpeciesRow key={f.id} f={f} col={col} isLast={i === species.length - 1} />
        ))}
      </Card>
    </div>
  );
}

function SpeciesRow({ f, col, isLast }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '56px 1fr 64px 46px',
      gap: 10, alignItems: 'center',
      padding: '7px 10px',
      borderBottom: isLast ? 'none' : '1px solid #EEF0F2',
      minHeight: 52,
    }}>
      <FishPhoto species={f} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#002C4D', lineHeight: 1.2 }}>{f.name}</div>
        <div style={{ fontSize: 10, color: '#8A95A2', fontStyle: 'italic' }}>{f.latin}</div>
        {f.tip && !f.warning && (
          <div style={{
            fontSize: 10, color: '#475260', marginTop: 2, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {f.tip}
          </div>
        )}
        {f.warning && (
          <div style={{
            fontSize: 10, color: '#A03418', marginTop: 2, display: 'flex', gap: 4,
            alignItems: 'flex-start', fontWeight: 600, lineHeight: 1.35,
          }}>
            <IconAlertTriangle size={11} color="#A03418" /><span>{f.warning}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {f.trail && <Sparkline data={f.trail} color={col} w={60} h={18} />}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: col, lineHeight: 1 }}>{f.count}</div>
        {f.yesterday != null && f.yesterday !== f.count && (
          <div style={{
            fontSize: 9, color: f.count > f.yesterday ? '#B26410' : '#2E7A2E',
            fontWeight: 700, marginTop: 2,
            display: 'inline-flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end',
          }}>
            {f.count > f.yesterday ? <IconArrowUp size={10} /> : <IconArrowDown size={10} />} {Math.abs(f.count - f.yesterday)}
          </div>
        )}
      </div>
    </div>
  );
}

// Real Wikimedia Commons photo for each species. Falls back to an initials
// badge if `photo` isn't set. Locked dimensions + flex-shrink so the column
// width never drifts from object-fit rounding.
function FishPhoto({ species }) {
  const w = 56, h = 40;
  if (!species.photo) {
    return (
      <div style={{
        width: w, height: h, borderRadius: 6, background: '#EEF0F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#667281', fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>{species.name.slice(0, 2).toUpperCase()}</div>
    );
  }
  return (
    <img
      src={species.photo}
      alt={`${species.name} — photograph from Wikimedia Commons`}
      title={`${species.name} · ${species.latin}`}
      style={{
        width: w, height: h, borderRadius: 6, display: 'block', flexShrink: 0,
        objectFit: 'cover', objectPosition: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(0,44,77,0.08)',
        background: '#F2F0EA',
      }}
    />
  );
}
