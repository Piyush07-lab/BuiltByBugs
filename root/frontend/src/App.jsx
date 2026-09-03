import Header from "./components/Header.jsx";
import { DrawerProvider, GlobalDrawerContainer } from "./components/drawer";
import usePathname from "./hooks/usePathname.js";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Project from "./pages/Project.jsx";

const routes = {
  "/": Home,
  "/library": Library,
  "/project": Project,
};



function App() {
  const pathname = usePathname();
  const Page = routes[pathname] ?? Home;

  return (
    <DrawerProvider>
    <div className="relative flex min-h-screen flex-col overflow-hidden isolate">
      <div className="pointer-events-none absolute -z-10 h-112 w-md rounded-full border border-accent/10 top-72 -left-76" aria-hidden="true" />
      <div className="pointer-events-none absolute -z-10 h-112 w-md rounded-full border border-[#93c5fd]/10 top-32 -right-80" aria-hidden="true" />

      <Header pathname={pathname} />

      <main className="mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] flex-1 pt-20 pb-16 md:pt-28 md:pb-20">
        <Page />
      </main>

      <footer className="mx-auto flex min-h-18.5 w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] items-center justify-between gap-4 border-t border-[#9eaedb]/10 text-xs uppercase tracking-[0.04em] text-subtle">
        <span>React + Vite</span>
        <span>Inventory-led rebuild</span>
      </footer>
      <GlobalDrawerContainer />
    </div>
    </DrawerProvider>
  );
}

export default App;
