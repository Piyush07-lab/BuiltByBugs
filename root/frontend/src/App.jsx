import Header from "./components/Header.jsx";
import { DrawerProvider, useDrawer } from './context/DrawerContext';
import Drawer from './components/Drawer';
import usePathname from "./hooks/usePathname.js";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Project from "./pages/Project.jsx";

const routes = {
  "/": Home,
  "/library": Library,
  "/project": Project,
};

function GlobalDrawerContainer() {
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
      title={titles[drawerState.type] || ''}
    >
      {drawerState.type === 'hire' && (
        <HireForm service={drawerState.data?.service} onClose={closeDrawer} />
      )}
      {drawerState.type === 'chat' && (
        <ChatBot onClose={closeDrawer} />
      )}
    </Drawer>
  );
}

function App() {
  const pathname = usePathname();
  const Page = routes[pathname] ?? Home;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden isolate">
      <div className="pointer-events-none absolute -z-10 h-[28rem] w-[28rem] rounded-full border border-[#a7f3d0]/10 top-[18rem] -left-[19rem]" aria-hidden="true" />
      <div className="pointer-events-none absolute -z-10 h-[28rem] w-[28rem] rounded-full border border-[#93c5fd]/10 top-[8rem] -right-[20rem]" aria-hidden="true" />

      <Header pathname={pathname} />

      <main className="mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] flex-1 pt-20 pb-16 md:pt-28 md:pb-20">
        <Page />
      </main>

      <footer className="mx-auto flex min-h-[74px] w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] items-center justify-between gap-4 border-t border-[#9eaedb]/10 text-xs uppercase tracking-[0.04em] text-[#78849f]">
        <span>React + Vite</span>
        <span>Inventory-led rebuild</span>
      </footer>
    </div>
  );
}

export default App;
