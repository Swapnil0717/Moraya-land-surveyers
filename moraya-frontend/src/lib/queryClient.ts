import { QueryClient } from '@tanstack/react-query'

// Conservative defaults: protect the Workers free tier (no refetch storms).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
