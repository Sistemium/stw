import { computed, type Ref } from 'vue'
import ServiceTask from '@/models/ServiceTask'
import day from 'dayjs'
import { likeLt } from '@/services/lt'

interface TaskingFilter {
  dateRange: Ref<Date[]>
  siteId: Ref<string>
  search: Ref<string>
}

export function useTasking({ dateRange, siteId, search }: TaskingFilter) {
  return {
    serviceTasks: computed(() => {
      const { value } = dateRange
      const date = {
        $gte: day(value[0]).startOf('day').toJSON(),
        $lte: day(value[1]).endOf('day').toJSON(),
      }
      const tasks = ServiceTask.reactiveFilter({
        siteId: siteId.value,
        // @ts-ignore
        date,
      })

      if (!search.value || !tasks.length) {
        return tasks
      }
      const re = likeLt(search.value)
      return tasks.filter(task => re.test(task.description))
    }),
  }
}
