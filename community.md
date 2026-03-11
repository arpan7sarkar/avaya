# 🌸 Community Feature — Implementation Plan

> **Project:** Abhaya (Avaya) — Women's Safety Web App  
> **Stack:** Node.js + Express + PostgreSQL (NeonDB) · React + Vite + Clerk Auth · Zustand · Tailwind v4 · Leaflet

---



## 📦 Feature Breakdown

The Community feature has **4 interconnected parts**:

1. **Community Feed** — Users can create posts (text + category), others can view + comment
2. **Safety Info Sharing** — Posts categorized as `general`, `safety-tip`, `incident-alert`, `resource`
3. **SOS Community Alert** — When a user presses the SOS/Emergency button, an automatic post is created with her location + "HELP HELP" distress signal visible to community
4. **Nodemailer SOS Email** — On SOS trigger, send an emergency email to configured trusted contact emails with location + Google Maps link

---

## 🗄️ Phase 1 — Backend: Database Schema

### Step 1.1 — Add Community Tables to `src/db/index.js`

Inside the `initDB()` function, **after all existing table creation blocks**, add these:

```js
// ── Table 6: community_posts ──────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS community_posts (
    id            SERIAL          PRIMARY KEY,
    clerk_user_id VARCHAR(255)    NOT NULL,
    author_name   VARCHAR(255)    NOT NULL,
    author_avatar TEXT,
    content       TEXT            NOT NULL,
    category      VARCHAR(20)     CHECK (category IN ('general', 'safety-tip', 'incident-alert', 'resource', 'sos-alert'))
                                  DEFAULT 'general',
    is_sos        BOOLEAN         DEFAULT false,
    sos_lat       NUMERIC(10,7),
    sos_lng       NUMERIC(10,7),
    sos_address   TEXT,
    created_at    TIMESTAMP       DEFAULT NOW(),
    updated_at    TIMESTAMP       DEFAULT NOW()
  );
`);

// ── Table 7: community_comments ───────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS community_comments (
    id            SERIAL          PRIMARY KEY,
    post_id       INT             NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255)    NOT NULL,
    author_name   VARCHAR(255)    NOT NULL,
    author_avatar TEXT,
    content       TEXT            NOT NULL,
    created_at    TIMESTAMP       DEFAULT NOW()
  );
`);

await client.query(`
  CREATE INDEX IF NOT EXISTS idx_comments_post_id
    ON community_comments(post_id);
`);

// ── Table 8: community_likes ──────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS community_likes (
    id            SERIAL          PRIMARY KEY,
    post_id       INT             NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    clerk_user_id VARCHAR(255)    NOT NULL,
    created_at    TIMESTAMP       DEFAULT NOW(),
    UNIQUE (post_id, clerk_user_id)
  );
`);
```

> **Note:** We use `clerk_user_id` (Clerk's user ID string like `user_2abc...`) instead of our own `users` table ID — no separate sync step needed since Clerk is the auth source of truth.

---

## 📡 Phase 2 — Backend: Routes & Controllers

### Step 2.1 — Install Nodemailer

```bash
cd backend
npm install nodemailer
```

### Step 2.2 — Update `backend/.env`

Add these variables to `backend/.env`:

```
# Nodemailer / Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SOS_ALERT_EMAILS=trusted1@email.com,trusted2@email.com
```

**Getting Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Select "Mail" → Generate 16-char code → use that as `SMTP_PASS`.

### Step 2.3 — Create new file `backend/src/lib/mailer.js`

Create the folder `backend/src/lib/` and add `mailer.js`:

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendSOSEmail(authorName, lat, lng, address) {
  const recipientList = process.env.SOS_ALERT_EMAILS || '';
  if (!recipientList) return;

  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const emails = recipientList.split(',').map((e) => e.trim()).filter(Boolean);

  await transporter.sendMail({
    from: `"Abhaya SOS Alert 🚨" <${process.env.SMTP_USER}>`,
    to: emails.join(', '),
    subject: `🚨 EMERGENCY: ${authorName} needs HELP RIGHT NOW!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff8f8;border:2px solid #dc2626;border-radius:12px;overflow:hidden;">
        <div style="background:#dc2626;color:white;padding:24px;text-align:center;">
          <h1 style="margin:0;font-size:28px;">🚨 SOS EMERGENCY ALERT</h1>
          <p style="margin:8px 0 0;opacity:0.9;">Automated emergency message from Abhaya</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:20px;font-weight:bold;color:#dc2626;margin:0 0 20px;">
            HELP! HELP! ${authorName} is in DANGER and needs immediate assistance!
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="background:#fef2f2;">
              <td style="padding:12px;font-weight:bold;border:1px solid #fca5a5;">Person</td>
              <td style="padding:12px;border:1px solid #fca5a5;">${authorName}</td>
            </tr>
            <tr>
              <td style="padding:12px;font-weight:bold;border:1px solid #fca5a5;">Location</td>
              <td style="padding:12px;border:1px solid #fca5a5;">${address || `${lat}, ${lng}`}</td>
            </tr>
            <tr style="background:#fef2f2;">
              <td style="padding:12px;font-weight:bold;border:1px solid #fca5a5;">Coordinates</td>
              <td style="padding:12px;border:1px solid #fca5a5;">Lat: ${lat}, Lng: ${lng}</td>
            </tr>
            <tr>
              <td style="padding:12px;font-weight:bold;border:1px solid #fca5a5;">Time</td>
              <td style="padding:12px;border:1px solid #fca5a5;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>
          <a href="${mapsLink}" style="display:block;text-align:center;background:#dc2626;color:white;padding:16px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;margin-bottom:20px;">
            📍 View Location on Google Maps
          </a>
          <p style="color:#6b7280;font-size:13px;text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;">
            Please call emergency services (100) or reach her immediately.<br/>
            This alert was triggered via Abhaya — Women\'s Safety Platform.
          </p>
        </div>
      </div>
    `,
  });

  console.log(`📧 SOS email sent to: ${emails.join(', ')}`);
}

module.exports = { sendSOSEmail };
```

### Step 2.4 — Create new file `backend/src/routes/community.js`

```js
const express = require('express');
const router  = express.Router();
const { pool } = require('../db');
const { sendSOSEmail } = require('../lib/mailer');

// GET /api/community/posts?page=1&limit=10&category=all
router.get('/posts', async (req, res, next) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 10);
    const offset   = (page - 1) * limit;
    const { category } = req.query;

    const hasFilter = category && category !== 'all';
    const params    = hasFilter ? [limit, offset, category] : [limit, offset];
    const where     = hasFilter ? 'WHERE p.category = $3' : '';

    const result = await pool.query(
      `SELECT p.*,
         COUNT(DISTINCT c.id) AS comment_count,
         COUNT(DISTINCT l.id) AS likes_count
       FROM community_posts p
       LEFT JOIN community_comments c ON c.post_id = p.id
       LEFT JOIN community_likes    l ON l.post_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM community_posts ${hasFilter ? 'WHERE category = $1' : ''}`,
      hasFilter ? [category] : []
    );

    res.json({
      posts: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) { next(err); }
});

// POST /api/community/posts
router.post('/posts', async (req, res, next) => {
  try {
    const { clerkUserId, authorName, authorAvatar, content, category = 'general',
            isSos = false, sosLat, sosLng, sosAddress } = req.body;

    if (!clerkUserId || !authorName || !content?.trim()) {
      return res.status(400).json({ error: 'clerkUserId, authorName and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO community_posts
         (clerk_user_id, author_name, author_avatar, content, category, is_sos, sos_lat, sos_lng, sos_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [clerkUserId, authorName, authorAvatar||null, content.trim(),
       isSos ? 'sos-alert' : category, isSos, sosLat||null, sosLng||null, sosAddress||null]
    );

    if (isSos && sosLat && sosLng) {
      sendSOSEmail(authorName, sosLat, sosLng, sosAddress).catch((e) =>
        console.error('❌ SOS email failed:', e.message)
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// GET /api/community/posts/:id  (post + comments)
router.get('/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const postRes = await pool.query(
      `SELECT p.*, COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT l.id) AS likes_count
       FROM community_posts p
       LEFT JOIN community_comments c ON c.post_id=p.id
       LEFT JOIN community_likes    l ON l.post_id=p.id
       WHERE p.id=$1 GROUP BY p.id`, [id]
    );
    if (!postRes.rows.length) return res.status(404).json({ error: 'Post not found' });

    const commentsRes = await pool.query(
      `SELECT * FROM community_comments WHERE post_id=$1 ORDER BY created_at ASC`, [id]
    );
    res.json({ post: postRes.rows[0], comments: commentsRes.rows });
  } catch (err) { next(err); }
});

// DELETE /api/community/posts/:id  — only author
router.delete('/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clerkUserId } = req.body;
    const result = await pool.query(
      `DELETE FROM community_posts WHERE id=$1 AND clerk_user_id=$2 RETURNING id`,
      [id, clerkUserId]
    );
    if (!result.rowCount) return res.status(403).json({ error: 'Not authorized or not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
});

// POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { clerkUserId, authorName, authorAvatar, content } = req.body;
    if (!clerkUserId || !authorName || !content?.trim())
      return res.status(400).json({ error: 'clerkUserId, authorName, content required' });

    const check = await pool.query(`SELECT id FROM community_posts WHERE id=$1`, [postId]);
    if (!check.rows.length) return res.status(404).json({ error: 'Post not found' });

    const result = await pool.query(
      `INSERT INTO community_comments (post_id,clerk_user_id,author_name,author_avatar,content)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [postId, clerkUserId, authorName, authorAvatar||null, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/community/comments/:id
router.delete('/comments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clerkUserId } = req.body;
    const result = await pool.query(
      `DELETE FROM community_comments WHERE id=$1 AND clerk_user_id=$2 RETURNING id`,
      [id, clerkUserId]
    );
    if (!result.rowCount) return res.status(403).json({ error: 'Not authorized or not found' });
    res.json({ message: 'Comment deleted' });
  } catch (err) { next(err); }
});

// POST /api/community/posts/:id/like  (toggle)
router.post('/posts/:id/like', async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { clerkUserId } = req.body;
    if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId required' });

    const exists = await pool.query(
      `SELECT id FROM community_likes WHERE post_id=$1 AND clerk_user_id=$2`,
      [postId, clerkUserId]
    );
    if (exists.rows.length) {
      await pool.query(`DELETE FROM community_likes WHERE post_id=$1 AND clerk_user_id=$2`,[postId,clerkUserId]);
      return res.json({ liked: false });
    }
    await pool.query(`INSERT INTO community_likes(post_id,clerk_user_id) VALUES($1,$2)`,[postId,clerkUserId]);
    res.json({ liked: true });
  } catch (err) { next(err); }
});

// POST /api/community/sos-alert  (dedicated SOS endpoint)
router.post('/sos-alert', async (req, res, next) => {
  try {
    const { clerkUserId, authorName, authorAvatar, lat, lng, address } = req.body;
    if (!clerkUserId || !authorName || !lat || !lng)
      return res.status(400).json({ error: 'clerkUserId, authorName, lat, lng required' });

    const sosContent = `🚨 HELP! HELP! I am in DANGER and need immediate assistance! Please help me! My current location: ${address || `${lat}, ${lng}`}. EMERGENCY! HELP!`;

    const result = await pool.query(
      `INSERT INTO community_posts
         (clerk_user_id,author_name,author_avatar,content,category,is_sos,sos_lat,sos_lng,sos_address)
       VALUES ($1,$2,$3,$4,'sos-alert',true,$5,$6,$7) RETURNING *`,
      [clerkUserId, authorName, authorAvatar||null, sosContent, lat, lng, address||null]
    );

    // Fire and forget — don't block response
    sendSOSEmail(authorName, lat, lng, address).catch((e) =>
      console.error('❌ SOS email error:', e.message)
    );

    res.status(201).json({ post: result.rows[0], message: 'SOS alert posted and email sent' });
  } catch (err) { next(err); }
});

module.exports = router;
```

### Step 2.5 — Register Route in `src/app.js`

**Add at the top** (with other requires):
```js
const communityRouter = require('./routes/community');
```

**Add in the Routes section** (after policeRouter):
```js
app.use('/api/community', communityRouter);
```

---

## 🌐 Phase 3 — Frontend: API Service Layer

### Step 3.1 — Append to `client/src/services/api.js`

Add these functions at the bottom of the file:

```js
// ── Community API ─────────────────────────────────────────────

export const getCommunityPosts = async (page = 1, limit = 10, category = 'all') => {
  const { data } = await api.get('/api/community/posts', { params: { page, limit, category } });
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/api/community/posts', postData);
  return data;
};

export const getPostById = async (id) => {
  const { data } = await api.get(`/api/community/posts/${id}`);
  return data;
};

export const deletePost = async (id, clerkUserId) => {
  const { data } = await api.delete(`/api/community/posts/${id}`, { data: { clerkUserId } });
  return data;
};

export const addComment = async (postId, commentData) => {
  const { data } = await api.post(`/api/community/posts/${postId}/comments`, commentData);
  return data;
};

export const deleteComment = async (commentId, clerkUserId) => {
  const { data } = await api.delete(`/api/community/comments/${commentId}`, { data: { clerkUserId } });
  return data;
};

export const toggleLike = async (postId, clerkUserId) => {
  const { data } = await api.post(`/api/community/posts/${postId}/like`, { clerkUserId });
  return data;
};

export const sendSOSAlert = async (sosData) => {
  const { data } = await api.post('/api/community/sos-alert', sosData);
  return data;
};
```

---

## 🎨 Phase 4 — Frontend: CommunityPage

### Step 4.1 — Create `client/src/pages/CommunityPage.jsx`

This is a large self-contained page. Key components inside the file:

- **`CATEGORIES` constant** — array of `{ value, label, icon, color }` for all post types
- **`timeAgo(dateStr)`** — helper function converts ISO timestamp to "5m ago"
- **`CategoryBadge`** — small colored pill showing the post category
- **`PostCard`** — renders a single community post with author info, content, SOS location link, like + comment buttons, delete button (own posts only)
- **`NewPostModal`** — modal with category dropdown + textarea + submit; shown when signed-in user clicks "New Post"
- **`CommentsPanel`** — modal showing all comments for a post + input to add new comment
- **`CommunityPage`** (default export) — the main page component with:
  - Category filter tabs
  - Paginated post feed
  - "New Post" button (auth-gated)
  - Handlers for create, delete, like, load-more

**Full component code** — copy exactly as written into `CommunityPage.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { MessageCircle, Heart, Trash2, Plus, Shield, X, Send, ChevronDown } from 'lucide-react';
import {
  getCommunityPosts, createPost, deletePost,
  addComment, deleteComment, toggleLike, getPostById,
} from '../services/api';

const CATEGORIES = [
  { value: 'all',            label: 'All Posts',      icon: '📋', color: '#6b6b6b' },
  { value: 'general',        label: 'General',        icon: '💬', color: '#6b7fd4' },
  { value: 'safety-tip',     label: 'Safety Tips',    icon: '🛡️', color: '#2d9e6b' },
  { value: 'incident-alert', label: 'Incident Alert', icon: '⚠️', color: '#e8a020' },
  { value: 'resource',       label: 'Resources',      icon: '📚', color: '#8b5cf6' },
  { value: 'sos-alert',      label: 'SOS Alerts',     icon: '🚨', color: '#dc2626' },
];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[1];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 700,
      background: cat.color + '18', color: cat.color,
      border: `1px solid ${cat.color}30`,
    }}>
      {cat.icon} {cat.label}
    </span>
  );
}

function Avatar({ name, avatarUrl, size = 40, bgColor = '#e8a020' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bgColor, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, flexShrink: 0, overflow: 'hidden',
    }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

function PostCard({ post, currentUserId, onDelete, onLike, onOpenComments }) {
  const isSos = post.is_sos;
  return (
    <article style={{
      background: isSos ? 'rgba(220,38,38,0.03)' : '#ffffff',
      border: isSos ? '1.5px solid rgba(220,38,38,0.25)' : '1px solid #e8e6e0',
      borderRadius: '16px', padding: '20px 24px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar name={post.author_name} avatarUrl={post.author_avatar} bgColor={isSos ? '#dc2626' : '#e8a020'} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#141414' }}>{post.author_name}</div>
            <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{timeAgo(post.created_at)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CategoryBadge category={post.category} />
          {currentUserId === post.clerk_user_id && (
            <button onClick={() => onDelete(post.id)} title="Delete post"
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p style={{ color: '#2d2d2d', lineHeight: 1.65, fontSize: '15px', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </p>

      {isSos && post.sos_lat && (
        <a href={`https://www.google.com/maps?q=${post.sos_lat},${post.sos_lng}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px',
            color: '#dc2626', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none', marginBottom: '16px',
          }}>
          📍 View Emergency Location on Maps
        </a>
      )}

      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f0ede8', paddingTop: '12px' }}>
        <button onClick={() => onLike(post.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#6b6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '4px 8px', borderRadius: '8px' }}>
          <Heart size={14} /> {post.likes_count || 0}
        </button>
        <button onClick={() => onOpenComments(post.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#6b6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '4px 8px', borderRadius: '8px' }}>
          <MessageCircle size={14} /> {post.comment_count || 0} Comments
        </button>
      </div>
    </article>
  );
}

function NewPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await onSubmit({ content, category });
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#141414' }}>Create Community Post</h2>
          <button onClick={onClose} style={{ background: '#f7f6f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b6b6b', marginBottom: '6px' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', background: '#fdf9f3', color: '#141414' }}>
              {CATEGORIES.filter((c) => c.value !== 'all' && c.value !== 'sos-alert').map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b6b6b', marginBottom: '6px' }}>What do you want to share?</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Share a safety tip, incident report, resource, or anything helpful for our community..."
              rows={5} required
              style={{ width: '100%', padding: '12px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', resize: 'vertical', lineHeight: 1.6, color: '#141414', background: '#fdf9f3' }} />
          </div>
          <button type="submit" disabled={submitting || !content.trim()}
            style={{ width: '100%', padding: '13px', background: '#141414', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CommentsPanel({ postId, currentUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPostById(postId).then(({ comments }) => {
      setComments(comments);
      setLoading(false);
    });
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    const comment = await addComment(postId, {
      clerkUserId:  currentUser.id,
      authorName:   currentUser.fullName || currentUser.firstName || 'User',
      authorAvatar: currentUser.imageUrl,
      content:      newComment.trim(),
    });
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId, currentUser.id);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#141414' }}>Comments</h3>
          <button onClick={onClose} style={{ background: '#f7f6f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {loading && <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>Loading comments...</p>}
          {!loading && comments.length === 0 && (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <Avatar name={c.author_name} avatarUrl={c.author_avatar} size={34} />
              <div style={{ flex: 1, background: '#f7f6f2', borderRadius: '12px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#141414' }}>{c.author_name}</span>
                  <span style={{ fontSize: '11px', color: '#6b6b6b' }}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#2d2d2d', lineHeight: 1.5 }}>{c.content}</p>
                {currentUser?.id === c.clerk_user_id && (
                  <button onClick={() => handleDeleteComment(c.id)}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '11px', marginTop: '4px', padding: 0 }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {currentUser && (
          <form onSubmit={handleAddComment}
            style={{ padding: '16px 24px', borderTop: '1px solid #e8e6e0', display: 'flex', gap: '10px' }}>
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', background: '#fdf9f3', color: '#141414' }} />
            <button type="submit" disabled={submitting || !newComment.trim()}
              style={{ padding: '10px 16px', background: '#141414', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Send size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNewPost, setShowNewPost]       = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const LIMIT = 10;

  const loadPosts = useCallback(async (p = 1, cat = activeCategory) => {
    setLoading(true);
    try {
      const data = await getCommunityPosts(p, LIMIT, cat);
      setPosts((prev) => p === 1 ? data.posts : [...prev, ...data.posts]);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { loadPosts(1, activeCategory); }, [activeCategory]);

  const handleCreatePost = async ({ content, category }) => {
    if (!isSignedIn) return;
    await createPost({
      clerkUserId:  user.id,
      authorName:   user.fullName || user.firstName || 'Anonymous',
      authorAvatar: user.imageUrl,
      content,
      category,
    });
    await loadPosts(1, activeCategory);
  };

  const handleDeletePost = async (postId) => {
    if (!isSignedIn || !window.confirm('Delete this post?')) return;
    await deletePost(postId, user.id);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setTotal((t) => t - 1);
  };

  const handleLike = async (postId) => {
    if (!isSignedIn) return;
    await toggleLike(postId, user.id);
    await loadPosts(1, activeCategory);
  };

  const hasMore = posts.length < total;

  return (
    <div className="landing-wrapper">
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#fff4e0', borderRadius: '20px', marginBottom: '16px' }}>
            <Shield size={14} color="#e8a020" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e8a020' }}>Safety Community</span>
          </div>
          <h1 className="font-playfair" style={{ fontSize: '40px', fontWeight: 800, color: '#141414', marginBottom: '12px' }}>
            Community Board
          </h1>
          <p style={{ color: '#6b6b6b', fontSize: '16px', lineHeight: 1.6 }}>
            Share safety tips, incident alerts, and resources. Stay informed. Stay safe. Together.
          </p>
        </div>

        {/* Filters + New Post */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  border: activeCategory === cat.value ? `1.5px solid ${cat.color}` : '1.5px solid #e8e6e0',
                  background: activeCategory === cat.value ? cat.color + '15' : 'transparent',
                  color: activeCategory === cat.value ? cat.color : '#6b6b6b',
                }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          {isSignedIn && (
            <button onClick={() => setShowNewPost(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: '#141414', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={16} /> New Post
            </button>
          )}
        </div>

        {/* Feed */}
        {loading && page === 1
          ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b6b' }}>Loading community posts...</div>
          : posts.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b6b' }}>
                <p>No posts yet in this category.</p>
                {isSignedIn && <p style={{ marginTop: '8px' }}>Be the first to share something helpful!</p>}
              </div>
            : posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={user?.id}
                  onDelete={handleDeletePost} onLike={handleLike}
                  onOpenComments={setOpenCommentsPostId} />
              ))
        }

        {hasMore && (
          <button onClick={() => loadPosts(page + 1)} disabled={loading}
            style={{ width: '100%', padding: '13px', background: '#f7f6f2', border: '1.5px solid #e8e6e0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#6b6b6b', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ChevronDown size={16} /> Load More
          </button>
        )}
      </div>

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleCreatePost} />
      )}
      {openCommentsPostId && (
        <CommentsPanel postId={openCommentsPostId} currentUser={user}
          onClose={() => setOpenCommentsPostId(null)} />
      )}
    </div>
  );
}
```

---

## 🔗 Phase 5 — Frontend: Routing & Navigation

### Step 5.1 — Edit `client/src/App.jsx`

**Add import** (with other page imports at top):
```jsx
import CommunityPage from './pages/CommunityPage';
```

**Add route** inside `<Routes>` (e.g. after the `/safety-tips` route):
```jsx
<Route path="/community" element={<SiteLayout><CommunityPage /></SiteLayout>} />
```

### Step 5.2 — Edit `client/src/components/Layout/SiteHeader.jsx`

Update the `navLinks` array at the top of the file:

```js
const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/map',         label: 'Map' },
  { to: '/community',   label: 'Community' },   // ← ADD THIS
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/about',       label: 'About' },
  { to: '/contact',     label: 'Contact' },
];
```

---

## 🚨 Phase 6 — SOS Integration

When the SOS button is tapped, it should:
1. ✅ Get nearest police station (existing behavior)
2. 🆕 Post a community SOS alert with location
3. 🆕 Trigger the emergency email via nodemailer

### Step 6.1 — Edit `client/src/components/UI/SOSButton.jsx`

Replace the file contents with:

```jsx
import { useState } from 'react';
import { Shield } from 'lucide-react';
import { getNearestPolice, sendSOSAlert } from '../../services/api';
import { useAvayaStore } from '../../store/useAvayaStore';
import { useUser } from '@clerk/react';

export default function SOSButton() {
  const userLocation    = useAvayaStore((s) => s.userLocation);
  const setSosResult    = useAvayaStore((s) => s.setSosResult);
  const setSosModalOpen = useAvayaStore((s) => s.setSosModalOpen);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleSOS = async () => {
    if (loading || !userLocation) return;
    setLoading(true);
    try {
      // 1. Existing: get nearest police station
      const result = await getNearestPolice(userLocation.lat, userLocation.lng);
      setSosResult(result);
      setSosModalOpen(true);

      // 2. New: post SOS to community + send email
      if (user) {
        const address = `Lat: ${userLocation.lat.toFixed(5)}, Lng: ${userLocation.lng.toFixed(5)}`;
        sendSOSAlert({
          clerkUserId:  user.id,
          authorName:   user.fullName || user.firstName || 'A User',
          authorAvatar: user.imageUrl || null,
          lat:     userLocation.lat,
          lng:     userLocation.lng,
          address,
        }).catch((e) => console.error('SOS alert post failed:', e.message));
      }
    } catch {
      setSosResult({
        name: 'Local Police Station',
        phone: '100',
        address: 'Call emergency services',
        distance_meters: null,
      });
      setSosModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSOS}
      disabled={loading}
      aria-label="Emergency SOS"
      style={{
        position: 'fixed', bottom: '24px', left: '16px', zIndex: 1000,
        width: '64px', height: '64px', borderRadius: '50%',
        background: '#dc2626', border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(220,38,38,0.5)',
      }}
    >
      {!loading && (
        <>
          <div className="animate-pulse-ring" style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px solid rgba(220,38,38,0.5)' }} />
          <div className="animate-pulse-ring" style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px solid rgba(220,38,38,0.3)', animationDelay: '0.7s' }} />
        </>
      )}
      {loading
        ? <div style={{ width: '24px', height: '24px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-shield 0.7s linear infinite' }} />
        : <Shield size={28} color="#fff" strokeWidth={2} />
      }
    </button>
  );
}
```

---

## ⚙️ Phase 7 — Environment Variables

### `backend/.env` — final state:
```
DATABASE_URL=postgresql://...your-neon-url...
PORT=5000

# Nodemailer — Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SOS_ALERT_EMAILS=guardian1@email.com,guardian2@email.com
```

No frontend `.env` changes needed.

---

## 📁 File Change Summary

```
backend/
├── src/
│   ├── db/index.js          ← EDIT: Add Tables 6,7,8 in initDB()
│   ├── lib/
│   │   └── mailer.js        ← NEW FILE
│   ├── routes/
│   │   └── community.js     ← NEW FILE
│   └── app.js               ← EDIT: require + app.use community router
└── .env                     ← EDIT: Add SMTP vars

client/src/
├── pages/
│   └── CommunityPage.jsx    ← NEW FILE
├── services/
│   └── api.js               ← EDIT: Append community functions
├── App.jsx                  ← EDIT: Import + add /community route
└── components/
    ├── Layout/
    │   └── SiteHeader.jsx   ← EDIT: Add 'Community' to navLinks
    └── UI/
        └── SOSButton.jsx    ← EDIT: Add sendSOSAlert call
```

---

## 🔄 Recommended Build Order

1. `backend/src/db/index.js` → Add community tables
2. `npm install nodemailer` in backend
3. `backend/.env` → Add SMTP variables
4. `backend/src/lib/mailer.js` → Create mailer utility
5. `backend/src/routes/community.js` → Create all routes
6. `backend/src/app.js` → Register community router
7. `client/src/services/api.js` → Append community API functions
8. `client/src/pages/CommunityPage.jsx` → Create page
9. `client/src/App.jsx` → Add /community route
10. `client/src/components/Layout/SiteHeader.jsx` → Add nav link
11. `client/src/components/UI/SOSButton.jsx` → Integrate SOS alert

---

## 🧪 Testing Checklist

- [ ] Backend restarts successfully after DB changes (tables created automatically via `initDB`)
- [ ] `GET /api/community/posts` returns `{ posts: [], total: 0, page: 1, limit: 10 }`
- [ ] `POST /api/community/posts` creates a post with correct category
- [ ] `POST /api/community/posts/:id/comments` adds a comment
- [ ] `POST /api/community/posts/:id/like` toggles like (double-click removes it)
- [ ] `POST /api/community/sos-alert` creates post + sends email to configured addresses
- [ ] `/community` route loads and shows community page
- [ ] "New Post" button hidden for signed-out users
- [ ] SOS button on Map page creates a community alert post
- [ ] SOS email arrives with correct location + Google Maps link
- [ ] Only post author sees Delete button on their own posts

---

## ⚠️ Important Notes

> **Gmail App Password:** Never use your regular Gmail password. Go to:  
> `myaccount.google.com` → Security → 2-Step Verification → App Passwords → Choose "Mail" → Generate → Copy the 16-char code.

> **SOS Email is Fire-and-Forget:** The API responds immediately after creating the community post. The email is sent asynchronously. This ensures the SOS community post appears instantly even if email is slow.

> **No auth middleware on backend:** Currently API routes are open (no JWT verification). This is fine for a prototype — community posts use Clerk user ID passed from the frontend. For production, add Clerk's backend SDK JWT verification middleware.

> **Reverse Geocoding (Optional Enhancement):** Currently SOS posts show raw coordinates. For human-readable addresses, call the Nominatim API from the frontend before posting: `https://nominatim.openstreetmap.org/reverse?lat=X&lon=Y&format=json` and pass the `display_name` field as the `address` parameter.
