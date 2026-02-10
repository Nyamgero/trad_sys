// ============================================
// services/api/client.ts
// ============================================

import type { ApiResponse, ApiError, QueryParams } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      const { page, pageSize, sortBy, sortOrder, filters } = params;

      if (page !== undefined) url.searchParams.set('page', String(page));
      if (pageSize !== undefined) url.searchParams.set('pageSize', String(pageSize));
      if (sortBy) url.searchParams.set('sortBy', sortBy);
      if (sortOrder) url.searchParams.set('sortOrder', sortOrder);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          url.searchParams.set(key, String(value));
        });
      }
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
      }));
      throw error;
    }
    return response.json();
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.defaultHeaders,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async post<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.defaultHeaders,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  clearAuthToken(): void {
    const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
    this.defaultHeaders = rest;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
