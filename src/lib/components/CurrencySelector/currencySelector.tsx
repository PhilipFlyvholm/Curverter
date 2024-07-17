import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type ReferenceElement
} from "@floating-ui/dom"
import { useEffect, useRef, useState } from "react"

import * as style from "~contents/styles.module.css"
import { currencies, type AcceptedCurrency } from "~lib/currencies"

import { useClickAway } from "../../hooks/useClickAway"
import CurrencyCombobox from "./currencyCombobox"

type CurrencySelectorProps = {
  recommendedCurrencies: AcceptedCurrency[]
  currency: AcceptedCurrency
  onCurrencyChange?: (newCurrency: AcceptedCurrency) => void
}

function updateFloatingPosition(
  element: ReferenceElement,
  floatingElement: HTMLElement
) {

  computePosition(element, floatingElement, {
    placement: "bottom",
    middleware: [flip(), shift({ padding: 5 }), offset(5)]
  }).then(({ x, y }) => {
    Object.assign(floatingElement.style, {
      left: `${x}px`,
      top: `${y}px`
    })
  })
}

const CurrencySelector = ({
  recommendedCurrencies,
  currency,
  onCurrencyChange = () => {
    return
  }
}: CurrencySelectorProps) => {
  const [isComboboxVisible, setComboBoxVisibility] = useState(false)
  const useClickAwayRef = useClickAway(() => {
    hideCombobox()
  })
  const [comboboxValue, setComboboxValue] = useState<string>(currency)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const referncePoint = useRef<HTMLDivElement>(null)
  const showCombobox = () => setComboBoxVisibility(true)
  const hideCombobox = () => setComboBoxVisibility(false)

  useEffect(() => {
    if (!referncePoint || !comboboxRef) return
    const referenceElement = referncePoint.current
    const floatingElement = comboboxRef.current
    const removeAutoUpdate = autoUpdate(referenceElement, floatingElement, () =>
      updateFloatingPosition(referenceElement, floatingElement)
    )
    return removeAutoUpdate
  }, [isComboboxVisible, referncePoint, comboboxRef])

  return (
    <>
      <div className={style.currencySelector} ref={referncePoint}>
        <img
          src={currencies[currency].flag}
          alt={`Flag of ${currency} currency`}
        />
        <button
          type="button"
          className={style.expandButton}
          onClick={showCombobox}>
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
      </div>
      <div
        ref={comboboxRef}
        className={style.currencyComboboxContainer}
        style={{ display: isComboboxVisible ? "block" : "none" }}>
        <CurrencyCombobox
          useClickAwayRef={useClickAwayRef}
          recommendedCurrencies={recommendedCurrencies}
          comboboxValue={comboboxValue}
          setComboboxValue={setComboboxValue}
          onCurrencyChange={onCurrencyChange}
        />
      </div>
    </>
  )
}

export default CurrencySelector
