import React from 'react';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
// 1. Add getProfilesForSymbols to your import
import { getQuotesForSymbols, getMetricsForSymbols, getProfilesForSymbols } from '@/lib/actions/finhub.actions';
import OpenSearchButton from '@/components/OpenSearchButton';
import { Plus } from 'lucide-react';
import WatchlistTable from '@/components/WatchlistTable';

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

    const plainItems = savedItems.map(item => ({
        symbol: item.symbol,
        company: item.company
    }));

    const symbols = plainItems.map(item => item.symbol);

    // 2. Add the profile fetcher to the Promise.all array
    const [liveQuotes, liveMetrics, liveProfiles] = await Promise.all([
        getQuotesForSymbols(symbols),
        getMetricsForSymbols(symbols),
        getProfilesForSymbols(symbols)
    ]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="watchlist-title mb-1">My Watchlist</h1>
                    <p className="text-gray-400 text-sm">
                        {symbols.length} {symbols.length === 1 ? 'Symbol' : 'Symbols'}
                    </p>
                </div>

                <OpenSearchButton className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors text-sm">
                    <Plus className="w-4 h-4" />
                    Add stock
                </OpenSearchButton>
            </div>

            <WatchlistTable
                initialItems={plainItems}
                liveQuotes={liveQuotes}
                metrics={liveMetrics}
                profiles={liveProfiles} // 3. Pass the new profiles object down
            />
        </div>
    );
}