import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {QueryClient} from '@tanstack/react-query';

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 500,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 0,
      cacheTime: 1000 * 60 * 60 * 24 * 365, // 1 year
      // staleTime: Infinity, // longer staleTimes result in queries not being re-fetched as often
      refetchOnReconnect: 'always',
      retry: 0,
      retryDelay: attempt =>
        Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});
