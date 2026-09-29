import { useEffect, useState } from "react";

function usePathname() {
    const [pathname, setpathname] = useState(() => {
        return window.location.pathname;
    });

    useEffect(() => {
        function handlePopState() {
            setpathname(window.location.pathname);
        }
        window.addEventListener("popstate", handlePopState);

        return() => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
    return pathname;
}

export default usePathname;