import { useStorage } from "@plasmohq/storage/hook"
import type {AcceptedCurrencies} from '../lib/currencies';

async function fetchCurrencyExchangeRates(fromCurrency: AcceptedCurrencies) {
  //https://open.er-api.com/v6/latest/DKK
  const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
  const json = await res.json()
  console.log(Object.keys(json.rates).reduce((acc, key) => acc + "\"" + key + "\"" + ", ", "")) 
  return { nextUpdateUnix: json.time_next_update_unix, rates: json.rates }
}
const Test = () => {
  const [hailingFrequency, setHailingFrequency] = useStorage("hailing")
  return (
    <button
      onClick={async () =>
        setHailingFrequency(await fetchCurrencyExchangeRates("DKK"))
      }>
      Custom button {JSON.stringify(hailingFrequency)}
    </button>
  )
}

export default Test
