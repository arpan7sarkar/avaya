import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Show, UserButton, useUser } from '@clerk/react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Map' },
  { to: '/community', label: 'Community' },
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 40px',
        background: 'rgba(255,255,255,0.92)',
        borderBottom: '1px solid #e8e6e0',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
        {/* Left: Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Shield size={28} color="#e8a020" strokeWidth={2} />
          <span className="font-playfair" style={{ fontWeight: 800, fontSize: '26px', color: '#141414' }}>Avaya</span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          aria-label="Main navigation"
        >
          <Show when="signed-in">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#141414' : '#6b6b6b',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </Show>
        </nav>

        {/* Right: Auth & Mobile Menu Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '120px', justifyContent: 'flex-end' }}>
          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to="/sign-in"
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#6b6b6b',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogIn size={18} style={{ marginRight: '6px' }} />
                Login
              </Link>
              <Link
                to="/sign-up"
                style={{
                  padding: '10px 24px',
                  background: '#141414',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <UserPlus size={18} style={{ marginRight: '6px' }} />
                Sign Up
              </Link>
            </div>
          </Show>
          <Show when="signed-in">
            <div style={{ background: '#f7f6f2', padding: '4px 16px 4px 4px', borderRadius: '30px', border: '1px solid #e8e6e0', display: 'flex', alignItems: 'center' }}>
              <UserButton showName={true} />
            </div>
          </Show>

          {/* Mobile menu toggle (visible only on small screens via CSS) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{
              display: 'flex',
              padding: '8px',
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '10px',
              color: '#141414',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="animate-fade-in mobile-nav"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.98)',
            borderBottom: '1px solid #e8e6e0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Show when="signed-in">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#e8a020' : '#141414',
                    background: isActive ? '#fdf9f3' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </Show>
        </div>
      )}
    </header>
  );
}
