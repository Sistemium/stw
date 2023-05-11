import { saveWithLoading } from '@/lib/validations';
import ArticleModel from '@/models/Article';
import Picture from '@/models/Picture';

export async function setAvatar(article, picture) {
  await saveWithLoading(() => ArticleModel.updateOne({
    id: article.id,
    avatarPictureId: picture ? picture.id : null,
  }));
}

export async function removeArticlePicture(article, picture) {
  await saveWithLoading(async () => {
    await Picture.destroy(picture.id);
    if (article.avatarPictureId === picture.id) {
      await setAvatar(article, null);
    }
  });
}
