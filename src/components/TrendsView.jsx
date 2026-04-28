// Trends view — pattern history for rangers / dam operators.
//
//   Chart left, AI-detected patterns right. Patterns are linked to the chart
//   in three ways:
//     1. Each PatternRow carries an xRange; hovering it paints a translucent
//        vertical band on the chart so the time span is obvious.
//     2. Each PatternRow shows a mini-sparkline echoing the shape over that
//        same xRange (Rule B from the 2nd-edition cheatsheet: "Help users
//        see, not read").
//     3. Each pattern kicker includes an x-label (e.g. "Peak · Jul") so the
//        link is legible without hovering.
//
//   Seasonality mimics SEQ reality: Mozambique tilapia and carp peak
//   Nov-Mar (summer spawn), natives steadier with a mild spring bump.
//   Multi-year view shows the +18%/yr pest baseline drift.

import { useMemo, useState, useRef } from 'preact/hooks';
import { Card, Eyebrow, SectionTitle, Button, Sparkline, FlagIssueButton } from './Primitives.jsx';
import { IconAlertTriangle, IconCheck, IconMinus } from './Icons.jsx';
import { THRESHOLD } from '../data/species.js';

const C_NATIVE = '#6BA43A';
const C_PEST   = '#E07A1A';
const C_THRESH = '#475260';

function rand(seed) { let x = seed; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }

const PEST_MONTHLY   = [1.55, 1.40, 1.15, 0.80, 0.55, 0.40, 0.35, 0.45, 0.65, 0.95, 1.25, 1.50];
const NATIVE_MONTHLY = [0.95, 0.90, 0.85, 0.90, 0.95, 0.95, 1.00, 1.15, 1.25, 1.20, 1.05, 1.00];

function useSeries(range) {
  return useMemo(() => {
    const configs = {
      day:       { points: 6,  labelFn: i => `${(i*4).toString().padStart(2,'0')}:00`,         labelEvery: 1, unit: '4hr',  unitLong: '4-hr block' },
      week:      { points: 7,  labelFn: i => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],   labelEvery: 1, unit: 'day',  unitLong: 'day' },
      month:     { points: 4,  labelFn: i => `Wk ${i+1}`,                                     labelEvery: 1, unit: 'week', unitLong: 'week' },
      quarter:   { points: 13, labelFn: i => `W${i+1}`,                                       labelEvery: 2, unit: 'wk',   unitLong: 'week' },
      year:      { points: 12, labelFn: i => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], labelEvery: 1, unit: 'mo', unitLong: 'month' },
      multiyear: { points: 24, labelFn: i => i % 12 === 0 ? `${2024 + Math.floor(i/12)}` : '', labelEvery: 1, unit: 'mo', unitLong: 'month' },
    };
    const cfg = configs[range];
    const r = rand(range.charCodeAt(0) * 37);
    const rPrev = rand(range.charCodeAt(0) * 37 + 13);
    const native = [], pest = [], nativePrev = [], pestPrev = [];
    for (let i = 0; i < cfg.points; i++) {
      let pestSeason = 1, nativeSeason = 1;
      let monthIdx = null;
      if (range === 'year')      monthIdx = i;
      if (range === 'multiyear') monthIdx = i % 12;
      if (monthIdx != null) {
        pestSeason = PEST_MONTHLY[monthIdx];
        nativeSeason = NATIVE_MONTHLY[monthIdx];
      }
      if (range === 'quarter') { pestSeason = 1 + 0.35 * Math.sin(i / 2); nativeSeason = 1 - 0.1 * Math.sin(i / 2); }
      if (range === 'month')   { pestSeason = 1 + 0.25 * Math.sin(i / 2); nativeSeason = 1 + 0.05 * Math.sin(i / 2); }
      if (range === 'week')    { pestSeason = 1 + 0.2 * Math.sin(i); nativeSeason = 1 + 0.05 * Math.sin(i); }
      if (range === 'day')     { pestSeason = 1 + 0.4 * Math.sin((i - 1.5) / 1.5); nativeSeason = 1 + 0.1 * Math.sin((i - 1.5) / 1.5); }

      const pestGrowth   = range === 'multiyear' ? 1 + (i / 24) * 0.36 : 1;
      const nativeGrowth = range === 'multiyear' ? 1 - (i / 24) * 0.06 : 1;
      // Bases scaled to the new daily pond total ~105 (autumn).
      // Monthly aggregate ≈ 30× daily, scaled down for display.
      const nBase = range === 'day' ? 20 : 65;
      const pBase = range === 'day' ? 10 : 45;
      native.push(Math.round(nBase * (0.85 + r() * 0.3) * nativeSeason * nativeGrowth));
      pest.push(  Math.round(pBase * (0.85 + r() * 0.3) * pestSeason   * pestGrowth));
      nativePrev.push(Math.round(nBase * (0.85 + rPrev() * 0.3) * nativeSeason * (nativeGrowth * 1.03)));
      pestPrev.push(  Math.round(pBase * (0.85 + rPrev() * 0.3) * pestSeason   * (pestGrowth   * 0.91)));
    }
    return {
      native, pest, nativePrev, pestPrev,
      labels: Array.from({ length: cfg.points }, (_, i) => cfg.labelFn(i)),
      cfg,
    };
  }, [range]);
}

export default function TrendsView() {
  const [range, setRange] = useState('year');
  const [showLastYear, setShowLastYear] = useState(true);
  const [hoveredRange, setHoveredRange] = useState(null);
  const { native, pest, nativePrev, pestPrev, labels, cfg } = useSeries(range);
  const totals = native.map((n, i) => n + pest[i]);
  const overIdx = totals.map((t, i) => t >= THRESHOLD ? i : -1).filter(i => i >= 0);
  const peakIdx = totals.indexOf(Math.max(...totals));
  const longestOverRun = longestRun(totals, THRESHOLD);
  const ratio = pest.reduce((a,b)=>a+b,0) / Math.max(1, native.reduce((a,b)=>a+b,0));

  const sumPest = pest.reduce((a,b)=>a+b,0);
  const sumPestPrev = pestPrev.reduce((a,b)=>a+b,0);
  const sumNative = native.reduce((a,b)=>a+b,0);
  const sumNativePrev = nativePrev.reduce((a,b)=>a+b,0);
  const pestDeltaPct = Math.round(((sumPest / Math.max(1, sumPestPrev)) - 1) * 100);
  const nativeDeltaPct = Math.round(((sumNative / Math.max(1, sumNativePrev)) - 1) * 100);

  const effectiveStyle = (range === 'week' || range === 'month') ? 'bars' : 'line';

  // "You are here" marker. Unobtrusive vertical line + dot at the current
  // period. For year: today is Apr → month index 3. Other ranges: anchor to
  // the last known point so the marker doesn't lie when data density
  // doesn't include the current slot.
  const todayIdx = range === 'year' ? 3 : null;

  const insights = buildFourInsights({ range, totals, native, pest, labels, overIdx, longestOverRun, peakIdx, cfg, ratio, pestDeltaPct, nativeDeltaPct });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 28px' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14,
        flexWrap: 'wrap', paddingBottom: 10, borderBottom: '1px solid #E5E8EC',
      }}>
        <div>
          <Eyebrow>Trends &middot; Hinze Pond</Eyebrow>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#002C4D', letterSpacing: '-0.015em', margin: '3px 0 0', lineHeight: 1.15 }}>
            Pattern <span style={{ color: 'var(--sw-blue-500)' }}>History</span>
          </h1>
          <div style={{ fontSize: 12, color: '#475260', marginTop: 4, maxWidth: 560, lineHeight: 1.5 }}>
            Native and pest counts by {cfg.unitLong}, ghosted vs the same window last year.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'nowrap' }}>
          <RangeSwitcher value={range} onChange={setRange} />
          <Button variant="outline" size="sm"><span style={{ whiteSpace: 'nowrap' }}>Export CSV</span></Button>
          <FlagIssueButton subject={`Trends · ${rangeTitle(range)}`} compact />
        </div>
      </header>

      <DecisionStrip
        cfg={cfg}
        overIdx={overIdx} totals={totals} longestOverRun={longestOverRun}
        ratio={ratio}
        pestDeltaPct={pestDeltaPct} nativeDeltaPct={nativeDeltaPct}
      />

      {/* Chart + patterns. align-items: stretch is implicit on grid, so the
          chart card and patterns column share the same height. Inside the
          patterns column we use grid-template-rows: auto + repeat(4, 1fr) so
          the 4 pattern cards divide the remaining vertical space evenly and
          their bottom edges lock. */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 14, marginTop: 14,
        alignItems: 'stretch',
      }}>
        <Card variant="stat" role="region" aria-label={`Fish counts by ${cfg.unitLong} — ${rangeTitle(range)}`}
              style={{ padding: 14, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 10, flexWrap: 'wrap' }}>
            <div>
              <Eyebrow>Counts by {cfg.unitLong}</Eyebrow>
              <SectionTitle>{rangeTitle(range)}</SectionTitle>
              <div style={{ fontSize: 11, color: '#667281', marginTop: 3 }}>
                This {windowLabel(range)}: <b style={{ color: C_NATIVE }}>{sumNative.toLocaleString('en-AU')}</b> native,
                &nbsp;<b style={{ color: C_PEST }}>{sumPest.toLocaleString('en-AU')}</b> pest
                &nbsp;({fmtDelta(nativeDeltaPct)} native / {fmtDelta(pestDeltaPct)} pest vs same window last year).
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, alignItems: 'center' }}>
              <ChartLegendSimple />
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#475260', cursor: 'pointer' }}>
                <input type="checkbox" checked={showLastYear} onChange={e => setShowLastYear(e.currentTarget.checked)} style={{ accentColor: '#667281' }}/>
                Last year
              </label>
            </div>
          </div>

          {/* Chart fills remaining card height so the card bottom lines up
              with the patterns column. */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
            {effectiveStyle === 'line'
              ? <CleanLineChart native={native} pest={pest} nativePrev={nativePrev} pestPrev={pestPrev} labels={labels} cfg={cfg} showLastYear={showLastYear} hoveredRange={hoveredRange} todayIdx={todayIdx}/>
              : <CleanBarChart  native={native} pest={pest} nativePrev={nativePrev} pestPrev={pestPrev} labels={labels} cfg={cfg} showLastYear={showLastYear} hoveredRange={hoveredRange} todayIdx={todayIdx}/>
            }
          </div>
        </Card>

        <div style={{
          display: 'grid',
          gridTemplateRows: 'auto repeat(4, 1fr)',
          gap: 7,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 3px' }}>
            <Eyebrow>Patterns detected</Eyebrow>
            <span style={{ fontSize: 10, color: '#8A95A2' }}>Hover to highlight on chart</span>
          </div>
          {insights.map((ins, i) => (
            <PatternRow
              key={i}
              {...ins}
              onHover={() => setHoveredRange(ins.xRange)}
              onLeave={() => setHoveredRange(null)}
            />
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, fontSize: 10, color: '#8A95A2' }}>
        Last data refresh &middot; 10:00 AM, 20 Apr 2026
      </div>
    </div>
  );
}

function fmtDelta(pct) {
  const sign = pct > 0 ? '+' : pct < 0 ? '' : '±';
  return `${sign}${pct}%`;
}

function DecisionStrip({ cfg, overIdx, totals, longestOverRun, ratio, pestDeltaPct, nativeDeltaPct }) {
  const overPct = overIdx.length / Math.max(1, totals.length);
  const opTone  = overPct >= 0.4 ? 'alert' : (overPct > 0 ? 'warn' : 'neutral');
  const ecoTone = ratio >= 1.5 ? 'alert' : (ratio >= 1.0 ? 'warn' : 'neutral');
  const yoyTone = pestDeltaPct >= 15 ? 'alert' : (pestDeltaPct >= 5 ? 'warn' : 'neutral');

  const worst = [opTone, ecoTone, yoyTone].includes('alert') ? 'alert' :
                [opTone, ecoTone, yoyTone].includes('warn')  ? 'warn' : 'neutral';
  const actionLabel = worst === 'alert' ? 'Escalate' : worst === 'warn' ? 'Monitor' : 'Hold Course';
  const actionDetail = worst === 'alert'
    ? 'Daily empty + ranger sweep. Notify ops.'
    : worst === 'warn'
      ? 'Keep current cadence. Review next week.'
      : 'Nothing required.';

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10, marginTop: 12, gridAutoRows: '1fr',
    }}>
      <DecisionCell
        label="Operations"
        state={overPct >= 0.4 ? 'Heavy' : (overPct > 0 ? 'Mixed' : 'Light')}
        tone={opTone}
        big={overIdx.length}
        small={`/ ${totals.length} ${cfg.unit}s`}
        evidence={`Longest run ${longestOverRun} ${cfg.unit}`}
      />
      <DecisionCell
        label="Ecology"
        state={ratio >= 1.5 ? 'Stressed' : ratio >= 1.0 ? 'Watch' : 'Healthy'}
        tone={ecoTone}
        big={ratio.toFixed(1)}
        small=": 1"
        evidence="pest : native · target ≤ 1"
      />
      <DecisionCell
        label="vs Last Year"
        state={pestDeltaPct >= 5 ? 'Worse' : pestDeltaPct <= -5 ? 'Better' : 'Similar'}
        tone={yoyTone}
        big={`${pestDeltaPct >= 0 ? '+' : ''}${pestDeltaPct}%`}
        small="pest"
        evidence={`Native ${nativeDeltaPct >= 0 ? '+' : ''}${nativeDeltaPct}% · same window`}
      />
      <DecisionCell
        label="Next action"
        state={actionLabel}
        tone={worst}
        bigIcon={worst === 'alert' ? IconAlertTriangle : worst === 'warn' ? IconMinus : IconCheck}
        small=""
        evidence={actionDetail}
        isAction
      />
    </div>
  );
}

function DecisionCell({ label, state, tone, big, bigIcon: BigIcon, small, evidence, isAction }) {
  const FG = { alert: '#A03418', warn: '#B26410', neutral: '#475260' }[tone];
  // Seqwater brand README: "No coloured left-border accent cards." Status is
  // encoded via the state pill (top-right) + big-stat colour + icon. The card
  // itself is plain white with a soft shadow, uniform across all four cells.
  return (
    <Card variant="content" style={{
      padding: '10px 12px', gap: 4, minHeight: 84,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#667281' }}>{label}</div>
        <div style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: tone === 'neutral' ? '#8A95A2' : FG,
          background: tone === 'neutral' ? 'transparent' : (tone === 'alert' ? '#FBE1DA' : '#FCEBDB'),
          padding: tone === 'neutral' ? 0 : '2px 7px', borderRadius: 999,
        }}>{state}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
        {BigIcon
          ? <BigIcon size={22} color={FG} />
          : <span style={{ fontSize: 22, fontWeight: 800, color: FG, lineHeight: 1, letterSpacing: '-0.02em' }}>{big}</span>}
        {small && <span style={{ fontSize: 11, color: '#667281' }}>{small}</span>}
      </div>
      <div style={{ fontSize: 10, color: '#667281', lineHeight: 1.35 }}>{evidence}</div>
    </Card>
  );
}

function PatternRow({ tone, kicker, shape, title, statValue, statDenom, statLabel, body, spark, sparkColor, onHover, onLeave }) {
  const FG = { alert: '#A03418', warn: '#B26410', good: '#2E7A2E', neutral: '#475260' }[tone];
  // Status is encoded by the kicker colour + big-stat colour + mini-sparkline
  // colour — no left-border (Seqwater brand rule). Focus ring is the only
  // chrome added on interaction.
  return (
    <Card
      variant="content"
      tabIndex={0}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onFocusCapture={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,169,224,0.35)'; }}
      onBlurCapture={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,44,77,0.06)'; }}
      style={{
        padding: '10px 12px',
        display: 'grid', gridTemplateColumns: '1fr 62px', gap: 10,
        alignItems: 'center',
        cursor: 'default', outline: 'none',
        transition: 'box-shadow 120ms',
        minHeight: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: tone === 'neutral' ? '#667281' : FG }}>{kicker}</span>
          {shape && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#8A95A2',
            }}>
              <ShapeGlyph shape={shape}/> {shape.replace('-', ' ')}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: FG, lineHeight: 1, letterSpacing: '-0.02em' }}>{statValue}</span>
          {statDenom != null && <span style={{ fontSize: 11, color: '#8A95A2' }}>/ {statDenom}</span>}
          <span style={{ fontSize: 10, color: '#667281' }}>{statLabel}</span>
        </div>
        <div style={{
          fontSize: 11, color: '#002C4D', fontWeight: 600, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{title}</div>
        <div style={{
          fontSize: 10, color: '#667281', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{body}</div>
      </div>
      {spark && spark.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkline data={spark} color={sparkColor || FG} w={56} h={24} />
        </div>
      )}
    </Card>
  );
}

function RangeSwitcher({ value, onChange }) {
  const items = [
    ['day','Day'], ['week','Week'], ['month','Month'],
    ['quarter','Quarter'], ['year','Year'], ['multiyear','Multi-yr'],
  ];
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E8EC', borderRadius: 8,
      padding: 2, display: 'inline-flex',
      boxShadow: '0 1px 2px rgba(0,44,77,0.04)',
    }}>
      {items.map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)} style={{
          background: value === id ? '#002C4D' : 'transparent',
          color: value === id ? '#fff' : '#475260',
          border: 'none', borderRadius: 6, padding: '4px 10px',
          fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}>{label}</button>
      ))}
    </div>
  );
}

function buildFourInsights({ range, totals, native, pest, labels, overIdx, longestOverRun, peakIdx, cfg, ratio, pestDeltaPct, nativeDeltaPct }) {
  const cards = [];
  const overPct = overIdx.length / Math.max(1, totals.length);

  // Operational: spans all the over-threshold indices.
  const opXRange = overIdx.length > 0 ? [overIdx[0], overIdx[overIdx.length - 1]] : [0, totals.length - 1];
  const opSpark  = overIdx.length > 0
    ? totals.slice(opXRange[0], opXRange[1] + 1)
    : totals;
  cards.push({
    tone: overPct >= 0.4 ? 'alert' : overPct > 0 ? 'warn' : 'good',
    kicker: overIdx.length > 0
      ? `Operational · ${labels[opXRange[0]]}–${labels[opXRange[1]]}`
      : 'Operational · all clear',
    shape: overPct >= 0.6 ? 'upward-shift' : (overPct > 0 ? 'mixture' : 'normal'),
    title: overIdx.length === 0
      ? 'No daily-empty days this ' + rangeWord(range)
      : `Daily-empty triggered on ${overIdx.length} of ${totals.length} ${cfg.unit}s`,
    statValue: overIdx.length === 0 ? '—' : overIdx.length,
    statDenom: overIdx.length === 0 ? null : totals.length,
    statLabel: overIdx.length === 0 ? 'all ' + cfg.unit + 's under ' + THRESHOLD : cfg.unit + 's over ' + THRESHOLD,
    body: overIdx.length === 0
      ? 'Reduced 2–3× weekly cadence was sufficient throughout.'
      : `Longest consecutive run at daily cadence: ${longestOverRun} ${cfg.unit}${longestOverRun === 1 ? '' : 's'}.`,
    xRange: opXRange,
    spark: opSpark,
    sparkColor: '#475260',
  });

  // Peak: single bucket, highlight one column.
  cards.push({
    tone: totals[peakIdx] >= THRESHOLD ? 'warn' : 'neutral',
    kicker: `Peak · ${labels[peakIdx] || 'n/a'}`,
    shape: 'mixture',
    title: `Highest count was ${totals[peakIdx]} fish`,
    statValue: totals[peakIdx],
    statDenom: null,
    statLabel: 'fish · ' + labels[peakIdx],
    body: `${native[peakIdx]} native + ${pest[peakIdx]} pest. ${totals[peakIdx] >= THRESHOLD ? 'Over threshold — daily cadence.' : 'Under threshold.'}`,
    xRange: [peakIdx, peakIdx],
    spark: totals,
    sparkColor: C_PEST,
  });

  // Seasonal / pest-high
  if (range === 'year' || range === 'multiyear') {
    const summerIdxs = range === 'year' ? [10, 11, 0, 1, 2] : [10, 11, 12, 13, 22, 23];
    const valid = summerIdxs.filter(i => i < pest.length);
    const summerMax = Math.max(...valid.map(i => pest[i]));
    const delta = Math.round(((summerMax / Math.max(1, avg(pest))) - 1) * 100);
    const sign = delta >= 0 ? '+' : '';
    // Year view wraps across year-end: Nov-Dec (10-11) + Jan-Feb (0-1).
    // Multi-year view has the Nov-Feb block in contiguous indices, so one range works.
    const xRange = range === 'year' ? [[10, 11], [0, 1]] : [10, 13];
    const summerSlice = range === 'year' ? [...pest.slice(10, 12), ...pest.slice(0, 3)] : pest.slice(10, 14);
    cards.push({
      tone: 'warn',
      kicker: 'Seasonal · Nov – Feb',
      shape: 'cycle',
      title: 'Summer pest surge',
      statValue: `${sign}${delta}%`,
      statDenom: null,
      statLabel: 'pest vs annual avg',
      body: `Peak of ${summerMax} pest fish in summer — matches Mozambique tilapia and carp spawn. Pre-position ranger shifts late November.`,
      xRange,
      spark: summerSlice,
      sparkColor: C_PEST,
    });
  } else {
    const peakPest = Math.max(...pest);
    const pestPeakIdx = pest.indexOf(peakPest);
    cards.push({
      tone: 'warn',
      kicker: `Pest high · ${labels[pestPeakIdx] || ''}`,
      shape: 'mixture',
      title: `Pest peaked at ${peakPest}`,
      statValue: peakPest,
      statDenom: null,
      statLabel: 'pest · ' + labels[pestPeakIdx],
      body: `Largest pest presence in this ${rangeWord(range)}. Watch for repeats.`,
      xRange: [pestPeakIdx, pestPeakIdx],
      spark: pest,
      sparkColor: C_PEST,
    });
  }

  // YoY / Multi-year
  if (range === 'multiyear') {
    cards.push({
      tone: 'alert',
      kicker: 'Ecological · 2024–26',
      shape: 'upward-trend',
      title: 'Pest baseline drifting upward',
      statValue: '+18%',
      statDenom: null,
      statLabel: 'per year',
      body: 'Consistent with SEQ catchment reports since 2020. Recommend escalation to regional ops.',
      xRange: [0, pest.length - 1],
      spark: pest,
      sparkColor: C_PEST,
    });
  } else if (range === 'year') {
    cards.push({
      tone: 'warn',
      kicker: 'YoY shift · full year',
      shape: 'upward-shift',
      title: 'Pest up, native down vs last year',
      statValue: fmtDelta(pestDeltaPct),
      statDenom: null,
      statLabel: 'pest · same window last year',
      body: `Native ${fmtDelta(nativeDeltaPct)} over the same period. Unfavourable trend is continuing.`,
      xRange: [0, pest.length - 1],
      spark: pest,
      sparkColor: C_PEST,
    });
  } else {
    cards.push({
      tone: 'neutral',
      kicker: 'Species watch',
      shape: 'downward-shift',
      title: 'Bullrout unseen for 14 days',
      statValue: '14',
      statDenom: null,
      statLabel: 'day absence',
      body: 'Saratoga also scarce (2 sightings). Schedule a ranger sweep.',
      xRange: [0, pest.length - 1],
      spark: native,
      sparkColor: C_NATIVE,
    });
  }
  const order = { alert: 0, warn: 1, neutral: 2, good: 3 };
  return cards.sort((a,b) => order[a.tone] - order[b.tone]).slice(0, 4);
}
function avg(arr) { return arr.reduce((a,b)=>a+b,0) / Math.max(1, arr.length); }
function longestRun(arr, threshold) { let best=0,cur=0; for (const v of arr) { if (v>=threshold) { cur++; best=Math.max(best,cur);} else cur=0;} return best; }
function rangeWord(r) { return ({ day:'day', week:'week', month:'month', quarter:'quarter', year:'year', multiyear:'multi-year' })[r]; }
function windowLabel(r) {
  return ({ day: 'today', week: 'week', month: 'month', quarter: 'quarter', year: 'year', multiyear: '24-month window' })[r] || 'period';
}
function rangeTitle(r) {
  return ({
    day: 'Hourly · Today, 20 Apr 2026',
    week: 'Daily · Week of 14–20 Apr 2026',
    month: 'Daily · April 2026',
    quarter: 'Weekly · Q2 2026 (Apr – Jun)',
    year: 'Monthly · 2026',
    multiyear: 'Monthly · 2024 – 2026',
  })[r];
}

function ShapeGlyph({ shape }) {
  const stroke = { stroke: '#475260', strokeWidth: 1.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    'upward-shift':   'M1 8 L8 8 L8 3 L19 3',
    'downward-shift': 'M1 3 L8 3 L8 8 L19 8',
    'upward-trend':   'M1 8 L19 2',
    'downward-trend': 'M1 2 L19 8',
    'cycle':          'M1 5 Q5 1 10 5 T19 5',
    'mixture':        'M1 8 L5 3 L9 7 L13 2 L17 8 L19 4',
    'stratification': 'M1 6 L19 6 M1 3 L19 3',
    'systematic':     'M1 5 L4 3 L7 7 L10 3 L13 7 L16 3 L19 7',
    'normal':         'M1 5 L19 5',
  };
  return (
    <svg width={18} height={8} style={{ display: 'block' }}>
      <path d={paths[shape] || paths.normal} {...stroke} />
    </svg>
  );
}

function chartBox() { return { w: 760, h: 280, padL: 42, padR: 60, padT: 14, padB: 36 }; }

// Translucent band over the x-range(s) of the currently-hovered pattern.
// `range` may be `[a, b]` or an array of `[a, b]` pairs (e.g. for seasonal
// patterns that wrap year-end, Nov-Dec + Jan-Feb).
function HoveredBand({ range, n, padL, plotW, padT, plotH }) {
  if (!range) return null;
  const ranges = Array.isArray(range[0]) ? range : [range];
  const X = i => padL + (i / Math.max(1, n - 1)) * plotW;
  return (
    <g pointerEvents="none">
      {ranges.map(([a, b], i) => {
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        const pad = lo === hi ? plotW / n / 2 : 0;
        const x1 = X(lo) - pad;
        const x2 = X(hi) + pad;
        return (
          <rect key={i}
            x={Math.max(padL, x1)} y={padT}
            width={Math.max(6, x2 - x1)} height={plotH}
            fill="#002C4D" fillOpacity="0.08"
            stroke="#002C4D" strokeOpacity="0.25" strokeWidth="1" />
        );
      })}
    </g>
  );
}

function CleanLineChart({ native, pest, nativePrev, pestPrev, labels, cfg, showLastYear, hoveredRange, todayIdx }) {
  const { w, h, padL, padR, padT, padB } = chartBox();
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = native.length;
  // Total is the line the threshold is actually measured against — must be
  // the primary visual or the threshold crossing is invisible when native and
  // pest are close to 50 individually but sum to over 50.
  const total     = native.map((v, i) => v + pest[i]);
  const totalPrev = nativePrev.map((v, i) => v + pestPrev[i]);
  const allVals = [...total, ...native, ...pest, ...(showLastYear ? [...totalPrev] : [])];
  const maxVal = Math.max(...allVals, THRESHOLD * 1.35);
  const X = i => padL + (i / Math.max(1, n - 1)) * plotW;
  const Y = v => padT + (1 - v / maxVal) * plotH;
  const threshY = Y(THRESHOLD);
  const path = arr => arr.map((v, i) => (i ? 'L' : 'M') + X(i) + ',' + Y(v)).join(' ');

  const ticks = [0, Math.round(maxVal * 0.5), Math.round(maxVal)];

  // Crosshair state. Nearest-index snapping against the x-pixel under the
  // cursor — matches uPlot's native cursor behaviour, renders as clean SVG.
  // Listed as the primary client-visible polish upgrade from the plan's
  // Phase D1 (uPlot package installed and ready for larger-scale datasets
  // when the PoC grows beyond ~24 points).
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  function handleMove(ev) {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const local = pt.matrixTransform(ctm.inverse());
    const xRel = local.x - padL;
    if (xRel < -4 || xRel > plotW + 4) { setHover(null); return; }
    const frac = Math.max(0, Math.min(1, xRel / plotW));
    const i = Math.round(frac * (n - 1));
    setHover(i);
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`} width="100%"
      style={{ display: 'block', fontFamily: 'inherit' }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      <HoveredBand range={hoveredRange} n={n} padL={padL} plotW={plotW} padT={padT} plotH={plotH}/>
      <line x1={padL} x2={padL + plotW} y1={padT + plotH} y2={padT + plotH} stroke="#E5E8EC" strokeWidth="1"/>
      {ticks.map(t => (
        <g key={t}>
          <text x={padL - 6} y={Y(t) + 3} textAnchor="end" fontSize="9" fill="#8A95A2">{t}</text>
        </g>
      ))}
      <line x1={padL} x2={padL + plotW} y1={threshY} y2={threshY} stroke={C_THRESH} strokeWidth="1.2" strokeDasharray="4,4"/>
      <text x={padL + plotW + 4} y={threshY + 3} fontSize="9" fill={C_THRESH} fontWeight="700">{THRESHOLD}</text>

      {todayIdx != null && (
        <g pointerEvents="none">
          <line x1={X(todayIdx)} x2={X(todayIdx)} y1={padT} y2={padT + plotH} stroke="#B4BCC6" strokeWidth="1" strokeDasharray="2,3"/>
          <circle cx={X(todayIdx)} cy={padT + plotH} r="3" fill="#fff" stroke="#475260" strokeWidth="1.2"/>
          <text x={X(todayIdx)} y={padT - 3} textAnchor="middle" fontSize="8" fill="#8A95A2" fontWeight="700" letterSpacing="0.08em">TODAY</text>
        </g>
      )}

      {showLastYear && (
        <g opacity="0.9">
          <path d={path(totalPrev)} fill="none" stroke="#8A95A2" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
        </g>
      )}

      {/* Component lines (native + pest) rendered first at lower weight so the
          total sits visually "on top" without losing the underlying breakdown. */}
      <path d={path(native)} fill="none" stroke={C_NATIVE} strokeWidth="1.2" opacity="0.7"/>
      <path d={path(pest)}   fill="none" stroke={C_PEST}   strokeWidth="1.2" opacity="0.7"/>

      {/* Primary total line — the one the threshold compares against. */}
      <path d={path(total)} fill="none" stroke="#002C4D" strokeWidth="2.2"/>
      {/* End-of-line dot to anchor the final value. */}
      <circle cx={X(n-1)} cy={Y(total[n-1])} r="2.6" fill="#002C4D"/>

      <text x={padL + plotW + 4} y={Y(total[n-1]) + 3}  fontSize="10" fill="#002C4D" fontWeight="800">{total[n-1]}</text>
      <text x={padL + plotW + 4} y={Y(native[n-1]) + 3} fontSize="9"  fill={C_NATIVE} fontWeight="700" opacity="0.85">{native[n-1]}</text>
      <text x={padL + plotW + 4} y={Y(pest[n-1]) + 3}   fontSize="9"  fill={C_PEST}   fontWeight="700" opacity="0.85">{pest[n-1]}</text>

      {labels.map((lbl, i) => (lbl && i % cfg.labelEvery === 0) && (
        <text key={i} x={X(i)} y={h - padB + 16} textAnchor="middle" fontSize="9" fill="#667281">{lbl}</text>
      ))}

      {hover != null && (
        <g pointerEvents="none">
          <line x1={X(hover)} x2={X(hover)} y1={padT} y2={padT + plotH} stroke="#475260" strokeWidth="1" strokeDasharray="2,2" opacity="0.55"/>
          <circle cx={X(hover)} cy={Y(total[hover])}  r="3.4" fill="#002C4D"/>
          <circle cx={X(hover)} cy={Y(native[hover])} r="2.8" fill={C_NATIVE}/>
          <circle cx={X(hover)} cy={Y(pest[hover])}   r="2.8" fill={C_PEST}/>
          <CrosshairTooltip
            x={X(hover)} plotW={plotW} padL={padL}
            padT={padT} label={labels[hover]}
            total={total[hover]} native={native[hover]}
            pest={pest[hover]}
            prevTotal={showLastYear ? totalPrev[hover] : null}
          />
        </g>
      )}
    </svg>
  );
}

// Tooltip panel anchored to the crosshair. Auto-flips to the left side of
// the cursor if there isn't enough room on the right so it never spills out
// of the chart box.
function CrosshairTooltip({ x, plotW, padL, padT, label, total, native, pest, prevTotal }) {
  const boxW = 156;
  const rowGap = 16;
  const headerH = 20;
  const baseRows = 3;
  const extraRows = prevTotal != null ? 1 : 0;
  const boxH = headerH + (baseRows + extraRows) * rowGap + 10;
  const flip = (x - padL) > plotW * 0.6;
  const boxX = flip ? x - boxW - 8 : x + 8;
  const boxY = padT + 4;
  const row = (i) => boxY + headerH + i * rowGap + 8;
  return (
    <g>
      <rect x={boxX + 1} y={boxY + 2} width={boxW} height={boxH} rx="6" fill="rgba(0,44,77,0.12)"/>
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="6" fill="#fff" stroke="#D4D9DF" strokeWidth="1"/>
      <text x={boxX + 10} y={boxY + 14} fontSize="10" fontWeight="800"
            fill="#667281" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</text>
      <line x1={boxX + 10} x2={boxX + boxW - 10} y1={boxY + headerH} y2={boxY + headerH} stroke="#EEF0F2" strokeWidth="1"/>
      {/* Total row */}
      <circle cx={boxX + 14} cy={row(0) - 3} r="3.2" fill="#002C4D"/>
      <text x={boxX + 24} y={row(0)} fontSize="11" fill="#002C4D" fontWeight="700">Total</text>
      <text x={boxX + boxW - 10} y={row(0)} fontSize="13" textAnchor="end" fontWeight="800" fill="#002C4D">{total}</text>
      {/* Native row */}
      <circle cx={boxX + 14} cy={row(1) - 3} r="3.2" fill="#6BA43A"/>
      <text x={boxX + 24} y={row(1)} fontSize="11" fill="#475260">Native</text>
      <text x={boxX + boxW - 10} y={row(1)} fontSize="12" textAnchor="end" fontWeight="700" fill="#6BA43A">{native}</text>
      {/* Pest row */}
      <circle cx={boxX + 14} cy={row(2) - 3} r="3.2" fill="#E07A1A"/>
      <text x={boxX + 24} y={row(2)} fontSize="11" fill="#475260">Pest</text>
      <text x={boxX + boxW - 10} y={row(2)} fontSize="12" textAnchor="end" fontWeight="700" fill="#E07A1A">{pest}</text>
      {prevTotal != null && (
        <>
          <line x1={boxX + 10} x2={boxX + boxW - 10} y1={row(2) + 5} y2={row(2) + 5} stroke="#EEF0F2" strokeWidth="1"/>
          <text x={boxX + 14} y={row(3)} fontSize="10" fill="#8A95A2">Last year</text>
          <text x={boxX + boxW - 10} y={row(3)} fontSize="11" textAnchor="end" fontWeight="700" fill="#8A95A2">{prevTotal}</text>
        </>
      )}
    </g>
  );
}

function CleanBarChart({ native, pest, nativePrev, pestPrev, labels, cfg, showLastYear, hoveredRange, todayIdx }) {
  const { w, h, padL, padR, padT, padB } = chartBox();
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = native.length;
  const totals = native.map((nv, i) => nv + pest[i]);
  const totalsPrev = nativePrev.map((nv, i) => nv + pestPrev[i]);
  const allVals = [...totals, ...(showLastYear ? totalsPrev : [])];
  const maxVal = Math.max(...allVals, THRESHOLD * 1.35);
  const Y = v => padT + (1 - v / maxVal) * plotH;
  const threshY = Y(THRESHOLD);
  const groupW = plotW / n;
  const barW = Math.min(30, groupW * 0.6);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', fontFamily: 'inherit' }}>
      <HoveredBand range={hoveredRange} n={n} padL={padL} plotW={plotW} padT={padT} plotH={plotH}/>
      <line x1={padL} x2={padL + plotW} y1={padT + plotH} y2={padT + plotH} stroke="#E5E8EC" strokeWidth="1"/>
      {[0, Math.round(maxVal * 0.5), Math.round(maxVal)].map(t => (
        <text key={t} x={padL - 6} y={Y(t) + 3} textAnchor="end" fontSize="9" fill="#8A95A2">{t}</text>
      ))}
      <line x1={padL} x2={padL + plotW} y1={threshY} y2={threshY} stroke={C_THRESH} strokeWidth="1.2" strokeDasharray="4,4"/>
      <text x={padL + plotW + 4} y={threshY + 3} fontSize="9" fill={C_THRESH} fontWeight="700">{THRESHOLD}</text>

      {todayIdx != null && (
        <g pointerEvents="none">
          <line x1={padL + groupW * (todayIdx + 0.5)} x2={padL + groupW * (todayIdx + 0.5)} y1={padT} y2={padT + plotH} stroke="#B4BCC6" strokeWidth="1" strokeDasharray="2,3"/>
          <text x={padL + groupW * (todayIdx + 0.5)} y={padT - 3} textAnchor="middle" fontSize="8" fill="#8A95A2" fontWeight="700" letterSpacing="0.08em">TODAY</text>
        </g>
      )}

      {native.map((nv, i) => {
        const cx = padL + groupW * (i + 0.5);
        const x0 = cx - barW / 2;
        const pv = pest[i];
        const t  = nv + pv;
        const nH = Y(0) - Y(nv);
        const pH = Y(0) - Y(pv);
        const breach = t >= THRESHOLD;
        const prevT = totalsPrev[i];
        return (
          <g key={i}>
            <rect x={x0} y={Y(nv)} width={barW} height={nH} fill={C_NATIVE} opacity={breach ? 1 : 0.85}/>
            <rect x={x0} y={Y(nv + pv)} width={barW} height={pH} fill={C_PEST} opacity={breach ? 1 : 0.85}/>
            {/* Double-encode threshold crossings: tone alone is sub-visible
                on high-contrast displays, so cap each over-threshold bar with
                a red tick. Reads as a distinct event marker without colliding
                with the numeric value label that sits just above. */}
            {breach && (
              <rect x={x0} y={Y(t) - 3} width={barW} height={2.5} fill="#E04A2F"/>
            )}
            <text x={cx} y={Y(t) - 7} textAnchor="middle" fontSize="9" fill="#475260" fontWeight="700">{t}</text>
            {showLastYear && (
              <line
                x1={x0 - 2} x2={x0 + barW + 2}
                y1={Y(prevT)} y2={Y(prevT)}
                stroke="#8A95A2" strokeWidth="1.2" strokeDasharray="2,2"
              />
            )}
            <text x={cx} y={h - padB + 16} textAnchor="middle" fontSize="9" fill="#667281">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ChartLegendSimple() {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 10, alignItems: 'center', color: '#475260', flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke="#002C4D" strokeWidth="2.4"/></svg>
        <b style={{ color: '#002C4D' }}>Total</b>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={C_NATIVE} strokeWidth="1.5" opacity="0.7"/></svg>
        <b style={{ color: C_NATIVE }}>Native</b>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={C_PEST} strokeWidth="1.5" opacity="0.7"/></svg>
        <b style={{ color: C_PEST }}>Pest</b>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8A95A2' }}>
        <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke="#8A95A2" strokeWidth="1" strokeDasharray="2,2"/></svg>
        Last year total
      </span>
    </div>
  );
}
