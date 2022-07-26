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
      return Article;
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

  methods: {
    async setAvatar(picture) {
      await this.$saveWithLoading(() => Article.createOne({
        ...this.article,
        avatarPictureId: picture.id,
      }));
    },
  },

};
