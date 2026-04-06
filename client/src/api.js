import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000' });

export const getPosts = (category) =>
  api.get('/posts', { params: category && category !== '전체' ? { category } : {} }).then((r) => r.data);

export const createPost = (content, category) =>
  api.post('/posts', { content, category }).then((r) => r.data);

export const getPost = (id) =>
  api.get(`/posts/${id}`).then((r) => r.data);

export const createComment = (postId, content) =>
  api.post(`/posts/${postId}/comments`, { content }).then((r) => r.data);

export const addReaction = (postId, type, action = 'add') =>
  api.post(`/posts/${postId}/reactions`, { type, action }).then((r) => r.data);
