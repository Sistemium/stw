import { computed, type Ref } from 'vue'
import day from 'dayjs'
import ServiceTask from '@/models/ServiceTask'
import ServicePointCustomer from '@/models/ServicePointCustomer'
import { likeLt } from '@/services/lt'
import orderBy from 'lodash/orderBy'
import ServiceTaskHistory, { type IServiceTaskHistory } from '@/models/ServiceTaskHistory'
import User from '@/models/User'
import Employee from '@/models/Employee'

interface TaskingFilter {
  dateRange: Ref<Date[]>
  siteId: Ref<string>
  search: Ref<string>
}

export type RichServiceTaskHistory = IServiceTaskHistory & {
  author?: string
  assignee?: string
}


export function useTaskHistory(props: { serviceTaskId: string }) {
  const history = computed<RichServiceTaskHistory[]>(() =>
    orderBy(ServiceTaskHistory.reactiveFilter({ serviceTaskId: props.serviceTaskId })
      .map(item => ({
        ...item,
        author: User.reactiveGet(item.authId)?.name,
        assignee: Employee.reactiveGet(item.assigneeId)?.name,
      })), 'timestamp', 'desc'),
  )
  return {
    history,
  }
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
      return tasks.filter(task => {
        const point = ServicePointCustomer.getByID(task.servicePointId)
        return re.test(task.description)
          || point && (re.test(point?.address) || re.test(point?.name))
      })
    }),
  }
}
