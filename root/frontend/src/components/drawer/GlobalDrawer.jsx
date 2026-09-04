import { useState } from 'react';
import Drawer from './Drawer.jsx';
import { useDrawer } from './DrawerContext.jsx';
import { sendHireRequest, sendChatMessage } from '../../api/fetchApi'; 

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
                Selected Service: <span className="font-semibold text-emerald-400">{service || 'General Inquiry'}</span>
            </p>

            {status === 'success' && (
                <div className="rounded border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-emerald-300">
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-none disabled:opacity-50"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 py-2.5 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {status === 'loading' ? 'Submitting...' : 'Submit Proposal'}
            </button>
        </form>
    );
}


function ContactForm({ onClose }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        // TODO: Wire this to your actual contact API endpoint later
        // Simulating a network request for now
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => onClose(), 1500);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <p className="text-zinc-400">Send a direct message. I usually respond within 24 hours.</p>

            {status === 'success' && (
                <div className="rounded border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-emerald-300">
                    Message sent successfully!
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
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
                    className="bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-none disabled:opacity-50"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 py-2.5 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}

function ChatAssistant({ onClose }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: 'Hi! I am the AI assistant for Piyush. How can I help you today?' }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', parts: [{ text: input.trim() }] };
        const updatedMessages = [...messages, userMessage];
        
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await sendChatMessage(updatedMessages);
            const modelMessage = { role: 'model', parts: [{ text: res.text }] };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev, 
                { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again later.' }] }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full text-xs">
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 flex flex-col min-h-[300px] max-h-[60vh]">
                {messages.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`max-w-[85%] rounded p-2.5 ${msg.role === 'user' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 self-end' : 'bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 self-start'}`}
                    >
                        {msg.parts[0].text}
                    </div>
                ))}
                {isLoading && (
                    <div className="max-w-[85%] rounded p-2.5 bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 self-start italic">
                        Typing...
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-zinc-800 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded p-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
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
                <HireForm service={drawerState.data?.service} onClose={closeDrawer} />
            )}
            
            {/* Added contact rendering condition */}
            {drawerState.type === 'contact' && (
                <ContactForm onClose={closeDrawer} />
            )}
            
            {drawerState.type === 'chat' && (
                <ChatAssistant onClose={closeDrawer} />
            )}
        </Drawer>
    );
}
