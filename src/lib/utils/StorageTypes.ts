import type { AcceptedCurrency } from "~lib/currencies";

export type ConversionHistoryList = {
    timestamp: Date
    meta: { url: string; title: string; favicon: string }
    from: { currency: AcceptedCurrency; value: number }
    to: { currency: AcceptedCurrency; value: number }
  }[]