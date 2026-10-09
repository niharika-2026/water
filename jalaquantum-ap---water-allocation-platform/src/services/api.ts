import { 
  User, 
  Reservoir, 
  CanalNetwork, 
  InflowForecastPoint, 
  OptimizationRun, 
  SluiceGateOrder, 
  TelemetryAlert 
} from '../types';

const TOKEN_KEY = 'jalaquantum_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  async register(payload: Partial<User> & { password: string }): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(payload: { name?: string; phone?: string; commandArea?: string }): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // User Management
  async getUsers(): Promise<{ users: User[] }> {
    return request<{ users: User[] }>('/api/users');
  },

  async createUser(payload: Partial<User> & { temporaryPassword?: string }): Promise<{ user: User }> {
    return request<{ user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateUser(id: string, payload: Partial<User>): Promise<{ user: User }> {
    return request<{ user: User }>(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Reservoirs & Canals
  async getReservoirs(): Promise<{ reservoirs: Reservoir[] }> {
    return request<{ reservoirs: Reservoir[] }>('/api/reservoirs');
  },

  async updateReservoirGates(id: string, gatesOpen: number, floodGateStatus?: string): Promise<{ reservoir: Reservoir }> {
    return request<{ reservoir: Reservoir }>(`/api/reservoirs/${id}/gates`, {
      method: 'PATCH',
      body: JSON.stringify({ gatesOpen, floodGateStatus }),
    });
  },

  async getCanals(): Promise<{ canals: CanalNetwork[] }> {
    return request<{ canals: CanalNetwork[] }>('/api/canals');
  },

  // Live Telemetry & Predictions
  async getLivePredictions(): Promise<{
    timestamp: string;
    liveMetrics: {
      totalInflowCusecs: number;
      totalOutflowCusecs: number;
      totalStorageTMC: number;
      totalGrossCapacityTMC: number;
      overallCapacityPct: number;
      netHydrologicalBalanceCusecs: number;
      activeCanalsCount: number;
    };
    forecast: InflowForecastPoint[];
  }> {
    return request('/api/predictions/live');
  },

  // Quantum Optimization
  async runOptimization(payload: {
    scenario: 'Deficit (Drought)' | 'Normal Inflow' | 'Excess (Flood Mitigation)';
    priorityWeights: { drinking: number; agriculture: number; tailEndEquity: number; evaporationLoss: number };
    quantumSteps?: number;
  }): Promise<{ solution: OptimizationRun }> {
    return request<{ solution: OptimizationRun }>('/api/optimize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Sluice Gate Dispatch Orders
  async getDispatchOrders(): Promise<{ orders: SluiceGateOrder[] }> {
    return request<{ orders: SluiceGateOrder[] }>('/api/dispatch');
  },

  async createDispatchOrder(payload: Partial<SluiceGateOrder>): Promise<{ order: SluiceGateOrder }> {
    return request<{ order: SluiceGateOrder }>('/api/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateDispatchStatus(id: string, status: string, executionNotes?: string): Promise<{ order: SluiceGateOrder }> {
    return request<{ order: SluiceGateOrder }>(`/api/dispatch/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, executionNotes }),
    });
  },

  // Alerts
  async getAlerts(): Promise<{ alerts: TelemetryAlert[] }> {
    return request<{ alerts: TelemetryAlert[] }>('/api/alerts');
  },

  async acknowledgeAlert(id: string): Promise<{ alert: TelemetryAlert }> {
    return request<{ alert: TelemetryAlert }>(`/api/alerts/${id}/ack`, {
      method: 'PATCH',
    });
  },

  // AI Hydrological Synthesis
  async synthesizeAI(payload: { scenario?: string; customPrompt?: string }): Promise<{ source: string; analysis: string }> {
    return request<{ source: string; analysis: string }>('/api/ai/synthesize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
