import { useEffect, useState } from 'react';

const GOLD_PRICE_URL = 'https://api.gold-api.com/price/XAU';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const TROY_OUNCE_IN_GRAMS = 31.1034768;

type GoldApiResponse = { price?: number; updatedAt?: string; updatedAtReadable?: string; currency?: string };

export function useGoldPrice() {
  const [pricePerGram24K, setPricePerGram24K] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const loadPrice = async () => {
      try {
        const response = await fetch(GOLD_PRICE_URL, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Gold price request failed');
        const data = (await response.json()) as GoldApiResponse;
        if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price <= 0) throw new Error('Invalid gold price response');
        if (active) { setPricePerGram24K(data.price / TROY_OUNCE_IN_GRAMS); setUpdatedAt(data.updatedAt ?? null); setError(false); }
      } catch { if (active) setError(true); }
      finally { if (active) setLoading(false); }
    };
    void loadPrice();
    const interval = window.setInterval(() => void loadPrice(), REFRESH_INTERVAL_MS);
    return () => { active = false; window.clearInterval(interval); };
  }, []);
  return { pricePerGram24K, updatedAt, loading, error };
}

export function goldPriceForKarat(pricePerGram24K: number, karat: 18 | 21) { return pricePerGram24K * (karat / 24); }
export function formatUsd(value: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value); }
export function formatGoldTimestamp(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(date) + ' UTC';
}
