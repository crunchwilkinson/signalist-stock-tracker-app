'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import WatchlistButtonWrapper from '@/components/WatchListButtonWrapper';
import OpenSearchButton from '@/components/OpenSearchButton';

// 1. Define strict TypeScript Interfaces to remove all 'any' types
interface WatchlistItem {
    symbol: string;
    company: string;
}

interface QuoteData {
    c?: number;
    d?: number;
    dp?: number;
}

interface MetricData {
    marketCapitalization?: number;
    peTTM?: number;
}

interface WatchlistTableProps {
    initialItems: WatchlistItem[];
    liveQuotes: Record<string, QuoteData>;
    metrics: Record<string, MetricData>;
}

const formatMarketCap = (value?: number) => {
    if (!value) return '—';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}T`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}B`;
    return `$${value.toFixed(2)}M`;
};

export default function WatchlistTable({ initialItems, liveQuotes, metrics }: WatchlistTableProps) {
    // 2. Type the React state correctly
    const [items, setItems] = useState<WatchlistItem[]>(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
        if (!isAdded) {
            // TypeScript now knows 'prev' is an array of WatchlistItem objects
            setItems((prev) => prev.filter(item => item.symbol !== symbol));
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-800 border border-gray-600 rounded-lg">
                <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
                <OpenSearchButton className="bg-yellow-400 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors mt-4">
                    Explore Stocks
                </OpenSearchButton>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            {/* 3. Apply your custom table classes */}
            <table className="watchlist-table text-left">
                <thead>
                <tr className="table-header-row">
                    <th className="table-header py-3 px-4 w-10 text-center"></th>
                    <th className="table-header py-3 px-4">Company</th>
                    <th className="table-header py-3 px-4">Symbol</th>
                    <th className="table-header py-3 px-4 text-right">Price</th>
                    <th className="table-header py-3 px-4 text-right">Change</th>
                    <th className="table-header py-3 px-4 text-right">Market Cap</th>
                    <th className="table-header py-3 px-4 text-right">P/E Ratio</th>
                    <th className="table-header py-3 px-4 text-center">Alerts</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => {
                    const quote = liveQuotes[item.symbol];
                    const metric = metrics[item.symbol];
                    const isPositive = (quote?.d ?? 0) >= 0;

                    return (
                        <tr key={item.symbol} className="table-row group">
                            <td className="table-cell py-3 px-4 text-center">
                                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                                    <WatchlistButtonWrapper
                                        symbol={item.symbol}
                                        company={item.company}
                                        type="icon"
                                        onWatchlistChange={handleWatchlistChange}
                                    />
                                </div>
                            </td>
                            <td className="table-cell py-3 px-4 text-gray-400 max-w-[200px] truncate">
                                {item.company}
                            </td>
                            <td className="table-cell py-3 px-4">
                                <Link href={`/stocks/${item.symbol}`} className="hover:text-yellow-400 transition-colors">
                                    {item.symbol}
                                </Link>
                            </td>
                            <td className="table-cell py-3 px-4 text-right">
                                ${quote?.c?.toFixed(2) || '—'}
                            </td>
                            <td className={`table-cell py-3 px-4 text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositive ? '+' : ''}{quote?.d?.toFixed(2) || '—'} ({isPositive ? '+' : ''}{quote?.dp?.toFixed(2) || '—'}%)
                            </td>
                            <td className="table-cell py-3 px-4 text-right text-gray-300">
                                {formatMarketCap(metric?.marketCapitalization)}
                            </td>
                            <td className="table-cell py-3 px-4 text-right text-gray-300">
                                {metric?.peTTM?.toFixed(2) || '—'}
                            </td>
                            <td className="table-cell py-3 px-4">
                                <button className="flex items-center justify-center gap-2 bg-transparent border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors text-xs font-medium w-full">
                                    <Bell className="w-3.5 h-3.5" />
                                    Add Alert
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}