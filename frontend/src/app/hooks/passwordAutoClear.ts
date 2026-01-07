import { useEffect, useRef } from "react"

export function usePasswordAutoClear(callback: () => void, timeout = 30000) {
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   useEffect(() => {
      const reset = () => {
         if (timerRef.current) {
            clearTimeout(timerRef.current)
         }
         timerRef.current = setTimeout(callback, timeout)
      }

      window.addEventListener('mousemove', reset)
      window.addEventListener('keydown', reset)
      window.addEventListener('click', reset)
      window.addEventListener('touchstart', reset)

      reset() // start immediately

      return () => {
         if (timerRef.current) {
            clearTimeout(timerRef.current)
         }
         window.removeEventListener('mousemove', reset)
         window.removeEventListener('keydown', reset)
         window.removeEventListener('click', reset)
         window.removeEventListener('touchstart', reset)
      }
   }, [callback, timeout])
}
