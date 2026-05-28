class HelperService {
  copyText = async (text: string): Promise<void> => {
    if (!navigator.clipboard || !window.isSecureContext) {
      this.executeFallbackCopyToClipboard(text)
      return
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      this.executeFallbackCopyToClipboard(text)
      console.error('Unable to copy to clipboard', err)
    }
  }
  executeFallbackCopyToClipboard = (text: string): void => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
  }
}

export const Helper = new HelperService()
