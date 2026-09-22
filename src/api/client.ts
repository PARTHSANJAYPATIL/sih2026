/**
 * Farm2Market AI - Full-Stack REST API Client
 * Manages JWT tokens, automatic headers, and standard error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('f2m_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('f2m_refresh_token');
  }

  public setTokens(access: string, refresh?: string) {
    localStorage.setItem('f2m_access_token', access);
    if (refresh) {
      localStorage.setItem('f2m_refresh_token', refresh);
    }
  }

  public clearTokens() {
    localStorage.removeItem('f2m_access_token');
    localStorage.removeItem('f2m_refresh_token');
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return null;

    try {
      const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const resData = await response.json();
      const newAccess = resData.data?.access || resData.access;
      if (newAccess) {
        localStorage.setItem('f2m_access_token', newAccess);
        return newAccess;
      }
    } catch {
      this.clearTokens();
    }
    return null;
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, headers = {}, ...customConfig } = options;

    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          queryParams.append(key, String(val));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = this.getAccessToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...authHeaders,
        ...(headers as Record<string, string>),
      },
    };

    try {
      let response = await fetch(url, config);

      // Handle token expiration & retry once
      if (response.status === 401 && this.getRefreshToken()) {
        const newAccess = await this.refreshAccessToken();
        if (newAccess) {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccess}`;
          response = await fetch(url, config);
        }
      }

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: json.message || json.error?.message || response.statusText,
          error: json.error || { code: 'HTTP_ERROR', message: json.message || 'Request failed' },
          data: json.data || null,
        };
      }

      // If backend already envelopes with { success: true, data: ... }
      if (json && typeof json === 'object' && 'data' in json) {
        return json as ApiResponse<T>;
      }

      return {
        success: true,
        data: json as T,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network connection failed',
        error: { code: 'NETWORK_ERROR', message: err.message || 'Network error' },
        data: null as any,
      };
    }
  }

  public get<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
