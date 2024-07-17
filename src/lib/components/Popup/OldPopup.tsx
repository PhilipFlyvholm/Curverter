import { useStorage } from "@plasmohq/storage/hook"

import type { AcceptedCurrency, CurrencyRates } from "~lib/currencies"

async function fetchCurrencyExchangeRates(
  fromCurrency: AcceptedCurrency
): Promise<CurrencyRates> {
  //https://open.er-api.com/v6/latest/DKK
  const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
  const json = await res.json()
  console.log(
    Object.keys(json.rates).reduce(
      (acc, key) => acc + '"' + key + '"' + ", ",
      ""
    )
  )
  return { nextUpdateUnix: json.time_next_update_unix, rates: json.rates }
}
function IndexPopup() {
  const [currencyRates, setCurrencyRates] = useStorage("currencyRates")

  return (
    <div
      style={{
        padding: 16
      }}>
      <button
        onClick={async () =>
          setCurrencyRates(await fetchCurrencyExchangeRates("DKK"))
        }>
        Update currency rates
      </button>
      {currencyRates ? (
        <textarea style={{ width: "100%" }}>
          {JSON.stringify(currencyRates)}
        </textarea>
      ) : "No currency rates"}
    </div>
  )
}

export default IndexPopup
