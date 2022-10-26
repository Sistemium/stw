import Article from '@/models/Article';
import PictureGallery from '@/lib/PictureGallery.vue';
import Picture from '@/models/Picture';

export default {

  name: 'ArticlePictureGallery',
  mixins: [PictureGallery],

  props: {
    articleId: String,
  },

  computed: {
    model() {
      return Picture;
    },
    avatarId() {
      return this.article.avatarPictureId;
    },
    article() {
      return Article.reactiveGet(this.articleId) || {};
    },
    activeId: {
      get() {
        return this.$route.query.activeId;
      },
      set(activeId) {
        this.updateRouteParams({}, { activeId })
          .catch(e => this.$error(e));
      },
    },
    images() {
      return Picture.reactiveFilter({ ownerXid: this.articleId });
    },
  },

  created() {
    this.$on('uploaded', async picture => {
      if (this.images.length === 1) {
        await this.setAvatar(picture);
      }
    });
  },

  methods: {
    async setAvatar(picture) {
      await this.$saveWithLoading(() => Article.createOne({
        ...this.article,
        avatarPictureId: picture ? picture.id : null,
      }));
    },
    async removeArticlePicture(picture) {
      await this.$saveWithLoading(async () => {
        await Picture.destroy(picture.id);
        if (this.avatarId === picture.id) {
          await this.setAvatar(null);
        }
      });
    },
  },

};
