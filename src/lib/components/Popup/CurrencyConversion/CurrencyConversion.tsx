import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { AcceptedCurrency } from "~lib/currencies"

import CurrencyInput from "./CurrencyInput"
import FlipCurrencyButton from "./FlipCurrencyButton"

type CurrencyField = {
  currency: AcceptedCurrency
  value: number
  isCalculated: boolean
}

type ConversionState = {
  from: CurrencyField
  to: CurrencyField
  rate: number
}

function CurrencyConversion() {
  const [convsersionState, setConversionState] = useState<ConversionState>()
  const [currencyRates] = useStorage("currencyRates")

  const updateCurrency = (field: "FROM" | "TO", currency: AcceptedCurrency) => {
    switch (field) {
      case "FROM": {
        setConversionState((state) => {
          const rate =
            (1 / currencyRates.rates[currency]) *
            currencyRates.rates[state.to.currency]
          return {
            from: {
              currency: currency,
              value: state.from.value,
              isCalculated: state.from.isCalculated
            },
            to: {
              currency: state.to.currency,
              value: state.from.value * rate,
              isCalculated: true
            },
            rate: rate
          }
        })
        break
      }
      case "TO": {
        setConversionState((state) => {
          const rate =
            (1 / currencyRates.rates[state.from.currency]) *
            currencyRates.rates[currency]
          return {
            to: {
              currency: currency,
              value: state.from.value * rate,
              isCalculated: true
            },
            from: state.from,
            rate: rate
          }
        })
        break
      }
    }
  }

  const updateValue = (field: "FROM" | "TO", value: number) => {
    switch (field) {
      case "FROM": {
        setConversionState((state) => {
          return {
            from: {
              currency: state.from.currency,
              value: value,
              isCalculated: false
            },
            to: {
              currency: state.to.currency,
              value: value * state.rate,
              isCalculated: true
            },
            rate: state.rate
          }
        })
        break
      }
      case "TO": {
        setConversionState((state) => {
          return {
            to: {
              currency: state.to.currency,
              value: value,
              isCalculated: false
            },
            from: {
              currency: state.from.currency,
              value: value / state.rate,
              isCalculated: true
            },
            rate: state.rate
          }
        })
        break
      }
    }
  }

  const flipCurrencies = () => {
    setConversionState((state) => {
      return {
        from: state.to,
        to: state.from,
        rate: 1 / state.rate
      }
    })
  }

  useEffect(() => {
    if (!currencyRates) return
    setConversionState({
      from: { currency: "DKK", value: 1, isCalculated: false },
      to: { currency: "EUR", value: currencyRates.rates["EUR"], isCalculated: true },
      rate: currencyRates.rates["EUR"]
    })
  }, [currencyRates])

  return (
    <section>
      <h3 className="section-header">Currency conversion</h3>
      {convsersionState && (
        <div className="currencyInputArea">
          <CurrencyInput
            labelText="Amount"
            currency={convsersionState.from.currency}
            onCurrencyChange={(currency) => updateCurrency("FROM", currency)}
            value={convsersionState.from.value}
            onValueChange={(value) => {
              updateValue("FROM", value)
            }}
            formatValue={convsersionState.from.isCalculated}
          />
          <FlipCurrencyButton onClick={flipCurrencies}/>
          <CurrencyInput
            labelText="Converted to"
            currency={convsersionState.to.currency}
            onCurrencyChange={(currency) => updateCurrency("TO", currency)}
            value={convsersionState.to.value}
            onValueChange={(value) => {
              updateValue("TO", value)
            }}
            formatValue={convsersionState.to.isCalculated}
          />
        </div>
      )}
    </section>
  )
}

export default CurrencyConversion
