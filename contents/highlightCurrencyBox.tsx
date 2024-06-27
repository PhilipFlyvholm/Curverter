import {
  autoUpdate,
  computePosition,
  flip,
  inline,
  offset,
  shift
} from "@floating-ui/dom"
import styleText from "data-text:./highlightCurrencyBox.module.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { currencies, type AcceptedCurrency } from "~lib/currencies"

//{ currency, value }: {currency:AcceptedCurrency, value: number}
import * as style from "./highlightCurrencyBox.module.css"
import { isCurrencyString } from "./highlightObserver"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
  css: ["fonts.css"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const HighlightCurrencyBox = () => {
  const box = useRef<HTMLDivElement>(null)
  const [conversionState, setConversionState] = useState<{
    value: number
    currencyRate: number
    currency: AcceptedCurrency
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

  function updateFloatingPosition(element: HTMLElement, floatingElement: HTMLElement) {
    computePosition(element, floatingElement, {
      placement: "bottom",
      middleware: [inline(), flip(), shift({ padding: 5 }), offset(5)]
    }).then(({ x, y }) => {
      Object.assign(floatingElement.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }

  async function handleMouseUp() {
    const currentSelection = window.getSelection()

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
      currency: match.currency.key,
      element
    })

    box.current.style.display = "flex"
    setFloatingUICleanup(
      autoUpdate(element, box.current, () =>
        updateFloatingPosition(element, box.current)
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

  useEffect(() => {
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
            <img
              src={currencies[conversionState.currency].flag}
              alt={`Flag of ${conversionState.currency} currency`}
            />
            <h2>
              {formatCurrency(conversionState.value, conversionState.currency)}
              {" = "}
              {formatCurrency(
                conversionState.value * conversionState.currencyRate,
                "DKK"
              )}
            </h2>
            <img src={currencies["DKK"].flag} alt={`Flag of DKK currency`} />
          </div>
          <p>
            {formatCurrency(1, conversionState.currency)}
            {" = "}
            {formatCurrency(conversionState.currencyRate, "DKK")}
          </p>
        </>
      )}
    </div>
  )
}

export default HighlightCurrencyBox
