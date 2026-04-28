// Inline Lucide-style icons. The Seqwater brand README specifies Lucide as
// the primary icon set and forbids unicode characters used as icons.
// We inline the handful we actually use so there's no CDN fetch and the
// icon stroke weight / rounding is consistent with the rest of the surface.
//
// Icons share these defaults: 1.75 stroke, round cap/join, currentColor
// stroke, no fill. Callers pass `size` (default 14) and optional `color`
// (defaults to currentColor, so a parent `color:` cascades).
//
// Paths taken from Lucide (lucide.dev, ISC licence) — kept 1:1 so future
// upgrades can be diff-checked.

function Svg({ size = 14, color, children, ...rest }) {
  return (
    <svg
      {...rest}
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >{children}</svg>
  );
}

export function IconFlag(props) {
  return (
    <Svg {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </Svg>
  );
}

export function IconAlertTriangle(props) {
  return (
    <Svg {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </Svg>
  );
}

export function IconAlertCircle(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </Svg>
  );
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M20 6 9 17l-5-5"/>
    </Svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </Svg>
  );
}

export function IconMinus(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14"/>
    </Svg>
  );
}

export function IconArrowUp(props) {
  return (
    <Svg {...props}>
      <path d="M12 19V5"/>
      <path d="m5 12 7-7 7 7"/>
    </Svg>
  );
}

export function IconArrowDown(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </Svg>
  );
}

export function IconArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </Svg>
  );
}

export function IconX(props) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </Svg>
  );
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6"/>
    </Svg>
  );
}
