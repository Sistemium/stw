import { computed, Ref } from 'vue'
import orderBy from 'lodash/orderBy'
import trim from 'lodash/trim'
import User, { IUser } from '@/models/User'
import { likeLt } from '@/services/lt'
import { useRoute } from 'vue-router'

interface UsingUsers {
  search: Ref<string>
}

export function useUsers({ search }: UsingUsers) {
  const route = useRoute()
  return {
    currentUserId: computed(() => route.params.userId as string),
    users: computed<IUser[]>(() => {
      const users = orderBy(User.hydratedFilter(), 'name')
      const searchString = trim(search.value)
      if (!searchString) {
        return users
      }
      const re = likeLt(searchString)
      return users.filter(user => {
        return re.test(user.name)
          || user.email && re.test(user.email)
          || user.phone && re.test(user.phone)
      })
    }),
  }
}
