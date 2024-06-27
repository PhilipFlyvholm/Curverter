import fs from "fs"

import rawData from "./rawCurrencyInfo.json"

type RawCurrency = {
  currency: string
  symbol: string
  code: string
  basic: string
}
type FormattedCurrencies = {
  [key: string]: RawCurrency & {
    symbols: string[]
    counties_using: number
    flag: string
    displaySymbol: string
  }
}

//Group by code
const res = rawData.reduce((acc: FormattedCurrencies, x: RawCurrency) => {
  const code: string = x.code
  if (code === "(none)" || !code) return acc

  if (!acc[code]) {
    const symbols = x.symbol
      .split("or")
      .flatMap((x: string) =>
        x.split(" ").map((x: string) => x.trim().toUpperCase()).filter((x: string) => x.length > 0 && !x.includes("("))
      )
      
    const displaySymbol = x.symbol
    //Load flag image png from assets/CurrencyFlags
    const existsImage = fs.existsSync(
      `../assets/CurrencyFlags/${code.toUpperCase()}.png`
    )
    let flag = ""
    if (existsImage) {
      flag = `data:image/png;base64,${fs.readFileSync(`../assets/CurrencyFlags/${code.toUpperCase()}.png`).toString("base64")}`
    }
    acc[code] = {
      ...x,
      symbols: symbols,
      counties_using: 1,
      flag,
      displaySymbol
    }
  } else {
    acc[code].counties_using += 1
  }
  return acc
}, {})

console.log(JSON.stringify(res))
