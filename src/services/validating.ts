import { ref } from 'vue';
import { onKeyStroke } from '@vueuse/core'
import Site from '@/models/Site'

export type FormValidateCallback = (is: any) => any

export function useFormValidate() {
  const form = ref<{ validate(cb: FormValidateCallback): any }>();
  return {
    form,
    validate(cb: FormValidateCallback) {
      return form.value?.validate(cb);
    },
  }
}

export function useEnter(onEnter: (e: EventTarget | null) => void) {
  onKeyStroke('Enter', e => {
    onEnter(e?.target)
    // @ts-ignore
    // e?.target?.blur();
  });
}

export function hasSiteAuth(id: string) {
  return !!Site.getByID(id)
}
