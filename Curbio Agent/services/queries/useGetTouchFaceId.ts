import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';

const useGetTouchFaceId = () => {
  const {data} = useQuery<boolean>({
    queryKey: [QueryKeys.faceTouchId],
    enabled: false,
    initialData: false,
  });

  return data;
};

export default useGetTouchFaceId;
