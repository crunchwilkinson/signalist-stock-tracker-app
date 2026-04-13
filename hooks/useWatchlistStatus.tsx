import { useState, useEffect } from 'react';

export function useWatchlistStatus(symbol: string, initialStatus?: boolean) {
    // Start with the provided status. If none is provided, default to false.
    const [isInWatchlist, setIsInWatchlist] = useState<boolean>(!!initialStatus);

    // Only show a loading state if we DON'T know the initial status
    const [loading, setLoading] = useState<boolean>(initialStatus === undefined);

    useEffect(() => {
        // If a server component already told us the status, do not make an API request!
        if (initialStatus !== undefined) return;

        fetch(`/api/watchlist?symbol=${symbol}`)
            .then((res) => res.json())
            .then((data) => {
                setIsInWatchlist(data.isInWatchlist);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch watchlist status", error);
                setLoading(false);
            });
    }, [symbol, initialStatus]);

    return { isInWatchlist, loading, setIsInWatchlist };
}