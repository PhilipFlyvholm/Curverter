import {
  autoUpdate,
  computePosition,
  flip,
  inline,
  offset,
  shift,
  type ReferenceElement
} from "@floating-ui/dom"
import { useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import * as style from "~contents/styles.module.css"
import CurrencySelector from "~lib/components/CurrencySelector/currencySelector"
import { type AcceptedCurrency } from "~lib/currencies"
import { isCurrencyString } from "~lib/highlightObserver"

const DEFAULT_CURRENCY = "DKK" // TODO: Make this configurable

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currencyRates] = useStorage("currencyRates")
  function unselect() {
    setConversionState(null)
    if (box.current) box.current.style.display = "none"
    if (floatingUICleanup) floatingUICleanup()
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

  function handleMouseDown(e: MouseEvent) {
    setMousePosition({ x: e.clientX, y: e.clientY })
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
    const element = currentSelection.anchorNode.parentElement
    const [isMatch, match] = isCurrencyString(selectedText)
    if (
      !isMatch ||
      match.currency.key === DEFAULT_CURRENCY ||
      !element ||
      !box.current
    ) {
      unselect()
      return
    }

    let { clientX, clientY } = e
    let { x, y } = mousePosition

    const virtualHeight = clientY > y ? clientY - y : y - clientY
    const virtualY = (clientY > y ? y : clientY) + virtualHeight / 2
    const virtualWidth = clientX > x ? clientX - x : x - clientX
    const virtualX = clientX > x ? x : clientX
    const height = parseFloat(
      window.getComputedStyle(element, null).getPropertyValue("font-size")
    )
    const virtualElement = {
      getBoundingClientRect() {
        return {
          width: virtualWidth,
          height: height,
          x: virtualX + virtualWidth,
          y: virtualY,
          top: virtualY,
          left: virtualX,
          right: virtualX + virtualWidth,
          bottom: virtualY + height
        }
      }
    }

    const currencyRate = 1 / currencyRates.rates[match.currency.key]
    setConversionState({
      value: match.value,
      currencyRate,
      fromCurrency: match.currency.key,
      toCurrency: DEFAULT_CURRENCY,
      alternativeCurrencies: match.alternatives,
      element
    })

    box.current.style.display = "block"
    setFloatingUICleanup(
      autoUpdate(virtualElement, box.current, () =>
        updateFloatingPosition(virtualElement, box.current)
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
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [currencyRates, mousePosition])

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
              recommendedCurrencies={[DEFAULT_CURRENCY]}
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
