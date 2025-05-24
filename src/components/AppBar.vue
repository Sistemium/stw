<template lang="pug">
v-app-bar(elevation='1')
  v-app-bar-title.flex-0-0
    v-btn.home-btn.ml-sm-2(
      variant='plain'
      to='/'
    )
      img.hidden-lg-and-up(
        src='@/assets/logo.svg'
        width='35'
        height='35'
      )
      .hidden-md-and-down {{ $t('menu.brand') }}
  template(#append)
    //basket-button.mr-1(v-if='user')
    //speech-button.mr-6.mx-sm-2(
    //  v-if="user"
    //  :busy="isBusy"
    //  @spoken="onSpoken"
    //)
    .mx-2
      v-btn(
        v-if='!isLogged'
        to='/signIn'
        color='primary'
        variant='tonal'
      ) {{ $t('account.logIn') }}
      v-btn(
        v-if='user'
        :variant='xs ? "tonal" : "text"'
        :prepend-icon="xs ? '$mdiAccount' : undefined"
        to='/userAccount/contacts'
      )
        .d-flex.flex-column
          .name {{ xs ? initials : user.name }}
  slot
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { computed } from 'vue'
import { IUser } from '@/models/User'

const props = defineProps<{
  isLogged: boolean
  user?: IUser
}>()

const { xs, smAndUp } = useDisplay()

const initials = computed(() => {
  const [, f, l] = props.user?.name.match(/^(.).* (.)/) || []
  return [f, l].filter(x => x).join('')
})

</script>
<style scoped lang="scss">
.home-btn {
  min-width: 0;
  padding: 0;
}
.d-flex.flex-column {
  max-width: 215px;
}
</style>
