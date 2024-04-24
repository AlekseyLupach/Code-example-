import {BookInspectionRequestDto} from 'src/api/generated';
import {callAPI} from '../BaseAPIService';
import {kandaEndpoints} from '../Endpoints';

export const bookingOrderInspection = async (
  data: BookInspectionRequestDto,
) => {
  return callAPI({
    url: kandaEndpoints.bookingOrderInspection,
    method: 'post',
    data: data,
  });
};
