import { useAvayaStore } from '../store/useAvayaStore';
import LoadingScreen from '../components/UI/LoadingScreen';
import AppShell from '../components/Layout/AppShell';
import AvayaMap from '../components/Map/AvayaMap';
import ErrorBoundary from '../components/UI/ErrorBoundary';

export default function MapPage() {
  const locationReady = useAvayaStore((s) => s.locationReady);

  return (
    <>
      {!locationReady && <LoadingScreen />}
      <AppShell>
        <ErrorBoundary>
          <AvayaMap />
        </ErrorBoundary>
      </AppShell>
    </>
  );
}
