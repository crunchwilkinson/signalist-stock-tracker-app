import React from 'react';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { getQuotesForSymbols, getProfilesForSymbols } from '@/lib/actions/finhub.actions'; // <-- Import the new function
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // <-- Import Avatar components

export default async function HomeWatchlist() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    await connectToDatabase();
    const savedItems = await Watchlist.find({ userId: session.user.id })
        .sort({ addedAt: -1 })
        .limit(5)
        .lean();

    if (savedItems.length === 0) return null;

    const symbols = savedItems.map(item => item.symbol);

    // Fetch quotes and profiles at the same time for maximum speed
    const [liveQuotes, profiles] = await Promise.all([
        getQuotesForSymbols(symbols),
        getProfilesForSymbols(symbols)
    ]);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-gray-100">My Watchlist</h2>
                <Link href="/watchlist" className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors font-medium">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                <div className="flex flex-col gap-1">
                    {savedItems.map((item) => {
                        const quote = liveQuotes[item.symbol];
                        const profile = profiles[item.symbol]; // <-- Get the specific profile
                        const isPositive = (quote?.d ?? 0) >= 0;

                        return (
                            <Link
                                key={item.symbol}
                                href={`/stocks/${item.symbol}`}
                                className="flex justify-between items-center p-3 rounded-md hover:bg-gray-700/50 transition-colors group"
                            >
                                {/* Left Side: Logo + Ticker Info */}
                                <div className="flex items-center gap-3">

                                    {/* The Logo Avatar */}
                                    <Avatar className="h-9 w-9 bg-white rounded-full border border-gray-600 shadow-sm flex-shrink-0">
                                        <AvatarImage
                                            src={profile?.logo}
                                            alt={item.symbol}
                                            className="object-contain p-1.5" // p-1.5 gives the logo some breathing room inside the circle
                                        />
                                        <AvatarFallback className="bg-gray-700 text-xs font-bold text-gray-200">
                                            {item.symbol.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-100 group-hover:text-yellow-400 transition-colors">
                                            {item.symbol}
                                        </span>
                                        <span className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-[140px]">
                                            {item.company}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Side: Prices */}
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-gray-200">
                                        ${quote?.c?.toFixed(2) || '—'}
                                    </span>
                                    <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPositive ? '+' : ''}{quote?.dp?.toFixed(2) || '—'}%
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}