import Model from '@/init/Model';
import find from 'lodash/find';
import type { IPicture } from '@/models/Pictures'

export default new Model<IPicture>({
  collection: 'Picture',
  schema: {},
  methods: {},
});

export function mapPictureInfo(name: string) {
  return (picture: IPicture) => ({
    ...find(picture.picturesInfo, { name }),
    id: picture.id,
    name: picture.name,
  });
}
