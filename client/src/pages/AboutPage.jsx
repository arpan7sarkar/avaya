import { Shield, Heart, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: '#fff4e0',
            borderRadius: '20px',
            marginBottom: '24px',
          }}
        >
          <Shield size={32} color="#e8a020" strokeWidth={2} />
        </div>
        <h1 className="font-playfair" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em', color: '#141414' }}>
          About Avaya
        </h1>
        <p style={{ fontSize: '16px', color: '#6b6b6b', lineHeight: 1.6 }}>
          Avaya is a women safety platform built to help you navigate the city with confidence.
        </p>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 className="font-playfair" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#141414' }}>
          <Target size={24} color="#e8a020" />
          Our Mission
        </h2>
        <p style={{ fontSize: '15px', color: '#6b6b6b', lineHeight: 1.7 }}>
          We believe every woman deserves to move freely and feel safe. Avaya combines live map data,
          community reports, and safety scores to surface the safest routes — so you can make informed
          choices about how you travel.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 className="font-playfair" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#141414' }}>
          <Heart size={24} color="#e8a020" />
          What We Do
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            'Color-coded road safety based on lighting, crowd levels, and reported incidents',
            'Safest route routing that avoids high-risk areas',
            'Emergency SOS with nearest police station and one-tap call',
            'Community-driven reporting to keep safety data up to date',
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid #e8e6e0' : 'none',
                fontSize: '15px',
                color: '#6b6b6b',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: '#2d9e6b', flexShrink: 0 }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-playfair" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#141414' }}>
          <Users size={24} color="#e8a020" />
          For Everyone
        </h2>
        <p style={{ fontSize: '15px', color: '#6b6b6b', lineHeight: 1.7 }}>
          Avaya is built for women, by people who care about safety. Whether you&apos;re walking home at
          night, commuting to work, or exploring a new area — we&apos;re here to help you stay safe.
        </p>
      </section>
    </div>
  );
}
