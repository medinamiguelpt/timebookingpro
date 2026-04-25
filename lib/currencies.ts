/**
 * Currencies — per-tier local prices and locale-aware formatting.
 *
 * SCOPE: EU-only pricing. The picker shows 4 EU currencies — EUR, SEK, DKK,
 * PLN. Non-EU currencies (USD, GBP, CHF, CAD, AUD, NOK, AED, JPY) are kept
 * in the CURRENCIES record for type/data consistency but are NOT listed in
 * CURRENCY_ORDER and therefore never appear in the picker. EU countries
 * without a native table (e.g. FR, DE, IE) fall back to EUR.
 *
 * We do NOT convert EUR at runtime — every tier has a hand-picked, round
 * local price per currency. Psychologically clean numbers in each market
 * rather than FX output like €99 → €107.42.
 */

import { YEARLY_DISCOUNT, type TierPricing } from "./pricing";

export type CurrencyCode =
  | "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD"
  | "SEK" | "NOK" | "DKK" | "PLN" | "AED" | "JPY";

export interface Currency {
  code: CurrencyCode;
  locale: string;
  name: string;
  flag: string;
  decimals: 0 | 2;
  tierMonthly: Record<TierPricing["id"], number>;
  roundStep: number;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  // — Pickable currencies (EU-only scope, authoritative from the dashboard handoff) —
  EUR: { code: "EUR", locale: "en-IE", name: "Euro", flag: "🇪🇺", decimals: 2,
    tierMonthly: { light:   99, standard:  179, busy:  299, heavy:  499 }, roundStep:  1 },
  SEK: { code: "SEK", locale: "sv-SE", name: "Swedish Krona", flag: "🇸🇪", decimals: 2,
    tierMonthly: { light: 1099, standard: 1999, busy: 3299, heavy: 5699 }, roundStep: 10 },
  DKK: { code: "DKK", locale: "da-DK", name: "Danish Krone", flag: "🇩🇰", decimals: 2,
    tierMonthly: { light:  749, standard: 1349, busy: 2249, heavy: 3699 }, roundStep: 10 },
  PLN: { code: "PLN", locale: "pl-PL", name: "Polish Zloty", flag: "🇵🇱", decimals: 2,
    tierMonthly: { light:  429, standard:  779, busy: 1299, heavy: 2149 }, roundStep:  1 },
  // — Non-EU (kept for type/data consistency; never listed in the picker) —
  USD: { code: "USD", locale: "en-US", name: "US Dollar", flag: "🇺🇸", decimals: 2,
    tierMonthly: { light: 109, standard:  199, busy:  329, heavy:   549 }, roundStep: 1 },
  GBP: { code: "GBP", locale: "en-GB", name: "British Pound", flag: "🇬🇧", decimals: 2,
    tierMonthly: { light:  89, standard:  159, busy:  269, heavy:   449 }, roundStep: 1 },
  CHF: { code: "CHF", locale: "de-CH", name: "Swiss Franc", flag: "🇨🇭", decimals: 2,
    tierMonthly: { light:  99, standard:  179, busy:  299, heavy:   499 }, roundStep: 1 },
  CAD: { code: "CAD", locale: "en-CA", name: "Canadian Dollar", flag: "🇨🇦", decimals: 2,
    tierMonthly: { light: 149, standard:  269, busy:  449, heavy:   749 }, roundStep: 1 },
  AUD: { code: "AUD", locale: "en-AU", name: "Australian Dollar", flag: "🇦🇺", decimals: 2,
    tierMonthly: { light: 169, standard:  299, busy:  499, heavy:   829 }, roundStep: 1 },
  NOK: { code: "NOK", locale: "nb-NO", name: "Norwegian Krone", flag: "🇳🇴", decimals: 2,
    tierMonthly: { light: 1149, standard: 2099, busy: 3499, heavy:  5799 }, roundStep: 10 },
  AED: { code: "AED", locale: "en-AE", name: "UAE Dirham", flag: "🇦🇪", decimals: 2,
    tierMonthly: { light: 399, standard:  719, busy: 1199, heavy:  1999 }, roundStep: 1 },
  JPY: { code: "JPY", locale: "ja-JP", name: "Japanese Yen", flag: "🇯🇵", decimals: 0,
    tierMonthly: { light: 16000, standard: 29000, busy: 48000, heavy: 81000 }, roundStep: 100 },
};

function prettyLocal(value: number, step: number): number {
  const rounded = Math.ceil(value / step) * step;
  return rounded - (step >= 10 ? 1 : step === 1 ? 1 : 0);
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
}

export function yearlyLocal(currency: Currency, tierId: TierPricing["id"]): number {
  const monthly = currency.tierMonthly[tierId];
  return prettyLocal(monthly * 12 * (1 - YEARLY_DISCOUNT), currency.roundStep);
}

export function yearlyMonthlyEquivalentLocal(currency: Currency, tierId: TierPricing["id"]): number {
  return Math.round(yearlyLocal(currency, tierId) / 12);
}

export function yearlySavingsLocal(currency: Currency, tierId: TierPricing["id"]): number {
  return currency.tierMonthly[tierId] * 12 - yearlyLocal(currency, tierId);
}

export function applyDiscountLocal(amount: number, pct: number, step: number): number {
  return prettyLocal(amount * (1 - pct), step);
}
