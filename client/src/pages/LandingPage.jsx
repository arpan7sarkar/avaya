import { Link } from 'react-router-dom';
import { Shield, MapPin, Route, AlertTriangle } from 'lucide-react';
import { Show, UserButton } from '@clerk/react';

export default function LandingPage() {
  const handleSOS = () => {
    alert("SOS Activated! Locating nearest police station...");
  };

  return (
    <div className="landing-wrapper animate-fade-in">
      {/* 1. HERO SECTION */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
        <div className="animate-slide-up-stagger">
          <div style={{ display: 'inline-block', padding: '8px 16px', background: '#fff4e0', color: '#e8a020', borderRadius: '20px', fontSize: '14px', fontWeight: 700, marginBottom: '24px' }}>🛡 Women's Safety Navigation</div>
          <h1 className="font-playfair" style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, color: '#141414', marginBottom: '24px' }}>Navigate with Confidence, Stay Safe Always</h1>
          <p style={{ fontSize: '18px', color: '#6b6b6b', lineHeight: 1.6, marginBottom: '48px' }}>Your ultimate companion for secure city travel. Get real-time safety scores, intelligent routing, and instant SOS capabilities.</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
             <Link to="/map" style={{ padding: '16px 32px', background: '#141414', color: '#fff', borderRadius: '14px', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>Open Live Map</Link>
             <Link to="/how-it-works" style={{ padding: '16px 32px', background: 'transparent', color: '#141414', border: '1.5px solid #e8e6e0', borderRadius: '14px', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>How it works</Link>
          </div>
          <div style={{ display: 'flex', gap: '48px', color: '#141414' }}>
            <div><div className="font-playfair" style={{ fontSize: '28px', fontWeight: 800 }}>2000+</div><div style={{ fontSize: '15px', color: '#6b6b6b' }}>Routes</div></div>
            <div><div className="font-playfair" style={{ fontSize: '28px', fontWeight: 800 }}>50K+</div><div style={{ fontSize: '15px', color: '#6b6b6b' }}>Women</div></div>
            <div><div className="font-playfair" style={{ fontSize: '28px', fontWeight: 800 }}>99%</div><div style={{ fontSize: '15px', color: '#6b6b6b' }}>Satisfaction</div></div>
          </div>
        </div>

        <div className="animate-float" style={{ position: 'relative', background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.06)', border: '1px solid #e8e6e0' }}>
           <div style={{ position: 'absolute', top: '-20px', left: '-20px', background: '#e6f7f0', color: '#2d9e6b', padding: '12px 20px', borderRadius: '16px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 12px 24px rgba(45,158,107,0.15)', zIndex: 10 }}><span>✅</span> Safe Route Found</div>
           <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#fdeaea', color: '#e04040', padding: '12px 20px', borderRadius: '16px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 12px 24px rgba(224,64,64,0.15)', zIndex: 10 }}><span>🚨</span> SOS Ready</div>
           
           <div style={{ width: '100%', height: '280px', background: '#f7f6f2', borderRadius: '16px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', opacity: 0.8 }}>
                 <path d="M50 200 L150 120 L250 160 L380 40" fill="none" stroke="#2d9e6b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="50" cy="200" r="10" fill="#141414" stroke="#fff" strokeWidth="3" />
                 <circle cx="380" cy="40" r="10" fill="#e04040" stroke="#fff" strokeWidth="3" />
              </svg>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ padding: '16px', background: '#e6f7f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#141414', fontSize: '16px' }}>Route 1 <span style={{ padding: '4px 10px', background: '#2d9e6b', color: '#fff', borderRadius: '12px', fontSize: '11px', marginLeft: '8px', fontWeight: 700 }}>SAFEST</span></div>
                  <div style={{ fontSize: '13px', color: '#6b6b6b', marginTop: '6px' }}>Main roads • Well lit • Active crowd</div>
                </div>
                <div style={{ fontWeight: 800, color: '#2d9e6b', fontSize: '20px' }}>9.2</div>
             </div>
             <div style={{ padding: '16px', background: '#fdf9f3', borderRadius: '16px', border: '1px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#141414', fontSize: '16px' }}>Route 2 <span style={{ padding: '4px 10px', background: '#e8a020', color: '#fff', borderRadius: '12px', fontSize: '11px', marginLeft: '8px', fontWeight: 700 }}>SHORTEST</span></div>
                  <div style={{ fontSize: '13px', color: '#6b6b6b', marginTop: '6px' }}>Residential • Moderate lighting</div>
                </div>
                <div style={{ fontWeight: 800, color: '#e8a020', fontSize: '20px' }}>7.5</div>
             </div>
           </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', border: '1.5px solid #e8e6e0', borderRadius: '30px', fontSize: '14px', fontWeight: 700, color: '#6b6b6b', marginBottom: '20px' }}>Core Features</div>
          <h2 className="font-playfair" style={{ fontSize: '40px', fontWeight: 800, color: '#141414' }}>Built for your personal safety</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          <div className="landing-feature-card" style={{ padding: '40px 32px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e8e6e0' }}>
             <div style={{ width: '56px', height: '56px', background: '#fff4e0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <MapPin color="#e8a020" size={28} />
             </div>
             <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#141414' }}>Color-coded Safety</h3>
             <p style={{ color: '#6b6b6b', lineHeight: 1.6, fontSize: '15px' }}>Roads reflect real-time safety metrics including lighting, crowd density, and historical incident reports to keep you informed.</p>
          </div>
          <div className="landing-feature-card" style={{ padding: '40px 32px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e8e6e0' }}>
             <div style={{ width: '56px', height: '56px', background: '#e6f7f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Route color="#2d9e6b" size={28} />
             </div>
             <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#141414' }}>Safest Routing</h3>
             <p style={{ color: '#6b6b6b', lineHeight: 1.6, fontSize: '15px' }}>Our advanced algorithm weighs safety heavily, dynamically guiding you through well-lit and populated safe areas.</p>
          </div>
          <div className="landing-feature-card" style={{ padding: '40px 32px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e8e6e0' }}>
             <div style={{ width: '56px', height: '56px', background: '#fdeaea', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <AlertTriangle color="#e04040" size={28} />
             </div>
             <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#141414' }}>Emergency SOS</h3>
             <p style={{ color: '#6b6b6b', lineHeight: 1.6, fontSize: '15px' }}>A dedicated one-tap panic button that instantly locates and routes you to the nearest police station securely.</p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section style={{ background: '#f7f6f2', padding: '100px 40px', borderTop: '1px solid #e8e6e0', borderBottom: '1px solid #e8e6e0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="font-playfair" style={{ fontSize: '40px', fontWeight: 800, color: '#141414', textAlign: 'center', marginBottom: '80px' }}>How It Works</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '35px', left: '15%', right: '15%', height: '2px', background: '#e8e6e0', zIndex: 0 }} />
             
             {[
               { num: 1, title: 'Set Location', desc: 'Enter your destination to instantly see road safety scores across the map.' },
               { num: 2, title: 'Compare Routes', desc: 'Review the shortest and safest path options side-by-side with metrics.' },
               { num: 3, title: 'Navigate Safely', desc: 'Follow the live map with total peace of mind along your journey.' }
             ].map((step) => (
               <div key={step.num} style={{ flex: 1, textAlign: 'center', zIndex: 1, background: '#f7f6f2', padding: '0 20px' }}>
                 <div style={{ width: '70px', height: '70px', background: '#ffffff', border: '3px solid #e8a020', borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: '#e8a020', margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(232,160,32,0.1)' }}>{step.num}</div>
                 <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#141414', marginBottom: '12px' }}>{step.title}</h3>
                 <p style={{ color: '#6b6b6b', maxWidth: '240px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. WELCOME BACK + QUICK ACTIONS (Auth Only) */}
      <Show when="signed-in">
        <section style={{ maxWidth: '1200px', margin: '100px auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', padding: '0 40px' }}>
          <div style={{ background: '#141414', borderRadius: '32px', padding: '60px 48px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
             <h2 className="font-playfair" style={{ fontSize: '42px', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>Ready to travel securely?</h2>
             <p style={{ color: '#a0a0a0', fontSize: '18px', marginBottom: '40px', lineHeight: 1.6 }}>Your personal safety dashboard is connected. Access live maps, check real-time routes, and use quick SOS actions.</p>
             <Link to="/map" style={{ alignSelf: 'flex-start', padding: '16px 36px', background: '#e8a020', color: '#ffffff', borderRadius: '16px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 24px rgba(232,160,32,0.3)' }}><MapPin size={20} /> Open Live Map</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <Link to="/map" className="landing-feature-card" style={{ background: '#ffffff', padding: '32px 24px', borderRadius: '24px', border: '1px solid #e8e6e0', textDecoration: 'none', color: '#141414', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', background: '#fdf9f3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Route size={28} color="#e8a020" /></div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Plan Route</span>
             </Link>
             <Link to="/safety-tips" className="landing-feature-card" style={{ background: '#ffffff', padding: '32px 24px', borderRadius: '24px', border: '1px solid #e8e6e0', textDecoration: 'none', color: '#141414', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', background: '#fdf9f3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={28} color="#e8a020" /></div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Safety Tips</span>
             </Link>
             <button onClick={handleSOS} className="landing-feature-card" style={{ cursor: 'pointer', background: '#ffffff', padding: '32px 24px', borderRadius: '24px', border: '1px solid #e8e6e0', color: '#141414', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', background: '#fdeaea', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={28} color="#e04040" /></div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>SOS Contacts</span>
             </button>
             <Link to="/map" className="landing-feature-card" style={{ background: '#ffffff', padding: '32px 24px', borderRadius: '24px', border: '1px solid #e8e6e0', textDecoration: 'none', color: '#141414', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', background: '#fdf9f3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={28} color="#e8a020" /></div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Safety Report</span>
             </Link>
          </div>
        </section>
      </Show>

      {/* 6. EMERGENCY SOS STRIP */}
      <section style={{ background: '#2d9e6b', padding: '40px 40px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: 0 }}>🚨 Emergency? Find nearest police station instantly</h2>
           <button onClick={handleSOS} className="landing-feature-card" style={{ padding: '16px 40px', background: '#ffffff', color: '#141414', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>Activate SOS</button>
        </div>
      </section>

    </div>
  );
}
