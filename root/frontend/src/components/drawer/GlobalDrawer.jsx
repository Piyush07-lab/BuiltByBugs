import { useEffect, useRef, useState } from 'react';
import Drawer from './Drawer.jsx';
import { useDrawer } from './DrawerContext.jsx';
import { sendHireRequest, sendContact } from '../../api/fetchApi';
import { createChatSocketClient } from '../../api/chatSocket.js';
import ProposalCard from './ProposalCard.jsx';
import { messageService, TOPICS } from '../../services/messageService.js';

function HireForm({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await sendHireRequest({
        service: service || 'General Inquiry',
        name: formData.name,
        email: formData.email,
        details: formData.details,
      });

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <p className="text-zinc-400">
        Selected Service:{' '}
        <span className="font-semibold text-brand-turquoise">
          {service || 'General Inquiry'}
        </span>
      </p>

      {status === 'success' && (
        <div className="rounded border border-brand-green/40 bg-brand-green/10 p-2.5 text-brand-green">
          Inquiry sent successfully! Closing drawer...
        </div>
      )}

      {status === 'error' && (
        <div className="rounded border border-red-500/40 bg-red-950/40 p-2.5 text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Name</label>
        <input
          type="text"
          name="name"
          required
          disabled={status === 'loading'}
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise transition-all disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          disabled={status === 'loading'}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise transition-all disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Details</label>
        <textarea
          rows={4}
          name="details"
          required
          disabled={status === 'loading'}
          value={formData.details}
          onChange={handleChange}
          placeholder="Proposition..."
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise resize-none transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 py-2.5 bg-gradient-to-r from-brand-violet to-brand-turquoise text-white font-semibold rounded hover:brightness-110 shadow-glow-turquoise/30 transition-all disabled:opacity-50 cursor-pointer"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Proposal'}
      </button>
    </form>
  );
}

function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await sendContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <p className="text-zinc-400">
        Send a direct message. I usually respond within 24 hours.
      </p>

      {status === 'success' && (
        <div className="rounded border border-brand-green/40 bg-brand-green/10 p-2.5 text-brand-green">
          Message sent successfully!
        </div>
      )}

      {status === 'error' && (
        <div className="rounded border border-red-500/40 bg-red-950/40 p-2.5 text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Name</label>
        <input
          type="text"
          name="name"
          required
          disabled={status === 'loading'}
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise transition-all disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          disabled={status === 'loading'}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise transition-all disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-300 font-medium">Message</label>
        <textarea
          rows={4}
          name="message"
          required
          disabled={status === 'loading'}
          value={formData.message}
          onChange={handleChange}
          placeholder="How can I help you?"
          className="bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise resize-none transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 py-2.5 bg-gradient-to-r from-brand-violet to-brand-turquoise text-white font-semibold rounded hover:brightness-110 shadow-glow-turquoise/30 transition-all disabled:opacity-50 cursor-pointer"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

const PROMPT_SUGGESTIONS = [
  'Draft a proposal for my project',
  'What are your core backend skills?',
  'What is your hourly rate and pricing policy?',
  'Show me your latest GitHub projects',
];

function ChatAssistant({ onClose: _onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [
        {
          text: 'Hi! I am the AI Site & Creator Assistant for BuiltByBugs by Piyush Mishra. I can answer technical questions, explain architecture, generate project proposals, negotiate project scopes, and auto-submit inquiries for you. How can I assist you?',
        },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const socketClientRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const client = createChatSocketClient();
    socketClientRef.current = client;
    client.connect().catch(() => {
      // Fallback to HTTP POST /api/chat will handle turns automatically
    });

    return () => {
      client.disconnect();
      socketClientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, streamStatus, isLoading]);

  const sendMessageWithText = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', parts: [{ text: textToSend.trim() }] };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setStreamStatus('');

    // Trigger curious mascot movement on message dispatch
    messageService.publish(TOPICS.MASCOT, { type: 'curious' });

    const client = socketClientRef.current || createChatSocketClient();
    let streamBubbleCreated = false;

    const ensureStreamBubble = () => {
      if (streamBubbleCreated) return;
      streamBubbleCreated = true;
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: '' }],
          isStreaming: true,
        },
      ]);
    };

    try {
      await client.sendMessageStream(updatedMessages, {
        onStart: () => {
          ensureStreamBubble();
        },
        onStatus: (label) => {
          setStreamStatus(label);
        },
        onChunk: (delta) => {
          if (!delta) return;
          ensureStreamBubble();
          setStreamStatus('');
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            const lastMsg = next[lastIdx];
            if (lastMsg && lastMsg.role === 'model') {
              const prevText = lastMsg.parts?.[0]?.text || '';
              next[lastIdx] = {
                ...lastMsg,
                parts: [{ text: prevText + delta }],
                isStreaming: true,
              };
            }
            return next;
          });
        },
        onEnd: ({ text, action, proposal }) => {
          setStreamStatus('');
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            const lastMsg = next[lastIdx];
            if (streamBubbleCreated && lastMsg && lastMsg.role === 'model') {
              next[lastIdx] = {
                ...lastMsg,
                parts: [{ text: text || lastMsg.parts?.[0]?.text || '' }],
                proposal: proposal || null,
                action: action || null,
                isStreaming: false,
              };
              return next;
            }
            return [
              ...prev,
              {
                role: 'model',
                parts: [{ text: text || '' }],
                proposal: proposal || null,
                action: action || null,
                isStreaming: false,
              },
            ];
          });

          if (action === 'PROPOSAL_CREATED') {
            messageService.publish(TOPICS.MASCOT, { type: 'cheer' });
          } else if (action === 'FORM_SUBMITTED') {
            messageService.publish(TOPICS.MASCOT, { type: 'double-wave' });
          } else {
            messageService.publish(TOPICS.MASCOT, { type: 'wave' });
          }
        },
      });
    } catch (error) {
      console.error('Chat error:', error);
      setStreamStatus('');
      setMessages((prev) => {
        const errorText =
          'Sorry, I encountered an error connecting to the AI system. Please try again later.';
        if (streamBubbleCreated) {
          const next = [...prev];
          const lastIdx = next.length - 1;
          next[lastIdx] = {
            role: 'model',
            parts: [{ text: errorText }],
            isStreaming: false,
          };
          return next;
        }
        return [
          ...prev,
          {
            role: 'model',
            parts: [{ text: errorText }],
          },
        ];
      });
    } finally {
      setIsLoading(false);
      setStreamStatus('');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessageWithText(input);
  };

  const handleAcceptProposal = (proposal) => {
    const confirmText = `I approve the proposal for "${proposal.projectName}" (${proposal.proposalId}). Please proceed with formal submission and notify Piyush.`;
    sendMessageWithText(confirmText);
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Quick Prompts */}
      <div className="mb-2 pb-2 border-b border-brand-border-subtle flex flex-wrap gap-1.5">
        {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => sendMessageWithText(suggestion)}
            className="text-[10px] rounded-full border border-brand-turquoise/30 bg-brand-turquoise/5 px-2.5 py-1 text-brand-turquoise hover:bg-brand-turquoise/15 hover:border-brand-turquoise/60 transition-all cursor-pointer disabled:opacity-40"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3.5 flex flex-col min-h-[300px] max-h-[60vh]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded p-2.5 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-brand-violet/25 to-brand-turquoise/25 border border-brand-turquoise/40 text-brand-turquoise self-end'
                : 'bg-brand-surface border border-brand-border text-zinc-200 self-start'
            }`}
          >
            {/* Main message text */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {msg.parts?.[0]?.text}
              {msg.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-brand-turquoise animate-pulse" />
              )}
            </div>

            {/* Render Interactive Proposal Card if present */}
            {msg.proposal && (
              <ProposalCard
                proposal={msg.proposal}
                onAccept={handleAcceptProposal}
              />
            )}

            {/* Action Status Banner */}
            {msg.action === 'FORM_SUBMITTED' && (
              <div className="mt-2 rounded bg-brand-green/15 border border-brand-green/40 p-2 text-brand-green text-[11px] font-semibold flex items-center gap-1.5">
                <span>✓</span>
                <span>Inquiry successfully delivered to Piyush!</span>
              </div>
            )}
          </div>
        ))}

        {(isLoading && (!messages[messages.length - 1]?.isStreaming || streamStatus)) && (
          <div className="max-w-[85%] rounded p-2.5 bg-brand-surface border border-brand-border text-zinc-400 self-start italic flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-turquoise animate-ping" />
            {streamStatus || 'Connecting to AI Assistant...'}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="mt-3 pt-3 border-t border-brand-border-subtle flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, negotiate scope, draft proposal..."
          disabled={isLoading}
          className="flex-1 bg-brand-bg/80 border border-brand-border-subtle rounded p-2 text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-brand-turquoise focus:border-brand-turquoise transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-gradient-to-r from-brand-violet to-brand-turquoise text-white font-semibold rounded hover:brightness-110 shadow-glow-turquoise/30 transition-all disabled:opacity-50 cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function GlobalDrawer() {
  const { drawerState, closeDrawer } = useDrawer();

  const titles = {
    hire: `Hire For: ${drawerState.data?.service || 'General'}`,
    contact: 'Get in Touch',
    chat: 'AI Assistant',
    settings: 'Preferences',
  };

  return (
    <Drawer
      isOpen={drawerState.isOpen}
      onClose={closeDrawer}
      title={titles[drawerState.type] || 'Menu'}
    >
      {drawerState.type === 'hire' && (
        <div id="hire-drawer">
          <HireForm service={drawerState.data?.service} onClose={closeDrawer} />
        </div>
      )}

      {/* Added contact rendering condition */}
      {drawerState.type === 'contact' && (
        <div id="contact-drawer">
          <ContactForm onClose={closeDrawer} />
        </div>
      )}

      {drawerState.type === 'chat' && (
        <div id="ai-assistant-drawer">
          <ChatAssistant onClose={closeDrawer} />
        </div>
      )}
    </Drawer>
  );
}
