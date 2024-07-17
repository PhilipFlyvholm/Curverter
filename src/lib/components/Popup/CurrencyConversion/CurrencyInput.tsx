import { useId, useMemo } from "react"

import CurrencySelector from "~lib/components/CurrencySelector/currencySelector"
import { popularCurrencies, type AcceptedCurrency } from "~lib/currencies"

type CurrencyInputProps = {
  labelText: string
  currency: AcceptedCurrency
  onCurrencyChange: (currency: AcceptedCurrency) => void
  value: number
  onValueChange: (value: number) => void,
  formatValue: boolean
}

function CurrencyInput({
  labelText,
  currency,
  onCurrencyChange,
  value,
  onValueChange,
  formatValue
}: CurrencyInputProps) {
  const id = useId()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value.trim() === "") {
      onValueChange(0)
      return
    }
    onValueChange(parseFloat(event.target.value))
  }
  const recommendedCurrencies = useMemo(() => {
    if (popularCurrencies.includes(currency)) {
      return popularCurrencies
    }
    return popularCurrencies.concat(currency)
  }, [])

  return (
    <div className="currencyInputContainer">
      <CurrencySelector
        recommendedCurrencies={recommendedCurrencies}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />
      <label htmlFor={"amount-" + id} className="currencyInput">
        <div className="currencyInputField">
          <small>{labelText}</small>
          <input
            type="number"
            id={"amount-" + id}
            value={formatValue ? value.toFixed(2) : value}
            onInput={handleInputChange}
          />
        </div>
        <p className="currencyInputCurrencyLabel">{currency}</p>
      </label>
    </div>
  )
}
export default CurrencyInput
