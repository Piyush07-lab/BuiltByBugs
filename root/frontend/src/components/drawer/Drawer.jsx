import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function Drawer({ isOpen, onClose, title, children }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200"
                aria-hidden="true"
            />

            <div className="fixed inset-0 flex justify-end overflow-hidden">
                <DialogPanel
                    transition
                    className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 p-6 text-white shadow-2xl flex flex-col transition duration-300 ease-in-out data-[closed]:translate-x-full">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                        <DialogTitle className="text-base font-semibold text-white">
                            {title || 'Menu'}
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="mt-4 flex-1 overflow-y-auto">
                        {children}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}