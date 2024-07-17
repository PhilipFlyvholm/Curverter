import { currencies, type AcceptedCurrency } from "~lib/currencies"

import { formatCurrency } from "../../../utils/FormatUtil"

type HistoryItemProps = {
  from: {
    currency: AcceptedCurrency
    value: number
  }
  to: {
    currency: AcceptedCurrency
    value: number
  }
  meta: {
    url: string
    title: string
    favicon: string
  }
}
const maxTitleLength = 25
function HistoryItem({ from, to, meta }: HistoryItemProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    chrome.tabs.create({ url: meta.url })
  }

  return (
    <div className="historyItem">
      <div className="conversionInfo">
        <img
          src={currencies[from.currency].flag}
          alt={`Flag of ${from.currency} currency`}
        />
        <h4>
          {formatCurrency(from.value, from.currency)}
          {" = "}
          {formatCurrency(to.value, to.currency)}
        </h4>
        <img
          src={currencies[to.currency].flag}
          alt={`Flag of ${to.currency} currency`}
        />
      </div>
      <a className="pageInfo" href={meta.url} onClick={handleLinkClick}>
        <img src={meta.favicon} alt={"Favicon of " + meta.url} />
        <p>
          {meta.title.length > maxTitleLength
            ? meta.title.substring(0, maxTitleLength) + "..."
            : meta.title}
        </p>
      </a>
    </div>
  )
}
export default HistoryItem
