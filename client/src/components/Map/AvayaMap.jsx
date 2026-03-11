import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getNearbyRoads } from '../../services/api';
import { useAvayaStore } from '../../store/useAvayaStore';
import RoadLayer from './RoadLayer';
import UserMarker from './UserMarker';
import DestinationMarker from './DestinationMarker';

const DEFAULT_CENTER = [22.5726, 88.3639];
const DEFAULT_ZOOM = 15;

function MapRecenter({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], map.getZoom(), { animate: true });
    }
  }, [location, map]);
  return null;
}

export default function AvayaMap() {
  useGeolocation();

  const userLocation = useAvayaStore((s) => s.userLocation);
  const locationReady = useAvayaStore((s) => s.locationReady);
  const setNearbyRoads = useAvayaStore((s) => s.setNearbyRoads);
  const setError = useAvayaStore((s) => s.setError);
  const intervalRef = useRef(null);

  const fetchNearbyRoads = async () => {
    const loc = useAvayaStore.getState().userLocation;
    if (!loc) return;
    try {
      const data = await getNearbyRoads(loc.lat, loc.lng, 1000);
      setNearbyRoads(data?.features ?? []);
    } catch {
      setError('Failed to load nearby roads.');
    }
  };

  useEffect(() => {
    if (!locationReady || !userLocation) return;

    fetchNearbyRoads();

    intervalRef.current = setInterval(fetchNearbyRoads, 60_000);

    return () => clearInterval(intervalRef.current);
  }, [locationReady, userLocation]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      />

      {locationReady && userLocation && <MapRecenter location={userLocation} />}

      <RoadLayer />
      <DestinationMarker />

      {locationReady && <UserMarker />}
    </MapContainer>
  );
}
