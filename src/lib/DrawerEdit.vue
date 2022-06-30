<template lang="pug">

  el-drawer.drawer-edit(
    :title="title"
    :visible="true"
    :append-to-body="true"
    :destroy-on-close="true"
    ref="drawer"
    :size="size"
    @close="handleClose"
  )

    .resize.container(:padding="60")
      slot(v-bind:model="model")

    form-buttons(
      :changed="changed"
      :deletable="deletable"
      @saveClick="onSaveClick"
      @cancelClick="cancelClick"
      @deleteClick="onDeleteClick"
    )

</template>
<script>

import log from 'sistemium-debug';
import FormButtons from '@bit/sistemium.vue.form-buttons/FormButtons.vue';
import matchesDeep from '@bit/sistemium.vue.matches-deep';
import cloneDeep from 'lodash/cloneDeep';

const { error } = log('DrawerEdit');

export default {
  name: 'DrawerEdit',
  components: { FormButtons },
  props: {
    title: String,
    size: {
      type: String,
      default: '350px',
    },
    from: Object,
    forceModified: Boolean,
    deletable: {
      type: Boolean,
      default: false,
    },
    modelOrigin: {
      type: Object,
      default: null,
    },
    saveFn: {
      type: Function,
      async default(props) {
        this.$error('saveFn not implemented', props);
      },
    },
    destroyFn: {
      type: Function,
      async default(id) {
        this.$error('destroyFn not implemented', id);
      },
    },
  },
  data() {
    return {
      loadingMessage: null,
      drawerOpen: false,
      model: null,
    };
  },
  created() {
    this.$nextTick(() => {
      this.drawerOpen = true;
    });
  },
  computed: {
    loading() {
      return !!this.loadingMessage;
    },
    changed() {
      return this.forceModified || !matchesDeep(this.model, this.modelOrigin);
    },
    // hasChanges() {
    //   return !this.modelOrigin
    //     || !this.modelOrigin.id
    //     || !matchesDeep(this.model, this.modelOrigin);
    // },
  },
  methods: {

    getPlainInstanceById(model, id) {
      const action = model.get(id);
      return action && action.toJSON();
    },

    cloneDeep,
    matchesDeep,

    onDeleteClick() {
      const { id } = this.model;
      if (!id) {
        this.$emit('deleted');
        return;
      }
      this.destroyFn(id)
        .then(() => {
          this.$emit('deleted', id);
          this.cancelClick();
        })
        .catch(e => {
          this.$emit('error', e);
        });
    },

    getValidateForm(parent = this.$parent) {
      const { form } = parent.$refs;
      if (!form) {
        return cb => (cb ? cb(true) : true);
      }
      const { validate } = form;
      return validate ? cb => validate.call(form, cb) : this.getValidateForm(form);
    },

    onSaveClick() {
      this.getValidateForm()(valid => {
        if (valid) {
          this.save();
        } else {
          this.$message.warning(String(this.$t('validation.formInvalid')));
        }
      });
    },

    save() {
      this.saveFn(this.model)
        .then(record => {
          this.$emit('saved', record);
          this.cancelClick();
        })
        .catch(e => {
          this.$message.error(e.message);
          this.$emit('error', e);
        });
    },

    handleClose() {
      if (!this.from) {
        this.drawerOpen = false;
        this.$parent.$emit('closed');
        return;
      }
      this.$router.replace(this.from)
        .catch(e => error('handleClose', e));
    },

    cancelClick() {
      const { drawer } = this.$refs;
      if (!drawer) {
        error('cancelClick', 'drawer ref is empty');
        return;
      }
      if (drawer.closeDrawer) {
        drawer.closeDrawer();
      } else {
        this.handleClose();
      }
    },

    async performOperation(op) {

      this.showLoading();

      try {
        await op();
        this.hideLoading();
        this.cancelClick();
      } catch (e) {
        this.hideLoading();
        this.showError(e);
      }

    },

    showError(e) {
      return this.$message.error({
        message: e.message,
        // offset: 20,
        duration: 7500,
        showClose: true,
        dangerouslyUseHTMLString: true,
      });
    },

    showLoading(message) {
      this.loadingMessage = this.$message({
        message: message || `${this.$t('saving')} ...`,
        duration: 0,
      });
    },

    hideLoading() {
      if (!this.loadingMessage) {
        return;
      }
      this.loadingMessage.close();
      this.loadingMessage = null;
    },

  },
  watch: {
    modelOrigin: {
      handler(modelOrigin) {
        this.model = cloneDeep(modelOrigin || {});
      },
      immediate: true,
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.container {
  padding: $margin-right;
}

</style>
