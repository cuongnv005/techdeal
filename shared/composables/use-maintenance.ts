import { ref } from 'vue'

const isMaintenanceActive = ref(false)
const maintenanceCustomMessage = ref<string | undefined>(undefined)

export const useMaintenance = () => {
  const triggerMaintenance = (customMessage?: string) => {
    if (customMessage) {
      maintenanceCustomMessage.value = customMessage
    }
    isMaintenanceActive.value = true
  }

  const resetMaintenance = () => {
    isMaintenanceActive.value = false
    maintenanceCustomMessage.value = undefined
  }

  return {
    isMaintenanceActive,
    maintenanceCustomMessage,
    triggerMaintenance,
    resetMaintenance
  }
}
