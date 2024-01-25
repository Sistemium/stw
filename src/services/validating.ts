import { ref } from 'vue';
import { onKeyStroke } from '@vueuse/core'

export function useFormValidate() {
  const form = ref<{ validate(cb: (e: any) => any): any }>();
  return {
    form,
    validate(cb: (is: any) => any) {
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
