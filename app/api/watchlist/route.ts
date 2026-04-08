import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

// --- GET: Fetch initial watchlist status ---
export async function GET(request: NextRequest) {
    // Extract the ?symbol=AAPL query parameter from the URL
    const symbol = request.nextUrl.searchParams.get('symbol');

    // If no symbol is provided, return false safely
    if (!symbol) {
        return NextResponse.json({ isInWatchlist: false });
    }

    // Authenticate the user making the request
    const session = await auth.api.getSession({ headers: await headers() });

    // If the user isn't logged in, they can't have a watchlist, return false
    if (!session?.user) {
        return NextResponse.json({ isInWatchlist: false });
    }

    // Connect to MongoDB and look for a matching record
    await connectToDatabase();
    const existing = await Watchlist.findOne({
        userId: session.user.id,
        symbol: symbol.toUpperCase(),
    });

    // Return true if a record was found, false otherwise
    return NextResponse.json({ isInWatchlist: !!existing });
}

// --- POST: Toggle the watchlist status ---
export async function POST(request: NextRequest) {
    // Authenticate the user making the request
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    // Extract the JSON body sent from the frontend button click
    const { symbol, company } = await request.json();

    if (!symbol || !company) {
        return NextResponse.json({ success: false, error: 'Missing symbol or company' }, { status: 400 });
    }

    await connectToDatabase();
    const userId = session.user.id;

    // Check if the stock is already saved
    const existingEntry = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });

    // Toggle logic: Delete if it exists, Create if it doesn't
    if (existingEntry) {
        await Watchlist.deleteOne({ _id: existingEntry._id });
    } else {
        await Watchlist.create({ userId, symbol: symbol.toUpperCase(), company });
    }

    return NextResponse.json({ success: true });
}