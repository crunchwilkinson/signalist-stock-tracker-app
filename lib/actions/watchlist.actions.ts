'use server';

import {connectToDatabase} from "@/database/mongoose";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {Watchlist} from "@/database/models/watchlist.model";
import {revalidatePath} from "next/cache";

export async function toggleWatchlist(symbol: string, company: string) {
    try {
        await connectToDatabase();

        //1. Authenticate the user
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { success: false, error: 'User not authenticated' };
        }

        const userId = session.user.id;

        // 2. Check 9f the stock is already in the Watchlist
        const existingEntry = await Watchlist.findOne({ userId, symbol });

        if (existingEntry) {
            // 3a. If it exists, remove it
            await Watchlist.deleteOne({ _id: existingEntry._id });
        } else {
            // 3b. If it doesn't exist, add it
            await Watchlist.create({ userId, symbol, company });
        }

        // 4. Tell Next.js to re-fetch the data for this page
        revalidatePath(`/stocks/${symbol}`);

        return {success: true};
    } catch (error) {
        console.error('Error toggling watchlist:', error);
        return {success: false, error: 'Failed to toggle watchlist'};
    }
}
