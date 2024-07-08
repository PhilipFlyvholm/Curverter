import globalStyleText from "data-text:./styles.css"
import styleText from "data-text:./styles.module.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import HighlightCurrencyBox from "~lib/components/HighlightCurrencyBox/highlightCurrencyBox"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
  css: ["fonts.css"]
}
export const getStyle: PlasmoGetStyle = () => {
  console.log("getStyle called from root")
  const style = document.createElement("style")
  style.textContent = globalStyleText + styleText
  return style
}

const RootOverlay = () => {
  return <HighlightCurrencyBox></HighlightCurrencyBox>
}

export default RootOverlay
