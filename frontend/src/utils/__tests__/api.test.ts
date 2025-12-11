import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { storage } from '../storage';

vi.mock('axios');
vi.mock('../storage');

const mockedAxios = vi.mocked(axios);

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios instance with base URL', () => {
    expect(mockedAxios.create).toHaveBeenCalled();
  });

  it('should add auth token to request headers when token exists', async () => {
    const token = 'jwt-token-123';
    vi.mocked(storage.getToken).mockReturnValue(token);

    const mockConfig = {
      headers: {},
    };

    const interceptor = mockedAxios.create.mock.results[0].value.interceptors.request.handlers[0]
      .fulfilled;

    const result = await interceptor(mockConfig);

    expect(result.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('should not add auth token when token does not exist', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);

    const mockConfig = {
      headers: {},
    };

    const interceptor = mockedAxios.create.mock.results[0].value.interceptors.request.handlers[0]
      .fulfilled;

    const result = await interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle 401 errors by redirecting to login', async () => {
    const error = {
      response: {
        status: 401,
      },
      config: {},
      isAxiosError: true,
    };

    const mockWindowLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockWindowLocation,
      writable: true,
    });

    const interceptor = mockedAxios.create.mock.results[0].value.interceptors.response.handlers[0]
      .rejected;

    await interceptor(error);

    expect(mockWindowLocation.href).toBe('/login');
  });

  it('should not redirect on non-401 errors', async () => {
    const error = {
      response: {
        status: 500,
      },
      config: {},
      isAxiosError: true,
    };

    const mockWindowLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockWindowLocation,
      writable: true,
    });

    const interceptor = mockedAxios.create.mock.results[0].value.interceptors.response.handlers[0]
      .rejected;

    try {
      await interceptor(error);
    } catch (e) {
      expect(mockWindowLocation.href).toBe('');
    }
  });
});

