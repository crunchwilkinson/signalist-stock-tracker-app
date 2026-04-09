'use client';

import { useEffect, useState } from 'react';
import WatchlistButton from '@/components/WatchListButton';

type Props = {
    symbol: string;
    company: string;
    type?: 'button' | 'icon';
};

const WatchlistButtonWrapper = ({ symbol, company, type = 'button' }: Props) => {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    // Start with a loading state so we don't accidentally flash the wrong button text
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // When the component mounts, call our GET API route
        fetch(`/api/watchlist?symbol=${symbol}`)
            .then((res) => res.json())
            .then((data) => {
                // Update the state with the true database value
                setIsInWatchlist(data.isInWatchlist);
                // Turn off the loading state to reveal the button
                setLoading(false);
            });
    }, [symbol]); // Re-run if the user navigates to a different stock symbol

    if (loading) {
        if (type === "icon") {
            return (
                // Renders a muted, pulsing star while waiting for the database
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5 text-gray-300 animate-pulse"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442c.499-.04.701-.663.321-.988l-4.204-3.602a.563.563 0 00-.182-.557l1.285-5.385a.562.562 0 01.84-.61l4.725 2.885z"
                    />
                </svg>
            );
        }

        // Renders a generic pulsing rectangle for the big button on the details page
        return <div className="h-10 w-[180px] bg-gray-600 animate-pulse rounded"></div>;
    }

    return (
        <WatchlistButton
            symbol={symbol}
            company={company}
            isInWatchlist={isInWatchlist} // Pass down the fetched true/false value
            type={type} // Pass down the button type
            onWatchlistChange={(_, isAdded) => setIsInWatchlist(isAdded)}
        />
    );
};

export default WatchlistButtonWrapper;