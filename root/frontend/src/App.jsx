import Header from './components/miscellaneous/Header.jsx';
import Footer from './components/miscellaneous/Footer.jsx';
import { DrawerProvider, GlobalDrawerContainer } from './components/drawer';
import MascotBot from './components/mascot/MascotBot.jsx';
import VectorBackground from './components/background/VectorBackground.jsx';
import usePathname from './hooks/usePathname.js';
import Home from './pages/Home.jsx';
import Library from './pages/Library.jsx';
import Project from './pages/Project.jsx';

const routes = {
  '/': Home,
  '/library': Library,
  '/project': Project,
};

/**
 * LEGACY GLOWING ARCS TOGGLE
 * Set to `true` if you ever want to re-enable the original violet & turquoise circular ambient glow arcs.
 * Currently disabled to allow the dynamic vector graphics to provide the background atmosphere cleanly.
 */
const SHOW_LEGACY_GLOWING_ARCS = true;

function App() {
  const pathname = usePathname();
  const Page = routes[pathname] ?? Home;

  return (
    <DrawerProvider>
      <div className="relative flex min-h-screen flex-col overflow-hidden isolate">
        <VectorBackground pathname={pathname} />

        {/* =========================================================================
            LEGACY GLOWING ARCS (VIOLET & TURQUOISE)
            Marked here for easy re-enabling if you feel it enhances cohesion.
            Toggle SHOW_LEGACY_GLOWING_ARCS = true above to re-enable them.
           ========================================================================= */}
        {SHOW_LEGACY_GLOWING_ARCS && (
          <div className="pointer-events-none" aria-hidden="true">
            {/* Left Arc: Subtle Violet Glow */}
            <div
              className="pointer-events-none absolute -z-10 h-112 w-md rounded-full border border-brand-violet/10 bg-brand-violet/[0.01] shadow-glow-violet top-72 -left-76"
              aria-hidden="true"
            />
            {/* Right Arc: Subtle Turquoise Glow */}
            <div
              className="pointer-events-none absolute -z-10 h-112 w-md rounded-full border border-brand-turquoise/10 bg-brand-turquoise/[0.01] shadow-glow-turquoise top-32 -right-80"
              aria-hidden="true"
            />
          </div>
        )}

        <Header pathname={pathname} />

        <main className="mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] flex-1 pt-20 pb-16 md:pt-28 md:pb-20">
          <Page />
        </main>

        <Footer />
        <MascotBot />
        <GlobalDrawerContainer />
      </div>
    </DrawerProvider>
  );
}

export default App;
