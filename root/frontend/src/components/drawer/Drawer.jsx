import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

export default function Drawer({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex justify-end overflow-hidden">
        <DialogPanel
          transition
          className="w-full max-w-md h-full bg-[#141026]/95 backdrop-blur-xl border-l border-brand-border p-6 text-white shadow-paper-depth flex flex-col transition duration-300 ease-in-out data-closed:translate-x-full"
        >
          <div className="flex items-center justify-between pb-4 border-b border-brand-border-subtle">
            <DialogTitle className="text-base font-semibold font-heading text-white tracking-wide">
              {title || 'Menu'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-brand-turquoise hover:bg-brand-surface-elevated transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
