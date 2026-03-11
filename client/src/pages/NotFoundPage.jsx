import { useNavigate } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fdf9f3',
        color: '#141414',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div
        className="panel-card"
        style={{
          maxWidth: '400px',
          textAlign: 'center',
          background: '#ffffff',
          border: '1px solid #e8e6e0',
          borderRadius: '24px',
          padding: '48px 32px',
        }}
      >
        <div
          style={{
            background: '#fff4e0',
            borderRadius: '16px',
            padding: '16px',
            display: 'inline-flex',
            marginBottom: '24px',
          }}
        >
          <Shield size={48} color="#e8a020" strokeWidth={2} />
        </div>
        <h1 className="font-playfair" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px', color: '#141414' }}>404</h1>
        <p style={{ fontSize: '15px', color: '#6b6b6b', marginBottom: '32px' }}>
          Page not found. The route you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#141414',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Home size={18} />
          Go Home
        </button>
      </div>
    </div>
  );
}
