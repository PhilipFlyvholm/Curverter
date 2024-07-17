import type { AcceptedCurrency } from "~lib/currencies"

export function formatCurrency(num: number, currency: AcceptedCurrency) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency
  })
  return formatter.format(num)
}
