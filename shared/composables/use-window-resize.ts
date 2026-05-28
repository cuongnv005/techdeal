interface Dimensions {
  width: number
  height: number
}

interface IWindowResize {
  resize?(val: Dimensions): void
}

export function useWindowResize(val: IWindowResize) {
  const dimensions = ref<Dimensions>({ width: 0, height: 0 })

  const resize = () => {
    dimensions.value = { width: window.innerWidth, height: window.innerHeight }
    if (val.resize) {
      val.resize(dimensions.value)
    }
  }

  onMounted(() => {
    if (process.client) {
      dimensions.value = { width: window.innerWidth, height: window.innerHeight }
      window.addEventListener('resize', resize)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', resize)
    }
  })

  return { dimensions }
}
