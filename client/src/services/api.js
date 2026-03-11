import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const api = axios.create({ baseURL: BASE });

export const getNearbyRoads = async (lat, lng, radius = 1000) => {
  const { data } = await api.get('/api/roads/nearby', { params: { lat, lng, radius } });
  return data;
};

export const getSafestRoute = async (startLat, startLng, endLat, endLng) => {
  const { data } = await api.get('/api/roads/route', {
    params: { startLat, startLng, endLat, endLng },
  });
  return data;
};

export const getMultipleRoutes = async (startLat, startLng, endLat, endLng, maxRoutes = 5) => {
  const { data } = await api.get('/api/roads/routes', {
    params: { startLat, startLng, endLat, endLng, maxRoutes },
  });
  return data;
};

export const reportRoad = async (roadId, description) => {
  const { data } = await api.post(`/api/roads/${roadId}/report`, { description });
  return data;
};

export const getNearestPolice = async (lat, lng) => {
  const { data } = await api.get('/api/police/nearest', { params: { lat, lng } });
  return data;
};

// ── Community API ─────────────────────────────────────────────

export const getCommunityPosts = async (page = 1, limit = 10, category = 'all') => {
  const { data } = await api.get('/api/community/posts', { params: { page, limit, category } });
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/api/community/posts', postData);
  return data;
};

export const addComment = async (postId, commentData) => {
  const { data } = await api.post(`/api/community/posts/${postId}/comments`, commentData);
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

export const getPostById = async (id) => {
  const { data } = await api.get(`/api/community/posts/${id}`);
  return data;
};
