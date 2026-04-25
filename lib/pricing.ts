/**
 * Pricing — single source of truth for subscription tiers, yearly packages,
 * and seasonal holiday promotions.
 *
 * MODEL: hard-cap. All tiers have a monthly minute bucket. When exhausted,
 * new calls route to voicemail until the next billing cycle or an upgrade.
 * No overage charges. Customers get email alerts at 25%, 50%, 75%, and 90% usage.
 *
 * Yearly billing applies a flat discount (YEARLY_DISCOUNT). Holiday promos
 * stack on top of the already-discounted price with `stacking: "multiply"`
 * or replace the base discount with `stacking: "replace"`.
 *
 * Canonical source: dashboard-sooty-seven-64.vercel.app/dashboard
 *                   → Settings → Subscription
 */

export type BillingCycle = "monthly" | "yearly";

export interface TierPricing {
  /** Machine id — never shown */
  id: "light" | "standard" | "busy" | "heavy";
  /** Display label */
  name: string;
  /** Color used for borders / CTA */
  color: string;
  /** Monthly list price in EUR */
  monthly: number;
  /** Hard-cap monthly minute bucket — calls go to voicemail when exhausted */
  minutesPerMonth: number;
  /** Short descriptor shown under the tier */
  profile: string;
  /** Marketing badge, optional */
  badge?: "Most popular" | "Best value";
}

/** 20% off the monthly list price when paid annually — industry standard. */
export const YEARLY_DISCOUNT = 0.2;

/**
 * Authoritative tier table (EUR) from the v3 pricing handoff · 23 Apr 2026.
 *
 *   Light     €99/mo · 100 min  · €0.990/min
 *   Standard  €179/mo · 250 min · €0.716/min · "Most popular"
 *   Busy      €299/mo · 500 min · €0.598/min
 *   Heavy     €499/mo · 1,000 min · €0.499/min · "Best value"
 */
export const SUBSCRIPTION_TIERS: TierPricing[] = [
  {
    id: "light",
    name: "Light",
    color: "#3D7A50",
    monthly: 99,
    minutesPerMonth: 100,
    profile: "Small or quieter business — ~3 calls/day",
  },
  {
    id: "standard",
    name: "Standard",
    color: "#1B5EBE",
    monthly: 179,
    minutesPerMonth: 250,
    profile: "Busy single location — ~8 calls/day",
    badge: "Most popular",
  },
  {
    id: "busy",
    name: "Busy",
    color: "#6747C7",
    monthly: 299,
    minutesPerMonth: 500,
    profile: "High volume or a couple of locations — ~15 calls/day",
  },
  {
    id: "heavy",
    name: "Heavy",
    color: "#B8411C",
    monthly: 499,
    minutesPerMonth: 1000,
    profile: "Multi-location or very high volume — ~30+ calls/day",
    badge: "Best value",
  },
];

/**
 * Stable keys for the shared feature bullets — text comes from
 * messages.pricing.features.{key} at render time so all 7 locales translate.
 */
export const FEATURE_KEYS = ["calendarSync", "performanceEmail", "languages"] as const
export type FeatureKey = (typeof FEATURE_KEYS)[number]

// ─────────────────────────────────────────────────────────────────────────────
// Holiday / seasonal promotions
//
// `starts` / `ends` are ISO dates (inclusive of `starts`, exclusive of `ends`).
// The active promo is the first one whose window contains "today". Add new
// sales by appending to this array — no UI changes required.
// ─────────────────────────────────────────────────────────────────────────────

export interface HolidayPromo {
  id: string;
  name: string;
  /** Short marketing tagline */
  tagline: string;
  /** Percent off as a decimal (0.25 = 25% off) */
  discount: number;
  /** ISO "YYYY-MM-DD" — sale starts 00:00 Europe/Athens this day */
  starts: string;
  /** ISO "YYYY-MM-DD" — sale ends 00:00 Europe/Athens this day */
  ends: string;
  /** Coupon code customers enter at checkout */
  code: string;
  /** "monthly" | "yearly" | "both" — which billing cycles the sale applies to */
  appliesTo: BillingCycle | "both";
  /** Banner accent */
  color: string;
  /** Emoji for banner flourish */
  emoji: string;
}

export const HOLIDAY_PROMOS: HolidayPromo[] = [
  {
    id: "spring-2026",
    name: "Spring Refresh",
    tagline: "Fresh season, fresh bookings — 15% off every plan.",
    discount: 0.15,
    starts: "2026-04-01",
    ends: "2026-05-01",
    code: "SPRING15",
    appliesTo: "both",
    color: "#2DA865",
    emoji: "🌱",
  },
  {
    id: "easter-2026",
    name: "Easter Special",
    tagline: "Καλό Πάσχα! 20% off yearly plans.",
    discount: 0.2,
    starts: "2026-04-05",
    ends: "2026-04-20",
    code: "PASCHA20",
    appliesTo: "yearly",
    color: "#D97706",
    emoji: "🐇",
  },
  {
    id: "summer-2026",
    name: "Summer Sale",
    tagline: "Busy season, smart prices — 15% off first 3 months.",
    discount: 0.15,
    starts: "2026-07-15",
    ends: "2026-08-16",
    code: "SUMMER15",
    appliesTo: "monthly",
    color: "#F59E0B",
    emoji: "☀️",
  },
  {
    id: "bf-2026",
    name: "Black Friday",
    tagline: "Our biggest sale of the year — 30% off annual plans.",
    discount: 0.3,
    starts: "2026-11-24",
    ends: "2026-12-02",
    code: "BF30",
    appliesTo: "yearly",
    color: "#111111",
    emoji: "🛍️",
  },
  {
    id: "xmas-2026",
    name: "Christmas",
    tagline: "Καλά Χριστούγεννα! 25% off every yearly plan.",
    discount: 0.25,
    starts: "2026-12-01",
    ends: "2027-01-07",
    code: "XMAS25",
    appliesTo: "yearly",
    color: "#C1272D",
    emoji: "🎄",
  },
  {
    id: "ny-2027",
    name: "New Year",
    tagline: "New year, new bookings — 20% off your first 3 months.",
    discount: 0.2,
    starts: "2027-01-01",
    ends: "2027-01-16",
    code: "NY20",
    appliesTo: "monthly",
    color: "#1B5EBE",
    emoji: "🎆",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Round up to the nearest €1, then subtract 1 — e.g. 2198.40 → 2199. */
/** Pick the first active promo for a given date, scoped to a billing cycle. */
export function activeHolidayPromo(cycle: BillingCycle, now: Date = new Date()): HolidayPromo | null {
  const today = now.toISOString().slice(0, 10);
  for (const promo of HOLIDAY_PROMOS) {
    if (today < promo.starts || today >= promo.ends) continue;
    if (promo.appliesTo !== "both" && promo.appliesTo !== cycle) continue;
    return promo;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Multi-currency + VAT quote
// ─────────────────────────────────────────────────────────────────────────────

import {
  CURRENCIES,
  applyDiscountLocal,
  formatMoney,
  yearlyLocal,
  yearlyMonthlyEquivalentLocal,
  yearlySavingsLocal,
  type Currency,
  type CurrencyCode,
} from "./currencies";
import { COUNTRIES, computeVat, type Country, type CountryCode, type VatComputation } from "./vat";

export interface Quote {
  tier: TierPricing;
  currency: Currency;
  country: Country;
  cycle: BillingCycle;
  promo: HolidayPromo | null;
  netBaseline: number;
  netPreHoliday: number;
  netEffective: number;
  vat: VatComputation;
  annualSavings: number;
  monthlyEquivalent: number;
  per: "month" | "year";
  formatted: {
    netBaseline: string;
    netPreHoliday: string;
    netEffective: string;
    vatAmount: string;
    gross: string;
    annualSavings: string;
    monthlyEquivalent: string;
    yearlyTotal: string;
  };
}

export interface QuoteInput {
  tier: TierPricing;
  cycle: BillingCycle;
  currencyCode: CurrencyCode;
  countryCode: CountryCode;
  isBusiness: boolean;
  hasValidVatId: boolean;
  now?: Date;
}

export function quote(input: QuoteInput): Quote {
  const { tier, cycle, currencyCode, countryCode, isBusiness, hasValidVatId, now } = input;
  const currency = CURRENCIES[currencyCode];
  const country = COUNTRIES[countryCode];
  const promo = activeHolidayPromo(cycle, now ?? new Date());

  const netBaseline = cycle === "monthly" ? currency.tierMonthly[tier.id] : currency.tierMonthly[tier.id] * 12;
  const netPreHoliday = cycle === "monthly" ? currency.tierMonthly[tier.id] : yearlyLocal(currency, tier.id);
  const netEffective = promo ? applyDiscountLocal(netPreHoliday, promo.discount, currency.roundStep) : netPreHoliday;
  const vat = computeVat({ net: netEffective, country, isBusiness, hasValidVatId });
  const annualSavings =
    cycle === "yearly" ? yearlySavingsLocal(currency, tier.id) + (promo ? netPreHoliday - netEffective : 0) : 0;
  const monthlyEquivalent = cycle === "yearly" ? yearlyMonthlyEquivalentLocal(currency, tier.id) : netEffective;

  return {
    tier,
    currency,
    country,
    cycle,
    promo,
    netBaseline,
    netPreHoliday,
    netEffective,
    vat,
    annualSavings,
    monthlyEquivalent,
    per: cycle === "monthly" ? "month" : "year",
    formatted: {
      netBaseline: formatMoney(netBaseline, currency),
      netPreHoliday: formatMoney(netPreHoliday, currency),
      netEffective: formatMoney(netEffective, currency),
      vatAmount: formatMoney(vat.amount, currency),
      gross: formatMoney(vat.gross, currency),
      annualSavings: formatMoney(annualSavings, currency),
      monthlyEquivalent: formatMoney(monthlyEquivalent, currency),
      yearlyTotal: formatMoney(yearlyLocal(currency, tier.id), currency),
    },
  };
}
