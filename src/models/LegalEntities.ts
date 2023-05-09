import ApiModel from '@/models/ApiModels';

export interface LegalEntity extends ApiModel {
  name: string;
  address: string;
  code: string;
  vatCode: string;
}
