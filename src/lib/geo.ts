export type LatLng = {
  lat: number;
  lng: number;
};

const CITY_COORDINATES: Record<string, LatLng> = {
  mazamitla: { lat: 19.9186, lng: -103.024 },
  zapopan: { lat: 20.7236, lng: -103.3847 },
  guadalajara: { lat: 20.6736, lng: -103.344 },
  tonala: { lat: 20.6281, lng: -103.2339 },
  tlaquepaque: { lat: 20.6408, lng: -103.2933 },
  tlajomulco: { lat: 20.4742, lng: -103.4466 },
  "la cofradía": { lat: 20.5362, lng: -103.2478 },
  "san josé de gracia": { lat: 19.9092, lng: -102.9173 },
  quitupan: { lat: 19.6354, lng: -102.7577 },
};

export const getCoordsForCity = (city?: string): LatLng | undefined => {
  if (!city) return undefined;
  return CITY_COORDINATES[city.trim().toLowerCase()];
};

export const haversineDistance = (a: LatLng, b: LatLng) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
};

export const formatCoords = (coords: LatLng) =>
  `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

