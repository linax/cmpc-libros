import { useContext } from "react"
import { BookContext } from "./BookContext"

export const useBooks = () => {
  const context = useContext(BookContext)

  if (!context) {
    throw new Error("useBooks debe usarse dentro de un BookProvider")
  }

  return context
}
