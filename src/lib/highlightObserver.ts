import { currencies, type AcceptedCurrency } from "~lib/currencies"

export {}

//Lower values are more important
enum CurrencyMatchReason {
  Key = 0,
  Symbol = 1
}

type CurrencyMatch = {
  key: AcceptedCurrency
  symbol: string
  reason: CurrencyMatchReason
  match: string
}

const extractCurrencyMatch = (
  text: string
): { currency: CurrencyMatch; alternatives: AcceptedCurrency[] } | null => {
  const currencyMatches: CurrencyMatch[] = []
  for (let key in currencies) {
    const currencyKey = key as AcceptedCurrency
    if (text.includes(key)) {
      currencyMatches.push({
        key: currencyKey,
        symbol: currencies[key].symbols[0],
        reason: CurrencyMatchReason.Key,
        match: key
      })
      continue
    }
    const symbols = currencies[key].symbols
    for (let symbol of symbols) {
      if (text.includes(symbol) || text.includes(symbol + ".")) {
        const currencyKey = key as AcceptedCurrency
        currencyMatches.push({
          key: currencyKey,
          symbol,
          reason: CurrencyMatchReason.Symbol,
          match: symbol
        })
        continue
      }
    }
  }
  if (currencyMatches.length > 0) {
    console.log("Currency matches: ", currencyMatches)
    const bestMatch: CurrencyMatch = currencyMatches.reduce((acc, x) => {
      if (x.reason < acc.reason) return x
      else if (x.reason === acc.reason)
        if (x.match.length > acc.match.length) return x
        else if (
          currencies[x.key].counties_using > currencies[acc.key].counties_using
        )
          return x
      return acc
    })
    console.log("Matched currency ", bestMatch)
    return {
      currency: bestMatch,
      alternatives: currencyMatches
        .sort((a, b) => {
          if (a.reason < b.reason) return -1
          else if (a.reason === b.reason)
            if (a.match.length > b.match.length) return -1
            else if (
              currencies[a.key].counties_using >
              currencies[b.key].counties_using
            )
              return -1
          return 1
        })
        .map((x) => x.key)
    }
  }
  return null
}

const extractNumber = (
  text: string,
  currencyMatch: CurrencyMatch
): number | null => {
  //Remove all non-numeric characters
  const currencyExactMatch = currencyMatch.match
  text = text.replaceAll(currencyExactMatch, "").trim()
  const lang = document.documentElement.lang
  const numberFormat = new Intl.NumberFormat(lang)
  const parts = numberFormat.formatToParts(1234567.89)
  const decimalSeparator =
    parts.find((part) => part.type === "decimal")?.value ?? ""
  const groupSeparator =
    parts.find((part) => part.type === "group")?.value ?? ""
  // Construct regex for the locale-specific number format
  const regex = new RegExp(
    `^((\\d+\\${groupSeparator})+)?\\d+(\\${decimalSeparator}\\d+)?$`
  )
  const match = text.match(regex)
  if (match) {
    console.log("Match: ", match)
    const number = match[0]
      .replaceAll(groupSeparator, "")
      .replaceAll(decimalSeparator, ".")
    return parseFloat(number)
  }
  console.log("No match found")

  return null
}

export const isCurrencyString = (
  text: string
):
  | [false, null]
  | [
      true,
      {
        value: number
        currency: CurrencyMatch
        alternatives: AcceptedCurrency[]
      }
    ] => {
  text = text.trim().toUpperCase()
  if (text.length < 0) return [false, null]
  const match = extractCurrencyMatch(text)
  if (!match) return [false, null]
  const { currency, alternatives } = match
  const value = extractNumber(text, currency)
  if (!value) return [false, null]
  return [true, { value, currency, alternatives }]
}
