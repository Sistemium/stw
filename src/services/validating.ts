import { ref } from 'vue';

export function useFormValidate() {
  const form = ref(null);
  return {
    form,
    validate(cb) {
      return form.value.validate(cb);
    },
  }
}
