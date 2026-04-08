'use client';
import {useEffect, useRef} from "react";

// A custom hook is just a regular function that starts with "use".
const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height= 600) => {
    // useRef creates a direct reference to a specific HTML element on the screen. We start it as 'null' because the div doesn't exist until React renders it.
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Stringify the config object to pass a stable, comparable string to the script.
    const configString = JSON.stringify(config);

    // useEffect lets us perform "side effects" (like fetching data or messing with the DOM) after React has painted the screen.
    useEffect(
        () => {
            if (!containerRef.current) return;
            // 2. Extra safety check for React Strict Mode

            if (containerRef.current.dataset.loaded) return;
            containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.innerHTML = configString
            containerRef.current.appendChild(script);
            containerRef.current.dataset.loaded = 'true'

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
        }, [scriptUrl, configString, height]
    );

    return containerRef;
}
export default useTradingViewWidget
