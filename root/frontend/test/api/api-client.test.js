import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiRequest } from '../../src/api/client.js';
import {
  getCodingActivity,
  getCodingSummary,
  fetchGitHubSummary,
  fetchGitContributions,
  fetchLeetcodeStats,
  sendContact,
  sendHireRequest,
  sendChatMessage,
} from '../../src/api/fetchApi.js';

describe('API Client & Status Check Suite', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Core apiRequest Client', () => {
    it('returns parsed JSON data on 200 OK status', async () => {
      const mockPayload = { status: 'ok', data: [1, 2, 3] };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      });

      const result = await apiRequest('/api/test');
      expect(result).toEqual(mockPayload);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('throws descriptive error on non-200 status (e.g. 404, 500)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(apiRequest('/api/nonexistent')).rejects.toThrow('API error: 404');

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(apiRequest('/api/server-error')).rejects.toThrow('API error: 500');
    });

    it('preserves custom headers passed in options', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiRequest('/api/custom', {
        headers: { 'X-Custom-Header': 'CustomValue' },
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/custom',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'CustomValue',
          }),
        })
      );
    });
  });

  describe('Endpoint Contract Tests (Status 200 Payload Handling)', () => {
    it('getCodingActivity requests /api/coding with optional refresh', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ activity: [] }),
      });

      await getCodingActivity();
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/coding', expect.any(Object));

      await getCodingActivity({ refresh: true });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/coding?refresh=true',
        expect.any(Object)
      );
    });

    it('getCodingSummary requests /api/coding/summary with optional refresh', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ totalMinutes: 60 }),
      });

      await getCodingSummary();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/coding/summary',
        expect.any(Object)
      );

      await getCodingSummary({ refresh: true });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/coding/summary?refresh=true',
        expect.any(Object)
      );
    });

    it('fetchGitHubSummary requests /api/github/summary', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: {}, repos: [] }),
      });

      await fetchGitHubSummary();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/github/summary',
        expect.any(Object)
      );
    });

    it('fetchGitContributions requests /api/github-contributions', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      await fetchGitContributions();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/github-contributions',
        expect.any(Object)
      );
    });

    it('fetchLeetcodeStats requests /api/leetcode', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ submitStatsGlobal: {} }),
      });

      await fetchLeetcodeStats();
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/leetcode', expect.any(Object));
    });

    it('sendContact issues POST request with serialized body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const contactData = { name: 'Alice', email: 'alice@example.com', message: 'Hello' };
      await sendContact(contactData);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(contactData),
        })
      );
    });

    it('sendHireRequest issues POST request with serialized body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const hireData = {
        service: 'Contract',
        name: 'Bob',
        email: 'bob@example.com',
        details: 'Project',
      };
      await sendHireRequest(hireData);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/hireRequest',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(hireData),
        })
      );
    });

    it('sendChatMessage issues POST request with messages object', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ text: 'AI response' }),
      });

      const messages = [{ role: 'user', parts: [{ text: 'Hi' }] }];
      await sendChatMessage(messages);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/chat',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ messages }),
        })
      );
    });
  });
});
