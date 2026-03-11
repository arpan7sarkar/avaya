import { Phone, Lightbulb, MapPin, Shield, AlertTriangle } from 'lucide-react';

const emergencyNumbers = [
  { label: 'Police', number: '100' },
  { label: 'Women Helpline', number: '1091' },
  { label: 'Child Helpline', number: '1098' },
  { label: 'Ambulance', number: '102' },
];

const tips = [
  {
    icon: MapPin,
    title: 'Plan your route',
    text: 'Check the map before you leave. Choose well-lit, busy streets. Avoid isolated shortcuts.',
  },
  {
    icon: Lightbulb,
    title: 'Stay visible',
    text: 'Stick to areas with good lighting and foot traffic. Trust your instincts—if a place feels wrong, leave.',
  },
  {
    icon: Shield,
    title: 'Use the SOS button',
    text: 'Keep the Avaya map open when walking alone. The SOS button gives you instant access to the nearest police station.',
  },
  {
    icon: AlertTriangle,
    title: 'Report unsafe areas',
    text: 'If you notice poor lighting, harassment, or other issues, report them in the app so others stay informed.',
  },
];

export default function SafetyTipsPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="font-playfair" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em', color: '#141414' }}>
          Safety Tips
        </h1>
        <p style={{ fontSize: '16px', color: '#6b6b6b', lineHeight: 1.6 }}>
          Important information and emergency contacts to help you stay safe.
        </p>
      </div>

      <section style={{ marginBottom: '48px' }}>
        <h2 className="font-playfair" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#141414' }}>
          <Phone size={24} color="#e8a020" />
          Emergency Numbers
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {emergencyNumbers.map(({ label, number }) => (
            <div
              key={label}
              className="panel-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #e8e6e0'
              }}
            >
              <span style={{ fontSize: '14px', color: '#6b6b6b', fontWeight: 600 }}>{label}</span>
              <a
                href={`tel:${number}`}
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#e04040',
                  textDecoration: 'none',
                }}
              >
                {number}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-playfair" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#141414' }}>
          <Shield size={24} color="#e8a020" />
          Safety Guidelines
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {tips.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="panel-card"
              style={{
                padding: '32px',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                background: '#ffffff',
                border: '1px solid #e8e6e0'
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '56px',
                  height: '56px',
                  background: '#fff4e0',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={28} color="#e8a020" />
              </div>
              <div>
                <h3 className="font-playfair" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#141414' }}>{title}</h3>
                <p style={{ fontSize: '15px', color: '#6b6b6b', lineHeight: 1.6 }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
