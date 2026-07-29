const regionDefinitions = [
  {
    id: 'western',
    title: 'Western Armenia',
    armenianTitle: 'Արևմտյան Հայաստան',
    subtitle: 'Historic provinces, cities, monasteries and cultural landscapes',
    description: 'A period-aware historical atlas of Armenian places and heritage sites across the Armenian Highlands. Historical names are shown separately from present-day administrative geography.',
  },
  {
    id: 'eastern',
    title: 'Eastern Armenia',
    armenianTitle: 'Արևելյան Հայաստան',
    subtitle: 'Regions, settlements, monuments and living cultural heritage',
    description: 'Explore major historical settlements, monasteries and cultural regions east of the traditional Western Armenian provinces, with clear period labels and source status.',
  },
];

const periodDefinitions = [
  { id: 'ancient', title: 'Ancient', range: 'Before 301', startYear: -9000, endYear: 300, accent: 'bronze' },
  { id: 'medieval', title: 'Medieval', range: '301–1799', startYear: 301, endYear: 1799, accent: 'gold' },
  { id: 'nineteenth', title: '19th Century', range: '1800–1917', startYear: 1800, endYear: 1917, accent: 'copper' },
  { id: 'republic', title: '1918–1920', range: 'First Republic', startYear: 1918, endYear: 1920, accent: 'ruby' },
  { id: 'soviet', title: 'Soviet period', range: '1921–1991', startYear: 1921, endYear: 1991, accent: 'slate' },
  { id: 'modern', title: 'Modern', range: '1991–present', startYear: 1991, endYear: null, accent: 'emerald' },
];

const placeDefinitions = [
  {
    slug: 'van',
    title: 'Van Province',
    armenianTitle: 'Վանի նահանգ',
    currentName: 'Van region',
    region: 'western',
    kind: 'province',
    periodIds: ['ancient', 'medieval', 'nineteenth'],
    map: { x: 52, y: 52 },
    featured: true,
    heroPosition: '67% center',
    summary: 'A historic Armenian province centered on Lake Van and a dense network of settlements, monasteries and fortresses.',
    description: 'The Van area is one of the central cultural landscapes of the Armenian Highlands. The atlas separates historical Armenian administrative and cultural geography from present-day borders and names, and links every future claim to a source record.',
    tags: ['Lake Van', 'province', 'fortresses', 'monasteries'],
    facts: [
      { label: 'Historic center', value: 'Van' },
      { label: 'Featured monument', value: 'Holy Cross, Aghtamar' },
      { label: 'Atlas status', value: 'Curated demo record' },
    ],
    sources: [
      { title: 'Historical atlas source record', status: 'Bibliography entry pending review' },
      { title: 'Monument documentation record', status: 'Image and citation review pending' },
    ],
  },
  {
    slug: 'aghtamar',
    title: 'Aghtamar Island',
    armenianTitle: 'Աղթամար',
    currentName: 'Akdamar Island',
    region: 'western',
    kind: 'monument',
    periodIds: ['medieval'],
    map: { x: 58, y: 58 },
    featured: true,
    heroPosition: '75% center',
    summary: 'An island in Lake Van known for the medieval Armenian Church of the Holy Cross.',
    description: 'Aghtamar is presented as a monument record with architecture, chronology, gallery and bibliography tabs. This seed entry is intentionally concise until reviewed historical sources and licensed images are attached.',
    tags: ['island', 'church', 'architecture', 'Lake Van'],
    facts: [
      { label: 'Type', value: 'Island and church complex' },
      { label: 'Historical period', value: 'Medieval' },
      { label: 'Content status', value: 'Draft · sources required' },
    ],
    sources: [{ title: 'Architecture bibliography', status: 'Pending editorial approval' }],
  },
  {
    slug: 'ani',
    title: 'Ani',
    armenianTitle: 'Անի',
    currentName: 'Ani archaeological site',
    region: 'western',
    kind: 'city',
    periodIds: ['medieval'],
    map: { x: 31, y: 30 },
    featured: true,
    heroPosition: '35% center',
    summary: 'A medieval Armenian capital and major urban, architectural and commercial center.',
    description: 'Ani will become a layered city page with fortifications, churches, urban quarters, excavation history and period-specific map overlays. The production record will distinguish documented history from later interpretation.',
    tags: ['capital', 'city', 'architecture', 'medieval'],
    facts: [
      { label: 'Record type', value: 'Historic city' },
      { label: 'Primary period', value: 'Medieval' },
      { label: 'Atlas status', value: 'Curated demo record' },
    ],
    sources: [{ title: 'Urban history bibliography', status: 'Pending editorial approval' }],
  },
  {
    slug: 'kars',
    title: 'Kars',
    armenianTitle: 'Կարս',
    currentName: 'Kars',
    region: 'western',
    kind: 'city',
    periodIds: ['medieval', 'nineteenth', 'republic'],
    map: { x: 24, y: 23 },
    featured: false,
    heroPosition: '31% center',
    summary: 'A historic fortified city connected with several major political and cultural periods.',
    description: 'The Kars record is designed to compare changing borders, names, institutions and urban landmarks across medieval, imperial and early twentieth-century periods.',
    tags: ['city', 'fortress', 'nineteenth century'],
    facts: [
      { label: 'Record type', value: 'Historic city' },
      { label: 'Periods', value: 'Medieval · 19th c. · 1918–1920' },
      { label: 'Source status', value: 'Editorial review pending' },
    ],
    sources: [{ title: 'Administrative history sources', status: 'Pending review' }],
  },
  {
    slug: 'mush',
    title: 'Mush',
    armenianTitle: 'Մուշ',
    currentName: 'Muş',
    region: 'western',
    kind: 'city',
    periodIds: ['medieval', 'nineteenth'],
    map: { x: 43, y: 69 },
    featured: false,
    heroPosition: '46% center',
    summary: 'A historic city and plain associated with Armenian settlements, monasteries and oral traditions.',
    description: 'The Mush page will connect the city, surrounding plain, settlement network and monument records while preserving alternative spellings and period-specific terminology.',
    tags: ['city', 'plain', 'settlements', 'monasteries'],
    facts: [
      { label: 'Record type', value: 'City and cultural landscape' },
      { label: 'Primary periods', value: 'Medieval · 19th century' },
      { label: 'Atlas status', value: 'Seed record' },
    ],
    sources: [{ title: 'Regional bibliography', status: 'Pending review' }],
  },
  {
    slug: 'erzurum',
    title: 'Erzurum / Karin',
    armenianTitle: 'Կարին',
    currentName: 'Erzurum',
    region: 'western',
    kind: 'city',
    periodIds: ['medieval', 'nineteenth'],
    map: { x: 47, y: 24 },
    featured: false,
    heroPosition: '52% center',
    summary: 'A major historic city represented with Armenian, alternative and present-day names.',
    description: 'This record demonstrates the atlas naming policy: historical Armenian names, alternative historical forms and current official names appear in separate fields rather than replacing one another.',
    tags: ['city', 'Karin', 'trade routes'],
    facts: [
      { label: 'Historic Armenian name', value: 'Karin' },
      { label: 'Current name', value: 'Erzurum' },
      { label: 'Atlas status', value: 'Seed record' },
    ],
    sources: [{ title: 'Toponymy record', status: 'Pending review' }],
  },
  {
    slug: 'yerevan',
    title: 'Yerevan',
    armenianTitle: 'Երևան',
    currentName: 'Yerevan',
    region: 'eastern',
    kind: 'city',
    periodIds: ['ancient', 'medieval', 'nineteenth', 'republic', 'soviet', 'modern'],
    map: { x: 48, y: 54 },
    featured: true,
    heroPosition: '55% center',
    summary: 'A continuously evolving urban center presented through archaeological, medieval, imperial, republican, Soviet and modern layers.',
    description: 'Yerevan serves as the model for a multi-period city page. Users will be able to compare maps and landmarks across time without collapsing distinct historical layers into a single narrative.',
    tags: ['capital', 'city', 'multi-period'],
    facts: [
      { label: 'Record type', value: 'Capital city' },
      { label: 'Timeline coverage', value: 'Ancient to modern' },
      { label: 'Atlas status', value: 'Curated demo record' },
    ],
    sources: [{ title: 'City chronology bibliography', status: 'Pending editorial approval' }],
  },
  {
    slug: 'garni',
    title: 'Garni',
    armenianTitle: 'Գառնի',
    currentName: 'Garni',
    region: 'eastern',
    kind: 'monument',
    periodIds: ['ancient', 'medieval'],
    map: { x: 60, y: 51 },
    featured: true,
    heroPosition: '60% center',
    summary: 'A historic site with ancient and medieval layers, including the well-known temple complex.',
    description: 'Garni demonstrates how one place can contain multiple periods. The final record will provide separate archaeological, architectural and settlement layers with their own citations.',
    tags: ['temple', 'archaeology', 'ancient'],
    facts: [
      { label: 'Record type', value: 'Archaeological and monument site' },
      { label: 'Primary periods', value: 'Ancient · Medieval' },
      { label: 'Atlas status', value: 'Seed record' },
    ],
    sources: [{ title: 'Archaeological bibliography', status: 'Pending review' }],
  },
  {
    slug: 'geghard',
    title: 'Geghard Monastery',
    armenianTitle: 'Գեղարդ',
    currentName: 'Geghard',
    region: 'eastern',
    kind: 'monastery',
    periodIds: ['medieval'],
    map: { x: 66, y: 47 },
    featured: false,
    heroPosition: '67% center',
    summary: 'A medieval Armenian monastery complex set within a dramatic mountain landscape.',
    description: 'The Geghard page will combine architecture, inscriptions, chronology, landscape and conservation information with a licensed gallery and reviewed bibliography.',
    tags: ['monastery', 'architecture', 'medieval'],
    facts: [
      { label: 'Record type', value: 'Monastery' },
      { label: 'Primary period', value: 'Medieval' },
      { label: 'Content status', value: 'Draft · sources required' },
    ],
    sources: [{ title: 'Monument conservation record', status: 'Pending review' }],
  },
  {
    slug: 'echmiadzin',
    title: 'Vagharshapat / Echmiadzin',
    armenianTitle: 'Վաղարշապատ / Էջմիածին',
    currentName: 'Vagharshapat',
    region: 'eastern',
    kind: 'city',
    periodIds: ['ancient', 'medieval', 'nineteenth', 'modern'],
    map: { x: 39, y: 55 },
    featured: true,
    heroPosition: '43% center',
    summary: 'A major Armenian religious and historical center with ancient, medieval and modern layers.',
    description: 'The atlas will present the city and cathedral complex through separate place and monument records, while linking them through shared chronology and bibliography.',
    tags: ['city', 'cathedral', 'religious center'],
    facts: [
      { label: 'Record type', value: 'Historic city' },
      { label: 'Timeline coverage', value: 'Ancient to modern' },
      { label: 'Atlas status', value: 'Curated demo record' },
    ],
    sources: [{ title: 'Religious architecture bibliography', status: 'Pending review' }],
  },
  {
    slug: 'tatev',
    title: 'Tatev Monastery',
    armenianTitle: 'Տաթև',
    currentName: 'Tatev',
    region: 'eastern',
    kind: 'monastery',
    periodIds: ['medieval'],
    map: { x: 53, y: 80 },
    featured: true,
    heroPosition: '56% center',
    summary: 'A major medieval Armenian monastery and intellectual center in Syunik.',
    description: 'Tatev will include architectural phases, educational history, inscriptions, landscape context and a source-reviewed gallery. This version provides the discovery structure only.',
    tags: ['monastery', 'Syunik', 'education', 'medieval'],
    facts: [
      { label: 'Record type', value: 'Monastery and intellectual center' },
      { label: 'Primary period', value: 'Medieval' },
      { label: 'Atlas status', value: 'Curated demo record' },
    ],
    sources: [{ title: 'Monastery history bibliography', status: 'Pending review' }],
  },
  {
    slug: 'haghpat',
    title: 'Haghpat Monastery',
    armenianTitle: 'Հաղպատ',
    currentName: 'Haghpat',
    region: 'eastern',
    kind: 'monastery',
    periodIds: ['medieval'],
    map: { x: 45, y: 20 },
    featured: false,
    heroPosition: '48% center',
    summary: 'A medieval Armenian monastery complex in Lori with a rich architectural and manuscript tradition.',
    description: 'The future Haghpat record will connect architecture, inscriptions, manuscripts and nearby settlement history in a single source-linked experience.',
    tags: ['monastery', 'Lori', 'manuscripts'],
    facts: [
      { label: 'Record type', value: 'Monastery' },
      { label: 'Primary period', value: 'Medieval' },
      { label: 'Atlas status', value: 'Seed record' },
    ],
    sources: [{ title: 'Architecture and manuscript bibliography', status: 'Pending review' }],
  },
];

function normalize(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en-US')
    .trim();
}

function publicPlace(place) {
  return {
    ...place,
    sourceCount: place.sources.length,
  };
}

export function getRegions() {
  return regionDefinitions.map((region) => ({
    ...region,
    placeCount: placeDefinitions.filter((place) => place.region === region.id).length,
  }));
}

export function getPeriods() {
  return periodDefinitions.map((period) => ({
    ...period,
    placeCount: placeDefinitions.filter((place) => place.periodIds.includes(period.id)).length,
  }));
}

export function getPlace(slug) {
  const place = placeDefinitions.find((item) => item.slug === slug);
  return place ? publicPlace(place) : null;
}

export function getFeaturedPlaces(limit = 4) {
  return placeDefinitions.filter((place) => place.featured).slice(0, limit).map(publicPlace);
}

export function getMap(region) {
  const regionRecord = getRegions().find((item) => item.id === region);
  if (!regionRecord) return null;

  return {
    region: regionRecord,
    places: placeDefinitions
      .filter((place) => place.region === region)
      .map(({ slug, title, armenianTitle, kind, map, summary, featured }) => ({
        slug,
        title,
        armenianTitle,
        kind,
        map,
        summary,
        featured,
      })),
  };
}

export function searchPlaces({ q = '', region = 'all', kind = 'all', period = 'all', limit = 24 } = {}) {
  const query = normalize(q);
  const tokens = query.split(/\s+/).filter(Boolean);

  const results = placeDefinitions
    .map((place) => {
      if (region !== 'all' && place.region !== region) return null;
      if (kind !== 'all' && place.kind !== kind) return null;
      if (period !== 'all' && !place.periodIds.includes(period)) return null;

      const haystack = normalize([
        place.title,
        place.armenianTitle,
        place.currentName,
        place.summary,
        place.description,
        place.kind,
        place.region,
        ...place.tags,
      ].join(' '));

      if (tokens.length && !tokens.every((token) => haystack.includes(token))) return null;

      let score = place.featured ? 5 : 0;
      if (query) {
        if (normalize(place.title).startsWith(query)) score += 30;
        if (normalize(place.armenianTitle).includes(query)) score += 24;
        if (normalize(place.currentName).includes(query)) score += 18;
        score += tokens.reduce((total, token) => total + (haystack.includes(token) ? 4 : 0), 0);
      }

      return { score, place: publicPlace(place) };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.place.title.localeCompare(right.place.title))
    .slice(0, limit)
    .map(({ place }) => place);

  return {
    results,
    total: results.length,
    filters: {
      regions: ['all', ...regionDefinitions.map((item) => item.id)],
      kinds: ['all', ...new Set(placeDefinitions.map((item) => item.kind))],
      periods: ['all', ...periodDefinitions.map((item) => item.id)],
    },
  };
}

export function getTimeline() {
  return getPeriods().map((period) => ({
    ...period,
    places: placeDefinitions
      .filter((place) => place.periodIds.includes(period.id))
      .slice(0, 5)
      .map(({ slug, title, armenianTitle, region, kind, summary }) => ({ slug, title, armenianTitle, region, kind, summary })),
  }));
}

export function getHomeContent() {
  return {
    regions: getRegions(),
    periods: getPeriods().slice(0, 4),
    featured: getFeaturedPlaces(4),
    stats: {
      places: placeDefinitions.length,
      regions: regionDefinitions.length,
      periods: periodDefinitions.length,
      reviewedSources: 0,
    },
    editorialNotice: 'Historical names and boundaries are period-specific. Present-day geography is stored separately and source review is required before publication.',
  };
}
