import { useRef, useMemo, useCallback } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useAvayaStore } from '../../store/useAvayaStore';
import { getMultipleRoutes } from '../../services/api';
import { useToastStore } from '../../store/useToastStore';

const destIcon = L.divIcon({
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  html: `
    <div style="position:relative;width:36px;height:36px;cursor:grab;">
      <div style="
        position:absolute;
        bottom:0;
        left:50%;
        transform:translateX(-50%);
        width:28px;
        height:36px;
        filter:drop-shadow(0 2px 6px rgba(239,68,68,0.5));
      ">
        <svg viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="36">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#ef4444"/>
          <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
      </div>
    </div>
  `,
});

export default function DestinationMarker() {
  const destination = useAvayaStore((s) => s.destination);
  const userLocation = useAvayaStore((s) => s.userLocation);
  const setDestination = useAvayaStore((s) => s.setDestination);
  const setAllRoutes = useAvayaStore((s) => s.setAllRoutes);
  const addToast = useToastStore((s) => s.addToast);
  const markerRef = useRef(null);

  const fetchRoutes = useCallback(
    async (destLat, destLng) => {
      const loc = useAvayaStore.getState().userLocation;
      if (!loc) return;
      try {
        const data = await getMultipleRoutes(loc.lat, loc.lng, destLat, destLng);
        setAllRoutes(data?.routes ?? []);
      } catch {
        addToast('Could not compute route to this location', 'error');
      }
    },
    [setAllRoutes, addToast]
  );

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          setDestination({ lat, lng, name: `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}` });
          fetchRoutes(lat, lng);
        }
      },
    }),
    [setDestination, fetchRoutes]
  );

  if (!destination) return null;

  return (
    <Marker
      ref={markerRef}
      position={[destination.lat, destination.lng]}
      icon={destIcon}
      draggable={true}
      eventHandlers={eventHandlers}
    >
      <Tooltip permanent direction="top" offset={[0, -38]}>
        <span style={{ fontSize: '12px', color: '#424446ff' }}>
          🏁 {destination.name ? destination.name.split(',').slice(0, 2).join(',') : 'Destination'} — drag to move
        </span>
      </Tooltip>
    </Marker>
  );
}
