import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export default function ContactPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      addToast('Thank you! We\'ll get back to you soon.', 'success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="font-playfair" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em', color: '#141414' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '16px', color: '#6b6b6b', lineHeight: 1.6 }}>
          Have feedback, a question, or want to report an issue? We&apos;d love to hear from you.
        </p>
      </div>

      <div
        className="panel-card"
        style={{
          padding: '32px',
          marginBottom: '32px',
          background: '#ffffff',
          border: '1px solid #e8e6e0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#fff4e0',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mail size={24} color="#e8a020" />
          </div>
          <div>
            <h2 className="font-playfair" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: '#141414' }}>Get in touch</h2>
            <p style={{ fontSize: '14px', color: '#6b6b6b' }}>We typically respond within 24–48 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="contact-name" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#141414' }}>
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#fdf9f3',
                border: '1px solid #e8e6e0',
                borderRadius: '12px',
                color: '#141414',
                fontSize: '15px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="contact-email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#141414' }}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#fdf9f3',
                border: '1px solid #e8e6e0',
                borderRadius: '12px',
                color: '#141414',
                fontSize: '15px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="contact-message" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#141414' }}>
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell us what's on your mind..."
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#fdf9f3',
                border: '1px solid #e8e6e0',
                borderRadius: '12px',
                color: '#141414',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              background: submitting ? '#f7f6f2' : '#e8a020',
              color: submitting ? '#6b6b6b' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: submitting ? 'none' : '0 8px 16px rgba(232,160,32,0.2)'
            }}
          >
            <Send size={18} />
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: '14px', color: '#6b6b6b', textAlign: 'center' }}>
        For emergencies, always call <strong style={{ color: '#e04040' }}>100</strong>.
      </p>
    </div>
  );
}
