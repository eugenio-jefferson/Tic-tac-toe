const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      // Alterado para sessionStorage
      sessionStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      // Alterado para sessionStorage
      this.token = sessionStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      // Alterado para sessionStorage
      sessionStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(username, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { username, password },
    });
  }

  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Users endpoints
  async getOnlineUsers() {
    return this.request('/users/online');
  }

  async getUserStats(userId) {
    return this.request(`/users/stats/${userId}`);
  }

  async getLeaderboard() {
    return this.request('/users/leaderboard');
  }

  // Games endpoints
  async createInvitation(toUserId) {
    return this.request('/games/invitations', {
      method: 'POST',
      body: { toUserId },
    });
  }

  async acceptInvitation(invitationId) {
    return this.request(`/games/invitations/${invitationId}/accept`, {
      method: 'PUT',
    });
  }

  async rejectInvitation(invitationId) {
    return this.request(`/games/invitations/${invitationId}/reject`, {
      method: 'PUT',
    });
  }

  async getPendingInvitations() {
    return this.request('/games/invitations/pending');
  }

  async getSentInvitations() {
    return this.request('/games/invitations/sent');
  }

  async makeMove(gameId, position) {
    return this.request(`/games/${gameId}/moves`, {
      method: 'POST',
      body: { position },
    });
  }

  async abandonGame(gameId) {
    return this.request(`/games/${gameId}/abandon`, {
      method: 'PUT',
    });
  }

  async getGame(gameId) {
    return this.request(`/games/${gameId}`);
  }

  async getUserGames(status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/games${query}`);
  }
}

export const apiClient = new ApiClient();