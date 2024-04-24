import {
  ChangeMobileUserRoleCommand,
  ConfirmAccountDeletionCommand,
  DeleteUserResponseDto,
  ForgotPasswordCommand,
  LeadSourceAnswerDto,
  LinkInspectorCompanyDto,
  RequestNewVerificationCodeCommand,
  ResetPasswordCommand,
  UpdateUserCommand,
  UserProfileDto,
  ValidateVerificationCodeCommand
} from 'src/api/generated';
import { callAPI } from '../BaseAPIService';
import { kandaEndpoints } from '../Endpoints';

export const getAccountProfile = async (
  signal?: AbortSignal | undefined
): Promise<UserProfileDto> => {
  return callAPI({
    url: kandaEndpoints.getAccountProfile,
    method: 'get',
    signal: signal
  }) as Promise<UserProfileDto>;
};

export const updateAccountProfile = async (data: UpdateUserCommand) => {
  return callAPI({
    url: kandaEndpoints.updateAccountProfile,
    method: 'put',
    data: data
  });
};

export const updateAccountProfileRole = async (
  data: ChangeMobileUserRoleCommand
) => {
  return callAPI({
    url: kandaEndpoints.updateAccountProfileRole,
    method: 'post',
    data: data
  });
};

export const getVerifySMSCode = async (
  data: RequestNewVerificationCodeCommand,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getVerifySMSCode,
    method: 'post',
    data: data,
    signal
  });
};

export const getAccountDeletionSMSCode = async (
  data: {},
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getAccountDeletionSMSCode,
    method: 'post',
    data: data,
    signal
  });
};

export const updateLeadSource = async (
  data: LeadSourceAnswerDto,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.updateLeadSource,
    method: 'post',
    data: data,
    signal
  });
};

export const updateInspectorCompany = async (
  data: LinkInspectorCompanyDto,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.updateInspectorCompany,
    method: 'post',
    data: data,
    signal
  });
};

export const removeInspectorCompany = async (
  data: {},
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.removeInspectorCompany,
    method: 'post',
    data: data,
    signal
  });
};

export const deleteAccount = async (
  data?: {},
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.deleteAccount,
    method: 'post',
    data: data,
    signal
  });
};

export const getDeleteAccountVerifySMSCode = async (
  data: ConfirmAccountDeletionCommand,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.getDeleteAccountVerifySMSCode,
    method: 'post',
    data: data,
    signal
  }) as DeleteUserResponseDto;
};

export const setBiometricPublicKey = async (
  data: string,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.setBiometricPublicKey,
    method: 'post',
    data: data,
    signal
  });
};

export const removeBiometricPublicKey = async (
  data: ConfirmAccountDeletionCommand,
  signal?: AbortSignal | undefined
) => {
  return callAPI({
    url: kandaEndpoints.removeBiometricPublicKey,
    method: 'post',
    data: data,
    signal
  });
};

export const accountForgotPassword = async (data: ForgotPasswordCommand) => {
  return callAPI({
    url: kandaEndpoints.accountForgotPassword,
    method: 'post',
    data: data,
    hideToast: true
  });
};

export const accountForgotPasswordVerifySMSCode = async (
  data: ValidateVerificationCodeCommand
) => {
  return callAPI({
    url: kandaEndpoints.accountForgotPasswordVerifySMSCode,
    method: 'post',
    data: data,
    hideToast: true
  });
};

export const accountUpdatePassword = async (data: ResetPasswordCommand) => {
  return callAPI({
    url: kandaEndpoints.accountUpdatePassword,
    method: 'post',
    data: data,
    hideToast: true
  });
};

export const removePartner = async (data: {}) => {
  return callAPI({
    url: kandaEndpoints.removePartner,
    method: 'post',
    data: data
  });
};
