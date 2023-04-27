import type ApiModel from '@/models/ApiModels';
import { RecipeMaterial } from '@/models/Recipes';
import type ArticleProp from '@/models/ArticleProps';

export interface ArticleProperty extends ArticleProp {
  propId: string;
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  optionId?: string;
}

export interface Article extends ApiModel {
  name: string;
  code?: string;

  isCustomName: boolean;
  barcodes: string[];
  props: ArticleProperty[];

  materials: RecipeMaterial[];
  isSKU: boolean;

  measureId?: string;
  measureUnitId?: string;
  unitPackageTypeId?: string;

  packageTypeId?: string;
  unitsInPackage?: number;

  avatarPictureId: string;

}
