import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/constants/enums';

const useNotDeliveredProjectPosts = (activeProjectId: number | undefined) => {
  const notDeliveredProjectPosts = useQuery({
    queryKey: [QueryKeys.notDeliveredProjectPosts, activeProjectId],
    enabled: false,
    initialData: [],
  });

  return notDeliveredProjectPosts;
};

export default useNotDeliveredProjectPosts;
