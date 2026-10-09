import { describe, it, expect, beforeEach, vi } from 'vitest';
import { messageService, TOPICS } from '../../src/services/messageService.js';

describe('Prototype Message Service & Health Protocol', () => {
  beforeEach(() => {
    messageService.reset();
  });

  it('publishes and subscribes to events across topics', () => {
    const subscriber = vi.fn();
    const unsubscribe = messageService.subscribe(TOPICS.MASCOT, subscriber);

    const payload = { action: 'wave', intensity: 1.0 };
    const event = messageService.publish(TOPICS.MASCOT, payload);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(payload, event);
    expect(event.topic).toBe(TOPICS.MASCOT);
    expect(event.relativeTimeMs).toBeGreaterThanOrEqual(0);

    unsubscribe();
    messageService.publish(TOPICS.MASCOT, { action: 'idle' });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('reports status 200 for healthy components', () => {
    const health = messageService.reportHealth('Header', 200, { route: '/' });

    expect(health.component).toBe('Header');
    expect(health.status).toBe(200);
    expect(health.statusText).toBe('OK');
    expect(messageService.getHealth('Header')).toEqual(health);
  });

  it('generates an audit report across multiple components', () => {
    messageService.reportHealth('Home', 200);
    messageService.reportHealth('BulletinWidget', 200);
    messageService.reportHealth('MascotBot', 200);

    const report = messageService.getAuditReport();
    expect(report).toHaveLength(3);
    expect(report.every((r) => r.status === 200)).toBe(true);
  });
});
