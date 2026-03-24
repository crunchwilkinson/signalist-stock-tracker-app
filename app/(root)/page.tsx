import TradingViewWidget from "@/components/TradingViewWidget";
import { HEATMAP_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";

// Notice there is NO 'use client' here. This is a Server Component by default.
// It acts as the structural blueprint, passing data down to the interactive client widgets.
const Home = () => {
    // The base URL for all the TradingView embed scripts
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen home-wrapper">
            {/* Top Row of widgets */}
            <section className="grid w-full gap-8 home-section">

                {/* Tailwind Grid classes for responsiveness:
                    On medium screens (md) it takes 1 column.
                    On extra large screens (xl) it also takes 1 column.
                */}
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Market Overview"
                        scriptUrl={`${scriptUrl}market-overview.js`} // Appends the specific script name to the base URL
                        config={MARKET_OVERVIEW_WIDGET_CONFIG} // Pulls the JSON settings from your constants file
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* On xl screens, this widget is wider, taking up 2 columns. */}
                <div className="md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>

            {/* Bottom Row of widgets */}
            <section className="grid w-full gap-8 home-section">
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>
        </div>
    )
}

export default Home;

