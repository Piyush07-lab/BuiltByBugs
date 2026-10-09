/**
 * @file messageService.js
 * @stage PROTOTYPE / EXPERIMENTAL
 *
 * Lightweight In-Project Message Bus & Component Health Diagnostic Service.
 * Enables decoupled pub/sub communication and status 200 health telemetry.
 */

import { useEffect, useRef } from 'react';

// Registry of active topic subscribers: Map<string, Set<Function>>
const subscribers = new Map();

// Registry of component health states: Map<string, HealthRecord>
const healthRegistry = new Map();

// Relative event log for deterministic replay / diagnostics
const eventLog = [];
let busStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

export const TOPICS = {
  DRAWER: 'drawer:event',
  MASCOT: 'mascot:action',
  TELEMETRY: 'telemetry:status',
  NOTIFICATION: 'ui:notification',
  HEALTH: 'component:health',
};

/**
 * Prototype Internal Message Bus
 */
export const messageService = {
  /**
   * Publish an event payload to a topic channel
   * @param {string} topic
   * @param {any} payload
   * @returns {object} The logged event metadata
   */
  publish(topic, payload) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const relativeTimeMs = Math.round((now - busStartTime) * 100) / 100;

    const event = {
      id: eventLog.length + 1,
      topic,
      payload,
      relativeTimeMs,
      timestamp: new Date().toISOString(),
    };

    eventLog.push(event);

    if (subscribers.has(topic)) {
      subscribers.get(topic).forEach((callback) => {
        try {
          callback(payload, event);
        } catch (err) {
          console.error(
            `[MessageBus:Prototype] Subscriber error on topic "${topic}":`,
            err
          );
        }
      });
    }

    return event;
  },

  /**
   * Subscribe to a topic channel
   * @param {string} topic
   * @param {(payload: any, event: object) => void} callback
   * @returns {() => void} Unsubscribe function
   */
  subscribe(topic, callback) {
    if (!subscribers.has(topic)) {
      subscribers.set(topic, new Set());
    }
    subscribers.get(topic).add(callback);

    return () => {
      const set = subscribers.get(topic);
      if (set) {
        set.delete(callback);
        if (set.size === 0) subscribers.delete(topic);
      }
    };
  },

  /**
   * Status 200 Protocol: Record operational health of a component or module
   * @param {string} componentName
   * @param {number} status - HTTP-style status code (200 = healthy, 500 = error)
   * @param {object} details
   */
  reportHealth(componentName, status = 200, details = {}) {
    const record = {
      component: componentName,
      status,
      statusText: status === 200 ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      ...details,
    };

    healthRegistry.set(componentName, record);
    this.publish(TOPICS.HEALTH, record);
    return record;
  },

  /**
   * Retrieve health state of a specific component
   * @param {string} componentName
   * @returns {object|undefined}
   */
  getHealth(componentName) {
    return healthRegistry.get(componentName);
  },

  /**
   * Retrieve full health audit summary
   * @returns {Array<object>}
   */
  getAuditReport() {
    return Array.from(healthRegistry.values());
  },

  /**
   * Retrieve current event log
   */
  getEventLog() {
    return [...eventLog];
  },

  /**
   * Reset bus state (useful for test isolation)
   */
  reset() {
    subscribers.clear();
    healthRegistry.clear();
    eventLog.length = 0;
    busStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  },
};

/**
 * Optional React Hook to automatically register component status 200 on mount
 * @param {string} componentName
 * @param {object} options
 */
export function useComponentHealth(
  componentName,
  { initialStatus = 200, meta = {} } = {}
) {
  const reportedRef = useRef(false);

  useEffect(() => {
    if (!reportedRef.current) {
      messageService.reportHealth(componentName, initialStatus, meta);
      reportedRef.current = true;
    }

    return () => {
      // Retain or clear if needed
    };
  }, [componentName, initialStatus, meta]);
}
