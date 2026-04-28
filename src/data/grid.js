// SEQ Water Grid regional dataset.
//
// This file backs the Regional view, which is framed against SEQ Digital Plan
// Foundation 1 (Common Data Environment) priorities 1.1 and 1.6:
//
//   1.1 Progress an SEQ Common Data Environment (CDE) — indicators track how
//       many councils / agencies are onboarded, how many priority datasets
//       are integrated, and how many cross-agency collaborations the CDE
//       has enabled.
//
//   1.6 Waterway Intelligence — region-wide capability to monitor, analyse
//       and proactively manage catchment health. Uses satellite imagery,
//       LiDAR and machine learning for pattern recognition and early
//       detection of erosion, sedimentation and water quality risks.
//
// All numbers below are illustrative dummy data. Ranges are hand-shaped to
// plausible magnitudes drawn from Seqwater and SEQ City Deal public material.

// Geographic coordinates (lat/lng) used by the Regional map's MapLibre view.
// Values are approximate SEQ dam locations — accurate enough for a locator
// view, but double-check against Seqwater's authoritative GIS layer before
// any production use. The original `x`/`y` pair is a percentage offset on
// the static SEQ map image used by the legacy rendering path.
export const GRID_DAMS = [
  {
    id: 'wivenhoe', name: 'Wivenhoe Dam', lake: 'Lake Wivenhoe',
    council: 'Somerset Regional', capacity_ML: 1165000, gated: true, onGrid: true,
    x: 48, y: 56, lat: -27.3953, lng: 152.6075,
    chi: 74, tone: 'warn',
    level: { v: '72%', tone: 'good' },
    rainfall7d: { v: '28 mm', tone: 'good' },
    turbidity: { v: 'Elevated', tone: 'warn' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Weekly', tone: 'good' },
    fishProgram: null,
    embankmentAI: { v: '3 risk sites', tone: 'warn' },
    sharedWith: ['Urban Utilities', 'QLD DRDMW', 'Brisbane CoC'],
  },
  {
    id: 'somerset', name: 'Somerset Dam', lake: 'Lake Somerset',
    council: 'Somerset Regional', capacity_ML: 380000, gated: true, onGrid: true,
    x: 50, y: 40, lat: -27.1028, lng: 152.5467,
    chi: 71, tone: 'warn',
    level: { v: '68%', tone: 'good' },
    rainfall7d: { v: '31 mm', tone: 'good' },
    turbidity: { v: 'Elevated', tone: 'warn' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Weekly', tone: 'good' },
    fishProgram: null,
    embankmentAI: { v: '1 risk site', tone: 'good' },
    sharedWith: ['Urban Utilities', 'QLD DRDMW'],
  },
  {
    id: 'northpine', name: 'North Pine Dam', lake: 'Lake Samsonvale',
    council: 'City of Moreton Bay', capacity_ML: 215000, gated: true, onGrid: true,
    x: 66, y: 48, lat: -27.2897, lng: 152.9461,
    chi: 62, tone: 'warn',
    driver: 'Level at rFSL · turbidity on watch',
    level: { v: '54% (rFSL)', tone: 'warn' },
    rainfall7d: { v: '22 mm', tone: 'good' },
    turbidity: { v: 'Watch', tone: 'warn' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Fortnightly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater', 'Urban Utilities'],
  },
  {
    id: 'hinze', name: 'Hinze Dam', lake: 'Advancetown Lake',
    council: 'City of Gold Coast', capacity_ML: 310500, gated: false, onGrid: true,
    x: 78, y: 86, lat: -28.0633, lng: 153.2903,
    chi: 81, tone: 'good',
    level: { v: '85.2%', tone: 'good' },
    rainfall7d: { v: '12 mm', tone: 'good' },
    turbidity: { v: 'Normal', tone: 'good' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Daily', tone: 'good' },
    fishProgram: { v: '107 fish · 50 threshold', tone: 'alert' },
    embankmentAI: { v: '0 risk sites', tone: 'good' },
    sharedWith: ['Gold Coast CoC', 'Healthy Land & Water'],
  },
  {
    id: 'baroon', name: 'Baroon Pocket Dam', lake: 'Lake Baroon',
    council: 'Sunshine Coast', capacity_ML: 61000, gated: false, onGrid: true,
    x: 58, y: 22, lat: -26.7486, lng: 152.8672,
    chi: 78, tone: 'good',
    level: { v: '91%', tone: 'good' },
    rainfall7d: { v: '44 mm', tone: 'good' },
    turbidity: { v: 'Normal', tone: 'good' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Weekly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater', 'Sunshine Coast Council'],
  },
  {
    id: 'leslie', name: 'Leslie Harrison Dam', lake: 'Tingalpa Reservoir',
    council: 'Redland City', capacity_ML: 24868, gated: false, onGrid: true,
    x: 80, y: 62, lat: -27.5772, lng: 153.2467,
    chi: 59, tone: 'alert',
    driver: 'Algae precursor · ranger survey monthly',
    level: { v: '46%', tone: 'warn' },
    rainfall7d: { v: '8 mm', tone: 'warn' },
    turbidity: { v: 'Algae precursor', tone: 'alert' },
    microPollutant: { v: 'Within ADWG', tone: 'good' },
    rangerSurveys: { v: 'Monthly', tone: 'warn' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Redland CoC'],
  },
  {
    id: 'ewen', name: 'Ewen Maddock Dam', lake: null,
    council: 'Sunshine Coast', capacity_ML: 16578, gated: false, onGrid: true,
    x: 64, y: 26, lat: -26.7772, lng: 153.0267,
    chi: 76, tone: 'good',
    level: { v: '88%', tone: 'good' },
    rainfall7d: { v: '41 mm', tone: 'good' },
    turbidity: { v: 'Normal', tone: 'good' },
    microPollutant: null,
    rangerSurveys: { v: 'Monthly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater', 'Sunshine Coast Council'],
  },
  {
    id: 'coolool', name: 'Cooloolabin Dam', lake: 'Lake Cooloolabin',
    council: 'Sunshine Coast', capacity_ML: 13800, gated: false, onGrid: true,
    x: 60, y: 12, lat: -26.6214, lng: 152.9522,
    chi: 80, tone: 'good',
    level: { v: '93%', tone: 'good' },
    rainfall7d: { v: '39 mm', tone: 'good' },
    turbidity: { v: 'Normal', tone: 'good' },
    microPollutant: null,
    rangerSurveys: { v: 'Monthly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater'],
  },
  {
    id: 'sideling', name: 'Sideling Creek Dam', lake: 'Lake Kurwongbah',
    council: 'City of Moreton Bay', capacity_ML: 13800, gated: false, onGrid: true,
    x: 66, y: 43, lat: -27.2817, lng: 152.9742,
    chi: 67, tone: 'warn',
    level: { v: '71%', tone: 'good' },
    rainfall7d: { v: '19 mm', tone: 'good' },
    turbidity: { v: 'Watch', tone: 'warn' },
    microPollutant: null,
    rangerSurveys: null,
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater'],
  },
  {
    id: 'macdonald', name: 'Lake Macdonald', lake: 'Six Mile Creek Dam',
    council: 'Noosa', capacity_ML: 8018, gated: false, onGrid: true,
    x: 58, y: 6, lat: -26.4122, lng: 152.9097,
    chi: 64, tone: 'warn',
    driver: 'Construction-affected turbidity',
    level: { v: '62% (works)', tone: 'warn' },
    rainfall7d: { v: '36 mm', tone: 'good' },
    turbidity: { v: 'Construction-affected', tone: 'warn' },
    microPollutant: null,
    rangerSurveys: { v: 'Daily (works)', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater', 'Noosa Council'],
  },
  {
    id: 'littlenerang', name: 'Little Nerang Dam', lake: null,
    council: 'City of Gold Coast', capacity_ML: 6705, gated: false, onGrid: true,
    x: 74, y: 90, lat: -28.1417, lng: 153.2764,
    chi: 82, tone: 'good',
    level: { v: '96%', tone: 'good' },
    rainfall7d: { v: '14 mm', tone: 'good' },
    turbidity: { v: 'Normal', tone: 'good' },
    microPollutant: null,
    rangerSurveys: { v: 'Monthly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Gold Coast CoC'],
  },
  {
    id: 'wappa', name: 'Wappa Dam', lake: null,
    council: 'Sunshine Coast', capacity_ML: 4694, gated: false, onGrid: true,
    x: 62, y: 16, lat: -26.6467, lng: 152.9906,
    chi: 72, tone: 'warn',
    level: { v: '79%', tone: 'good' },
    rainfall7d: { v: '42 mm', tone: 'good' },
    turbidity: { v: 'Watch', tone: 'warn' },
    microPollutant: null,
    rangerSurveys: { v: 'Monthly', tone: 'good' },
    fishProgram: null,
    embankmentAI: null,
    sharedWith: ['Unitywater'],
  },
];

export const OFF_GRID_DAMS = [
  { id: 'wyaralong', name: 'Wyaralong Dam', x: 54, y: 78, council: 'Scenic Rim' },
  { id: 'moogerah',  name: 'Moogerah Dam',  x: 46, y: 76, council: 'Scenic Rim' },
  { id: 'maroon',    name: 'Maroon Dam',    x: 50, y: 84, council: 'Scenic Rim' },
  { id: 'borumba',   name: 'Borumba Dam',   x: 44, y: 6,  council: 'Gympie' },
  { id: 'atkinson',  name: 'Atkinson Dam',  x: 32, y: 56, council: 'Lockyer Valley' },
  { id: 'clarendon', name: 'Clarendon Dam', x: 38, y: 60, council: 'Lockyer Valley' },
  { id: 'manchester',name: 'Lake Manchester', x: 46, y: 60, council: 'Brisbane CoC' },
  { id: 'enoggera',  name: 'Enoggera Dam',  x: 56, y: 60, council: 'Brisbane CoC' },
];

// ------------------------------------------------------------------------
// Priority 1.6 — Waterway Intelligence: AI-detected cross-site patterns.
// These are what the ML pattern-recognition layer surfaces from the
// integrated catchment datasets.
// ------------------------------------------------------------------------
export const REGIONAL_PATTERNS = [
  {
    kind: 'alert', shape: 'upward-shift',
    headline: '3 dams · algae precursor conditions',
    detail: 'Elevated chlorophyll-a + declining DO detected at Leslie Harrison, Sideling Creek and Wappa. Pattern matches Nov 2023 bloom precursor (14 days out).',
    method: 'IoT water-quality sensors + ML time-series model',
    sites: ['leslie', 'sideling', 'wappa'],
  },
  {
    kind: 'warn', shape: 'systematic',
    headline: 'Turbidity co-elevation · Wivenhoe ↔ Somerset',
    detail: 'Post-rainfall turbidity spike correlated across both storages (r=0.87). Mt Crosby WTP inlet flagged for operational awareness.',
    method: 'Rainfall + turbidity telemetry · cross-correlation',
    sites: ['wivenhoe', 'somerset'],
  },
  {
    kind: 'warn', shape: 'downward-trend',
    headline: 'Sunshine Coast cluster · YoY level decline',
    detail: 'Baroon Pocket, Ewen Maddock, Cooloolabin, Wappa, Macdonald all trending −8% to −14% vs 2024. Rainfall deficit confirmed.',
    method: 'Satellite imagery + BoM rainfall data',
    sites: ['baroon', 'ewen', 'coolool', 'wappa', 'macdonald'],
  },
  {
    kind: 'good', shape: 'normal',
    headline: 'Gold Coast cluster · stable & healthy',
    detail: 'Hinze and Little Nerang above 85%, turbidity normal, pest-fish programme running on threshold. Highest CHI cluster in the grid.',
    method: 'All monitoring dimensions · composite CHI',
    sites: ['hinze', 'littlenerang'],
  },
];

// Priority 1.6 — AI-identified high-risk embankment sites. Seeded from
// satellite + LiDAR + ML pattern recognition per the plan text.
export const EMBANKMENT_RISKS = [
  { siteId: 'wiv-e-07', damId: 'wivenhoe',  km: 12.4, risk: 'High',   driver: 'Erosion scarp widening 1.8 m since Jan',   method: 'Satellite + LiDAR' },
  { siteId: 'wiv-e-11', damId: 'wivenhoe',  km: 4.1,  risk: 'Medium', driver: 'Sediment plume recurring post-rain',        method: 'Satellite imagery' },
  { siteId: 'wiv-e-14', damId: 'wivenhoe',  km: 22.7, risk: 'Medium', driver: 'Gully progression detected in LiDAR delta', method: 'LiDAR Δ' },
  { siteId: 'som-e-03', damId: 'somerset',  km: 6.2,  risk: 'Medium', driver: 'Vegetation loss on south bank',             method: 'Satellite imagery' },
  { siteId: 'npi-e-02', damId: 'northpine', km: 2.9,  risk: 'Low',    driver: 'Minor slumping flagged for watch',          method: 'LiDAR Δ' },
];

// ------------------------------------------------------------------------
// Priority 1.1 — Common Data Environment: onboarding + dataset uptake.
// These reflect the CDE indicators listed in the plan:
//   - Councils & agencies onboarded
//   - Priority datasets integrated
//   - Cross-agency collaborations
//   - New services / applications using CDE data
// ------------------------------------------------------------------------
export const CDE_STATUS = {
  councilsOnboarded:      8,
  councilsTotal:          12,
  agenciesOnboarded:      5,   // e.g. Seqwater, QLD DRDMW, Urban Utilities, Unitywater, Healthy Land & Water
  agenciesTotal:          9,
  datasetsIntegrated:     14,
  datasetsPrioritised:    22,
  collabsActive:          19,   // cross-agency data-sharing MoUs live
  servicesUsingCDE:       6,    // e.g. flood dashboard, road-safety tool, fish programme
  startupsEngaged:        11,
  priority16Target:       'FY27',
};

export const PRIORITY_DATASETS = [
  // Category ids map to SEQ Digital Plan p.26 "Priority regional datasets".
  { cat: 'Environment & water', name: 'Catchment & water quality',        status: 'integrated',  contributors: 5 },
  { cat: 'Environment & water', name: 'Hydrological & rainfall',          status: 'integrated',  contributors: 4 },
  { cat: 'Environment & water', name: 'Environmental sensor & LiDAR',     status: 'integrated',  contributors: 3 },
  { cat: 'Environment & water', name: 'Soil, erosion & sediment control', status: 'partial',     contributors: 2 },
  { cat: 'Weather & disaster',  name: 'Flood & inundation mapping',        status: 'integrated',  contributors: 4 },
  { cat: 'Weather & disaster',  name: 'Satellite imagery feed',            status: 'integrated',  contributors: 2 },
  { cat: 'Weather & disaster',  name: 'Disaster response & recovery',      status: 'partial',     contributors: 3 },
  { cat: 'Weather & disaster',  name: 'Sandbag locations (real-time)',     status: 'planned',     contributors: 0 },
  { cat: 'Infrastructure',      name: 'Asset condition & maintenance',     status: 'partial',     contributors: 3 },
  { cat: 'Infrastructure',      name: 'Capital works & investment pipeline', status: 'partial',   contributors: 2 },
  { cat: 'Transport & mobility',name: 'Traffic flow & congestion',         status: 'integrated',  contributors: 3 },
  { cat: 'Transport & mobility',name: 'Road safety & incident',            status: 'integrated',  contributors: 2 },
  { cat: 'Housing & planning',  name: 'Machine-readable planning rules',   status: 'partial',     contributors: 4 },
  { cat: 'Housing & planning',  name: '3D cadastre',                       status: 'planned',     contributors: 0 },
];

// Agencies that have signed a data-sharing MoU and publish to the CDE.
export const CDE_PARTNERS = [
  { name: 'Seqwater',             role: 'Catchment & dam-ops data (lead)' },
  { name: 'QLD DRDMW',            role: 'Water resource + rainfall' },
  { name: 'Urban Utilities',      role: 'Drinking water quality' },
  { name: 'Unitywater',           role: 'Sunshine Coast & Moreton Bay utilities' },
  { name: 'Healthy Land & Water', role: 'Report-card & ecological data' },
  { name: 'Brisbane CoC',         role: 'Urban waterway + stormwater' },
  { name: 'Gold Coast CoC',       role: 'Coastal catchment + recreation' },
  { name: 'Sunshine Coast Council', role: 'Catchment land-use' },
  { name: 'City of Moreton Bay',  role: 'North Pine catchment data' },
  { name: 'Redland CoC',          role: 'Tingalpa + Leslie Harrison' },
  { name: 'Noosa Council',        role: 'Six Mile / Lake Macdonald' },
  { name: 'Somerset Regional',    role: 'Wivenhoe + Somerset catchment' },
  { name: 'Scenic Rim Regional',  role: 'Wyaralong + Moogerah + Maroon' },
];

// Downstream services / apps built on the CDE. Indicator for Priority 1.1.
export const CDE_SERVICES = [
  { name: 'SEQ Flood & inundation dashboard',   consumer: 'QFES + councils',          status: 'live' },
  { name: 'Regional road-safety AI tool',        consumer: 'DTMR',                     status: 'live' },
  { name: 'Hinze fish-programme monitor',        consumer: 'Seqwater ops',             status: 'live' },
  { name: 'Waterway Intelligence pattern feed',  consumer: 'Seqwater + Healthy Land & Water', status: 'live' },
  { name: 'Housing approvals accelerator (pilot)', consumer: 'Brisbane CoC',           status: 'pilot' },
  { name: 'Brisbane 2032 venues planning',       consumer: 'Games Independent Infrastructure Co-ord.', status: 'pilot' },
];

// Monitoring coverage across the 12 grid dams (used by the coverage matrix).
export const COVERAGE = {
  totalReferableDams: 25,
  gridDams: 12,
  fullyInstrumented: 9,
  partiallyInstrumented: 3,
  aiEmbankment: 2,
  fishProgramme: 1,
  priority16Target: 'FY27',
};
