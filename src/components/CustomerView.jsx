// Customer view — public-facing dam page designed to sit inside the
// seqwater.com.au visual language.
//
// Design tokens below were captured directly from the live site via
// DOM inspection, not guessed. Key tokens (verified):
//   - Font:         "Roboto Condensed", sans-serif
//   - Primary navy: #00385A
//   - Accent orange:#BC511E  (emergency + CTA highlight)
//   - H1:           72px / 600 weight / white on dark hero
//   - H2:           48px / 600 weight / navy
//   - Body:         16px
//   - Buttons:      50px border-radius, navy bg, 700-weight white text,
//                   10px 24px padding. Emergency button is 40px radius,
//                   orange bg, 600 weight, 0.5px letter-spacing.
//   - Cards:        flat — 0–5px radius, box-shadow: none.
//
// The hero image is the actual photo Seqwater uses on their own
// /dams/hinze page, served from their public CDN, so the imagery
// feels native to the brand.

import { useState } from 'preact/hooks';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/500.css';
import '@fontsource/roboto-condensed/600.css';
import '@fontsource/roboto-condensed/700.css';
import {
  DAM_FACTS, WATER_METRICS, SAFETY_NOTICES,
  NATIVE_SPECIES, PEST_NOTES, FLORA, FAUNA, ECOSYSTEM_STATS,
} from '../data/customer.js';

const NAVY = '#00385A';
const NAVY_ALT = '#003A5D';
const ORANGE = '#BC511E';
const FONT = '"Roboto Condensed", sans-serif';

const TONE = {
  good:  { fg: '#2E7A2E', bg: '#E5F4E5', label: 'Good' },
  warn:  { fg: '#B26410', bg: '#FCEBDB', label: 'Monitor' },
  alert: { fg: '#A03418', bg: '#FBE1DA', label: 'Action' },
  info:  { fg: '#0A4C73', bg: '#D6F1FA', label: 'Info' },
};

export default function CustomerView() {
  const [view, setView] = useState('water');
  return (
    <div style={{ background: '#fff', fontFamily: FONT }}>
      <Hero />
      <ViewSwitcher view={view} onChange={setView} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        {view === 'water' ? <WaterView /> : <BiodiversityView />}
        <MonitoringBanner />
      </main>
    </div>
  );
}

/* =========== Hero =========== */

function Hero() {
  return (
    <section style={{
      position: 'relative',
      background: `linear-gradient(180deg, rgba(0,56,90,0.32) 0%, rgba(0,56,90,0.78) 100%), center / cover no-repeat url(${DAM_FACTS.photo})`,
      color: '#fff',
      minHeight: 460,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 48px', width: '100%' }}>
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, marginBottom: 16 }}>
          Our dams &nbsp;›&nbsp; {DAM_FACTS.name}
        </div>
        <h1 style={{
          fontFamily: FONT,
          fontSize: 72, fontWeight: 600, lineHeight: 1.0,
          margin: 0, maxWidth: 860, letterSpacing: 'normal',
        }}>
          {DAM_FACTS.name}
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.45, maxWidth: 720, marginTop: 20, marginBottom: 0, opacity: 0.96 }}>
          {DAM_FACTS.lead}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <PrimaryButton>See dam levels</PrimaryButton>
          <GhostButton>Visit Hinze Dam</GhostButton>
        </div>
      </div>
    </section>
  );
}

/* =========== Buttons (seqwater.com.au styling) =========== */

function PrimaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: NAVY, color: '#fff', border: 'none',
      borderRadius: 50, padding: '10px 38px 10px 24px',
      fontFamily: FONT, fontSize: 16, fontWeight: 700,
      cursor: 'pointer',
      position: 'relative',
    }}>
      {children}
      <span style={{
        position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, borderTop: '2px solid #fff', borderRight: '2px solid #fff',
        transform: 'translateY(-50%) rotate(45deg)',
      }}/>
    </button>
  );
}

function GhostButton({ children }) {
  return (
    <button style={{
      background: 'transparent', color: '#fff', border: '2px solid #fff',
      borderRadius: 50, padding: '8px 24px',
      fontFamily: FONT, fontSize: 16, fontWeight: 700,
      cursor: 'pointer',
    }}>{children}</button>
  );
}

/* =========== View Switcher =========== */

function ViewSwitcher({ view, onChange }) {
  const items = [
    { id: 'water',        label: 'Water quality', blurb: 'Level, quality, catchment health.' },
    { id: 'biodiversity', label: 'Biodiversity',   blurb: 'The ecosystem in and around the dam.' },
  ];
  return (
    <div style={{ background: '#fff', borderBottom: '2px solid #E5E8EC' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4 }}>
        {items.map(it => {
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)}
              style={{
                background: 'transparent', border: 'none', padding: '22px 24px',
                fontFamily: FONT, fontWeight: 600, fontSize: 18,
                color: active ? NAVY : '#667281',
                cursor: 'pointer',
                borderBottom: `4px solid ${active ? ORANGE : 'transparent'}`,
                marginBottom: -2,
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                transition: 'color 120ms, border-color 120ms',
              }}>
              <span>{it.label}</span>
              <span style={{ fontSize: 13, fontWeight: 400, color: active ? '#475260' : '#8A95A2' }}>{it.blurb}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========== Water view =========== */

function WaterView() {
  return (
    <>
      <SectionHeader
        eyebrow="Water quality · today"
        title="The dam is healthy"
        kicker="Six measurements the community sees weekly. Each reading is verified by a Seqwater monitoring officer before it is published here."
      />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 18, marginTop: 24,
      }}>
        {WATER_METRICS.map(m => <WaterMetricCard key={m.key} metric={m} />)}
      </div>

      <SectionHeader
        eyebrow="Notices"
        title="What to know when you visit"
        kicker="We publish advisories and dam-release notifications here as soon as they are issued."
        style={{ marginTop: 56 }}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 18, marginTop: 24,
      }}>
        {SAFETY_NOTICES.map((n, i) => <NoticeCard key={i} notice={n} />)}
      </div>
    </>
  );
}

function WaterMetricCard({ metric }) {
  const t = TONE[metric.tone] || TONE.info;
  return (
    <article style={{
      background: '#F8F6F0', borderRadius: 5, padding: 24,
      border: '1px solid #E5E8EC',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#667281', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {metric.label}
        </div>
        <span style={{
          background: t.bg, color: t.fg,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase',
        }}>{t.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
        <div style={{ fontSize: 48, fontWeight: 600, color: NAVY, lineHeight: 1 }}>
          {metric.value}
        </div>
        {metric.unit && <div style={{ fontSize: 16, color: '#667281' }}>{metric.unit}</div>}
      </div>
      <div style={{ fontSize: 15, color: NAVY, marginTop: 12, lineHeight: 1.5 }}>{metric.note}</div>
      <div style={{ fontSize: 13, color: '#8A95A2', marginTop: 6, lineHeight: 1.4 }}>{metric.detail}</div>
    </article>
  );
}

function NoticeCard({ notice }) {
  return (
    <article style={{
      background: '#fff', borderRadius: 5, padding: 20,
      border: '1px solid #E5E8EC', borderLeft: `5px solid ${ORANGE}`,
    }}>
      <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: NAVY, margin: 0, lineHeight: 1.2 }}>
        {notice.title}
      </h3>
      <p style={{ fontSize: 15, color: '#475260', marginTop: 10, marginBottom: 0, lineHeight: 1.55 }}>
        {notice.body}
      </p>
    </article>
  );
}

/* =========== Biodiversity view =========== */

function BiodiversityView() {
  return (
    <>
      <SectionHeader
        eyebrow="Biodiversity · today"
        title="A living catchment"
        kicker="Native fish, riparian plants, and the birds, reptiles and mammals that call the dam home. The same data our rangers and operators use, shared here so the community can see it too."
      />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14, marginTop: 24,
      }}>
        <EcoStat big={ECOSYSTEM_STATS.nativeFishSpecies} label="Native fish species" />
        <EcoStat big={ECOSYSTEM_STATS.pestFishManaged} label="Pest fish managed" />
        <EcoStat big={ECOSYSTEM_STATS.floraRecorded} label="Flora recorded" />
        <EcoStat big={ECOSYSTEM_STATS.faunaRecorded} label="Fauna observed" />
        <EcoStat big={ECOSYSTEM_STATS.surveysThisQuarter} label="Ranger surveys this quarter" />
      </div>

      <SectionHeader
        eyebrow="What lives here"
        title="Native fish of Hinze Dam"
        kicker="Counted at the fish screen and verified on weekly surveys. These species thrive alongside our active pest-fish management programme."
        style={{ marginTop: 56 }}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20, marginTop: 24,
      }}>
        {NATIVE_SPECIES.map(sp => <SpeciesCard key={sp.id} sp={sp} />)}
      </div>

      <aside style={{
        background: '#F8F6F0', borderRadius: 5, padding: 28, marginTop: 32,
        border: '1px solid #E5E8EC', borderLeft: `5px solid ${ORANGE}`,
      }}>
        <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: ORANGE }}>
          Pest fish · managed
        </div>
        <h3 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: NAVY, margin: '8px 0 10px', lineHeight: 1.2 }}>
          Protecting natives from introduced species
        </h3>
        <p style={{ fontSize: 16, color: '#475260', margin: 0, lineHeight: 1.6 }}>
          {PEST_NOTES.note} Current ratio: <b>{PEST_NOTES.native}</b> native fish to <b>{PEST_NOTES.pest}</b> pest fish at the screen.
        </p>
      </aside>

      <SectionHeader
        eyebrow="Plants of the catchment"
        title="Flora"
        kicker="A healthy riparian zone stabilises banks, shades the water, and provides habitat. Seqwater works with council and Healthy Land &amp; Water to maintain this fringe."
        style={{ marginTop: 56 }}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20, marginTop: 24,
      }}>
        {FLORA.map(f => <NatureCard key={f.name} item={f} kind="flora" />)}
      </div>

      <SectionHeader
        eyebrow="Wildlife observed"
        title="Fauna"
        kicker="Ranger surveys log every sighting. Counts below are sighting events this quarter, not absolute population estimates."
        style={{ marginTop: 56 }}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20, marginTop: 24,
      }}>
        {FAUNA.map(f => <NatureCard key={f.name} item={f} kind="fauna" />)}
      </div>
    </>
  );
}

function EcoStat({ big, label }) {
  return (
    <div style={{
      background: '#F8F6F0', borderRadius: 5, padding: '22px 24px',
      border: '1px solid #E5E8EC',
    }}>
      <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 600, color: NAVY, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 14, color: '#475260', marginTop: 8, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
}

// Card cover. Uses an actual <img> tag rather than a CSS background —
// Chrome's ORB (Opaque Response Blocking) silently blocks many
// cross-origin CSS `background-image` requests from Wikimedia's CDN,
// even when the image itself is public. <img> requests aren't subject
// to ORB, so they load reliably. The gradient tint sits behind the
// image as a fallback while it loads / if it 404s.
function MediaCover({ photo, tint = ['#475260', '#A8AEB6'], alt = '' }) {
  const gradient = `linear-gradient(135deg, ${tint[0]} 0%, ${tint[1]} 100%)`;
  return (
    <div style={{
      aspectRatio: '16 / 10', position: 'relative', overflow: 'hidden',
      background: gradient, backgroundColor: tint[0],
    }}>
      {photo && (
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          referrerpolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      )}
    </div>
  );
}

function SpeciesCard({ sp }) {
  return (
    <article style={{
      background: '#fff', borderRadius: 5, overflow: 'hidden',
      border: '1px solid #E5E8EC', display: 'flex', flexDirection: 'column',
    }}>
      <MediaCover photo={sp.photo} tint={['#355C3E', '#8EB77A']} alt={sp.name} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.2 }}>{sp.name}</h3>
          {sp.count != null && (
            <span style={{ fontSize: 22, fontWeight: 700, color: '#6BA43A', lineHeight: 1 }}>{sp.count}</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#8A95A2', fontStyle: 'italic' }}>{sp.latin}</div>
        <p style={{ fontSize: 14, color: '#475260', margin: '8px 0 0', lineHeight: 1.55 }}>{sp.note}</p>
      </div>
    </article>
  );
}

function NatureCard({ item, kind }) {
  const meta = kind === 'flora'
    ? { topLabel: item.role, topColor: '#4A7A2E', trailing: null }
    : { topLabel: item.group, topColor: groupColor(item.group), trailing: item.sightings };
  return (
    <article style={{
      background: '#fff', borderRadius: 5, overflow: 'hidden',
      border: '1px solid #E5E8EC',
    }}>
      <MediaCover photo={item.photo} tint={item.tint} alt={item.name} />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
            color: meta.topColor,
          }}>{meta.topLabel}</span>
          {meta.trailing != null && (
            <span style={{ fontSize: 14, fontWeight: 600, color: '#475260' }}>
              {meta.trailing} <span style={{ color: '#8A95A2', fontWeight: 400 }}>sightings</span>
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: NAVY, margin: '6px 0 0', lineHeight: 1.2 }}>{item.name}</h3>
        <div style={{ fontSize: 13, color: '#8A95A2', fontStyle: 'italic', marginTop: 2 }}>{item.latin}</div>
        <p style={{ fontSize: 14, color: '#475260', margin: '10px 0 0', lineHeight: 1.55 }}>{item.note}</p>
      </div>
    </article>
  );
}

function groupColor(group) {
  return { Mammal: '#6E4A2A', Bird: '#0A4C73', Reptile: '#B26410' }[group] || '#475260';
}

/* =========== Shared =========== */

function SectionHeader({ eyebrow, title, kicker, style }) {
  return (
    <header style={{ marginTop: 48, maxWidth: 820, ...style }}>
      <div style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: ORANGE }}>
        {eyebrow}
      </div>
      <h2 style={{
        fontFamily: FONT, fontSize: 48, fontWeight: 600, color: NAVY,
        margin: '10px 0 0', lineHeight: 1,
      }}>{title}</h2>
      {kicker && (
        <p style={{ fontSize: 18, color: '#475260', marginTop: 14, marginBottom: 0, lineHeight: 1.55 }}>
          {kicker}
        </p>
      )}
    </header>
  );
}

function MonitoringBanner() {
  return (
    <aside style={{
      marginTop: 72,
      background: NAVY,
      color: '#fff',
      padding: '48px 48px',
      display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32,
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: '#7FC6E5' }}>
          How we know
        </div>
        <h3 style={{ fontFamily: FONT, fontSize: 36, fontWeight: 600, margin: '10px 0 14px', lineHeight: 1.05 }}>
          One dataset, shared across every audience
        </h3>
        <p style={{ fontSize: 16, opacity: 0.88, lineHeight: 1.65, margin: 0 }}>
          Water-quality probes, automated fish counts, satellite imagery and ranger field surveys all feed the
          same Seqwater Common Data Environment. Your rangers, operators, council partners and the community
          see the same numbers — aligned to the SEQ Digital Plan's right-to-information and Customer principles.
        </p>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MethodBullet n="1" text="IoT water-quality probes" />
        <MethodBullet n="2" text="Automated pond-screen fish count" />
        <MethodBullet n="3" text="Weekly ranger surveys" />
        <MethodBullet n="4" text="Satellite &amp; LiDAR change detection" />
      </ul>
    </aside>
  );
}

function MethodBullet({ n, text }) {
  return (
    <li style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <span style={{
        width: 32, height: 32, borderRadius: 999, background: ORANGE, color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 15, flexShrink: 0,
      }}>{n}</span>
      <span style={{ fontSize: 15, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  );
}
