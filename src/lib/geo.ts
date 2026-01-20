type Point = {
  lat: number;
  lon: number;
};

type Polygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

type MultiPolygon = {
  type: 'MultiPolygon';
  coordinates: number[][][][];
};

type GeoShape = Polygon | MultiPolygon;

const pointInRing = (point: Point, ring: number[][]) => {
  let inside = false;
  const { lat, lon } = point;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const isPointInsideGeoJson = (point: Point, shape: GeoShape) => {
  if (shape.type === 'Polygon') {
    return pointInRing(point, shape.coordinates[0] ?? []);
  }
  return shape.coordinates.some((polygon) => pointInRing(point, polygon[0] ?? []));
};

export const distanceKm = (a: Point, b: Point) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
};
