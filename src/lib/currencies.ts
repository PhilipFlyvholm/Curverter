import currenciesJSON from "./currencies.json"

export const currencies: typeof currenciesJSON = currenciesJSON
export type AcceptedCurrency = keyof typeof currenciesJSON
export type CurrencyRates = {
  nextUpdateUnix: number
  rates: Record<AcceptedCurrency, number>
}
export const popularCurrencies: AcceptedCurrency[] = ["USD", "EUR", "GBP", "JPY", "CNY"]
