/**
 * Extract a user-friendly error message from an API error.
 * Catches raw database/technical errors and returns a clean message.
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const error = err as {
    response?: {
      data?: {
        error?: string | { message?: string | string[] }
        message?: string | string[]
      }
    }
  }

  const data = error.response?.data

  let message: string | undefined
  if (data?.message) {
    message = Array.isArray(data.message) ? data.message[0] : data.message
  }

  if (!message && data?.error && typeof data.error === 'object') {
    const nested = data.error.message
    message = Array.isArray(nested) ? nested[0] : nested
  }

  if (!message) {
    message = fallback
  }

  const lower = message.toLowerCase()
  if (
    lower.includes('does not exist in the current database') ||
    lower.includes('prisma') ||
    lower.includes('prismaclient') ||
    lower.includes('internal server error') ||
    lower.includes('cannot read properties') ||
    lower.includes('econnrefused') ||
    lower.includes('network error')
  ) {
    return fallback
  }

  return message
}
