// Public-facing Customer view data for Hinze Dam.
//
// Framing: this is what Seqwater publishes to the community under the
// SEQ Digital Plan's right-to-information and Customer outcomes
// principles — the same underlying dataset the Ranger/Operator console
// consumes, re-presented in plain English for citizens.
//
// Every value below is illustrative. Ranges are plausible for Hinze
// Dam / Advancetown Lake on the Gold Coast hinterland, drawn from
// public SEQ material. Photos point at Wikimedia Commons thumbs so
// the demo works without bundling additional image assets.

export const DAM_FACTS = {
  name: 'Hinze Dam',
  lake: 'Advancetown Lake',
  council: 'City of Gold Coast',
  location: 'Gold Coast hinterland · Nerang River',
  capacity_ML: 310500,
  currentVolume_ML: 264546,
  currentPercent: 85.2,
  commissioned: 1976,
  firstRaised: 1989,
  lastRaised: 2011,
  services_peoplek: 270,
  // Hero image — the actual photo Seqwater uses on their own Hinze Dam
  // page, cached locally in public/assets/wildlife/ so the demo works
  // without a live cross-origin fetch.
  photo: '/assets/wildlife/hinze-dam.jpg',
  photoFallback: '/assets/hinze-pond-hero.png',
  // Lead paragraph lifted verbatim from seqwater.com.au/dams/hinze so
  // the tone and wording feel authentically Seqwater.
  lead: 'Hinze Dam is located in the Gold Coast hinterland. Built across the Nerang River, it was originally constructed in 1976, raised in 1989 and significantly upgraded in 2011.',
};

// Water quality metrics the public cares about. Each carries a plain
// label, a value, a short human explanation, and a tone used to style
// the status pill.
export const WATER_METRICS = [
  {
    key: 'level',
    label: 'Dam level',
    value: '85.2%',
    unit: 'full',
    tone: 'good',
    note: 'Within the normal operating range for autumn.',
    detail: '264,546 ML of 310,500 ML full supply.',
  },
  {
    key: 'turbidity',
    label: 'Turbidity',
    value: '3.2',
    unit: 'NTU',
    tone: 'good',
    note: 'Clear water — typical of a stable autumn inflow.',
    detail: 'Measured at the intake tower. Guideline: below 5 NTU.',
  },
  {
    key: 'ph',
    label: 'pH',
    value: '7.3',
    unit: '',
    tone: 'good',
    note: 'Neutral, well within ADWG guideline (6.5 – 8.5).',
    detail: 'Weekly composite sample, surface layer.',
  },
  {
    key: 'temp',
    label: 'Water temperature',
    value: '22.4',
    unit: '°C',
    tone: 'good',
    note: 'Seasonal average for April on the Gold Coast.',
    detail: 'Surface layer · 14-day rolling mean.',
  },
  {
    key: 'do',
    label: 'Dissolved oxygen',
    value: '8.1',
    unit: 'mg/L',
    tone: 'good',
    note: 'Healthy — supports native fish and invertebrates.',
    detail: 'Measured 1 m below surface, 08:00 reading.',
  },
  {
    key: 'rainfall',
    label: 'Rainfall (7 day)',
    value: '12',
    unit: 'mm',
    tone: 'good',
    note: 'Light shower activity; catchment response nominal.',
    detail: 'Gauge at Advancetown · Bureau of Meteorology feed.',
  },
];

export const SAFETY_NOTICES = [
  {
    kind: 'info',
    title: 'Catchment open to visitors',
    body: 'Picnic areas, walking tracks and the lookout are open 6 AM – 6 PM. Powered boats are not permitted on Advancetown Lake.',
  },
  {
    kind: 'info',
    title: 'No current advisories',
    body: 'Water quality results meet the Australian Drinking Water Guidelines across all monitored dimensions.',
  },
];

// Plausible SEQ native fish. Counts mirror the operator console, with
// the warning/tone fields dropped — the citizen view frames species as
// "what lives here" rather than "what we're managing". Photos are the
// same local assets the operator console uses (public/assets/fish/).
export const NATIVE_SPECIES = [
  {
    id: 'golden-perch', name: 'Golden Perch', latin: 'Macquaria ambigua',
    count: 20,
    note: 'Popular SEQ sport fish. Yellow belly; deep, compact body.',
    photo: '/assets/fish/golden-perch.jpg',
  },
  {
    id: 'eel-tailed-catfish', name: 'Eel-Tailed Catfish', latin: 'Tandanus tandanus',
    count: 14,
    note: 'Bottom-dweller with distinctive eel-like tail.',
    photo: '/assets/fish/eel-tailed-catfish.jpg',
  },
  {
    id: 'bony-bream', name: 'Bony Bream', latin: 'Nematalosa erebi',
    count: 12,
    note: 'Deep, silvery body. Shoaling species — a key food source for larger natives.',
    photo: '/assets/fish/boney-bream.jpg',
  },
  {
    id: 'australian-bass', name: 'Australian Bass', latin: 'Percalates novemaculeata',
    count: 10,
    note: 'Iconic SEQ river native. Dark olive back, prefers flowing water.',
    photo: '/assets/fish/australian-bass.jpg',
  },
  {
    id: 'spangled-perch', name: 'Spangled Perch', latin: 'Leiopotherapon unicolor',
    count: 6,
    note: 'Silvery with characteristic dark spangles on scales.',
    photo: '/assets/fish/spangled-perch.jpg',
  },
  {
    id: 'freshwater-mullet', name: 'Freshwater Mullet', latin: 'Trachystoma petardi',
    count: 4,
    note: 'Slim silver body — moves between fresh and tidal waters seasonally.',
    photo: '/assets/fish/freshwater-mullet.jpg',
  },
];

// Pest fish — framed for the citizen as "species we actively manage"
// rather than by the threshold/cadence the ranger uses.
export const PEST_NOTES = {
  native: 72,
  pest: 35,
  note: 'Pest fish (mostly Mozambique tilapia and common carp) are actively removed to protect native species. Hinze Pond is emptied on a cadence that responds to fish counts measured at the screen.',
};

// Catchment flora — riparian + aquatic plants commonly recorded on the
// Nerang River catchment that feeds Hinze Dam. `tint` drives the card
// cover gradient in CustomerView when no bundled photo is available
// (production would drop in real SEQ photography here).
// All flora photos below are cached locally (public/assets/wildlife/)
// to avoid cross-origin image blocking and Wikimedia thumbnail-
// regeneration rate-limits. Original source is Wikimedia Commons;
// resolved via the Wikipedia REST API (page summary) and downloaded
// with a Mozilla User-Agent header per Wikimedia's policy.
export const FLORA = [
  {
    name: 'River Red Gum',
    latin: 'Eucalyptus camaldulensis',
    role: 'Riparian canopy',
    tint: ['#4A7A2E', '#A8C67A'],
    note: 'Anchors streambanks, shades water, critical habitat for hollow-nesting birds and gliders.',
    photo: '/assets/wildlife/river-red-gum.jpg',
  },
  {
    name: 'Weeping Bottlebrush',
    latin: 'Melaleuca viminalis',
    role: 'Riparian shrub',
    tint: ['#8A2A2A', '#E07A7A'],
    note: 'Brilliant red flowers through spring — a major nectar source for honeyeaters and lorikeets.',
    photo: '/assets/wildlife/weeping-bottlebrush.jpg',
  },
  {
    name: 'River She-Oak',
    latin: 'Casuarina cunninghamiana',
    role: 'Riparian canopy',
    tint: ['#3D5A3D', '#7BA37B'],
    note: 'Dense root mat stabilises the bank against flood flows; drops needle-like foliage that feeds detritivores.',
    photo: '/assets/wildlife/river-she-oak.jpg',
  },
  {
    name: 'Native Water Ribbons',
    latin: 'Cycnogeton procerum',
    role: 'Submerged macrophyte',
    tint: ['#2A5A6E', '#7FC6D6'],
    note: 'Oxygenates the lake and provides cover for juvenile native fish. Indicator of clear, low-nutrient water.',
    photo: '/assets/wildlife/water-ribbons.jpg',
  },
  {
    name: 'Lomandra',
    latin: 'Lomandra longifolia',
    role: 'Understorey grass',
    tint: ['#5A6E2A', '#B4C67A'],
    note: 'Dense tussocks along the water\'s edge hold sediment in place during storm runoff.',
    photo: '/assets/wildlife/lomandra.jpg',
  },
];

// Fauna sighted in / around Advancetown Lake by ranger surveys. Mixes
// iconic SEQ species with quieter indicator species.
export const FAUNA = [
  {
    name: 'Platypus',
    latin: 'Ornithorhynchus anatinus',
    group: 'Mammal',
    sightings: 14,
    tint: ['#4A3A2A', '#A89576'],
    note: 'Year-round resident in the upper Nerang River tributaries. A living indicator of good water quality.',
    photo: '/assets/wildlife/platypus.jpg',
  },
  {
    name: 'Azure Kingfisher',
    latin: 'Ceyx azureus',
    group: 'Bird',
    sightings: 31,
    tint: ['#1A4A7A', '#7FB5E0'],
    note: 'Iridescent blue perched angler. Hunts small fish from overhanging branches.',
    photo: '/assets/wildlife/azure-kingfisher.jpg',
  },
  {
    name: 'Eastern Water Dragon',
    latin: 'Intellagama lesueurii',
    group: 'Reptile',
    sightings: 47,
    tint: ['#6E4A1A', '#C9A676'],
    note: 'A common sight on rocks and low branches at the water\'s edge. Harmless, territorial, and excellent swimmers.',
    photo: '/assets/wildlife/eastern-water-dragon.jpg',
  },
  {
    name: 'Pacific Heron',
    latin: 'Ardea pacifica',
    group: 'Bird',
    sightings: 22,
    tint: ['#2A3A5A', '#8FA3C7'],
    note: 'Standing-hunter; watches shallows for fish and frogs. Population stable year-on-year.',
    photo: '/assets/wildlife/pacific-heron.jpg',
  },
  {
    name: 'Swamp Wallaby',
    latin: 'Wallabia bicolor',
    group: 'Mammal',
    sightings: 9,
    tint: ['#5A3A1A', '#B8926C'],
    note: 'Browses the riparian understorey at dusk. A conservation success: numbers up 12% since catchment restoration began.',
    photo: '/assets/wildlife/swamp-wallaby.jpg',
  },
  {
    name: 'Whistling Kite',
    latin: 'Haliastur sphenurus',
    group: 'Bird',
    sightings: 18,
    tint: ['#6E4A2A', '#C9A576'],
    note: 'Apex scavenger — signals a food web with enough biomass to support large raptors.',
    photo: '/assets/wildlife/whistling-kite.jpg',
  },
];

export const ECOSYSTEM_STATS = {
  nativeFishSpecies: NATIVE_SPECIES.length,
  pestFishManaged: 10,
  floraRecorded: 42,
  faunaRecorded: 87,
  surveysThisQuarter: 14,
};
