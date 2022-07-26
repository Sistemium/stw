import Model from '@/init/Model';
import find from 'lodash/find';

export default new Model({
  collection: 'Picture',
  schema: {},
  methods: {},
});

export function mapPictureInfo(name) {
  return picture => ({
    ...find(picture.picturesInfo, { name }),
    id: picture.id,
    name: picture.name,
  });
}
