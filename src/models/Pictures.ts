import type ApiModel from '@/models/ApiModels';

export interface PictureInfo {
  name: string;
  src: string;
  height: number;
  width: number;
}

export interface IMSResponse {
  name: string;
  folder: string;
  pictures: PictureInfo[],
}

export interface IPicture extends ApiModel {
  name: string;
  href: string;
  thumbnailHref: string;
  ownerXid: string;
  target: string;
  picturesInfo: PictureInfo[],
}
