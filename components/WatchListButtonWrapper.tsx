'use client';

import { useEffect, useState } from 'react';
import WatchlistButton from '@/components/WatchListButton';

type Props = {
    symbol: string;
    company: string;
};

const WatchlistButtonWrapper = ({ symbol, company }: Props) => {
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

    // Hide the button entirely until we know its true state
    if (loading) return null;

    return (
        <WatchlistButton
            symbol={symbol}
            company={company}
            isInWatchlist={isInWatchlist} // Pass down the fetched true/false value
            type="button"
            onWatchlistChange={(_, isAdded) => setIsInWatchlist(isAdded)}
        />
    );
};

export default WatchlistButtonWrapper;