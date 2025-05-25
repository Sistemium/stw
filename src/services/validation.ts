import { computed, ref } from 'vue'
import { safeT, safeTd } from '@/services/i18n'

type ValidatorResult = string | true
type StringFieldValidator = (val: any) => ValidatorResult

export function requiredRule(fieldName: string): StringFieldValidator {
  return value => !!value || safeT('required', 'validation', safeT(fieldName))
}

export function minValueRule(fieldName: string, minValue: string): StringFieldValidator {
  return value => {
    return (
      value >= minValue ||
      safeT('notLessThan', 'validation', safeT(fieldName), safeTd(minValue, 'short'))
    )
  }
}

export function emailRule(fieldName: string): StringFieldValidator {
  return (value: string): ValidatorResult => {
    if (!value) {
      return true
    }
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || safeT('email', 'validation', safeT(fieldName))
  }
}

interface ValidationResult {
  valid: boolean
  errors?: { id: string | number; errorMessages: string[] }[]
}

interface Validator {
  validate: () => Promise<ValidationResult>
}

export function useFormValidation() {
  const formRef = ref<Validator>()
  return {
    formRef,
    async validate(): Promise<ValidationResult> {
      const { value } = formRef
      if (!value) {
        console.error('useFormValidation formRef empty')
        return { valid: false }
      }
      // console.log(value)
      return value.validate()
    },
  }
}

export function useRequiredProp(props: { required?: boolean }, fieldName: string) {
  return computed(() => {
    if (!props.required) {
      return []
    }
    return [requiredRule(fieldName)]
  })
}
