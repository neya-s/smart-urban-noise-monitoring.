const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Universal fetch wrapper for Smart Urban Noise Monitoring API
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const authAPI = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
};

export const complaintAPI = {
  create: (payload) => request('/complaints', { method: 'POST', body: JSON.stringify(payload) }),
  getMyComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/complaints/my${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getAllComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/complaints${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) => request(`/complaints/${id}`, { method: 'GET' }),
  delete: (id) => request(`/complaints/${id}`, { method: 'DELETE' }),
  updateStatus: (id, payload) => request(`/complaints/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
};

export const hotspotAPI = {
  getHotspots: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hotspots${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) => request(`/hotspots/${id}`, { method: 'GET' }),
};

export const statsAPI = {
  getCitizenDashboard: () => request('/stats/citizen-dashboard', { method: 'GET' }),
  getStaffDashboard: () => request('/stats/staff-dashboard', { method: 'GET' }),
};

export default {
  auth: authAPI,
  complaints: complaintAPI,
  hotspots: hotspotAPI,
  stats: statsAPI,
};
