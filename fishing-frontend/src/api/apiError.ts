import axios from 'axios'

type ProblemDetailsLike = {
  title?: unknown
  detail?: unknown
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function tryReadProblemDetails(data: unknown): ProblemDetailsLike | null {
  if (!isObject(data)) return null
  return {
    title: data.title,
    detail: data.detail,
  }
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const pd = tryReadProblemDetails(err.response?.data)
    const detail = typeof pd?.detail === 'string' ? pd.detail : null
    const title = typeof pd?.title === 'string' ? pd.title : null

    return detail || title || err.message || fallback
  }

  if (err instanceof Error) return err.message
  return fallback
}
