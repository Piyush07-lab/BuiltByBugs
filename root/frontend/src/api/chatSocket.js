import { sendChatMessage } from './fetchApi.js';

const WS_CONNECT_TIMEOUT_MS = 3000;

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

  const cleanupSocket = () => {
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, 'Drawer closed');
      }
      socket = null;
    }
  };

  const connect = () => {
    if (typeof WebSocket === 'undefined') {
      return Promise.reject(new Error('WebSocket not supported'));
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      return Promise.resolve(socket);
    }

    if (socket && socket.readyState === WebSocket.CONNECTING) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, WS_CONNECT_TIMEOUT_MS);

        socket.addEventListener(
          'open',
          () => {
            clearTimeout(timer);
            resolve(socket);
          },
          { once: true }
        );
        socket.addEventListener(
          'error',
          () => {
            clearTimeout(timer);
            reject(new Error('WebSocket connection failed'));
          },
          { once: true }
        );
      });
    }

    isManuallyClosed = false;
    const wsUrl = resolveWebSocketUrl();

    return new Promise((resolve, reject) => {
      try {
        socket = new WebSocket(wsUrl);
      } catch (err) {
        reject(err);
        return;
      }

      const timer = setTimeout(() => {
        if (socket && socket.readyState !== WebSocket.OPEN) {
          cleanupSocket();
          reject(new Error('WebSocket connection timeout'));
        }
      }, WS_CONNECT_TIMEOUT_MS);

      socket.onopen = () => {
        clearTimeout(timer);
        resolve(socket);
      };

      socket.onmessage = (event) => {
        let frame;
        try {
          frame = JSON.parse(event.data);
        } catch {
          return;
        }

        if (!activeTurn) return;

        switch (frame.type) {
          case 'stream:start':
            activeTurn.started = true;
            activeTurn.onStart?.();
            break;
          case 'stream:status':
            activeTurn.onStatus?.(frame.label || '');
            break;
          case 'stream:chunk':
            activeTurn.onChunk?.(frame.delta || '');
            break;
          case 'stream:end': {
            const turn = activeTurn;
            activeTurn = null;
            turn.onEnd?.({
              text: frame.text || '',
              action: frame.action || null,
              proposal: frame.proposal || null,
            });
            turn.resolve?.();
            break;
          }
          case 'stream:error': {
            const turn = activeTurn;
            activeTurn = null;
            const err = new Error(frame.message || frame.error || 'Stream error');
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
          reject(new Error('WebSocket error'));
        }
      };

      socket.onclose = () => {
        clearTimeout(timer);
        const pending = activeTurn;
        activeTurn = null;
        socket = null;

        if (pending && !isManuallyClosed) {
          pending.reject?.(new Error('WebSocket closed before response completed'));
        }
      };
    });
  };

  const disconnect = () => {
    isManuallyClosed = true;
    if (activeTurn) {
      activeTurn.reject?.(new Error('Disconnected'));
      activeTurn = null;
    }
    cleanupSocket();
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

    try {
      const ws = await connect();

      await new Promise((resolve, reject) => {
        activeTurn = {
          ...callbacks,
          started: false,
          resolve,
          reject,
        };

        ws.send(
          JSON.stringify({
            type: 'chat:message',
            messages: cleanMessages,
          })
        );
      });
    } catch (wsError) {
      if (isManuallyClosed) return;

      // Fallback cleanly to HTTP POST /api/chat if WebSocket failed before streaming
      console.warn('[ChatSocket] Falling back to HTTP /api/chat:', wsError.message);
      await runHttpFallback(cleanMessages, callbacks);
    }
  };

  return {
    connect,
    disconnect,
    sendMessageStream,
  };
}
