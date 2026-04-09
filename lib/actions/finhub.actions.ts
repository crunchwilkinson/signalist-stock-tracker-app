'use server';

import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { cache } from 'react';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

interface FinnhubProfile {
    name?: string;
    ticker?: string;
    exchange?: string;
}

export interface FinnhubQuote {
    c: number;  // Current price
    d: number;  // Change
    dp: number; // Percent change
    h: number;  // High of the day
    l: number;  // Low of the day
    o: number;  // Open price
    pc: number; // Previous close price
}

export interface FinnhubMetric {
    marketCapitalization?: number;
    peTTM?: number;
}

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
    const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' };

    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Fetch failed ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
}

export { fetchJSON };

export const searchStocks = cache(async (query?: string): Promise<Stock[]> => {
    try {
        const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) {
            console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
            return [];
        }

        const trimmed = typeof query === 'string' ? query.trim() : '';

        // FIX: Properly type the results array to accept the __exchange property without using 'any'
        let results: Array<FinnhubSearchResult & { __exchange?: string }> = [];

        if (!trimmed) {
            const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
            const profiles = await Promise.all(
                top.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
                        // FIX: Replaced <any> with our new <FinnhubProfile> interface
                        const profile = await fetchJSON<FinnhubProfile>(url, 3600);
                        return { sym, profile };
                    } catch (e) {
                        console.error('Error fetching profile2 for', sym, e);
                        // FIX: Removed the 'as any' casting hack here
                        return { sym, profile: null };
                    }
                })
            );

            results = profiles
                .map(({ sym, profile }) => {
                    const symbol = sym.toUpperCase();
                    const name: string | undefined = profile?.name || profile?.ticker || undefined;
                    const exchange: string | undefined = profile?.exchange || undefined;
                    if (!name) return undefined;

                    // FIX: Construct the object cleanly without mutating it later with 'as any'
                    const r: FinnhubSearchResult & { __exchange?: string } = {
                        symbol,
                        description: name,
                        displaySymbol: symbol,
                        type: 'Common Stock',
                        __exchange: exchange,
                    };
                    return r;
                })
                .filter((x): x is FinnhubSearchResult & { __exchange?: string } => Boolean(x));
        } else {
            const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
            const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
            results = Array.isArray(data?.result) ? data.result : [];
        }

        const seen = new Set<string>();
        const mapped: Stock[] = results
            .map((r) => {
                const upper = (r.symbol || '').toUpperCase();
                const name = r.description || upper;
                const exchangeFromDisplay = (r.displaySymbol as string | undefined) || undefined;

                // FIX: Safely pull __exchange without the 'as any' cast
                const exchangeFromProfile = r.__exchange;

                const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
                const type = r.type || 'Stock';

                const item: Stock = {
                    symbol: upper,
                    name,
                    exchange,
                    type,
                };
                return item;
            })
            .filter((item) => {
                if (!item.symbol || seen.has(item.symbol)) return false;
                seen.add(item.symbol);
                return true;
            })
            .slice(0, 15);

        return mapped;
    } catch (err) {
        console.error('Error in stock search:', err);
        return [];
    }
});

export const getQuotesForSymbols = async (symbols: string[]) => {
    const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token || symbols.length === 0) return {};

    const quotes: Record<string, FinnhubQuote> = {};

    // Fetch all quotes in parallel to keep the page load fast
    await Promise.all(
        symbols.map(async (sym) => {
            try {
                const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(sym)}&token=${token}`;
                // Cache for 60 seconds so you don't burn through your Finnhub API limits on refreshes
                const quote = await fetchJSON<FinnhubQuote>(url, 60);
                quotes[sym] = quote;
            } catch (e) {
                console.error(`Error fetching quote for ${sym}`, e);
            }
        })
    );

    return quotes;
};

export const getMetricsForSymbols = async (symbols: string[]) => {
    const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token || symbols.length === 0) return {};

    const metrics: Record<string, FinnhubMetric> = {};

    await Promise.all(
        symbols.map(async (sym) => {
            try {
                const url = `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodeURIComponent(sym)}&metric=all&token=${token}`;
                // Cache for 1 hour
                const data = await fetchJSON<{ metric: FinnhubMetric }>(url, 3600);
                metrics[sym] = data.metric || {};
            } catch (e) {
                console.error(`Error fetching metrics for ${sym}`, e);
            }
        })
    );

    return metrics;
};