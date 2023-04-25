import type ApiModel from '@/models/ApiModels';

export default interface Article extends ApiModel {
  name: string;
  code?: string;
}
