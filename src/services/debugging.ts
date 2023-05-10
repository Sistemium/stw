import { getCurrentInstance } from 'vue';
import { nsLog } from 'sistemium-debug';

type DebugFn = (...args: (string | number | object | boolean)[]) => void;

export function useLog(): { debug: DebugFn, error: DebugFn } {
  const instance = getCurrentInstance();
  const ns = `stm:${instance.type.__name}`;
  const nse = `stm:error:${instance.type.__name}`;
  const { debug, error } = nsLog(ns, nse);
  return { debug, error };
}
