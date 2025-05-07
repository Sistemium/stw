import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { v4 } from 'uuid'
import store from '.'
import User, { IUser } from '@/models/User'

const { VITE_LS_PREFIX = 'stv' } = import.meta.env;

export interface BarcodeScan {
  code: string;
  symbology: string;
}

function prefixed(key: string) {
  return `${VITE_LS_PREFIX}.${key}`
}

interface StoreType extends Record<string, any> {
  user?: IUser
  uuid: string
}

export const useInvStore = defineStore('inv', {
  state: () => ({
    currentStorageId: useStorage<string>(prefixed('CURRENT_STORAGE'), ''),
    currentSiteId: useStorage<string | undefined>(prefixed('CURRENT_SITE'), ''),
    scannedBarcode: undefined,
    uuid: v4(),
    clientDataId: useStorage<string>(prefixed('CLIENT_DATA_ID'), v4()),
    user: undefined
  } as StoreType),
  getters: {
    authToken() {
      return store.getters['auth/ACCESS_TOKEN'] as string
    },
    authId() {
      const account = store.getters['auth/account']
      return (account?.authId || account?.id) as string
    },
    account() {
      return store.getters['auth/account'] as { id: string, name: string, authId: string }
    }
  },
  actions: {
    hasRole(role: string) {
      return this.user?.roles && this.user.roles[role]
    },
    clearBarcode() {
      this.scannedBarcode = undefined;
    },
    resetUUID() {
      this.uuid = v4()
    },
    async initUser() {
      this.user = await User.findByID('me')
    }
  },
});
