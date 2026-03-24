// This component uses our custom hook (which uses browser APIs), so it must also be a Client Component.
'use client';

import React, { memo } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

// TypeScript Interface: This defines exactly what data this component expects to receive from its parent.
interface TradingViewWidgetProps {
    title?: string; // The '?' means this is optional
    scriptUrl: string;
    config: Record<string, unknown>; // A generic object for the TradingView settings
    height?: number;
    className?: string; // Allows us to pass custom Tailwind classes from the parent
}

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className }: TradingViewWidgetProps) => {

    // We call our custom hook, passing it the required data.
    // It does all the heavy lifting and hands us back the 'containerRef'.
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    return (
        <div className="w-full">
            {/* Conditional Rendering: If a 'title' was provided, render this <h3>. Otherwise, render nothing here. */}
            {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}

            {/* We use the 'cn' (classnames) utility to safely merge the default "tradingview-widget-container"
                class with any custom 'className' passed in via props.
                We attach 'ref={containerRef}' so our hook knows exactly which div to target.
            */}
            <div className={cn('tradingview-widget-container', className)} ref={containerRef}>
                <div className="tradingview-widget-container__widget" style={{ height: height, width: "100%" }} />
            </div>
        </div>
    );
}

// React.memo wraps the component so it caches the rendered output.
// It will only re-render if its props (title, config, etc.) actually change, saving performance.
export default memo(TradingViewWidget);
