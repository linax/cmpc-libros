//TODO: Check if this model is necesary
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
