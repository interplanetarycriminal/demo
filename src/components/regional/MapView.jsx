// SEQ Water Grid map — MapLibre GL with CARTO Voyager raster tiles.
//
// Plan ref: Phase D2 in the targeted-polish pass. Vector pan/zoom on a 4K
// screen reads as 2026, not 2014, which is exactly the professional lift
// the SEQ demo benefits from.
//
// Integration gotcha: this component is lazy-mounted behind a "Show map"
// toggle inside a flex card that itself only appears on the Waterway
// Intelligence tab. That chain means the container's layout box is NOT
// final at the moment the Preact `useEffect` fires. Constructing
// MapLibre against a 0-width container silently stalls the style-load
// pipeline (`isStyleLoaded` never flips to true; no error). We defer
// construction until an `IntersectionObserver` confirms the container
// is on screen with real dimensions — the cleanest fix.

import { useState, useEffect, useRef } from 'preact/hooks';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GRID_DAMS } from '../../data/grid.js';

function chiColor(tone) {
  return { good: '#9AA3AE', warn: '#E07A1A', alert: '#C8102E', info: '#1E5F8E' }[tone] || '#B4BCC6';
}

// CARTO Voyager raster style — no API key, good SEQ readability, warm
// neutrals that don't fight our warm-canvas tokens.css palette.
const BASE_STYLE = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    { id: 'carto-voyager', type: 'raster', source: 'carto-voyager', minzoom: 0, maxzoom: 20 },
  ],
};

export default function MapView({ onSelect, selectedId }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  // Inner pin elements, keyed by dam id. MapLibre sets `transform:
  // translate(...)` on the marker element every frame, so we can't apply
  // `transform: scale(...)` directly — it gets wiped. Instead the marker
  // is a 0×0 wrapper and the visual pin is an absolutely-positioned
  // child whose own `transform` we're free to animate.
  const pinsRef = useRef({});
  const [hovered, setHovered] = useState(null);
  // The detail card should only appear on *hover*. Showing it permanently
  // for the default-selected dam (Hinze) makes the map feel broken —
  // every other pin reads as un-hoverable because the card is already
  // occupying the corner.
  const activeDam = hovered ? GRID_DAMS.find(d => d.id === hovered) : null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    let disposed = false;
    let map = null;
    let ro = null;
    let io = null;

    const build = () => {
      if (disposed || mapRef.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) return;

      map = new maplibregl.Map({
        container: el,
        // Start with an empty style so the internal style machinery
        // initialises cleanly, then swap in the CARTO raster style once
        // the map is mounted. This works around a style-load stall we
        // observed when the object style is passed at construction time
        // inside a lazy-mounted flex card.
        style: { version: 8, sources: {}, layers: [] },
        center: [152.95, -27.25],
        zoom: 7.3,
        attributionControl: { compact: true },
        cooperativeGestures: false,
      });
      map.setStyle(BASE_STYLE);
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      mapRef.current = map;
      map.on('error', (e) => {
        // eslint-disable-next-line no-console
        console.error('[MapView] maplibre error', e?.error?.message || e);
      });

      const addMarkers = () => {
        if (Object.keys(markersRef.current).length > 0) return;
        for (const dam of GRID_DAMS) {
          // Wrapper is the element MapLibre positions via transform:
          // translate(...). Keep it 0×0 and untouched so our own scale
          // transform on the inner pin survives MapLibre's frame updates.
          const wrap = document.createElement('div');
          wrap.style.cssText = 'width:0;height:0;position:relative;';

          const pin = document.createElement('button');
          pin.className = 'seq-dam-pin';
          pin.type = 'button';
          pin.setAttribute('aria-label', `${dam.name} (CHI ${dam.chi})`);
          pin.style.cssText = [
            'position: absolute', 'left: -7px', 'top: -7px',
            'width: 14px', 'height: 14px', 'border-radius: 999px',
            `background: ${chiColor(dam.tone)}`,
            'border: 2px solid #fff',
            `box-shadow: 0 0 0 4px ${chiColor(dam.tone)}33, 0 1px 3px rgba(0,44,77,0.25)`,
            'cursor: pointer', 'padding: 0',
            'transform: scale(1)',
            'transform-origin: center center',
            'transition: transform 120ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 120ms',
          ].join(';');
          pin.addEventListener('mouseenter', () => { setHovered(dam.id); pin.style.transform = 'scale(1.4)'; });
          pin.addEventListener('mouseleave', () => { setHovered(null);   pin.style.transform = 'scale(1)'; });
          pin.addEventListener('click', (e) => { e.stopPropagation(); onSelect(dam); });

          wrap.appendChild(pin);
          const marker = new maplibregl.Marker({ element: wrap })
            .setLngLat([dam.lng, dam.lat])
            .addTo(map);
          markersRef.current[dam.id] = marker;
          pinsRef.current[dam.id] = pin;
        }
      };

      // Belt and braces: load AND idle both attach markers (idempotent).
      map.on('load', addMarkers);
      map.on('idle', addMarkers);

      // Kick the pipeline one more time after construction so that even
      // when the container was exactly at the IO threshold, the paint
      // loop picks up the final dimensions.
      requestAnimationFrame(() => map && !disposed && map.resize());

      // Keep map in sync with container size (window resize, tab toggle).
      ro = typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => mapRef.current?.resize())
        : null;
      if (ro) ro.observe(el);
    };

    // Poll the container until it has real dimensions, then build. A
    // single frame of waiting wasn't enough on slower paint budgets —
    // poll with back-off for up to ~1.5 s and give up gracefully if the
    // container never becomes measurable.
    let attempts = 0;
    const MAX_ATTEMPTS = 25;
    const poll = () => {
      if (disposed || mapRef.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.width >= 40 && rect.height >= 40) {
        build();
        return;
      }
      attempts++;
      if (attempts < MAX_ATTEMPTS) setTimeout(poll, 60);
    };
    poll();

    // Also wire an IntersectionObserver so, if the user scrolls the card
    // into view AFTER mount without any dimension change, we still get a
    // chance to initialise.
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        if (mapRef.current) { io?.disconnect(); return; }
        if (entries.some(e => e.isIntersecting)) {
          requestAnimationFrame(build);
        }
      }, { threshold: 0.05 });
      io.observe(el);
    }

    return () => {
      disposed = true;
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (map) map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Visually highlight the selected marker without re-rendering the map.
  // Style goes on the inner pin element (never the marker wrapper — that's
  // MapLibre's to own — or scale will fight the translate and pins will
  // snap to the top-left corner whenever we touch them).
  useEffect(() => {
    for (const [id, pin] of Object.entries(pinsRef.current)) {
      const active = id === selectedId;
      const tone = GRID_DAMS.find(d => d.id === id)?.tone;
      pin.style.boxShadow = active
        ? `0 0 0 6px ${chiColor(tone)}55, 0 2px 6px rgba(0,44,77,0.3)`
        : `0 0 0 4px ${chiColor(tone)}33, 0 1px 3px rgba(0,44,77,0.25)`;
      // Don't override transform here — hover handler owns scale. A
      // selected pin reads as "selected" via the heavier outer ring.
    }
  }, [selectedId]);

  return (
    <div style={{
      background: '#fff', borderRadius: 10, padding: 10,
      boxShadow: '0 1px 3px rgba(0,44,77,0.08)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 10, color: '#667281' }}>
          Hover a pin for detail &middot; click to select
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, color: '#667281', flexWrap: 'wrap' }}>
          <LegendSwatch color="#9AA3AE" label="Healthy (CHI ≥ 75)" />
          <LegendSwatch color="#E07A1A" label="Watch (60–74)" />
          <LegendSwatch color="#C8102E" label="Alert (< 60)" />
        </div>
      </div>

      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
        <div
          ref={containerRef}
          role="application"
          aria-label="SEQ Water Grid dam locator map"
          style={{
            width: '100%', height: 440,
            background: '#F6F7F8',
          }}
        />

        {activeDam && (
          <div style={{
            position: 'absolute', right: 16, top: 16, maxWidth: 260,
            background: '#fff', borderRadius: 12, padding: 14,
            boxShadow: '0 4px 10px rgba(0,44,77,0.12)',
            border: `1.5px solid ${chiColor(activeDam.tone)}`,
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667281', fontWeight: 700 }}>
              {activeDam.council}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#002C4D', marginTop: 2 }}>
              {activeDam.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: chiColor(activeDam.tone), lineHeight: 1 }}>
                {activeDam.chi}
              </div>
              <div style={{ fontSize: 11, color: '#667281' }}>Catchment Health Index</div>
            </div>
            <div style={{ fontSize: 11, color: '#667281', marginTop: 8 }}>
              {activeDam.capacity_ML.toLocaleString('en-AU')} ML &middot; {activeDam.gated ? 'Gated' : 'Un-gated'}
            </div>
            {activeDam.id === 'hinze' && (
              <div style={{ fontSize: 11, color: '#0095C8', marginTop: 8, fontWeight: 700 }}>
                Click to open full Hinze dashboard &rarr;
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: 11, color: '#8A95A2', marginTop: 10, fontStyle: 'italic' }}>
        Non-Seqwater and off-grid referable dams in SEQ are managed separately and not shown on this view.
      </div>
    </div>
  );
}

function LegendSwatch({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}
