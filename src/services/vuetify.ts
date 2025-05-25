import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi-svg'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import i18n from '@/services/i18n'
import { useI18n } from 'vue-i18n'
import {
  mdiAccount,
  mdiArrowUp,
  mdiArrowDown,
  mdiAlert,
  mdiAlertCircle,
  mdiBasket,
  mdiBarcode,
  mdiBell,
  mdiBellOff,
  mdiCalendar,
  mdiClose,
  mdiCloseCircle,
  mdiCog,
  mdiCheck,
  mdiCheckBold,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiCircle,
  mdiEmail,
  mdiFullscreenExit,
  mdiFullscreen,
  mdiAlertBox,
  mdiHelpCircleOutline,
  mdiInformation,
  mdiLogout,
  mdiMapMarkerMultipleOutline,
  mdiMenuDown,
  mdiMenuUp,
  mdiMessage,
  mdiMessageOutline,
  mdiMessageProcessingOutline,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiMinus,
  mdiMenu,
  mdiMinusCircle,
  mdiPlus,
  mdiPlusCircle,
  mdiMagnify,
  mdiPencil,
  mdiPencilCircle,
  mdiPencilCircleOutline,
  mdiPercent,
  mdiPhone,
  mdiProgressAlert,
  mdiProgressClock,
  mdiProgressPencil,
  mdiProgressUpload,
  mdiRefresh,
  mdiRefreshCircle,
  mdiSale,
  mdiSaleOutline,
  mdiSortAscending,
  mdiSortDescending,
  mdiTarget,
  mdiTextBox,
  mdiMinusBox,
  mdiCellphoneKey,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  // @ts-ignore
} from '@mdi/js'
import { VBtn } from 'vuetify/components'

export default createVuetify({
  components,
  directives,
  locale: {
    // @ts-ignore
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      mdiAccount,
      mdiArrowUp,
      mdiArrowDown,
      mdiAlert,
      mdiAlertCircle,
      mdiBarcode,
      mdiBasket,
      mdiBell,
      mdiBellOff,
      mdiCalendar,
      mdiCog,
      mdiCheck,
      mdiCheckBold,
      mdiCheckCircleOutline,
      mdiChevronDown,
      mdiChevronUp,
      mdiChevronLeft,
      mdiChevronRight,
      mdiCircle,
      mdiEmail,
      mdiFullscreenExit,
      mdiFullscreen,
      mdiAlertBox,
      mdiCellphoneKey,
      mdiCheckboxMarked,
      mdiCheckboxBlankOutline,
      mdiClose,
      mdiCloseCircle,
      mdiInformation,
      mdiHelpCircleOutline,
      mdiLogout,
      mdiMapMarkerMultipleOutline,
      mdiMenuDown,
      mdiMenuUp,
      mdiMicrophone,
      mdiMicrophoneOff,
      mdiMinus,
      mdiMenu,
      mdiMessage,
      mdiMessageOutline,
      mdiMessageProcessingOutline,
      mdiMinusCircle,
      mdiPencil,
      mdiPencilCircle,
      mdiPencilCircleOutline,
      mdiPercent,
      mdiPlus,
      mdiMagnify,
      mdiPhone,
      mdiPlusCircle,
      mdiProgressAlert,
      mdiProgressClock,
      mdiProgressPencil,
      mdiProgressUpload,
      mdiRefresh,
      mdiRefreshCircle,
      mdiSale,
      mdiSaleOutline,
      mdiSortAscending,
      mdiSortDescending,
      mdiTarget,
      mdiTextBox,
      checkboxIndeterminate: mdiMinusBox,
      checkboxOn: mdiCheckboxMarked,
      checkboxOff: mdiCheckboxBlankOutline,
      clear: mdiCloseCircle,
      dropdown: mdiMenuDown,
      close: mdiClose,
      next: mdiChevronRight,
      prev: mdiChevronLeft,
      delimiter: mdiCircle,
    },
    sets: {
      mdi,
    },
  },
  aliases: {
    VBtnText: VBtn,
    VBtnAdd: VBtn,
  },
  defaults: {
    VChip: {
      filterIcon: '$mdiCheck',
      closeIcon: '$mdiCloseCircle',
    },
    VBtnAdd: {
      variant: 'tonal',
      prependIcon: '$mdiPlus',
      density: 'comfortable',
      color: 'primary',
    },
    VBtnText: {
      variant: 'text',
    },
    VDataTableVirtual: {
      sortAscIcon: '$mdiSortAscending',
      sortDescIcon: '$mdiSortDescending',
    },
    VDataTable: {
      sortAscIcon: '$mdiSortAscending',
      sortDescIcon: '$mdiSortDescending',
    },
    VTextField: {},
    VAutocomplete: {
      menuIcon: '$mdiMenuDown',
    },
    VDateInput: {
      modeIcon: '$mdiMenuDown',
    },
    VExpansionPanel: {
      collapseIcon: '$mdiMenuUp',
      expandIcon: '$mdiMenuDown',
    },
    VExpansionPanels: {
      collapseIcon: '$mdiChevronUp',
      expandIcon: '$mdiChevronDown',
    },
    VListGroup: {
      collapseIcon: '$mdiChevronUp',
      expandIcon: '$mdiChevronDown',
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          'on-background': '#339af0',
          primary: '#339af0',
          'on-primary': '#88E2F2',
          secondary: '#88E2F2',
          'on-secondary': '#1C1468',
          blue2: '#484382',
          'on-blue2': '#FFFFFF',
          blue3: '#00AEE7',
        },
      },
    },
  },
})

export type VuetifyVariant =
  | 'filled'
  | 'outlined'
  | 'plain'
  | 'underlined'
  | 'solo'
  | 'solo-inverted'
  | 'solo-filled'
  | undefined

export type VuetifyDensity = undefined | 'default' | 'comfortable' | 'compact'

export type VuetifySize = 'default' | 'small'

export type VuetifyButtonVariant = 'plain' | 'tonal' | 'elevated' | 'outlined' | 'text' | 'flat'

export type VuetifyMessageType = 'success' | 'warning' | 'error' | 'info'
