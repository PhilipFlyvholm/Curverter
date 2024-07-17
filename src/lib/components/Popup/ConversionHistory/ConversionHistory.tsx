import { useStorage } from "@plasmohq/storage/hook"

import type { ConversionHistoryList } from "~lib/utils/StorageTypes"

import HistoryItem from "./HistoryItem"

function ConversionHistory() {
  const [historyItems] = useStorage<ConversionHistoryList>("conversionHistory", [])
  return (
    <section>
      <h3 className="section-header">Conversion history</h3>
      <div className="historyItemContainer">
        {historyItems.length !== 0 ? (
          historyItems
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((item, index) => (
              <HistoryItem
                key={index}
                from={item.from}
                to={item.to}
                meta={item.meta}
              />
            ))
        ) : (
          <p className="noHistoryText">No history yet</p>
        )}
      </div>
    </section>
  )
}

export default ConversionHistory
