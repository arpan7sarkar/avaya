import { useRef, useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useAvayaStore } from '../../store/useAvayaStore';

const createIcon = (isManual) =>
  L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: isManual
      ? `
      <div style="position:relative;width:32px;height:32px;cursor:grab;">
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(232,196,105,0.5);animation:pulse-ring 1.8s ease-out infinite;transform-origin:center;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#e8c469;border:2.5px solid #fff;box-shadow:0 0 12px rgba(232,196,105,0.8);"></div>
      </div>
    `
      : `
      <div style="position:relative;width:32px;height:32px;">
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(59,130,246,0.5);animation:pulse-ring 1.8s ease-out infinite;transform-origin:center;"></div>
        <div style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(59,130,246,0.3);animation:pulse-ring 1.8s ease-out 0.6s infinite;transform-origin:center;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 10px rgba(59,130,246,0.8);"></div>
      </div>
    `,
  });

export default function UserMarker() {
  const userLocation = useAvayaStore((s) => s.userLocation);
  const locationMode = useAvayaStore((s) => s.locationMode);
  const setManualLocation = useAvayaStore((s) => s.setManualLocation);
  const markerRef = useRef(null);

  const isManual = locationMode === 'manual';

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          setManualLocation({ lat, lng });
        }
      },
    }),
    [setManualLocation]
  );

  if (!userLocation) return null;

  return (
    <Marker
      ref={markerRef}
      position={[userLocation.lat, userLocation.lng]}
      icon={createIcon(isManual)}
      draggable={isManual}
      eventHandlers={isManual ? eventHandlers : {}}
    >
      <Tooltip permanent direction="top" offset={[0, -18]}>
        <span style={{ fontSize: '12px', color: '#424446ff' }}>
          {isManual ? '📍 Drag me to set location' : 'You are here'}
        </span>
      </Tooltip>
    </Marker>
  );
}
