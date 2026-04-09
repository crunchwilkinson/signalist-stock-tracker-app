import React from 'react';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { getQuotesForSymbols } from '@/lib/actions/finhub.actions';
import WatchListButtonWrapper from '@/components/WatchListButtonWrapper';
import Link from 'next/link';
import OpenSearchButton from '@/components/OpenSearchButton'; // <-- Import the new button

export default async function WatchlistPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-400 text-lg">Please sign in to view your watchlist.</p>
            </div>
        );
    }

    await connectToDatabase();
    const savedItems = await Watchlist.find({ userId: session.user.id })
        .sort({ addedAt: -1 })
        .lean();

    const symbols = savedItems.map(item => item.symbol);
    const liveQuotes = await getQuotesForSymbols(symbols);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">My Watchlist</h1>
                    <p className="text-gray-400 text-sm">
                        {symbols.length} {symbols.length === 1 ? 'Symbol' : 'Symbols'}
                    </p>
                </div>

                {/* Updated to yellow and triggers the global search */}
                <OpenSearchButton className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors text-sm">
                    Add stock
                </OpenSearchButton>
            </div>

            {symbols.length === 0 ? (
                <div className="text-center py-20 border border-gray-800 rounded-xl bg-[#0a0a0a]">
                    <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
                    {/* Empty state button updated too */}
                    <OpenSearchButton className="bg-yellow-400 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors mt-4">
                        Explore Stocks
                    </OpenSearchButton>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-gray-800 bg-[#0a0a0a] shadow-lg wat">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        {/* Headers made lighter with text-gray-200 and a slightly raised bg color */}
                        <thead className="bg-[#1a1a1a] text-gray-200 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium rounded-tl-xl">Symbol</th>
                            <th className="px-6 py-4 font-medium">Company</th>
                            <th className="px-6 py-4 font-medium text-right">Price</th>
                            <th className="px-6 py-4 font-medium text-right">Change</th>
                            <th className="px-6 py-4 font-medium text-right">Change %</th>
                            <th className="px-6 py-4 font-medium text-center rounded-tr-xl">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {savedItems.map((item) => {
                            const quote = liveQuotes[item.symbol];
                            const isPositive = quote?.d >= 0;

                            return (
                                <tr key={item.symbol} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-white">
                                        <Link href={`/stocks/${item.symbol}`} className="hover:text-yellow-400 transition-colors">
                                            {item.symbol}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 max-w-[200px] truncate">
                                        {item.company}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                                        ${quote?.c?.toFixed(2) || '—'}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPositive ? '+' : ''}{quote?.d?.toFixed(2) || '—'}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPositive ? '+' : ''}{quote?.dp?.toFixed(2) || '—'}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                            <WatchListButtonWrapper
                                                symbol={item.symbol}
                                                company={item.company}
                                                type="icon"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}