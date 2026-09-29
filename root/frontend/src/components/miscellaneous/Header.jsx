import { navigation } from '../../data/navigation.js';

function Header({ pathname }) {
  return (
    <header className="mx-auto flex min-h-21 w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] flex-wrap items-center justify-between gap-6 border-b border-brand-border-subtle py-4 md:flex-nowrap md:py-0">
      <a
        className="group flex items-center gap-2.5 text-base font-extrabold tracking-[0.02em] text-white no-underline select-none"
        href="/"
        aria-label="BuiltByBugs home"
      >
        <img
          className="block h-8 w-auto transition-transform duration-300 group-hover:scale-105"
          src={`${import.meta.env.VITE_API_BASE_URL || ''}/api/assets/logo`}
          alt="BuiltByBugs"
        />
        <span className="transition-all duration-300 group-hover:text-gradient-logo">
          BuiltByBugs
        </span>
      </a>

      <nav
        className="order-3 flex w-full items-center justify-between gap-1.5 md:order-0 md:w-auto md:justify-start"
        aria-label="Primary navigation"
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <a
              className={`flex-1 md:flex-initial rounded-[0.55rem] px-2.5 sm:px-3.5 py-2 text-center text-[0.8rem] sm:text-[0.9rem] font-medium no-underline transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-brand-violet/15 text-white border border-brand-violet/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  : 'text-muted border border-transparent hover:bg-brand-violet/10 hover:text-white focus-visible:bg-brand-violet/10 focus-within:text-white'
              }`}
              href={item.href}
              key={item.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <span className="flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-2.5 py-1 text-xs whitespace-nowrap text-brand-green sm:px-3 sm:py-1.5">
        <span
          className="h-[0.45rem] w-[0.45rem] rounded-full bg-brand-green shadow-glow-green"
          aria-hidden="true"
        />
        Live
      </span>
    </header>
  );
}

export default Header;
