import { MapPin, Search, Route, Shield, AlertTriangle, Flag } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: MapPin,
    title: 'Allow location',
    text: 'When you open the map, Avaya asks for your location. This helps us show nearby roads and your position in real time. If denied, we fall back to a default area.',
  },
  {
    step: 2,
    icon: Shield,
    title: 'See safety colors',
    text: 'Roads are color-coded: green (safe), amber (moderate), and red (unsafe). Tap any road to see details like lighting, CCTV, and incident reports.',
  },
  {
    step: 3,
    icon: Search,
    title: 'Search your destination',
    text: 'Type where you want to go in the search bar. We use OpenStreetMap to find the place, then calculate the safest route—not the shortest.',
  },
  {
    step: 4,
    icon: Route,
    title: 'Follow the route',
    text: 'The safest path appears in gold on the map. The route panel shows each segment with its safety score so you know what to expect.',
  },
  {
    step: 5,
    icon: AlertTriangle,
    title: 'Use SOS when needed',
    text: 'Tap the red SOS button for the nearest police station. You get the name, address, distance, and a one-tap call button.',
  },
  {
    step: 6,
    icon: Flag,
    title: 'Report unsafe roads',
    text: 'Found a poorly lit street or had an incident? Report it from any road popup. Your report helps keep the community safe.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          How It Works
        </h1>
        <p style={{ fontSize: '16px', color: '#8a8f9e', lineHeight: 1.6 }}>
          A quick guide to using Avaya&apos;s safety map and features.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {steps.map(({ step, icon: Icon, title, text }) => (
          <div
            key={step}
            className="panel-card"
            style={{
              padding: '28px',
              display: 'flex',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: '56px',
                height: '56px',
                background: 'rgba(232,196,105,0.12)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#e8c469',
              }}
            >
              {step}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={20} color="#e8c469" />
                {title}
              </h3>
              <p style={{ fontSize: '15px', color: '#8a8f9e', lineHeight: 1.7 }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
