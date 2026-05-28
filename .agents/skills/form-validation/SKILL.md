---
name: form-validation
description: USE THIS SKILL whenever the user asks to add validation to a form, create a new input field with rules, or fix validation logic.
---

# Form Validation Skill

This skill enforces standardized form validation using [Element Plus](https://element-plus.org/en-US/component/form.html) and the project's custom `RuleService`.

---

## 1. Core Infrastructure

Validation rules are centralized in `shared/validation/rules.ts` and exported as `RuleService`.

### 1.1 Import RuleService

Always import `RuleService` from the shared path alias:

```ts
import { RuleService } from '#shared/validation/rules'
```

### 1.2 Available Rules

| Method                       | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `isRequired(message)`        | Field is required (trims whitespace)        |
| `isEmail(message)`           | Validates email format                      |
| `rulePassword(message)`      | Validates password length (6-20 characters) |
| `rulePhone(message)`         | Validates phone number format               |
| `isNumber(message)`          | Validates that input is a number            |
| `isLink(message)`            | Validates URL format                        |
| `isLinkYoutube(message)`     | Validates YouTube link                      |
| `isLinkVimeo(message)`       | Validates Vimeo link                        |
| `isLinkGoogleDrive(message)` | Validates Google Drive link                 |
| `isPathLink(message)`        | Validates internal path (e.g., `/my-page`)  |
| `colorHex(message)`          | Validates Hex color code                    |
| `isRequiredArray(message)`   | Validates that an array is not empty        |

---

## 2. Implementation in Components

### 2.1 Rule Definition

Rules should be defined using `computed` to ensure they respond to language changes if `useTranslate` is used.

```ts
const { translate } = useTranslate()

const rules = computed(() => ({
  email: [
    RuleService.isRequired(translate('validation.required')),
    RuleService.isEmail(translate('validation.email'))
  ],
  password: [
    RuleService.isRequired(translate('validation.required')),
    RuleService.rulePassword(translate('validation.password'))
  ]
}))
```

### 2.2 Template Usage

Use `el-form` with `:rules` and `:model`. Inside, use `field` components (or `el-form-item` + input) with the `prop` matching the rule key.

```vue
<template>
  <el-form ref="formRef" :rules="rules" :model="form" @submit.prevent="handleSubmit">
    <!-- field component automatically handles el-form-item wrapper if configured -->
    <field v-model="form.email" name="email" type="text" />
    <field v-model="form.password" name="password" type="password" />

    <button type="submit">Submit</button>
  </el-form>
</template>
```

> [!NOTE]
> The `field.vue` component in this project (found in `#shared/ui/field.vue`) is used as a wrapper for form inputs.
> The `button.vue` component in this project (found in `#shared/ui/field.vue`) is used as a wrapper for form inputs.

### 2.3 Form Instance ref

Always type the `formRef` with `FormInstance` from `element-plus`.

```ts
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const form = ref({ email: '', password: '' })
```

---

## 3. Submission Logic

Always validate the form programmatically before proceeding with the submission logic.

```ts
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // Proceed with API call or logic
      console.log('Form is valid!', form.value)
    } else {
      console.log('Validation failed')
    }
  })
}
```

---

## 4. Handling Backend Validation Errors

When the backend returns validation errors, always map them into per-field UI errors. In this project, `#shared/ui/field.vue` supports an `error` prop that renders directly via `el-form-item :error`, so prefer that over trying to mutate Element Plus internal validation state.

### 4.1 Expected Backend Error Shapes

Support these common shapes (normalize them in the UI layer):

- **Field errors map** (recommended):
  - `errors: Record<string, string[]>` or `errors: Record<string, string>`
- **Array of errors**:
  - `errors: Array<{ field: string; message: string }>`
- **Global (non-field) error**:
  - `message: string`

> [!IMPORTANT]
> Backend field keys should match the `prop` of `el-form-item` (or `name` in `field`) to show the error under the correct input.

### 4.2 Usage in Submit Handler

- Keep a dedicated `errorsForm` record in the page/component state.
- If API fails with validation errors (often \(422\)), normalize them and assign to `errorsForm`.
- If API fails with non-field message, show it as a toast/alert above the form.
- Clear `backendErrors` on successful submit, and optionally clear a field error on focus/input.

```ts
type FormErrors = Readonly<Record<string, string[]>>

const formErrors = ref<FormErrors>({})

const handleSubmit = async () => {
  formErrors.value = {}
  if (!formRef.value) return
  const isValid = await formRef.value.validate()
  if (!isValid) return
  const resp = await executeLogin({ email: form.value.email, password: form.value.password })

  if (resp.status === 422) {
    backendErrors.value = Formatter.formatErrors(resp.data.errors)
    return
  }
}
```

Then bind the error into `field`:

```vue
<field
  v-model="form.email"
  name="email"
  type="text"
  :form-ref="formRef"
  :error="formErrors.email ?? ''"
/>
```

---

## 5. Best Practices

- **Use Localized Messages**: Always use `translate()` for error messages.
- **Trigger Consistency**: By default, `RuleService` uses `trigger: 'blur'`. Do not override unless necessary.
- **Model Reactivity**: Ensure the `:model` object passed to `el-form` is the same ref used in `v-model`.
- **Validation on Submit**: Always perform a final `validate()` check in the submit handler.

---

## 6. Form Validation Checklist

- [ ] Import `RuleService` from `#shared/validation/rules`
- [ ] Define `formRef` with `ref<FormInstance>()`
- [ ] Define `rules` using `computed()` and `translate()`
- [ ] Always use `translate()` for error messages.
- [ ] Bind `:rules` and `:model` to `el-form`
- [ ] Ensure `prop` (or `name` in `field`) matches the rule key
- [ ] Call `formRef.value.validate()` in the submit handler
- [ ] Normalize backend field errors into `Record<string, string[]>`
- [ ] Bind backend errors to `field :error` (and show non-field errors as toast/banner)
