export type PlaceCategory = 'delegacia-mulher' | 'delegacia' | 'hospital' | 'bombeiros';

export interface NearbyPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  distanceKm: number;
  address?: string;
}

export const CATEGORY_META: Record<PlaceCategory, { label: string; color: string; emoji: string }> = {
  'delegacia-mulher': { label: 'Delegacia da Mulher', color: '#9d4e95', emoji: '🚨' },
  delegacia: { label: 'Delegacia de Polícia', color: '#613a7e', emoji: '👮' },
  hospital: { label: 'Hospital', color: '#c0392b', emoji: '🏥' },
  bombeiros: { label: 'Corpo de Bombeiros', color: '#e07b39', emoji: '🚒' },
};

/** Distância em km entre duas coordenadas (fórmula de Haversine). */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function categorize(tags: Record<string, string> = {}): PlaceCategory | null {
  const amenity = tags.amenity;
  const name = (tags.name || '').toLowerCase();

  if (amenity === 'police') {
    const womenStation = name.includes('mulher') || /\bdeam\b/.test(name) || name.includes('defesa da mulher');
    return womenStation ? 'delegacia-mulher' : 'delegacia';
  }
  if (amenity === 'hospital') return 'hospital';
  if (amenity === 'fire_station') return 'bombeiros';
  return null;
}

function buildAddress(tags: Record<string, string> = {}): string | undefined {
  const street = tags['addr:street'];
  const number = tags['addr:housenumber'];
  if (!street) return undefined;
  return number ? `${street}, ${number}` : street;
}

/** Servidores públicos da Overpass API — se um falhar/estiver lento, tentamos o próximo. */
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

async function runOverpass(query: string): Promise<{ elements: OverpassElement[] }> {
  let lastError: unknown = new Error('Nenhum servidor Overpass respondeu.');

  for (const url of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Overpass API respondeu ${response.status}`);
      return (await response.json()) as { elements: OverpassElement[] };
    } catch (err) {
      lastError = err;
    } finally {
      window.clearTimeout(timer);
    }
  }

  throw lastError;
}

/**
 * Busca delegacias (de polícia e da mulher), hospitais e corpos de
 * bombeiros num raio (em metros) a partir de uma coordenada, usando a
 * Overpass API (dados abertos do OpenStreetMap — gratuita, sem chave).
 * Se nada for encontrado no raio inicial, amplia a busca uma vez.
 */
export async function fetchNearbyPlaces(
  lat: number,
  lon: number,
  radiusMeters = 6000
): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="police"](around:${radiusMeters},${lat},${lon});
      way["amenity"="police"](around:${radiusMeters},${lat},${lon});
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
      way["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
    );
    out center tags;
  `.trim();

  const data = await runOverpass(query);

  const places: NearbyPlace[] = [];

  for (const el of data.elements) {
    const category = categorize(el.tags);
    if (!category) continue;

    const placeLat = el.lat ?? el.center?.lat;
    const placeLon = el.lon ?? el.center?.lon;
    if (placeLat === undefined || placeLon === undefined) continue;

    places.push({
      id: `${category}-${el.id}`,
      name: el.tags?.name || CATEGORY_META[category].label,
      category,
      lat: placeLat,
      lon: placeLon,
      distanceKm: haversineKm(lat, lon, placeLat, placeLon),
      address: buildAddress(el.tags),
    });
  }

  if (places.length === 0 && radiusMeters < 15000) {
    return fetchNearbyPlaces(lat, lon, 15000);
  }

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}

export function directionsUrl(originLat: number, originLon: number, destLat: number, destLon: number): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${destLat},${destLon}&travelmode=driving`;
}
