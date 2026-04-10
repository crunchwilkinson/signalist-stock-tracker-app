import TradingViewWidget from "@/components/TradingViewWidget";
import { HEATMAP_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";
import HomeWatchlist from "@/components/HomeWatchlist";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex flex-col min-h-screen home-wrapper p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-8">

            {/* Dashboard Layout: 1 Column on Mobile -> 3 Columns on Large Screens */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full home-section">

                {/* Left Column (1/3 width) */}
                <div className="flex flex-col gap-8 xl:col-span-1">
                    <TradingViewWidget
                        title="Market Overview"
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />

                    <HomeWatchlist />

                    {/* Moved Top Stories right under the Watchlist */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Right Column (2/3 width) */}
                <div className="flex flex-col gap-8 xl:col-span-2">
                    <TradingViewWidget
                        title="Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                    />

                    {/* Indices Table (Market Quotes) now drops directly under the heatmap
                        and automatically takes up the exact same full 2/3 width! */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>

            </section>
        </div>
    )
}

export default Home;