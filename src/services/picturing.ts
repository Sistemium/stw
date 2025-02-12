import find from 'lodash/find';
import ReactiveModel from 'sistemium-data-vue';
import type { PictureInfo } from '@/models/Pictures';
import type ApiModel from '@/models/ApiModels';
import type { BaseItem } from '@/init/Model'

export async function createPicture(
  model: ReactiveModel<BaseItem & ApiModel>,
  picturesInfo: PictureInfo[],
  pictureProperties: object
): Promise<BaseItem & ApiModel> {
  const href = find(picturesInfo, { name: 'original' })?.src;
  const thumbnailHref = find(picturesInfo, { name: 'thumbnail' })?.src;

  return model.create({
    href,
    thumbnailHref,
    picturesInfo,
    ...pictureProperties,
  });
}
