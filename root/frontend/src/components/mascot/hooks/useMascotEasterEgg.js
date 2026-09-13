import { useState, useCallback } from "react";

export function useMascotEasterEgg() {
    const [isEasterEgg, setIsEasterEgg] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleEasterEggClick = useCallback(() => {
        const nextClicks = clickCount + 1;
        setClickCount(nextClicks);

        if (nextClicks >= 5) {
            setIsEasterEgg(true);
            setTimeout(() => {
                setIsEasterEgg(false);
                setClickCount(0);
            }, 3000);
        }
    }, [clickCount]);

    return {
        isEasterEgg,
        handleEasterEggClick
    };
}
