'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import WatchlistButtonWrapper from '@/components/WatchListButtonWrapper';
import { useRouter } from 'next/navigation';
import OpenSearchButton from '@/components/OpenSearchButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 1. Import Avatar

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

// 2. Add the ProfileData interface
interface ProfileData {
    logo?: string;
    name?: string;
    ticker?: string;
    weburl?: string;
}

interface WatchlistTableProps {
    initialItems: WatchlistItem[];
    liveQuotes: Record<string, QuoteData>;
    metrics: Record<string, MetricData>;
    profiles: Record<string, ProfileData>; // 3. Add profiles to the props interface
}

const formatMarketCap = (value?: number) => {
    if (!value) return '—';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}T`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}B`;
    return `$${value.toFixed(2)}M`;
};

export default function WatchlistTable({ initialItems, liveQuotes, metrics, profiles }: WatchlistTableProps) {
    const [items, setItems] = useState<WatchlistItem[]>(initialItems);
    const router = useRouter();

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
        if (!isAdded) {
            setItems((prev) => prev.filter(item => item.symbol !== symbol));
            router.refresh();
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
                    const profile = profiles[item.symbol]; // 4. Grab the profile for this row
                    const isPositive = (quote?.d ?? 0) >= 0;

                    return (
                        <tr key={item.symbol} className="table-row group">
                            <td className="table-cell py-3 px-4 text-center">
                                <div className="flex justify-center opacity-70 group-hover:opacity-100 transition-opacity [&_svg]:w-4 [&_svg]:h-4">
                                    <WatchlistButtonWrapper
                                        symbol={item.symbol}
                                        company={item.company}
                                        type="icon"
                                        onWatchlistChange={handleWatchlistChange}
                                    />
                                </div>
                            </td>

                            {/* 5. Render the Avatar next to the Company Name */}
                            <td className="table-cell py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-7 w-7 bg-white rounded-full border border-gray-600 shadow-sm shrink-0 overflow-hidden">
                                        <AvatarImage
                                            src={profile?.logo}
                                            alt={item.symbol}
                                            className="object-contain"
                                        />
                                        <AvatarFallback className="bg-gray-700 text-[10px] font-bold text-gray-200">
                                            {item.symbol.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-gray-400 max-w-[180px] truncate" title={item.company}>
                                            {item.company}
                                        </span>
                                </div>
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