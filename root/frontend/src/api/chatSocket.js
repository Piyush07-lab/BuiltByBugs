import { sendChatMessage } from './fetchApi.js';

const WS_CONNECT_TIMEOUT_MS = 3000;
const KEEPALIVE_INTERVAL_MS = 25000;
const MAX_RECONNECT_ATTEMPTS = 5;

function resolveWebSocketUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (baseUrl) {
    const normalized = baseUrl.replace(/\/+$/, '');
    const wsBase = normalized.replace(/^http(s?):\/\//i, (_, s) =>
      s ? 'wss://' : 'ws://'
    );
    return `${wsBase}/api/chat/ws`;
  }

  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/chat/ws`;
  }

  return 'ws://localhost:5500/api/chat/ws';
}

function sanitizeMessages(messages = []) {
  return messages
    .filter(
      (msg) =>
        msg &&
        !msg.isError &&
        (msg.role === 'user' || msg.role === 'model') &&
        Array.isArray(msg.parts) &&
        msg.parts.length > 0
    )
    .map((msg) => ({
      role: msg.role,
      parts: msg.parts.map((part) => ({ text: part?.text || '' })),
    }));
}

export function createChatSocketClient() {
  let socket = null;
  let activeTurn = null;
  let isManuallyClosed = false;
  let sessionActive = false;
  let hasOpenedOnce = false;
  let keepaliveTimer = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let connectPromise = null;
  let connectionStatus = 'disconnected';
  let availableModels = [];
  let unloadHandler = null;
  const statusListeners = new Set();

  const setConnectionStatus = (nextStatus) => {
    if (connectionStatus === nextStatus) return;
    connectionStatus = nextStatus;
    statusListeners.forEach((listener) => {
      try {
        listener(connectionStatus);
      } catch {
        // Ignore listener errors
      }
    });
  };

  const stopKeepalive = () => {
    if (keepaliveTimer !== null) {
      clearInterval(keepaliveTimer);
      keepaliveTimer = null;
    }
  };

  const startKeepalive = () => {
    stopKeepalive();
    keepaliveTimer = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch {
          // Ignore send errors; onclose handler will manage recovery
        }
      }
    }, KEEPALIVE_INTERVAL_MS);
    if (typeof keepaliveTimer?.unref === 'function') {
      keepaliveTimer.unref();
    }
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const cleanupSocket = (reason = 'Session ended') => {
    stopKeepalive();
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close(1000, reason);
      }
      socket = null;
    }
    setConnectionStatus('disconnected');
  };

  const scheduleReconnect = () => {
    if (
      isManuallyClosed ||
      !sessionActive ||
      !hasOpenedOnce ||
      reconnectTimer !== null ||
      reconnectAttempt >= MAX_RECONNECT_ATTEMPTS
    ) {
      return;
    }

    const delayMs = Math.min(15000, 2000 * 2 ** reconnectAttempt);
    reconnectAttempt += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (!isManuallyClosed && sessionActive) {
        connect().catch(() => {
          scheduleReconnect();
        });
      }
    }, delayMs);
    if (typeof reconnectTimer?.unref === 'function') {
      reconnectTimer.unref();
    }
  };

  const bindBeforeUnload = () => {
    if (typeof window === 'undefined' || unloadHandler) return;
    unloadHandler = () => {
      disconnect();
    };
    window.addEventListener('beforeunload', unloadHandler);
  };

  const unbindBeforeUnload = () => {
    if (typeof window !== 'undefined' && unloadHandler) {
      window.removeEventListener('beforeunload', unloadHandler);
      unloadHandler = null;
    }
  };

  const connect = () => {
    if (typeof WebSocket === 'undefined') {
      return Promise.reject(new Error('WebSocket not supported'));
    }

    sessionActive = true;
    isManuallyClosed = false;
    clearReconnectTimer();
    bindBeforeUnload();

    if (socket && socket.readyState === WebSocket.OPEN) {
      setConnectionStatus('connected');
      return Promise.resolve(socket);
    }

    if (connectPromise) {
      return connectPromise;
    }

    if (socket && socket.readyState === WebSocket.CONNECTING) {
      setConnectionStatus('connecting');
      connectPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          connectPromise = null;
          reject(new Error('WebSocket connection timeout'));
        }, WS_CONNECT_TIMEOUT_MS);

        socket.addEventListener(
          'open',
          () => {
            clearTimeout(timer);
            connectPromise = null;
            hasOpenedOnce = true;
            reconnectAttempt = 0;
            setConnectionStatus('connected');
            startKeepalive();
            resolve(socket);
          },
          { once: true }
        );
        socket.addEventListener(
          'error',
          () => {
            clearTimeout(timer);
            connectPromise = null;
            setConnectionStatus('disconnected');
            reject(new Error('WebSocket connection failed'));
          },
          { once: true }
        );
      });
      return connectPromise;
    }

    const wsUrl = resolveWebSocketUrl();
    setConnectionStatus('connecting');

    connectPromise = new Promise((resolve, reject) => {
      try {
        socket = new WebSocket(wsUrl);
      } catch (err) {
        connectPromise = null;
        setConnectionStatus('disconnected');
        reject(err);
        return;
      }

      const timer = setTimeout(() => {
        if (socket && socket.readyState !== WebSocket.OPEN) {
          connectPromise = null;
          cleanupSocket('Connection timeout');
          reject(new Error('WebSocket connection timeout'));
        }
      }, WS_CONNECT_TIMEOUT_MS);

      socket.onopen = () => {
        clearTimeout(timer);
        connectPromise = null;
        hasOpenedOnce = true;
        reconnectAttempt = 0;
        setConnectionStatus('connected');
        startKeepalive();
        resolve(socket);
      };

      socket.onmessage = (event) => {
        let frame;
        try {
          frame = JSON.parse(event.data);
        } catch {
          return;
        }

        if (frame.type === 'stream:ready') {
          if (Array.isArray(frame.models)) {
            availableModels = frame.models;
          }
          setConnectionStatus('connected');
          return;
        }

        if (frame.type === 'pong') {
          return;
        }

        if (!activeTurn) return;

        switch (frame.type) {
          case 'stream:start':
            activeTurn.markStarted?.();
            activeTurn.onStart?.();
            break;
          case 'stream:status':
            activeTurn.markStarted?.();
            activeTurn.onStatus?.(frame.label || '');
            break;
          case 'stream:tool':
            activeTurn.markStarted?.();
            break;
          case 'stream:proposal':
            activeTurn.markStarted?.();
            break;
          case 'stream:chunk':
            activeTurn.markStarted?.();
            activeTurn.onChunk?.(frame.delta || '');
            break;
          case 'stream:end': {
            const turn = activeTurn;
            activeTurn = null;
            turn.onEnd?.({
              text: frame.text || '',
              action: frame.action || null,
              proposal: frame.proposal || null,
              model: frame.model || null,
            });
            turn.resolve?.();
            break;
          }
          case 'stream:error': {
            const turn = activeTurn;
            activeTurn = null;
            const err = new Error(frame.message || frame.error || 'Stream error');
            err.code = frame.code || frame.error || 'STREAM_ERROR';
            err.retryable = frame.retryable !== false;
            err.isServerError = true;
            turn.onError?.(err);
            turn.reject?.(err);
            break;
          }
          default:
            break;
        }
      };

      socket.onerror = () => {
        clearTimeout(timer);
        if (socket && socket.readyState !== WebSocket.OPEN) {
          connectPromise = null;
          setConnectionStatus('disconnected');
          reject(new Error('WebSocket error'));
        }
      };

      socket.onclose = () => {
        clearTimeout(timer);
        stopKeepalive();
        connectPromise = null;
        const pending = activeTurn;
        activeTurn = null;
        socket = null;
        setConnectionStatus('disconnected');

        if (pending && !isManuallyClosed) {
          pending.reject?.(new Error('WebSocket closed before response completed'));
        }

        scheduleReconnect();
      };
    });

    return connectPromise;
  };

  const disconnect = () => {
    isManuallyClosed = true;
    sessionActive = false;
    connectPromise = null;
    clearReconnectTimer();
    unbindBeforeUnload();
    if (activeTurn) {
      activeTurn.reject?.(new Error('Disconnected'));
      activeTurn = null;
    }
    cleanupSocket('Session ended');
  };

  const runHttpFallback = async (cleanMessages, callbacks) => {
    callbacks.onStart?.();
    const res = await sendChatMessage(cleanMessages);
    if (res?.text) {
      callbacks.onChunk?.(res.text);
    }
    callbacks.onEnd?.({
      text: res?.text || '',
      action: res?.action || null,
      proposal: res?.proposal || null,
    });
  };

  const sendMessageStream = async (messages, callbacks = {}) => {
    const cleanMessages = sanitizeMessages(messages);

    let ws;
    try {
      ws = await connect();
    } catch (connectError) {
      if (isManuallyClosed) return;

      // Fallback cleanly to HTTP POST /api/chat if WebSocket could not connect
      console.warn('[ChatSocket] Falling back to HTTP /api/chat:', connectError.message);
      await runHttpFallback(cleanMessages, callbacks);
      return;
    }

    let turnStarted = false;
    try {
      await new Promise((resolve, reject) => {
        activeTurn = {
          ...callbacks,
          started: false,
          markStarted: () => {
            turnStarted = true;
            if (activeTurn) {
              activeTurn.started = true;
            }
          },
          resolve,
          reject,
        };

        try {
          ws.send(
            JSON.stringify({
              type: 'chat:message',
              messages: cleanMessages,
            })
          );
        } catch (sendError) {
          activeTurn = null;
          reject(sendError);
        }
      });
    } catch (streamError) {
      if (isManuallyClosed) return;

      // Only fall back to HTTP if the transport failed before streaming started,
      // never on explicit server stream:error or after chunks began streaming
      if (!turnStarted && !streamError?.isServerError) {
        console.warn(
          '[ChatSocket] Turn failed before streaming started, falling back to HTTP /api/chat:',
          streamError.message
        );
        await runHttpFallback(cleanMessages, callbacks);
        return;
      }

      throw streamError;
    }
  };

  const getStatus = () => connectionStatus;
  const getAvailableModels = () => availableModels;
  const onConnectionChange = (listener) => {
    statusListeners.add(listener);
    listener(connectionStatus);
    return () => {
      statusListeners.delete(listener);
    };
  };

  return {
    connect,
    disconnect,
    sendMessageStream,
    getStatus,
    getAvailableModels,
    onConnectionChange,
  };
}

let sharedClient = null;

export function getSharedChatSocketClient() {
  if (!sharedClient) {
    sharedClient = createChatSocketClient();
  }
  return sharedClient;
}
