import { saveWithLoading } from '@/lib/validations';
import ArticleModel from '@/models/Article';
import Picture from '@/models/Picture';
import type { IArticle } from '@/models/Articles'

export async function setAvatar(article: IArticle, picture: null | { id: string }) {
  await saveWithLoading(() => ArticleModel.updateOne({
    id: article.id,
    avatarPictureId: picture ? picture.id : null,
  }));
}

export async function removeArticlePicture(article: IArticle, picture: { id: string }) {
  await saveWithLoading(async () => {
    await Picture.destroy(picture.id);
    if (article.avatarPictureId === picture.id) {
      await setAvatar(article, null);
    }
  });
}
