/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID?: string
  readonly VITE_HIVESIGNER_APP?: string
  readonly VITE_MAGI_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
