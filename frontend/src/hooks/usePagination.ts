import { useState } from "react"
import { PaginationParams } from "../models/book"

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit
  })

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setPagination({ page: 1, limit })
  }

  return {
    pagination,
    handlePageChange,
    handleLimitChange
  }
}
