import { Polyline, Popup } from 'react-leaflet';
import { useAvayaStore, getActiveFeatures } from '../../store/useAvayaStore';

const getSafetyColor = (score) => {
  if (typeof score !== 'number') return '#8a8f9e';
  if (score >= 7) return '#22c55e';
  if (score >= 4) return '#f59e0b';
  return '#ef4444';
};

const toLatLng = (coords) => coords.map(([lng, lat]) => [lat, lng]);

const ROUTE_COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];

export default function RoadLayer() {
  const nearbyRoads = useAvayaStore((s) => s.nearbyRoads);
  const allRoutes = useAvayaStore((s) => s.allRoutes);
  const selectedRouteIndex = useAvayaStore((s) => s.selectedRouteIndex);
  const routeViewMode = useAvayaStore((s) => s.routeViewMode);
  const activeRoute = getActiveFeatures(allRoutes, selectedRouteIndex);
  const setReportRoadId = useAvayaStore((s) => s.setReportRoadId);


  const activeIds = new Set(
    activeRoute
      .map((f) => f?.properties?._id || f?.properties?.id)
      .filter(Boolean)
  );

  // Collect all route road IDs (for dimming nearby roads when any route is active)
  const allRouteIds = new Set();
  allRoutes.forEach((route) => {
    (route.features || []).forEach((f) => {
      const id = f?.properties?._id || f?.properties?.id;
      if (id) allRouteIds.add(id);
    });
  });

  const renderPopup = (props, roadId) => (
    <Popup>
      <div style={{ minWidth: '200px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '10px',
          }}
        >
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: '#f0f2f5', marginBottom: '2px' }}>
              {props.road_name || 'Unnamed Road'}
            </p>
            {props.road_type && (
              <p style={{ fontSize: '11px', color: '#8a8f9e' }}>{props.road_type}</p>
            )}
          </div>
          {typeof props.final_safety_score === 'number' && (
            <span
              style={{
                background: `${getSafetyColor(props.final_safety_score)}20`,
                color: getSafetyColor(props.final_safety_score),
                border: `1px solid ${getSafetyColor(props.final_safety_score)}50`,
                borderRadius: '20px',
                padding: '2px 9px',
                fontSize: '12px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                marginLeft: '8px',
              }}
            >
              {props.final_safety_score.toFixed(1)}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '12px' }}>
          {[
            ['💡', 'Lighting', props.lighting],
            ['👥', 'Crowd', props.crowd_level],
            ['📹', 'CCTV', props.cctv_present ? 'Yes' : 'No'],
            ['⚠️', 'Incidents', props.incidents_reported ?? '—'],
          ].map(([icon, label, val]) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                padding: '5px 7px',
              }}
            >
              <p style={{ fontSize: '10px', color: '#8a8f9e' }}>
                {icon} {label}
              </p>
              <p style={{ fontSize: '12px', color: '#f0f2f5', fontWeight: 500 }}>{val ?? '—'}</p>
            </div>
          ))}
        </div>

        {roadId && (
          <button
            type="button"
            onClick={() => setReportRoadId(roadId)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ⚑ Report Unsafe
          </button>
        )}
      </div>
    </Popup>
  );

  const hasRoute = allRoutes.length > 0;
  const isSelectMode = routeViewMode === 'select' && allRoutes.length > 1;

  return (
    <>
      {/* Nearby roads (always rendered, dimmed when routes active) */}
      {nearbyRoads.map((feature, idx) => {
        if (!feature?.geometry?.coordinates?.length) return null;
        const props = feature.properties ?? {};
        const roadId = props._id || props.id || null;
        const score = props.final_safety_score;
        const color = getSafetyColor(score);
        const isActive = roadId && activeIds.has(roadId);

        const roadColor = color;
        const roadWeight = hasRoute ? 4 : 5;
        const roadOpacity = hasRoute ? 0.2 : 0.75;

        return (
          <Polyline
            key={roadId || idx}
            positions={toLatLng(feature.geometry.coordinates)}
            pathOptions={{
              color: roadColor,
              weight: roadWeight,
              opacity: roadOpacity,
              dashArray: undefined,
            }}
          >
            {renderPopup(props, roadId)}
          </Polyline>
        );
      })}

      {/* In select mode: render ALL routes using clipped routeLine */}
      {isSelectMode &&
        allRoutes.map((route, routeIdx) => {
          const isSelected = routeIdx === selectedRouteIndex;
          const routeColor = ROUTE_COLORS[routeIdx % ROUTE_COLORS.length];
          const routeLineCoords = route.routeLine?.coordinates;

          if (!routeLineCoords?.length) return null;

          return (
            <Polyline
              key={`route-line-${routeIdx}`}
              positions={toLatLng(routeLineCoords)}
              pathOptions={{
                color: routeColor,
                weight: isSelected ? 7 : 4,
                opacity: isSelected ? 0.9 : 0.4,
                dashArray: isSelected ? undefined : '8 6',
              }}
            />
          );
        })}

      {/* In detail mode: render the selected route's clipped routeLine */}
      {!isSelectMode && (() => {
        const route = allRoutes[selectedRouteIndex];
        const routeLineCoords = route?.routeLine?.coordinates;
        if (!routeLineCoords?.length) return null;

        // Compute average safety score for color
        const scores = (route.features || [])
          .map((f) => f?.properties?.final_safety_score)
          .filter((s) => typeof s === 'number');
        const avgScore = scores.length
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : null;

        return (
          <Polyline
            key="route-detail-line"
            positions={toLatLng(routeLineCoords)}
            pathOptions={{ color: getSafetyColor(avgScore), weight: 7, opacity: 1 }}
          />
        );
      })()}
    </>
  );
}
