import React from "react"

export function useClickAway(cb: (e: any) => void) {
  const ref = React.useRef(null)
  const refCb = React.useRef(cb)

  React.useLayoutEffect(() => {
    refCb.current = cb
  })

  React.useEffect(() => {
    const shadowRootContainer = document.querySelector("plasmo-csui")
    console.log(shadowRootContainer);
    
    if (shadowRootContainer !== null) {
      const shadowRoot = shadowRootContainer.shadowRoot

      const shadowRootHandler = (e: { target: any }) => {
        const element = ref.current

        if (element && !element.contains(e.target)) {
          refCb.current(e)
        }
      }

      const documentHandler = (e: { target: any }) => {
        if (e.target == shadowRootContainer) {
          return
        }

        refCb.current(e)
      }

      shadowRoot.addEventListener("mousedown", shadowRootHandler)
      shadowRoot.addEventListener("touchstart", shadowRootHandler)

      document.addEventListener("mousedown", documentHandler)
      document.addEventListener("touchstart", documentHandler)

      return () => {
        shadowRoot.removeEventListener("mousedown", shadowRootHandler)
        shadowRoot.removeEventListener("touchstart", shadowRootHandler)
        document.removeEventListener("mousedown", documentHandler)
        document.removeEventListener("touchstart", documentHandler)
      }
    }else{
      const handler = (e: { target: any }) => {
        const element = ref.current

        if (element && !element.contains(e.target)) {
          refCb.current(e)
        }
      }

      document.addEventListener("mousedown", handler)
      document.addEventListener("touchstart", handler)

      return () => {
        document.removeEventListener("mousedown", handler)
        document.removeEventListener("touchstart", handler)
      }
    }
  }, [])

  return ref
}
