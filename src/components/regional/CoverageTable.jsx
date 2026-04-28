// Coverage table — compact mode by default (one scannable bar per dam),
// with a fallback full-matrix view for detail.
import { useState } from 'preact/hooks';
import { Eyebrow } from '../Primitives.jsx';
import { GRID_DAMS } from '../../data/grid.js';

const DIMENSIONS = [
  { k: 'level',          short: 'LV', label: 'Level' },
  { k: 'rainfall7d',     short: 'RF', label: 'Rainfall 7d' },
  { k: 'turbidity',      short: 'TB', label: 'Turbidity' },
  { k: 'microPollutant', short: 'MP', label: 'Micro-pollutants' },
  { k: 'rangerSurveys',  short: 'RS', label: 'Ranger surveys' },
  { k: 'fishProgram',    short: 'FS', label: 'Fish programme' },
  { k: 'embankmentAI',   short: 'AI', label: 'AI embankment' },
];

function classifyCell(cell) {
  if (!cell) return 'missing';
  if (cell.tone === 'good' || cell.tone === 'info') return 'full';
  if (cell.tone === 'warn') return 'partial';
  if (cell.tone === 'alert') return 'partial-alert';
  return 'full';
}

const COV_COLOURS = {
  full:           { fill: '#6B8596', label: 'Monitored — target cadence' },
  partial:        { fill: '#E07A1A', label: 'Monitored — below target cadence' },
  'partial-alert':{ fill: '#C8102E', label: 'Monitored — flagged' },
  missing:        { fill: 'transparent', label: 'Not instrumented' },
};

export default function CoverageTable({ onSelect, selectedId }) {
  const [sortBy, setSortBy] = useState('chi');
  const [expandedId, setExpandedId] = useState(null);
  const [fullMatrix, setFullMatrix] = useState(false);

  const rows = [...GRID_DAMS].sort((a, b) => {
    if (sortBy === 'chi')      return a.chi - b.chi;
    if (sortBy === 'coverage') return coverageScore(a).covered - coverageScore(b).covered;
    if (sortBy === 'capacity') return b.capacity_ML - a.capacity_ML;
    if (sortBy === 'name')     return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      boxShadow: '0 1px 3px rgba(0,44,77,0.08)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 14, flexWrap: 'wrap', gap: 14,
      }}>
        <div>
          <Eyebrow>Monitoring coverage</Eyebrow>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#002C4D', margin: '3px 0 0', lineHeight: 1.25 }}>
            All 12 grid dams · all 7 dimensions
          </h3>
          <div style={{ fontSize: 11, color: '#667281', marginTop: 2 }}>
            Empty slots = not yet instrumented · Priority 1.6 target: FY27.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#667281' }}>Sort:</span>
          {[
            ['chi', 'By CHI'],
            ['coverage', 'By coverage'],
            ['capacity', 'By capacity'],
            ['name', 'A–Z'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setSortBy(k)} style={{
              background: sortBy === k ? '#002C4D' : '#fff',
              color: sortBy === k ? '#fff' : '#475260',
              border: '1px solid #D4D9DF',
              borderRadius: 999, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>{l}</button>
          ))}
          <button onClick={() => setFullMatrix(v => !v)} style={{
            marginLeft: 6,
            background: fullMatrix ? '#0A4C73' : '#fff',
            color: fullMatrix ? '#fff' : '#475260',
            border: '1px solid #D4D9DF',
            borderRadius: 999, padding: '4px 12px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{fullMatrix ? '◀ Compact view' : 'Full matrix ▶'}</button>
        </div>
      </div>

      {fullMatrix ? (
        <FullMatrixView rows={rows} onSelect={onSelect} selectedId={selectedId} />
      ) : (
        <>
          <div style={{
            display: 'flex', gap: 20, fontSize: 11, color: '#475260',
            padding: '6px 8px 12px', alignItems: 'center', flexWrap: 'wrap',
          }}>
            <LegendSwatchCov state="full"    label="Monitored — target cadence" />
            <LegendSwatchCov state="partial" label="Below target cadence" />
            <LegendSwatchCov state="partial-alert" label="Flagged" />
            <LegendSwatchCov state="missing" label="Not instrumented" />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 36px minmax(220px, 1fr) 80px 24px',
            gap: 12, alignItems: 'center',
            padding: '8px 10px', borderBottom: '1.5px solid #D4D9DF',
            fontSize: 10, fontWeight: 700, color: '#667281',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <div>Waterbody</div>
            <div style={{ textAlign: 'center' }}>CHI</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DIMENSIONS.length}, 1fr)`, gap: 4 }}>
              {DIMENSIONS.map(d => (
                <div key={d.k} title={d.label} style={{ textAlign: 'center', color: '#8A95A2', fontSize: 9 }}>
                  {d.short}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>Score</div>
            <div />
          </div>
          {rows.map(dam => (
            <CoverageRow
              key={dam.id}
              dam={dam}
              isSelected={dam.id === selectedId}
              isExpanded={dam.id === expandedId}
              onToggleExpand={() => {
                setExpandedId(e => e === dam.id ? null : dam.id);
                onSelect(dam);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function CoverageRow({ dam, isSelected, isExpanded, onToggleExpand }) {
  const chiCol = { good: '#9AA3AE', warn: '#E07A1A', alert: '#C8102E' }[dam.tone];
  const score = coverageScore(dam);
  return (
    <div style={{
      borderBottom: '1px solid #EEF0F2',
      background: isSelected ? '#EEF8FD' : (isExpanded ? '#F9FBFD' : 'transparent'),
    }}>
      <div
        onClick={onToggleExpand}
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 36px minmax(220px, 1fr) 80px 24px',
          gap: 12, alignItems: 'center',
          padding: '10px', cursor: 'pointer',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontWeight: 700, color: '#002C4D', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              {dam.name.replace(' Dam', '')}
              {dam.gated && <Tag>GATED</Tag>}
              {dam.id === 'hinze' && <Tag color="#00A9E0">PILOT</Tag>}
            </div>
            <div style={{ fontSize: 11, color: '#667281' }}>
              {dam.council} · {(dam.capacity_ML / 1000).toFixed(dam.capacity_ML < 100000 ? 1 : 0)}k ML
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{
            background: chiCol, color: '#fff',
            fontSize: 12, fontWeight: 800,
            padding: '3px 8px', borderRadius: 6, minWidth: 30,
            display: 'inline-block',
          }}>{dam.chi}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DIMENSIONS.length}, 1fr)`, gap: 4 }}>
          {DIMENSIONS.map(dim => {
            const state = classifyCell(dam[dim.k]);
            return <CoverageSlot key={dim.k} state={state} tooltip={`${dim.label}: ${COV_COLOURS[state].label}`} />;
          })}
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#002C4D' }}>
            {score.covered}
            <span style={{ fontSize: 11, color: '#8A95A2' }}>/{DIMENSIONS.length}</span>
          </span>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#8A95A2', transition: 'transform 120ms', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
          ▸
        </div>
      </div>

      {isExpanded && <DrillDown dam={dam} />}
    </div>
  );
}

function CoverageSlot({ state, tooltip }) {
  const col = COV_COLOURS[state];
  if (state === 'missing') {
    return (
      <div title={tooltip} style={{
        height: 22, borderRadius: 4,
        border: '1.5px dashed #D4D9DF',
        background: 'repeating-linear-gradient(45deg, #F6F7F8 0 4px, #FFF 4px 8px)',
      }} />
    );
  }
  return (
    <div title={tooltip} style={{
      height: 22, borderRadius: 4, background: col.fill,
    }} />
  );
}

function DrillDown({ dam }) {
  return (
    <div style={{
      padding: '14px 16px 18px 20px',
      background: '#F9FBFD',
      borderTop: '1px dashed #D4D9DF',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
    }}>
      {DIMENSIONS.map(dim => {
        const cell = dam[dim.k];
        const state = classifyCell(cell);
        const col = COV_COLOURS[state];
        return (
          <div key={dim.k} style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8A95A2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {dim.label}
            </div>
            {cell ? (
              <div style={{ fontSize: 13, fontWeight: 700, color: '#002C4D' }}>{cell.v}</div>
            ) : (
              <div style={{ fontSize: 12, color: '#B4BCC6', fontStyle: 'italic' }}>not instrumented</div>
            )}
            <div style={{ fontSize: 10, color: '#667281' }}>{col.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function FullMatrixView({ rows, onSelect, selectedId }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'inherit' }}>
        <thead>
          <tr style={{ background: '#F6F7F8' }}>
            <th style={thStyle('left')}>Waterbody</th>
            <th style={thStyle('center')}>CHI</th>
            {DIMENSIONS.map(d => (
              <th key={d.k} style={thStyle('center')}>{d.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(dam => (
            <tr key={dam.id}
                onClick={() => onSelect(dam)}
                style={{
                  cursor: 'pointer',
                  background: dam.id === selectedId ? '#D6F1FA' : 'transparent',
                }}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #EEF0F2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {dam.gated && <Tag>GATED</Tag>}
                  {dam.id === 'hinze' && <Tag color="#00A9E0">PILOT</Tag>}
                  <div>
                    <div style={{ fontWeight: 700, color: '#002C4D', fontSize: 13 }}>{dam.name}</div>
                    <div style={{ fontSize: 11, color: '#667281' }}>
                      {dam.council} · {(dam.capacity_ML / 1000).toFixed(dam.capacity_ML < 100000 ? 1 : 0)}k ML
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #EEF0F2', textAlign: 'center' }}>
                <span style={{
                  background: { good: '#9AA3AE', warn: '#E07A1A', alert: '#C8102E' }[dam.tone],
                  color: '#fff', fontSize: 12, fontWeight: 800,
                  padding: '3px 8px', borderRadius: 6,
                }}>{dam.chi}</span>
              </td>
              {DIMENSIONS.map(dim => <Cell key={dim.k} data={dam[dim.k]} />)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ data }) {
  if (!data) {
    return (
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #EEF0F2', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', color: '#B4BCC6', fontSize: 11, fontWeight: 700,
          border: '1px dashed #D4D9DF', borderRadius: 4, padding: '2px 8px',
        }}>not instrumented</span>
      </td>
    );
  }
  const bg = { good: '#E5F4E5', warn: '#FCEBDB', alert: '#FBE1DA', info: '#D6F1FA' }[data.tone] || '#EEF0F2';
  const fg = { good: '#2E7A2E', warn: '#B26410', alert: '#A03418', info: '#0A4C73' }[data.tone] || '#475260';
  return (
    <td style={{ padding: '10px 12px', borderBottom: '1px solid #EEF0F2', textAlign: 'center' }}>
      <span style={{
        display: 'inline-block', background: bg, color: fg,
        fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
      }}>{data.v}</span>
    </td>
  );
}

function coverageScore(dam) {
  let covered = 0;
  for (const dim of DIMENSIONS) if (dam[dim.k]) covered++;
  return { covered, total: DIMENSIONS.length };
}

function Tag({ children, color = '#002C4D' }) {
  return (
    <span style={{
      background: color, color: '#fff', fontSize: 9,
      padding: '2px 6px', borderRadius: 3, fontWeight: 700, letterSpacing: '0.04em',
    }}>{children}</span>
  );
}

function LegendSwatchCov({ state, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 16, height: 10, borderRadius: 3,
        background: state === 'missing' ? 'repeating-linear-gradient(45deg, #F6F7F8 0 3px, #FFF 3px 6px)' : COV_COLOURS[state].fill,
        border: state === 'missing' ? '1px dashed #D4D9DF' : 'none',
      }} />
      {label}
    </span>
  );
}

function thStyle(align) {
  return {
    padding: '12px', textAlign: align, fontSize: 11, fontWeight: 700,
    color: '#475260', textTransform: 'uppercase', letterSpacing: '0.08em',
    borderBottom: '1.5px solid #D4D9DF', whiteSpace: 'nowrap',
  };
}
