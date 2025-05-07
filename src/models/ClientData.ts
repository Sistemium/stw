import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IClientData extends ApiModel {
  appVersion: string
  buildType: string
  bundleIdentifier: string
  bundleVersion: string
  deviceName: string
  devicePlatform: string
  deviceToken: string
  systemVersion?: string
  tokenHash?: string
  authId: string
  deviceInfo: Record<string, any>
  locale: string
}

export default new Model<IClientData>({
  collection: 'ClientData',
  schema: {},
  methods: {},
});
