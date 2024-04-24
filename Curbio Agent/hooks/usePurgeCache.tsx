import {useQueryClient} from '@tanstack/react-query';

const usePurgeCache = () => {
  const queryClient = useQueryClient();

  const purge = async (queryKey: string) => {
    await queryClient.resetQueries({queryKey: [queryKey]});
  };

  return purge;
};

export default usePurgeCache;
