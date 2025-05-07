import dayjs, { Dayjs } from 'dayjs'
import { computed, ref, onUnmounted } from 'vue'
import { useRouteParams } from '@/lib/updateRouteParams'

const today = ref<Dayjs>(dayjs().endOf('day'))

export function useDateRange(defaults?: { dateB: string | Date, dateE: string | Date }) {
  const { updateRouteParams, route } = useRouteParams()
  updateToday()
  const dateRange = computed({
    get() {
      const { dateB, dateE } = route.query
      return resetDates(dateB as string, dateE as string)
    },
    set(val) {
      const [dateB, dateE] = val || resetDates()
      const query = {
        dateB: val ? dayjs(dateB).toJSON() : undefined,
        dateE: val ? dayjs(dateE).toJSON() : undefined,
      }
      updateRouteParams({}, query)
        .then()
    },
  })

  function resetDates(dateB?: string, dateE?: string) {
    const monthAgo = today.value.add(-12, 'month')
    return [
      dayjs(dateB || defaults?.dateB || monthAgo).startOf('day').toDate(),
      dayjs(dateE || defaults?.dateE || today.value).endOf('day').toDate(),
    ]
  }

  const interval = setInterval(updateToday, 1000 * 60)

  onUnmounted(() => {
    clearInterval(interval)
  })

  return { dateRange }
}

function updateToday() {
  today.value = dayjs().endOf('day')
}

export function todayStringDate() {
  return dayjs().toJSON()
}

export function dateFormat(date?: string | Date) {
  return dayjs(date).format('YYYY-MM-DD')
}
