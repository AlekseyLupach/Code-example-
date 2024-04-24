import {useQuery} from '@tanstack/react-query';
import {QueryKeys} from 'src/constants/enums';
import {getEstimatesList} from '../EstimateListService';

const useGetEstimatesList = (
  pageNumber: number,
  pageSize?: number,
  createdDateTo?: string | undefined,
  createdDateFrom?: string | undefined,
  addressFilter?: string | undefined,
  selectedStatuses?: any[] | undefined,
  renovationEstimateStatuses?: any[] | undefined,
) => {
  const {isPending, isSuccess, data, refetch} = useQuery({
    queryKey: [
      QueryKeys.estimateList,
      pageNumber,
      addressFilter,
      selectedStatuses,
    ],
    queryFn: async ({signal}) =>
      getEstimatesList({
        addressFilter: addressFilter,
        createdDateFrom: createdDateFrom,
        createdDateTo: createdDateTo,
        pageNumber: pageNumber,
        pageSize: pageSize,
        renovationEstimateStatuses: renovationEstimateStatuses,
      }),
  });
  return {data, isPending, isSuccess, refetch};
};

export default useGetEstimatesList;
