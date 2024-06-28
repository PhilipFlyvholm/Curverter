import {
  autoUpdate,
  computePosition,
  flip,
  inline,
  offset,
  shift
} from "@floating-ui/dom"
import { useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import * as style from "~contents/styles.module.css"
import CurrencySelector from "~lib/components/CurrencySelector/currencySelector"
import { type AcceptedCurrency } from "~lib/currencies"
import { isCurrencyString } from "~lib/highlightObserver"

const HighlightCurrencyBox = () => {
  const box = useRef<HTMLDivElement>(null)
  const [conversionState, setConversionState] = useState<{
    value: number
    currencyRate: number
    fromCurrency: AcceptedCurrency
    toCurrency: AcceptedCurrency
    alternativeCurrencies: AcceptedCurrency[]
    element: HTMLElement
  } | null>(null)
  const [floatingUICleanup, setFloatingUICleanup] =
    useState<() => void | null>(null)
  const [currencyRates] = useStorage("currencyRates")

  function unselect() {
    setConversionState(null)
    if (box.current) box.current.style.display = "none"
    if (floatingUICleanup) floatingUICleanup()
  }

  function updateFloatingPosition(
    element: HTMLElement,
    floatingElement: HTMLElement,
    { x, y }: { x: number; y: number }
  ) {
    computePosition(element, floatingElement, {
      placement: "bottom",
      middleware: [inline({ x, y }), flip(), shift({ padding: 5 }), offset(5)]
    }).then(({ x, y }) => {
      Object.assign(floatingElement.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }

  async function handleMouseUp(e: MouseEvent) {
    const currentSelection = window.getSelection()

    if (box.current) {
      if ((e.target as Node).nodeName == "PLASMO-CSUI") {
        return
      }
    }
    if (!currentSelection || !currencyRates) {
      unselect()
      return
    }

    const selectedText = currentSelection.toString()
    const [isMatch, match] = isCurrencyString(selectedText)
    if (!isMatch) {
      unselect()
      return
    }

    //TODO: Handle case where target and source currencies are the same

    const element = currentSelection.anchorNode.parentElement
    if (!element || !box.current) {
      unselect()
      return
    }

    const currencyRate = 1 / currencyRates.rates[match.currency.key]
    setConversionState({
      value: match.value,
      currencyRate,
      fromCurrency: match.currency.key,
      toCurrency: "DKK",
      alternativeCurrencies: match.alternatives,
      element
    })
    console.log(e.clientX, e.clientY)

    box.current.style.display = "block"
    setFloatingUICleanup(
      autoUpdate(element, box.current, () =>
        updateFloatingPosition(element, box.current, {
          x: e.clientX,
          y: e.clientY
        })
      )
    )
  }

  function formatCurrency(num: number, currency: AcceptedCurrency) {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency
    })
    return formatter.format(num)
  }

  function handleFromCurrencyChange(currency: AcceptedCurrency) {
    setConversionState((state) => {
      if (!state) return null
      return {
        ...state,
        currencyRate: 1 / currencyRates.rates[currency],
        fromCurrency: currency
      }
    })
  }

  function handleToCurrencyChange(currency: AcceptedCurrency) {
    setConversionState((state) => {
      if (!state) return null
      // We use the original currency rate to convert into the new currency to avoid fetching currencies rates again
      // This means if original target currency is USD and we convert from EUR and then change the target currency to DKK
      // Then we convert from EUR to USD and then to DKK
      const currencyRate =
        (1 / currencyRates.rates[state.fromCurrency]) *
        currencyRates.rates[currency]
      return {
        ...state,
        currencyRate,
        toCurrency: currency
      }
    })
  }

  useEffect(() => {
    console.log("Loaded extension");
    
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [currencyRates])

  return (
    <div className={style.highlightBox} ref={box}>
      {conversionState && (
        <>
          <div className={style.highlightBoxInner}>
            <CurrencySelector
              recommendedCurrencies={conversionState.alternativeCurrencies}
              currency={conversionState.fromCurrency}
              onCurrencyChange={handleFromCurrencyChange}
            />
            <h2>
              {formatCurrency(
                conversionState.value,
                conversionState.fromCurrency
              )}
              {" = "}
              {formatCurrency(
                conversionState.value * conversionState.currencyRate,
                conversionState.toCurrency
              )}
            </h2>
            <CurrencySelector
              recommendedCurrencies={["DKK"]}
              currency={conversionState.toCurrency}
              onCurrencyChange={handleToCurrencyChange}
            />
          </div>
          <p>
            {formatCurrency(1, conversionState.fromCurrency)}
            {" = "}
            {formatCurrency(
              conversionState.currencyRate,
              conversionState.toCurrency
            )}
          </p>
        </>
      )}
    </div>
  )
}

export default HighlightCurrencyBox
