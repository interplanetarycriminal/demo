// Regional AI-pattern callouts — the Priority 1.6 payoff surface.
import { Eyebrow } from '../Primitives.jsx';
import { GRID_DAMS, REGIONAL_PATTERNS } from '../../data/grid.js';

function PatternCard({ pattern, onSiteClick }) {
  const cfg = {
    alert: { bar: '#C8102E', bg: '#FBE1DA', fg: '#A03418', label: 'Act' },
    warn:  { bar: '#E07A1A', bg: '#FCEBDB', fg: '#B26410', label: 'Monitor' },
    good:  { bar: '#9AA3AE', bg: '#F0F2F4', fg: '#475260', label: 'Healthy' },
  }[pattern.kind];
  return (
    <div style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,44,77,0.08)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-block', background: cfg.bg, color: cfg.fg,
            fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: 999,
          }}>{cfg.label}</span>
          {pattern.shape && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#F0F2F4', color: '#475260',
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 999,
            }}>
              <PatternGlyph shape={pattern.shape} />
              {pattern.shape.replace('-', ' ')}
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#002C4D', marginTop: 7, lineHeight: 1.3 }}>
          {pattern.headline}
        </div>
        <div style={{ fontSize: 11, color: '#475260', marginTop: 5, lineHeight: 1.5 }}>
          {pattern.detail}
        </div>
        {pattern.method && (
          <div style={{ fontSize: 10, color: '#8A95A2', marginTop: 5, fontStyle: 'italic' }}>
            Method: {pattern.method}
          </div>
        )}
      </div>
      <div style={{ padding: '7px 14px', borderTop: '1px solid #EEF0F2', background: '#F6F7F8',
                    display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: '#667281', fontWeight: 700, textTransform: 'uppercase',
                       letterSpacing: '0.08em', marginRight: 3 }}>Sites</span>
        {pattern.sites.map(id => {
          const dam = GRID_DAMS.find(d => d.id === id);
          if (!dam) return null;
          return (
            <button key={id} onClick={() => onSiteClick(dam)} style={{
              background: '#fff', border: '1px solid #D4D9DF', borderRadius: 999,
              padding: '1px 8px', fontSize: 10, fontWeight: 700, color: '#003A5D',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{dam.name.replace(' Dam','')}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function PatternsPanel({ onSiteClick }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>AI · last 14 days</Eyebrow>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#002C4D', margin: '3px 0 0', lineHeight: 1.25 }}>
            Regional patterns · cross-site signals
          </h3>
        </div>
        <span style={{
          background: '#002C4D', color: '#fff', fontSize: 9, fontWeight: 700,
          padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>Priority 1.6 · Waterway Intelligence</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {REGIONAL_PATTERNS.map((p, i) => (
          <PatternCard key={i} pattern={p} onSiteClick={onSiteClick} />
        ))}
      </div>
    </div>
  );
}

function PatternGlyph({ shape }) {
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
    <svg width={20} height={10} style={{ display: 'block' }}>
      <path d={paths[shape] || paths.normal} {...stroke} />
    </svg>
  );
}
