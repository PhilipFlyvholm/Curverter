import { Command } from "cmdk"

import * as style from "~contents/styles.module.css"
import { currencies, type AcceptedCurrency } from "~lib/currencies"

type CurrencyComboboxProps = {
  useClickAwayRef: React.MutableRefObject<any>
  recommendedCurrencies: AcceptedCurrency[]
  comboboxValue: string
  setComboboxValue: (value: string) => void
  onCurrencyChange: (newCurrency: string) => void
  visible?: boolean
}

function CurrencyCombobox({
  useClickAwayRef,
  recommendedCurrencies,
  comboboxValue,
  setComboboxValue,
  onCurrencyChange,
  visible =  false
}: CurrencyComboboxProps) {
  return (
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
              <CurrencyItem
                key={currency}
                currency={currency}
                onSelect={onCurrencyChange}
              />
            ))}
          </Command.Group>
          <Command.Group heading="Other currencies">
            {Object.keys(currencies)
              .filter(
                (currency) =>
                  !recommendedCurrencies.includes(currency as AcceptedCurrency)
              )
              .sort()
              .map((currency) => (
                <CurrencyItem
                  key={currency}
                  currency={currency}
                  onSelect={onCurrencyChange}
                />
              ))}
          </Command.Group>
        </Command.List>
      </Command>
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

export default CurrencyCombobox
