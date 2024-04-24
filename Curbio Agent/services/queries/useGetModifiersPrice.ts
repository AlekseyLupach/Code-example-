import {useQuery} from '@tanstack/react-query';
import {GeneralEstimatePriceModifiersDto} from 'src/api/generated';
import {QueryKeys} from 'src/constants/enums';
import {getModifiersPrice} from '../EstimateService';

const useGetModifiersPrice = () => {
  const {data} = useQuery<GeneralEstimatePriceModifiersDto>({
    queryKey: [QueryKeys.modifiersPrice],
    queryFn: async ({signal}) => getModifiersPrice(signal),
  });

  return {data};
};

export default useGetModifiersPrice;
