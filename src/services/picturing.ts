import find from 'lodash/find';
import ReactiveModel from 'sistemium-data-vue';
import type { PictureInfo } from '@/models/Pictures';
import type ApiModel from '@/models/ApiModels';

export async function createPicture(
  model: ReactiveModel,
  picturesInfo: PictureInfo[],
  pictureProperties: object
): Promise<ApiModel> {
  const { src: href } = find(picturesInfo, { name: 'original' });
  const { src: thumbnailHref } = find(picturesInfo, { name: 'thumbnail' });

  return model.create({
    href,
    thumbnailHref,
    picturesInfo,
    ...pictureProperties,
  });
}
