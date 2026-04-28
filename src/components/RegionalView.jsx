// Regional view — SEQ Water Grid landing.
//
// Split into two focused tabs to honour "Don't put everything in one
// dashboard" (design-rule cheatsheet 2nd edition, Rule A):
//
//   CDE Uptake (Priority 1.1 lens) — the stewardship / programme-health
//     story: councils onboarded, priority datasets integrated, partners,
//     downstream services.
//
//   Waterway Intelligence (Priority 1.6 lens) — the operational /
//     catchment-health story: grid verdict, CHI ranked list, embankment
//     risk sites, AI-detected patterns, coverage matrix.
//
// Selection state (a clicked dam) is shared across tabs so clicking a row
// on the WI side and switching to CDE shows the same dam's data-sharing
// detail in a slide-in drawer.

import { useState, useEffect, useRef } from 'preact/hooks';
import { animate } from 'motion';
import { Card, Eyebrow, SectionTitle, FlagIssueButton } from './Primitives.jsx';
import { IconX } from './Icons.jsx';
import CoverageTable from './regional/CoverageTable.jsx';
import PatternsPanel from './regional/PatternsPanel.jsx';
import MapView from './regional/MapView.jsx';
import {
  GRID_DAMS, CDE_STATUS, PRIORITY_DATASETS, CDE_PARTNERS, CDE_SERVICES,
  EMBANKMENT_RISKS,
} from '../data/grid.js';

export default function RegionalView() {
  const [selected, setSelected] = useState(GRID_DAMS.find(d => d.id === 'hinze'));
  const [focus, setFocus] = useState(readFocusFromUrl());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Keep ?focus= in sync so the two tabs are bookmarkable.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('focus') !== focus) {
      url.searchParams.set('focus', focus);
      window.history.replaceState(null, '', url.toString());
    }
  }, [focus]);

  const openDetailFor = (dam) => {
    setSelected(dam);
    setDrawerOpen(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 28px', position: 'relative' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 14, flexWrap: 'wrap', paddingBottom: 10,
        borderBottom: '1px solid #E5E8EC',
      }}>
        <div>
          <Eyebrow>Common Data Environment · Waterway Intelligence</Eyebrow>
          <h1 style={{ fontSize: 28, color: '#002C4D', fontWeight: 700, margin: '3px 0 0', lineHeight: 1.15, letterSpacing: '-0.015em' }}>
            SEQ <span style={{ color: 'var(--sw-blue-500)' }}>Water Grid</span> &middot; Regional Landing
          </h1>
          <div style={{ fontSize: 12, color: '#667281', marginTop: 4, maxWidth: 660, lineHeight: 1.5 }}>
            Aligned to SEQ Digital Plan priorities
            <PlanBadge>1.1 CDE</PlanBadge>
            and
            <PlanBadge>1.6 Waterway Intelligence</PlanBadge>.
          </div>
        </div>
        <FlagIssueButton subject={`Regional · ${focusTitle(focus)}`} />
      </header>

      <FocusTabs focus={focus} onChange={setFocus} />

      {focus === 'cde'
        ? <CdeTab onOpenDam={openDetailFor} selectedId={selected?.id} />
        : <WiTab   onOpenDam={openDetailFor} selectedId={selected?.id} showMap={showMap} setShowMap={setShowMap} />
      }

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 14,
        fontSize: 10, color: '#8A95A2',
      }}>
        <span>Priority 1.6 target &middot; coverage by FY27</span>
        <span>Last data refresh &middot; 10:00 AM, 20 Apr 2026</span>
      </div>

      {drawerOpen && (
        <SharingDrawer dam={selected} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}

function readFocusFromUrl() {
  if (typeof window === 'undefined') return 'cde';
  const f = new URL(window.location.href).searchParams.get('focus');
  return f === 'wi' ? 'wi' : 'cde';
}

function focusTitle(f) {
  return f === 'wi' ? 'Waterway Intelligence' : 'CDE Uptake';
}

function FocusTabs({ focus, onChange }) {
  const items = [
    { id: 'cde', label: 'CDE Uptake',           sub: 'Priority 1.1' },
    { id: 'wi',  label: 'Waterway Intelligence', sub: 'Priority 1.6' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 4, marginTop: 12,
      borderBottom: '1px solid #E5E8EC',
    }}>
      {items.map(it => {
        const active = it.id === focus;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${active ? '#0A4C73' : 'transparent'}`,
            padding: '8px 14px 8px 4px',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'baseline', gap: 6,
          }}>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? '#002C4D' : '#667281' }}>
              {it.label}
            </span>
            <span style={{ fontSize: 10, color: active ? '#0A4C73' : '#8A95A2', fontWeight: 700, letterSpacing: '0.06em'}}>
              {it.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PlanBadge({ children }) {
  return (
    <span style={{
      display: 'inline-block', background: '#D6F1FA', color: '#0A4C73',
      fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 5,
      margin: '0 5px', letterSpacing: '0.04em',
    }}>{children}</span>
  );
}

/* =========== CDE tab ============= */

function CdeTab({ onOpenDam, selectedId }) {
  return (
    <>
      <CdeKpiStrip />
      <section style={{ marginTop: 16 }}>
        <PriorityDatasetsPanel />
      </section>
      <section style={{
        marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 14, gridAutoRows: '1fr',
      }}>
        <PartnersPanel onOpenDam={onOpenDam} selectedId={selectedId} />
        <ServicesPanel />
      </section>
    </>
  );
}

function CdeKpiStrip() {
  const s = CDE_STATUS;
  const items = [
    { label: 'Councils onboarded',   big: `${s.councilsOnboarded}`, denom: `/ ${s.councilsTotal}`, sub: 'of 12 SEQ councils' },
    { label: 'Agencies onboarded',   big: `${s.agenciesOnboarded}`, denom: `/ ${s.agenciesTotal}`, sub: 'Seqwater, DRDMW, utilities, HL&W …' },
    { label: 'Priority datasets',    big: `${s.datasetsIntegrated}`, denom: `/ ${s.datasetsPrioritised}`, sub: 'across 5 plan categories' },
    { label: 'Cross-agency collabs', big: `${s.collabsActive}`, denom: null, sub: 'MoUs live · data-sharing active' },
    { label: 'Services using CDE',   big: `${s.servicesUsingCDE}`, denom: null, sub: `${s.startupsEngaged} startups + academics engaged` },
  ];
  return (
    <section style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 14,
      gridAutoRows: '1fr',
    }}>
      {items.map(it => (
        <Card key={it.label} variant="stat" style={{
          padding: '10px 12px', gap: 3,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: '#667281' }}>{it.label}</div>
          {/* Big-stat row pushed to the bottom so all five baselines align
              regardless of whether the label wraps to one or two lines. */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 'auto' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#002C4D', lineHeight: 1, letterSpacing: '-0.02em' }}>{it.big}</span>
            {it.denom && <span style={{ fontSize: 11, color: '#8A95A2', fontWeight: 600 }}>{it.denom}</span>}
          </div>
          <div style={{ fontSize: 10, color: '#667281' }}>{it.sub}</div>
        </Card>
      ))}
    </section>
  );
}

function PriorityDatasetsPanel() {
  const byCat = PRIORITY_DATASETS.reduce((m, d) => {
    (m[d.cat] ||= []).push(d); return m;
  }, {});
  const STATUS = {
    integrated: { col: '#2E7A2E', bg: '#E5F4E5', label: 'Integrated' },
    partial:    { col: '#B26410', bg: '#FCEBDB', label: 'Partial'    },
    planned:    { col: '#667281', bg: '#EEF0F2', label: 'Planned'    },
  };
  const cats = Object.keys(byCat);
  return (
    <Card variant="panel" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <Eyebrow>Priority datasets &middot; integration status</Eyebrow>
          <SectionTitle>14 of 22 priority datasets integrated across 5 categories</SectionTitle>
          <div style={{ fontSize: 10, color: '#667281', marginTop: 2 }}>
            Categories mirror SEQ Digital Plan p.26 priority regional datasets.
          </div>
        </div>
        <PlanBadge>1.1</PlanBadge>
      </div>
      {/* Tile grid with `grid-auto-rows: 1fr` locks every category tile to
          the tallest sibling so the row bottoms align even when categories
          have different dataset counts (Env & Water has 4, Housing has 2). */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 10, marginTop: 10, gridAutoRows: '1fr',
      }}>
        {cats.map(cat => (
          <div key={cat} style={{
            background: '#F9FBFD', borderRadius: 8, padding: 10,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A4C73' }}>{cat}</div>
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {byCat[cat].map(d => {
                const s = STATUS[d.status];
                return (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 11, color: '#002C4D', fontWeight: 600 }}>
                      {d.name}
                      <span style={{ fontSize: 9, color: '#8A95A2', fontWeight: 500, marginLeft: 5 }}>
                        &middot; {d.contributors} contrib
                      </span>
                    </div>
                    <span style={{
                      background: s.bg, color: s.col,
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                      padding: '1px 7px', borderRadius: 999, whiteSpace: 'nowrap',
                    }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PartnersPanel({ onOpenDam, selectedId }) {
  // Map partner name -> first matching grid dam (so clicking a partner row
  // can reveal their catchment's data-sharing drawer).
  const findDamFor = (partner) => GRID_DAMS.find(d => d.sharedWith?.some(o => o === partner)) || null;
  return (
    <Card variant="panel" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>Onboarded partners</Eyebrow>
          <SectionTitle>{CDE_PARTNERS.length} agencies & councils publishing to the CDE</SectionTitle>
        </div>
        <PlanBadge>1.1</PlanBadge>
      </div>
      {/* flex: 1 so the scrollable row-list fills the remaining card height —
          keeps the Partners card bottom-aligned with Services. */}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {CDE_PARTNERS.map(p => {
          const dam = findDamFor(p.name);
          return (
            <button key={p.name}
              onClick={() => dam && onOpenDam(dam)}
              disabled={!dam}
              style={{
                background: selectedId && dam?.id === selectedId ? '#EEF8FD' : 'transparent',
                border: 'none', padding: '5px 4px', borderRadius: 6,
                display: 'flex', justifyContent: 'space-between', gap: 8,
                fontFamily: 'inherit', textAlign: 'left',
                cursor: dam ? 'pointer' : 'default',
                borderBottom: '1px solid #EEF0F2',
              }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#002C4D' }}>{p.name}</div>
              <div style={{ fontSize: 10, color: '#667281', textAlign: 'right' }}>{p.role}</div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ServicesPanel() {
  const STATUS = { live: { col: '#2E7A2E', bg: '#E5F4E5' }, pilot: { col: '#B26410', bg: '#FCEBDB' } };
  return (
    <Card variant="panel" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>Downstream services &middot; built on CDE</Eyebrow>
          <SectionTitle>{CDE_SERVICES.filter(s => s.status === 'live').length} live &middot; {CDE_SERVICES.filter(s => s.status === 'pilot').length} in pilot</SectionTitle>
        </div>
        <PlanBadge>1.1</PlanBadge>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
        {CDE_SERVICES.map(s => {
          const st = STATUS[s.status];
          return (
            <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto 50px', gap: 8, padding: '5px 0', borderBottom: '1px solid #EEF0F2', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#002C4D' }}>{s.name}</div>
              <div style={{ fontSize: 10, color: '#667281', textAlign: 'right' }}>{s.consumer}</div>
              <span style={{
                background: st.bg, color: st.col,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                padding: '1px 6px', borderRadius: 999, textAlign: 'center',
                textTransform: 'uppercase',
              }}>{s.status}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* =========== Waterway Intelligence tab ============= */

function WiTab({ onOpenDam, selectedId, showMap, setShowMap }) {
  return (
    <>
      {/* Two-column WI layout. `align-items: stretch` (implicit on grid)
          pulls the two columns to equal height; each inner column uses
          `flex: 1` on its last child so the bottom edges lock. */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr',
        gap: 14, marginTop: 14, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ChiRankedList onSelect={onOpenDam} selectedId={selectedId} />
          <EmbankmentRiskPanel onSelect={onOpenDam} selectedId={selectedId} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <VerdictPanel />
          <Card variant="panel" style={{ padding: 14, flex: 1 }}>
            <Eyebrow>Locator map</Eyebrow>
            <button onClick={() => setShowMap(v => !v)} style={{
              marginTop: 8,
              background: '#fff', border: '1px solid #D4D9DF', borderRadius: 999,
              padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#475260',
              cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start',
            }}>
              {showMap ? 'Hide map' : 'Show map'}
            </button>
            {showMap && (
              <div style={{ marginTop: 8 }}>
                <MapView onSelect={onOpenDam} selectedId={selectedId} />
              </div>
            )}
          </Card>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <PatternsPanel onSiteClick={onOpenDam} />
      </section>

      <section style={{ marginTop: 18 }}>
        <CoverageTable onSelect={onOpenDam} selectedId={selectedId} />
      </section>
    </>
  );
}

function ChiRankedList({ onSelect, selectedId }) {
  const sorted = [...GRID_DAMS].sort((a, b) => a.chi - b.chi);
  return (
    <Card variant="panel" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Catchment Health · ranked</Eyebrow>
          <SectionTitle>12 grid dams by Catchment Health Index</SectionTitle>
          <div style={{ fontSize: 10, color: '#667281', marginTop: 2 }}>
            Composite 0-100 &middot; lowest first.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        {sorted.map(d => {
          const col = { alert: '#C8102E', warn: '#E07A1A', good: '#B4BCC6' }[d.tone];
          const active = d.id === selectedId;
          return (
            <button key={d.id}
              onClick={() => onSelect(d)}
              style={{
                display: 'grid', gridTemplateColumns: '1.3fr 1fr 36px',
                gap: 8, padding: '5px 6px', borderRadius: 6,
                background: active ? '#EEF8FD' : 'transparent',
                cursor: 'pointer', alignItems: 'center',
                border: 'none', width: '100%', fontFamily: 'inherit', textAlign: 'left',
              }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#002C4D', fontWeight: active ? 700 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.name.replace(' Dam', '')}
                </div>
                <div style={{ fontSize: 9, color: '#8A95A2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.driver ? d.driver : d.council}
                </div>
              </div>
              <div style={{ height: 7, background: '#F0F2F4', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: `${d.chi}%`, height: '100%', background: col, borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: col, textAlign: 'right' }}>{d.chi}</div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function VerdictPanel() {
  const alerts = GRID_DAMS.filter(d => d.tone === 'alert').length;
  const warns  = GRID_DAMS.filter(d => d.tone === 'warn').length;
  const goods  = GRID_DAMS.filter(d => d.tone === 'good').length;
  return (
    <Card variant="panel" style={{ padding: 14 }}>
      <Eyebrow>Grid verdict &middot; today</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6, gridAutoRows: '1fr' }}>
        <VerdictCell big={alerts} label="Alert"   tone="alert" sub="CHI < 60" />
        <VerdictCell big={warns}  label="Watch"   tone="warn"  sub="CHI 60–74" />
        <VerdictCell big={goods}  label="Healthy" tone="good"  sub="CHI 75+" />
      </div>
    </Card>
  );
}

function VerdictCell({ big, label, tone, sub }) {
  const col = { alert: '#C8102E', warn: '#E07A1A', good: '#9AA3AE' }[tone];
  return (
    <div role="group" aria-label={`${label}: ${big}. ${sub}`}
         style={{
      background: '#F9FBFD', borderRadius: 8, padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: col, flexShrink: 0 }} />
        <div style={{ fontSize: 9, color: '#8A95A2', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: col, marginTop: 2, lineHeight: 1 }} aria-hidden="true">{big}</div>
      <div style={{ fontSize: 10, color: '#667281', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function EmbankmentRiskPanel({ onSelect, selectedId, style }) {
  const sorted = [...EMBANKMENT_RISKS].sort((a, b) => rank(a.risk) - rank(b.risk));
  return (
    <Card variant="panel" style={{ padding: 14, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Embankment risk · AI-identified</Eyebrow>
          <SectionTitle>{sorted.length} high-priority sites flagged this fortnight</SectionTitle>
          <div style={{ fontSize: 10, color: '#667281', marginTop: 2 }}>
            Satellite imagery, LiDAR delta and ML pattern recognition.
          </div>
        </div>
        <PlanBadge>1.6</PlanBadge>
      </div>
      <div style={{ marginTop: 6 }}>
        {sorted.map(r => {
          const dam = GRID_DAMS.find(d => d.id === r.damId);
          const riskCol = { High: '#C8102E', Medium: '#E07A1A', Low: '#9AA3AE' }[r.risk];
          return (
            <button key={r.siteId}
              onClick={() => dam && onSelect(dam)}
              style={{
                display: 'grid', gridTemplateColumns: '64px 1fr auto',
                gap: 10, padding: '7px 6px', borderRadius: 6,
                background: selectedId === r.damId ? '#EEF8FD' : 'transparent',
                cursor: 'pointer', alignItems: 'center',
                borderBottom: '1px solid #EEF0F2',
                border: 'none', borderLeft: 'none', width: '100%',
                fontFamily: 'inherit', textAlign: 'left',
              }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: '#fff',
                background: riskCol, padding: '2px 6px',
                borderRadius: 5, textAlign: 'center', letterSpacing: '0.04em',
              }}>{r.risk.toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#002C4D' }}>
                  {dam ? dam.name.replace(' Dam','') : '—'} &middot; km {r.km}
                  <span style={{ color: '#8A95A2', fontWeight: 500, marginLeft: 5, fontSize: 10 }}>#{r.siteId}</span>
                </div>
                <div style={{ fontSize: 10, color: '#475260', marginTop: 1 }}>{r.driver}</div>
              </div>
              <div style={{ fontSize: 9, color: '#667281', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {r.method}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function rank(r) { return { High: 0, Medium: 1, Low: 2 }[r] ?? 3; }

/* =========== Sharing drawer (slide-in) ============= */

function SharingDrawer({ dam, onClose }) {
  const panelRef = useRef(null);
  const scrimRef = useRef(null);

  // Motion One spring land for the drawer panel + scrim fade-in. Respects
  // prefers-reduced-motion by default inside Motion One.
  useEffect(() => {
    if (panelRef.current) {
      animate(
        panelRef.current,
        { transform: ['translateX(100%)', 'translateX(0%)'] },
        { duration: 0.38, easing: [0.2, 0.8, 0.2, 1] }
      );
    }
    if (scrimRef.current) {
      animate(scrimRef.current, { opacity: [0, 1] }, { duration: 0.22 });
    }
  }, []);

  if (!dam) return null;
  return (
    <div
      ref={scrimRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 20,
        background: 'rgba(0,44,77,0.28)',
        display: 'flex', justifyContent: 'flex-end',
        opacity: 0,
      }}
      onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-label={`Data sharing for ${dam.name}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(420px, 100%)', height: '100%',
          background: '#fff', boxShadow: '-8px 0 24px rgba(0,44,77,0.18)',
          padding: '18px 20px',
          overflowY: 'auto',
          transform: 'translateX(100%)',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Eyebrow>Data sharing &middot; CDE</Eyebrow>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#002C4D', margin: '3px 0 0', lineHeight: 1.2 }}>
              {dam.name}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#667281', fontFamily: 'inherit', padding: 4, lineHeight: 1,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconX size={16} />
          </button>
        </div>
        <PlanBadge>1.1</PlanBadge>
        <div style={{ fontSize: 11, color: '#667281', marginTop: 8 }}>
          Feeds published to the SEQ Common Data Environment and consumed by:
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
          {dam.sharedWith.map(org => (
            <span key={org} style={{
              background: '#EEF8FD', color: '#003A5D', fontSize: 11, fontWeight: 600,
              padding: '3px 9px', borderRadius: 999, border: '1px solid #D6F1FA',
            }}>{org}</span>
          ))}
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SharedStat label="Level" v={dam.level?.v} tone={dam.level?.tone}/>
          <SharedStat label="Rainfall (7 day)" v={dam.rainfall7d?.v} tone={dam.rainfall7d?.tone}/>
          <SharedStat label="Turbidity" v={dam.turbidity?.v} tone={dam.turbidity?.tone}/>
          <SharedStat label="Micro-pollutant" v={dam.microPollutant?.v} tone={dam.microPollutant?.tone}/>
          <SharedStat label="Ranger survey" v={dam.rangerSurveys?.v} tone={dam.rangerSurveys?.tone}/>
          <SharedStat label="Fish programme" v={dam.fishProgram?.v} tone={dam.fishProgram?.tone}/>
          <SharedStat label="AI embankment" v={dam.embankmentAI?.v} tone={dam.embankmentAI?.tone}/>
        </div>

        {dam.id === 'hinze' && (
          <a href="/today" style={{
            display: 'inline-block', marginTop: 14, fontSize: 12, fontWeight: 700,
            color: '#0095C8', textDecoration: 'none',
          }}>Open full Hinze fish-programme dashboard →</a>
        )}
      </div>
    </div>
  );
}

function SharedStat({ label, v, tone }) {
  const bg = { good: '#E5F4E5', warn: '#FCEBDB', alert: '#FBE1DA', info: '#D6F1FA' }[tone] || '#EEF0F2';
  const fg = { good: '#2E7A2E', warn: '#B26410', alert: '#A03418', info: '#0A4C73' }[tone] || '#475260';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '5px 0', borderBottom: '1px solid #EEF0F2',
    }}>
      <span style={{ fontSize: 11, color: '#667281', fontWeight: 600 }}>{label}</span>
      {v ? (
        <span style={{
          background: bg, color: fg, fontSize: 11, fontWeight: 700,
          padding: '2px 9px', borderRadius: 999, whiteSpace: 'nowrap',
        }}>{v}</span>
      ) : (
        <span style={{ fontSize: 10, color: '#B4BCC6', fontStyle: 'italic' }}>not instrumented</span>
      )}
    </div>
  );
}
