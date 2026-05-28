export const usePreventBrowserBack = (callback?: () => void) => {
  const handlePopState = () => {
    history.go(1)
    callback?.()
  }

  onMounted(() => {
    history.pushState(null, '', location.href)
    addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    removeEventListener('popstate', handlePopState)
  })
}
