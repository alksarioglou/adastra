import { offsetLatLng } from "./geo";

type StreetViewLib = google.maps.StreetViewLibrary;

export async function findNearestPanorama(
  streetViewLib: StreetViewLib,
  latitude: number,
  longitude: number,
): Promise<google.maps.StreetViewPanoramaData | null> {
  const service = new streetViewLib.StreetViewService();

  const attempts: google.maps.StreetViewLocationRequest[] = [
    {
      location: { lat: latitude, lng: longitude },
      radius: 250,
      preference: streetViewLib.StreetViewPreference.NEAREST,
      sources: [streetViewLib.StreetViewSource.OUTDOOR],
    },
    {
      location: { lat: latitude, lng: longitude },
      radius: 500,
      preference: streetViewLib.StreetViewPreference.BEST,
      sources: [streetViewLib.StreetViewSource.DEFAULT],
    },
    {
      location: offsetLatLng(latitude, longitude, 0, -80),
      radius: 300,
      preference: streetViewLib.StreetViewPreference.NEAREST,
      sources: [streetViewLib.StreetViewSource.DEFAULT],
    },
    {
      location: offsetLatLng(latitude, longitude, 80, 0),
      radius: 300,
      preference: streetViewLib.StreetViewPreference.NEAREST,
      sources: [streetViewLib.StreetViewSource.DEFAULT],
    },
  ];

  for (const request of attempts) {
    try {
      const response = await service.getPanorama(request);
      const data = response.data;
      if (data?.location?.latLng && data.tiles) {
        return data;
      }
    } catch {
      // try next search point
    }
  }

  return null;
}