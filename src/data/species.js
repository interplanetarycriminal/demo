// Species list and counts for Hinze Pond.
//
// Counts philosophy (this pass):
//   Real Seqwater reporting on the Hinze fishway shows ~9,000 native fish
//   transferred upstream and ~4,000 pest fish removed across a programme
//   year — roughly a 2.25 : 1 native : pest split at the screen. Natives
//   dominate *unless* the summer tilapia / carp spawn flips the ratio
//   (Nov-Mar). The baseline on this view (20 Apr 2026, autumn) sits in the
//   native-dominant calm: ~70 native, ~35 pest, total ~105 — under the
//   150-fish threshold, so cadence is 2-3×/week, not daily. The Trends
//   view is where the summer flip is visible.
//
//   Source: https://www.seqwater.com.au/news/fishway-helps-move-more-9000-fish-hinze-dam
//
// Imagery: one photo per species under /assets/fish/<id>.jpg, pulled from
// Wikimedia Commons (CC-BY-SA / public-domain). The Seqwater ID board
// remains the reference lookup and is reachable from the Today view via
// "Show reference board".

function trail(today, min, max, seed) {
  let x = seed;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const arr = [];
  for (let i = 0; i < 13; i++) {
    arr.push(Math.max(0, Math.round(min + rnd() * (max - min))));
  }
  arr.push(today);
  return arr;
}

export const SPECIES_NATIVE = [
  { id: 'golden-perch', name: 'Golden Perch (Yellow Belly)', latin: 'Macquaria ambigua',
    count: 20, yesterday: 18, trail: trail(20, 12, 24, 67),
    tip: 'Yellow belly, deep body — SEQ favourite.',
    photo: '/assets/fish/golden-perch.jpg' },
  { id: 'eel-tailed-catfish', name: 'Eel-Tailed Catfish', latin: 'Tandanus tandanus',
    count: 14, yesterday: 12, trail: trail(14, 8, 17, 11),
    tip: 'Whiskered, eel-like tail — bottom dweller.',
    photo: '/assets/fish/eel-tailed-catfish.jpg' },
  { id: 'boney-bream', name: 'Boney Bream', latin: 'Nematalosa erebi',
    count: 12, yesterday: 11, trail: trail(12, 6, 15, 23),
    tip: 'Deep silvery body, forked tail.',
    photo: '/assets/fish/boney-bream.jpg' },
  { id: 'australian-bass', name: 'Australian Bass', latin: 'Percalates novemaculeata',
    count: 10, yesterday: 9, trail: trail(10, 5, 13, 131),
    tip: 'Dark olive back, iconic SEQ river native.',
    photo: '/assets/fish/australian-bass.jpg' },
  { id: 'spangled-perch', name: 'Spangled Perch', latin: 'Leiopotherapon unicolor',
    count: 6, yesterday: 7, trail: trail(6, 3, 9, 97),
    tip: 'Silver with black spangles on scales.',
    photo: '/assets/fish/spangled-perch.jpg' },
  { id: 'freshwater-mullet', name: 'Freshwater Mullet', latin: 'Trachystoma petardi',
    count: 4, yesterday: 4, trail: trail(4, 1, 7, 41),
    tip: 'Slim silver body, small mouth.',
    photo: '/assets/fish/freshwater-mullet.jpg' },
  { id: 'sea-mullet', name: 'Sea Mullet', latin: 'Mugil cephalus',
    count: 3, yesterday: 3, trail: trail(3, 1, 6, 83),
    tip: 'Torpedo-shaped, silver — migrates to saltwater.',
    photo: '/assets/fish/sea-mullet.jpg' },
  { id: 'saratoga', name: 'Saratoga', latin: 'Scleropages leichardti',
    count: 2, yesterday: 2, trail: trail(2, 0, 4, 71),
    tip: 'Long body, scales with pink/red spots — rare sighting.',
    photo: '/assets/fish/saratoga.jpg' },
  { id: 'bullrout', name: 'Bullrout', latin: 'Notesthes robusta',
    count: 1, yesterday: 0, trail: trail(1, 0, 2, 113),
    tip: 'Mottled brown, camouflaged against rocks.',
    warning: 'Venomous — needle-proof gloves required, use nets only.',
    photo: '/assets/fish/bullrout.jpg' },
];

export const SPECIES_PEST = [
  { id: 'mozambique-tilapia-f', name: 'Mozambique Tilapia (Female)', latin: 'Oreochromis mossambicus',
    count: 9, yesterday: 8, trail: trail(9, 5, 13, 163),
    tip: 'Mouth-broods eggs — holds clutch for 3 weeks.',
    photo: '/assets/fish/mozambique-tilapia-f.jpg' },
  { id: 'mozambique-tilapia-m', name: 'Mozambique Tilapia (Male)', latin: 'Oreochromis mossambicus',
    count: 8, yesterday: 9, trail: trail(8, 5, 12, 149),
    tip: 'Pointed continuous dorsal fin, stripes on juveniles.',
    photo: '/assets/fish/mozambique-tilapia-m.jpg' },
  { id: 'carp', name: 'Carp', latin: 'Cyprinus carpio',
    count: 7, yesterday: 6, trail: trail(7, 4, 11, 211),
    tip: 'Look for whiskers (barbels) near the mouth.',
    photo: '/assets/fish/carp.jpg' },
  { id: 'spotted-tilapia', name: 'Spotted Tilapia', latin: 'Tilapia mariae',
    count: 4, yesterday: 5, trail: trail(4, 2, 7, 181),
    tip: 'Continuous dorsal fin and stripes.',
    photo: '/assets/fish/spotted-tilapia.jpg' },
  { id: 'banded-grunter', name: 'Banded Grunter', latin: 'Amniataba percoides',
    count: 3, yesterday: 3, trail: trail(3, 1, 6, 241),
    tip: 'Look for stripes — easily confused with juvenile tilapia.',
    photo: '/assets/fish/banded-grunter.jpg' },
  { id: 'pearl-cichlid', name: 'Pearl Cichlid', latin: 'Geophagus brasiliensis',
    count: 2, yesterday: 3, trail: trail(2, 0, 4, 197),
    tip: 'Tilapia-like shape, fewer markings.',
    photo: '/assets/fish/pearl-cichlid.jpg' },
  { id: 'mirror-carp', name: 'Mirror Carp', latin: 'Cyprinus carpio',
    count: 1, yesterday: 1, trail: trail(1, 0, 3, 257),
    tip: 'Carp variant — scattered oversized scales.',
    photo: '/assets/fish/mirror-carp.jpg' },
  { id: 'goldfish', name: 'Goldfish', latin: 'Carassius auratus',
    count: 1, yesterday: 2, trail: trail(1, 0, 3, 227),
    tip: 'Like a small carp, but no whiskers.',
    photo: '/assets/fish/goldfish.jpg' },
];

// Decision threshold: at 50 fish in the pond the ranger / dam operator must
// empty the pond and transport the natives upstream that same day. Below 50
// the pond only needs emptying 2-3× per week (seasonal). This is the live
// operational rule at Hinze; the threshold drives the "Today's cadence"
// verdict on the Today view and the "over-threshold days" metric on Trends.
export const THRESHOLD = 50;
