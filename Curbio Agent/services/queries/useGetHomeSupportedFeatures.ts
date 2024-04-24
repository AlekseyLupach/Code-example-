import {useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';
import {SupportedFeaturesOptions} from 'src/api/generated';
import {QueryKeys} from 'src/constants/enums';
import {StorageKeys} from 'src/constants/storage';
import {storeValue} from 'src/Utils/common';
import {getHomeSupportedFeatures} from '../HomeService';

const useGetHomeSupportedFeatures = () => {
  const {isPending, data} = useQuery<SupportedFeaturesOptions>({
    queryFn: async ({signal}) => getHomeSupportedFeatures(signal),
    queryKey: [QueryKeys.home, 'showOrderPreSaleCheckupBtn'],
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data && data?.orderPresaleCheckup) {
      setAsyncStorageValue(JSON.stringify(data?.orderPresaleCheckup));
    } else {
      setAsyncStorageValue('false');
    }
  }, [data]);

  const setAsyncStorageValue = async (data: string) => {
    storeValue(StorageKeys.showOrderPreSaleCheckupBtn, data);
  };

  return {data, isPending};
};

export default useGetHomeSupportedFeatures;
