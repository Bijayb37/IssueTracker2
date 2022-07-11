import { useState } from "react"

export default function useToggler(initialValue) {
  const [booleanValue, setBooleanValue] = useState(initialValue)

  const toggle = () => {
    setBooleanValue((prev) => !prev)
  }

  return [booleanValue, toggle]
}
