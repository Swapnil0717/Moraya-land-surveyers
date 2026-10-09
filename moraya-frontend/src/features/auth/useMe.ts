import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/lib/api'
import { useAuth } from './AuthProvider'

export const meKey = (userId: string | undefined) => ['me', userId] as const

export function useMe() {
  const { session } = useAuth()
  const userId = session?.user.id
  return useQuery({
    queryKey: meKey(userId),
    queryFn: () => fetchMe(),
    enabled: !!userId,
    retry: false,
    staleTime: 5 * 60_000,
  })
}
