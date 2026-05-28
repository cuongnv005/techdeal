import type jp from '@i18n/locales/jp.json'
import type { AxiosResponse } from 'axios'

type Translations = typeof jp

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
    ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
    : Text

export type TxKeyPath = RecursiveKeyOf<Translations>

export type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

interface ResponseData<T> {
  message: string
  errors?: Record<string, string[]>
  data: T
}

export type Future<T> = Promise<AxiosResponse<ResponseData<T>>>
