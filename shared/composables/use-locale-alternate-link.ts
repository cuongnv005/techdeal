import { useState } from '#app'

export const useLocaleAlternateLink = () => useState<string | null>('locale-alternate-link', () => null)
