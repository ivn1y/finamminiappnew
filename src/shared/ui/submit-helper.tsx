'use client'

import { useFormStatus } from "react-dom"

type SubmitHelperProps = {
  children: (pending: boolean) => React.ReactNode
}

export const SubmitHelper = ({ children }: SubmitHelperProps) => {
  const { pending } = useFormStatus()

  return <>
    {children(pending)}
  </>
}