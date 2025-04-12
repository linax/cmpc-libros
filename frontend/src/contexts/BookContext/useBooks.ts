import { useContext } from "react"
import { BookContext } from "./BookContext"

export const useBooks = () => {
  const context = useContext(BookContext)

  if (!context) {
    throw new Error("useBooks should be used inside BookProvider")
  }

  return context
}
