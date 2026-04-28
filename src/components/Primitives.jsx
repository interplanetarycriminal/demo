// Shared building blocks for the Hinze Pond operator console.
// Scale targets: card padding 12-16px; radii differentiated per Seqwater brand
// README (stat=16px, content=10px); font sizes from tokens.css.
import { IconFlag, IconAlertTriangle, IconCheck, IconMinus } from './Icons.jsx';

// Card — the one true white-on-canvas card surface. Replaces inline style blocks
// so every card across the project shares radius / padding / shadow behaviour
// and the "Alignment ON" grid baseline holds. Pass `variant="stat"` for rounder
// hero/KPI cards (16px), "content" (default, 10px), or "panel" (12px) for mid
// surfaces like ranked lists.
//
// `flush` drops internal padding for callers that need to paint the whole
// surface (e.g. the pond hero with its background photo).
export function Card({ variant = 'content', flush = false, style, children, ...rest }) {
  const radius = { stat: 16, panel: 12, content: 10 }[variant] || 10;
  return (
    <div {...rest} style={{
      background: '#fff',
      borderRadius: radius,
      padding: flush ? 0 : 14,
      boxShadow: '0 1px 3px rgba(0,44,77,0.08)',
      display: 'flex', flexDirection: 'column',
      ...style,
    }}>{children}</div>
  );
}

// SectionTitle — the one h3/card-title style. 14px / 700 / navy-900, tight
// line-height. Replaces the 13-17px drift across TodayView, TrendsView,
// RegionalView.
export function SectionTitle({ children, style, ...rest }) {
  return (
    <h3 {...rest} style={{
      fontSize: 14, fontWeight: 700, color: '#002C4D',
      margin: '3px 0 0', lineHeight: 1.25, letterSpacing: '-0.005em',
      ...style,
    }}>{children}</h3>
  );
}

export function StatusPill({ tone = 'good', children, dot = true }) {
  const tones = {
    good:   { bg: '#E5F4E5', fg: '#2E7A2E' },
    warn:   { bg: '#FCEBDB', fg: '#B26410' },
    alert:  { bg: '#FBE1DA', fg: '#A03418' },
    info:   { bg: '#D6F1FA', fg: '#0A4C73' },
    neutral:{ bg: '#EEF0F2', fg: '#475260' },
  };
  const t = tones[tone] || tones.good;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: t.bg, color: t.fg,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: 999, background: t.fg }} />}
      {children}
    </span>
  );
}

export function Button({ variant = 'primary', size = 'md', children, onClick, style, ...rest }) {
  const variants = {
    primary:   { bg: '#00A9E0', fg: '#fff', bd: 'transparent' },
    navy:      { bg: '#003A5D', fg: '#fff', bd: 'transparent' },
    outline:   { bg: '#fff',   fg: '#0095C8', bd: '#00A9E0' },
    ghost:     { bg: 'transparent', fg: '#003A5D', bd: 'transparent' },
    emergency: { bg: '#C8102E', fg: '#fff', bd: 'transparent', caps: true },
    accent:    { bg: 'linear-gradient(90deg,#E04A2F,#E98320)', fg: '#fff', bd: 'transparent' },
  };
  const v = variants[variant] || variants.primary;
  const pads = { sm: '5px 12px', md: '7px 16px', lg: '10px 22px' };
  const fs   = { sm: 11,        md: 12,         lg: 13         };
  return (
    <button onClick={onClick} {...rest} style={{
      background: v.bg, color: v.fg,
      border: v.bd === 'transparent' ? 'none' : `1.5px solid ${v.bd}`,
      borderRadius: 999, padding: pads[size],
      fontWeight: 700, fontSize: fs[size], fontFamily: 'inherit',
      letterSpacing: v.caps ? 0.08 : 0,
      textTransform: v.caps ? 'uppercase' : 'none',
      cursor: 'pointer', transition: 'all 120ms',
      ...style,
    }}>{children}</button>
  );
}

export function StatCard({ label, value, unit, pill, pillTone = 'good', icon, accent }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      boxShadow: '0 1px 3px rgba(0,44,77,0.08)',
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      {icon && (
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: accent || '#D6F1FA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{icon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: '#667281', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'}}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#002C4D', lineHeight: 1 }}>{value}</div>
          {unit && <div style={{ fontSize: 12, color: '#667281', fontWeight: 600 }}>{unit}</div>}
        </div>
        {pill && <div style={{ marginTop: 6 }}><StatusPill tone={pillTone}>{pill}</StatusPill></div>}
      </div>
    </div>
  );
}

export function SensorPin({ x, y, label, reading, tone = 'good', align = 'right' }) {
  const dotColor = { good: '#6BA43A', warn: '#E98320', alert: '#C8102E', info: '#00A9E0' }[tone];
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
      display: 'flex', alignItems: 'center', gap: 8,
      flexDirection: align === 'left' ? 'row-reverse' : 'row',
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: 999, background: dotColor,
        boxShadow: `0 0 0 4px ${dotColor}40, 0 1px 2px rgba(0,0,0,0.2)`,
        flexShrink: 0,
      }} />
      <div style={{
        background: '#fff', borderRadius: 999, padding: '4px 10px',
        boxShadow: '0 2px 6px rgba(0,44,77,0.18)',
        fontSize: 11, color: '#002C4D', whiteSpace: 'nowrap',
      }}>
        <b>{label}</b>
        {reading && <span style={{ color: '#667281', marginLeft: 6 }}>{reading}</span>}
      </div>
    </div>
  );
}

export function ActionRow({ tone = 'alert', children }) {
  const cfg = {
    alert:   { bg: '#FBE1DA', fg: '#C8102E', Icon: IconAlertTriangle },
    warn:    { bg: '#FCEBDB', fg: '#B26410', Icon: IconAlertTriangle },
    good:    { bg: '#E5F4E5', fg: '#2E7A2E', Icon: IconCheck },
    neutral: { bg: '#EEF0F2', fg: '#667281', Icon: IconMinus },
  }[tone];
  const { Icon } = cfg;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #EEF0F2' }}>
      <span style={{
        width: 20, height: 20, borderRadius: 999, background: cfg.bg, color: cfg.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>
        <Icon size={12} color={cfg.fg} />
      </span>
      <div style={{ fontSize: 12, color: '#003A5D', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export function DamLevelBar({ percent = 85.2, label = 'Hinze Dam · Current volume', full = '379,849 ML', status = 'Stable' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 1px 3px rgba(0,44,77,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 12, color: '#667281', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 18, color: '#002C4D', fontWeight: 700 }}>
          {percent}<span style={{ fontSize: 11, color: '#667281', fontWeight: 600 }}> %</span>
        </div>
      </div>
      <div style={{ height: 10, background: '#EEF0F2', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
        <div style={{
          width: `${percent}%`, height: '100%',
          background: 'linear-gradient(90deg,#00A9E0,#2DBEEB)',
          borderRadius: 999, transition: 'width 600ms ease-out',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#667281', marginTop: 5 }}>
        <span>0 ML</span>
        <span style={{ color: '#2E7A2E', fontWeight: 700 }}>● {status}</span>
        <span>{full}</span>
      </div>
    </div>
  );
}

export function Eyebrow({ children }) {
  return <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#667281', lineHeight: 1.4 }}>{children}</div>;
}

// Sparkline — compact trend line. Used on both Today (per-species + BAN) and
// Trends (per-pattern). Keeps a single implementation in one place.
export function Sparkline({ data, w = 120, h = 24, color = '#475260', threshold, thresholdColor = 'rgba(71,82,96,0.45)', strokeWidth = 1.6 }) {
  if (!data || data.length < 2) return null;
  const min = 0;
  const max = Math.max(...data, threshold || 0);
  const X = i => (i / (data.length - 1)) * w;
  const Y = v => h - ((v - min) / Math.max(1, max - min)) * h;
  const d = data.map((v, i) => (i ? 'L' : 'M') + X(i) + ',' + Y(v)).join(' ');
  const area = d + ` L${X(data.length-1)},${h} L${X(0)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
      {threshold != null && (
        <line x1="0" x2={w} y1={Y(threshold)} y2={Y(threshold)} stroke={thresholdColor} strokeWidth="1" strokeDasharray="2,2" />
      )}
      <path d={area} fill={color} opacity="0.18" />
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(data.length-1)} cy={Y(data[data.length-1])} r="2.2" fill={color} />
    </svg>
  );
}

// Rule 6.2 (original DesignRules.txt feedback loop) — every visualisation has
// a lightweight "Flag data issue" path. PoC just prompts + alerts; in prod
// this hits a tickets backend (Linear, ServiceNow, etc.).
export function FlagIssueButton({ subject, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => {
        const note = window.prompt(`Flag data issue for "${subject}"\n\nWhat looks wrong? (sent to data ops)`);
        if (note && note.trim()) {
          window.alert('Thanks — flagged to data ops. (PoC: no backend wired.)');
        }
      }}
      style={{
        background: '#fff', border: '1px solid #D4D9DF',
        borderRadius: 999, padding: compact ? '4px 10px' : '5px 12px',
        fontSize: 11, fontWeight: 600, color: '#475260',
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
      <IconFlag size={12} />
      {compact ? 'Flag' : 'Flag data issue'}
    </button>
  );
}
