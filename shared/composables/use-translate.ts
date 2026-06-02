import type { TxKeyPath } from '@shared/types/common.type'

interface TranslateOptions {
  [key: string]: string | number | boolean | null | undefined
}

interface UseTranslateResult {
  translate: (key: TxKeyPath, options?: TranslateOptions) => string
}

export function useTranslate(): UseTranslateResult {
  const translate = (key: TxKeyPath, _options?: TranslateOptions): string => {
    return String(key)
  }

  return { translate }
}
