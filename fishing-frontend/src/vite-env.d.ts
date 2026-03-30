/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin (no trailing slash). Empty string uses same origin + Vite proxy in dev. */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
