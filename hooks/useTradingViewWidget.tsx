// This tells Next.js that this code must run in the user's browser,
// not on the server, because it interacts directly with the browser's DOM (document).
'use client';
import {useEffect, useRef} from "react";

// A custom hook is just a regular function that starts with "use".
// It takes in the script URL, the specific chart settings (config), and a height.
const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height= 600) => {
    // useRef creates a direct reference to a specific HTML element on the screen.
    // We start it as 'null' because the div doesn't exist until React renders it.
    const containerRef = useRef<HTMLDivElement | null>(null);

    // useEffect lets us perform "side effects" (like fetching data or messing with the DOM)
    // after React has painted the screen.
    useEffect(
        () => {
            if (!containerRef.current) return;
            if (containerRef.current.dataset.loaded) return;
            containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.innerHTML = JSON.stringify(config);
            containerRef.current.appendChild(script);
            containerRef.current.dataset.loaded = 'true';

            const currentContainer = containerRef.current;

            // THE CLEANUP FUNCTION: This runs when the component is removed from the screen.
            // It prevents memory leaks and overlapping charts if the user navigates away.
            return () => {
                if (currentContainer) {
                    currentContainer.innerHTML = '';
                    delete currentContainer.dataset.loaded;
                }
            }
            // The dependency array: If any of these 3 variables change, React will re-run this useEffect block.
        }, [scriptUrl, config, height]
    );

    return containerRef;
}
export default useTradingViewWidget
