import "~contents/fonts.css"
import "~contents/styles.module.css"
import "./popupStyle.css"

import CurrencyConversion from "~lib/components/Popup/CurrencyConversion/CurrencyConversion"
import Header from "~lib/components/Popup/Header"

function IndexPopup() {
  return (
    <>
      <Header />
      <CurrencyConversion />
    </>
  )
}

export default IndexPopup
