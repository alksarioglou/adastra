export type CityLocation = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  latitude: number;
  longitude: number;
  qrAltitudeMeters: number;
  camera: {
    longitude: number;
    latitude: number;
    height: number;
    heading: number;
    pitch: number;
  };
};

export const CITY_LOCATIONS: CityLocation[] = [
  {
    id: "san-francisco",
    name: "San Francisco",
    short: "SF",
    tagline: "Financial District",
    latitude: 37.7897,
    longitude: -122.4009,
    qrAltitudeMeters: 180,
    camera: {
      longitude: -122.392,
      latitude: 37.782,
      height: 120,
      heading: 320,
      pitch: -22,
    },
  },
  {
    id: "new-york",
    name: "New York",
    short: "NYC",
    tagline: "Midtown Manhattan",
    latitude: 40.758,
    longitude: -73.9855,
    qrAltitudeMeters: 220,
    camera: {
      longitude: -73.978,
      latitude: 40.748,
      height: 150,
      heading: 45,
      pitch: -20,
    },
  },
  {
    id: "austin",
    name: "Austin",
    short: "ATX",
    tagline: "Congress Ave",
    latitude: 30.2672,
    longitude: -97.7431,
    qrAltitudeMeters: 160,
    camera: {
      longitude: -97.735,
      latitude: 30.26,
      height: 100,
      heading: 200,
      pitch: -18,
    },
  },
  {
    id: "miami",
    name: "Miami",
    short: "MIA",
    tagline: "Brickell",
    latitude: 25.7617,
    longitude: -80.1918,
    qrAltitudeMeters: 170,
    camera: {
      longitude: -80.182,
      latitude: 25.754,
      height: 110,
      heading: 280,
      pitch: -20,
    },
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    short: "LA",
    tagline: "Downtown",
    latitude: 34.0522,
    longitude: -118.2437,
    qrAltitudeMeters: 200,
    camera: {
      longitude: -118.232,
      latitude: 34.044,
      height: 130,
      heading: 90,
      pitch: -22,
    },
  },
];

export function getCityLocation(id: string): CityLocation {
  return CITY_LOCATIONS.find((c) => c.id === id) ?? CITY_LOCATIONS[0];
}