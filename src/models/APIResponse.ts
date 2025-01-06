/**
 * Interface for a standard API response structure.
 */
export interface APIResponse<T = any> {
  status: number; // HTTP status code
  success: boolean; // Indicates whether the operation was successful
  message: string; // Message describing the response
  data: T | null; // Data payload (generic type)
}
