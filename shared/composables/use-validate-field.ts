interface FormValidationInstance {
  clearValidate?: (field: string) => void
  validateField?: (field: string) => void
}

export function useValidateField() {
  const resetField = (formRef: FormValidationInstance, field: string): void => {
    formRef.clearValidate?.(field)
  }

  const validateField = (formRef: FormValidationInstance, field: string): void => {
    formRef.validateField?.(field)
  }

  return {
    validateField,
    resetField
  }
}
