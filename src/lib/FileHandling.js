import VueDropzone from 'vue2-dropzone';
import { createNamespacedHelpers } from 'vuex';
import filter from 'lodash/filter';
import { ACCESS_TOKEN } from 'sistemium-vue/store/auth/getters';
import { addMonths } from 'sistemium-dates';

const { mapState } = createNamespacedHelpers('auth');
const { VUE_APP_LS_PREFIX } = process.env;

export default {

  props: {
    allowMultiple: {
      type: Boolean,
      default: true,
    },
    maxFileSize: {
      type: Number,
      default: 1024 * 1024 * 20,
    },
    entityName: String,
    orgFolder: String,
  },

  components: { VueDropzone },

  data() {
    return {
      countdown: 0,
      acceptedFiles: 'image/png,image/jpeg',
    };
  },

  computed: {
    ...mapState({
      token: ACCESS_TOKEN,
      org(auth) {
        const { orgFolder } = this;
        if (orgFolder) {
          return orgFolder;
        }
        return auth && auth.account && (auth.account.org || VUE_APP_LS_PREFIX);
      },
    }),
    // isNative,
    uploadHeaders() {
      return { authorization: this.token };
    },
    dzOptions() {
      return {
        url: this.imsUrl(),
        maxFiles: this.allowMultiple ? null : 1,
        thumbnailWidth: 150,
        acceptedFiles: this.acceptedFiles,
        headers: this.uploadHeaders,
        createImageThumbnails: false,
      };
    },
    isUploading() {
      return !!this.countdown;
    },
    dropZone() {
      return this.$refs.dz;
    },
  },

  methods: {

    unprocessedCount() {
      const { dropZone: dz } = this;
      return dz && (dz.getUploadingFiles().length + dz.getQueuedFiles().length);
    },

    onDropzoneSuccess(file, response) {
      this.imageUploaded(response, file.name);
      this.dropZone.removeFile(file);
    },

    imsUrl() {
      const url = [
        `/ims/${this.org}?folder=${this.entityName}/${addMonths(new Date(), 0)}`,
        this.trim && 'trim=true',
      ];
      return filter(url)
        .join('&');
    },

    // nativeTriggerClick() {
    //   takePhoto(this.entityName, {})
    //     .then(this.done);
    // },

    uploadProgress(totalUploadProgress, totalBytes, totalBytesSent) {
      this.countdown = this.unprocessedCount();
      this.$debug(totalUploadProgress, totalBytes, totalBytesSent);
    },

    imageUploaded(res, fileName) {
      // this.$debug('imageUploaded', fileName, res);
      const { pictures: picturesInfo } = res;
      if (!picturesInfo) {
        this.$emit('error', res);
        return;
      }
      this.$emit('done', picturesInfo, fileName);
    },

    onError(files, message) {
      this.dropZone.removeAllFiles();
      this.$emit('error', message);
    },

  },
};
