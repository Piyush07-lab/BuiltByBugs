import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

export default function Drawer({ isOpen, onClose, title, children }) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 flex justify-end overflow-hidden">
                    <TransitionChild
                        as={Fragment}
                        enter="transform transition ease-in-out duration-300"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 p-6 text-white shadow-2xl flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                                <DialogTitle className="text-base font-semibold text-white">
                                    {title || 'Menu'}
                                </DialogTitle>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Dynamic Body Content */}
                            <div className="mt-4 flex-1 overflow-y-auto">
                                {children}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}