import "~contents/fonts.css"
import "~contents/styles.module.css"
import "./popupStyle.css"

import CurrencyConversion from "~lib/components/Popup/CurrencyConversion/CurrencyConversion"
import ConversionHistory from "~lib/components/Popup/ConversionHistory/ConversionHistory"
import Header from "~lib/components/Popup/Header"

function IndexPopup() {
  return (
    <>
      <Header />
      <CurrencyConversion />
      <ConversionHistory />
    </>
  )
}

export default IndexPopup
