import { useState } from 'react';
import Drawer from './Drawer.jsx';
import { useDrawer } from './DrawerContext.jsx';
import { sendHireRequest } from '../../api/fetchApi'; 

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

export default function GlobalDrawer() {
    const { drawerState, closeDrawer } = useDrawer();

    const titles = {
        hire: `Hire For: ${drawerState.data?.service || 'General'}`,
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
            {drawerState.type === 'chat' && (
                <div className="text-xs text-zinc-400">AI Assistant view goes here.</div>
            )}
        </Drawer>
    );
}
