import { Command } from "cmdk"
import { useId, useRef, useState } from "react"

import * as style from "~contents/styles.module.css"
import { currencies, type AcceptedCurrency } from "~lib/currencies"

import { useClickAway } from "../../hooks/useClickAway"

type CurrencySelectorProps = {
  recommendedCurrencies: AcceptedCurrency[]
  currency: AcceptedCurrency
  onCurrencyChange?: (newCurrency: AcceptedCurrency) => void
}

const CurrencySelector = ({
  recommendedCurrencies,
  currency,
  onCurrencyChange = () => {
    return
  }
}: CurrencySelectorProps) => {
  const [showCombobox, setShowCombobox] = useState(false)
  const useClickAwayRef = useClickAway(() => {
    setShowCombobox(false)
  })
  const [comboboxValue, setComboboxValue] = useState<string>(currency)
  return (
    <div className={style.currencySelector}>
      <img
        src={currencies[currency].flag}
        alt={`Flag of ${currency} currency`}
      />
      <button
        type="button"
        className={style.expandButton}
        onClick={() => setShowCombobox(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {showCombobox && (
        <div className={style.currencyCombobox} ref={useClickAwayRef}>
          <Command
            label="Currency selector"
            value={comboboxValue}
            onValueChange={setComboboxValue}>
            <Command.Input placeholder="Search currencies..." />
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>

              <Command.Group heading="Recommended">
                {recommendedCurrencies.map((currency) => (
                  <CurrencyItem key={currency} currency={currency}  onSelect={onCurrencyChange}/>
                ))}
              </Command.Group>
              <Command.Group heading="Other currencies">
                {Object.keys(currencies)
                  .filter(
                    (currency) =>
                      !recommendedCurrencies.includes(
                        currency as AcceptedCurrency
                      )
                  )
                  .sort()
                  .map((currency) => (
                    <CurrencyItem key={currency} currency={currency} onSelect={onCurrencyChange}/>
                  ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </div>
  )
}

const CurrencyItem = ({ currency, onSelect }) => {
  return (
    <Command.Item onSelect={onSelect} value={currency}>
      <div className={style.currencyItem}>
        <img
          src={currencies[currency].flag}
          alt={`Flag of ${currency} currency`}
        />
        <span>{currencies[currency].currency}</span>
        <small>{currency}</small>
      </div>
    </Command.Item>
  )
}

export default CurrencySelector
