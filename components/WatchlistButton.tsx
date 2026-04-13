"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWatchlistStatus } from "@/hooks/useWatchlistStatus"; // Import the hook

interface WatchlistButtonProps {
    symbol: string;
    company: string;
    initialStatus?: boolean; // Renamed from isInWatchlist to clarify its purpose
    showTrashIcon?: boolean;
    type?: "button" | "icon";
    onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
}

const WatchlistButton = ({
                             symbol,
                             company,
                             initialStatus,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {

    // 1. The Hook handles the brainwork (fetching data if necessary)
    const { isInWatchlist, loading, setIsInWatchlist } = useWatchlistStatus(symbol, initialStatus);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const label = useMemo(() => {
        if (type === "icon") return "";
        return isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist";
    }, [isInWatchlist, type]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        // Optimistically update the hook's state instantly
        const nextState = !isInWatchlist;
        setIsInWatchlist(nextState);
        onWatchlistChange?.(symbol, nextState);
        setIsPending(true);

        try {
            const res = await fetch('/api/watchlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, company }),
            });
            const result = await res.json();

            if (!result.success) {
                // Revert state if the server request fails
                setIsInWatchlist(!nextState);
                onWatchlistChange?.(symbol, !nextState);
                console.error("Failed to update watchlist");
            } else {
                router.refresh();
            }
        } catch (error) {
            // Revert state if internet drops
            setIsInWatchlist(!nextState);
            onWatchlistChange?.(symbol, !nextState);
            console.error("Network error toggling watchlist", error);
        } finally {
            setIsPending(false);
        }
    };

    // 2. Render Loading Skeletons
    // This only triggers if no initialStatus was provided and it's waiting for the DB
    if (loading) {
        if (type === "icon") {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-300 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z" />
                </svg>
            );
        }
        return <div className="h-10 w-[180px] bg-gray-600 animate-pulse rounded"></div>;
    }

    // 3. Render Interactive Icon
    if (type === "icon") {
        return (
            <button
                title={isInWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={isInWatchlist ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`watchlist-icon-btn ${isInWatchlist ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
                disabled={isPending}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isInWatchlist ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    // 4. Render Interactive Text Button
    return (
        <button
            className={`watchlist-btn ${isInWatchlist ? "watchlist-remove" : ""} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleClick}
            disabled={isPending}>
            {showTrashIcon && isInWatchlist ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
                </svg>
            ) : null}
            <span>{label}</span>
        </button>
    );
};

export default WatchlistButton;