import type { TxKeyPath } from '@shared/types/common.type'

interface TranslateOptions {
  [key: string]: string | number | boolean | null | undefined
}

interface UseTranslateResult {
  translate: (key: TxKeyPath, options?: TranslateOptions) => string
}

export function useTranslate(): UseTranslateResult {
  const { $i18n } = useNuxtApp()

  const translate = (key: TxKeyPath, options?: TranslateOptions): string => {
    if (options) {
      return $i18n.t(key, options)
    }
    return $i18n.t(key)
  }

  return { translate }
}
