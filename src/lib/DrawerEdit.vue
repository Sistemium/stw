<template lang="pug">

component.drawer-edit.box-card(
  :is="drawerComponent"
  shadow="never"
  :title="title"
  :visible="true"
  :append-to-body="true"
  :destroy-on-close="true"
  ref="drawer"
  :size="size"
  @close="handleClose"
  :style="drawerStyle"
)

  .resize.container(:padding="60")
    slot(v-bind:model="model")

  form-buttons(
    :changed="changed"
    :deletable="isDeletable"
    @saveClick="onSaveClick"
    @cancelClick="cancelClick"
    @deleteClick="onDeleteClick"
  )

</template>
<script>

import FormButtons from 'sistemium-vue/components/FormButtons.vue';
import matchesDeep from '@bit/sistemium.vue.matches-deep';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'DrawerEdit',
  components: { FormButtons },
  props: {
    title: String,
    isDrawer: { type: Boolean, default: true },
    size: {
      type: String,
      default: '370px',
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
    drawerStyle: Object,
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
    drawerComponent() {
      return this.isDrawer ? 'el-drawer' : 'el-card';
    },
    loading() {
      return !!this.loadingMessage;
    },
    isDeletable() {
      return this.deletable && !!(this.modelOrigin && this.modelOrigin.id);
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
      this.performOperation(() => this.destroyFn(id)
        .then(() => {
          this.$emit('deleted', id);
        })
        .catch(e => {
          this.$emit('error', e);
        }));
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
          this.performOperation(this.save);
        } else {
          this.$message.warning(this.$t('validation.formInvalid').toString());
        }
      });
    },

    save() {
      return this.saveFn(this.model)
        .then(record => {
          this.$parent.$emit('saved', record);
          return record;
          // if (this.$refs.drawer) {
          //   this.cancelClick(record);
          // }
        })
        .catch(e => {
          this.$message.error(e.message);
          this.$emit('error', e);
        });
    },

    handleClose(record) {
      if (!this.from) {
        this.drawerOpen = false;
        this.$parent.$emit('closed', record);
        return;
      }
      this.$router.replace(this.from)
        .catch(e => this.$error('handleClose', e));
    },

    cancelClick(record) {
      const { drawer } = this.$refs;
      if (!drawer) {
        this.$error('cancelClick', 'drawer ref is empty');
        return;
      }
      this.handleClose(record);
    },

    async performOperation(op) {

      this.showLoading();

      try {
        const res = await op();
        this.hideLoading();
        this.cancelClick(res);
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

.el-card {
  border: none;

  ::v-deep .el-card__body, .container {
    padding: 0;
  }
  @include responsive-only(gt-xxs) {
    .form-buttons {
      justify-content: flex-end;
    }
  }
}

</style>
