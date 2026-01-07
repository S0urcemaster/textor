import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react"
import Button from "./Button"

export function FeedbackButton({ duration, children, disabled, style, className, mouseDown, successNode, failureNode, evaluation, evaluated }: { duration: number, children: ReactNode, disabled?: boolean, style?: CSSProperties, className?: string, mouseDown?: boolean, successNode: ReactNode, failureNode: ReactNode, evaluation: () => boolean, evaluated: (to: boolean) => void }) {

   const [success, setSuccess] = useState<boolean | undefined>()

   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   useEffect(() => {
      if (success !== undefined) {
         if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
               setSuccess(undefined)
               timeoutRef.current = null
            }, duration)
         }
      }
   }, [success])

   function evaluate() {
      const success = evaluation()
      setSuccess(success)
      evaluated(success)
   }

   return (
      <>
         {success ?
            <Button disabled={disabled} style={{ ...style }} onActivate={evaluate}>{children}</Button>
            :
            <Button disabled={disabled} style={{ ...style }} onActivate={evaluate}>{children}</Button>
         }
      </>
   )
}
