import { Formik } from 'formik';
import React, { useRef } from "react";
import Input from "src/components/Input/Input";
import { QueryKeys } from 'src/constants/enums';
import { useMutation } from '@tanstack/react-query';
import logger from 'src/logging/applicationInsights';
import { toastService } from 'src/Utils/toastService';
import useGetAuth from 'src/services/queries/useGetAuth';
import { queryClient } from 'src/services/queryClient';
import { validationProfile } from 'src/Utils/validate';
import { refreshToken } from 'src/services/AuthService';
import { ButtonComponent } from "src/components/Button/Button";
import { UserProfileDto, UserRoleEnum } from 'src/api/generated';
import useAccountProfile from 'src/services/queries/useAccountProfile';
import { btnAboveKeyboardMargin, headerHeight } from 'src/constants';
import { formatPhoneNumber, getFirstAndLastNameField } from 'src/Utils/utils';
import { roleTypes } from 'src/screens/SignUpEnterRoleScreen/SignUpEnterRoleScreen';
import { Keyboard, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import ProfilePhotoPicker from 'src/components/ProfilePhotoPicker/ProfilePhotoPicker';
import RNPickerSelectComponent from 'src/components/RNPickerSelectComponent/RNPickerSelectComponent';

type Props = {
    handleRemovePartner: () => void;
    handleRemoveInspectorCompany: () => void;
    profileData: UserProfileDto | undefined,
}

interface IUpdateUser {
    email: string,
    phoneNumber: string,
    role: string,
    fullName: string,
}

const ProfileForm: React.FC<Props> = ({ profileData, handleRemovePartner, handleRemoveInspectorCompany }) => {
    const auth = useGetAuth();
    const inputFullName = useRef<TextInput | null>(null);
    const inputPhoneNumber = useRef<TextInput | null>(null);

    const { updateProfile, updateProfileRole } = useAccountProfile();
    const updateProfileMutation = updateProfile();
    const updateProfileRoleMutation = updateProfileRole();
    const refreshTokenMutation = useMutation({ mutationFn: refreshToken })

    const handleSubmit = async (values: IUpdateUser) => {
        logger.trackEvent({ name: `my profile - update start` });
        Keyboard.dismiss();
        const fullName = getFirstAndLastNameField(values.fullName);
        if (profileData?.firstName !== fullName.firstName || profileData?.lastName !== fullName.lastName || profileData?.phoneNumber !== values.phoneNumber) {
            await updateProfileMutation.mutateAsync(
                {
                    firstName: fullName.firstName,
                    lastName: fullName.lastName,
                    phoneNumber: values.phoneNumber,
                },
                {
                    onError: () => {
                        logger.trackEvent({ name: `profile update error` });
                        return;
                    },
                    onSuccess: () => {
                        logger.trackEvent({ name: `profile update` });
                    }
                }
            );
        }
        if (values.role !== profileData?.userRoles![0]) {
            await updateProfileRoleMutation.mutateAsync(
                {
                    role: values.role as UserRoleEnum
                },
                {
                    onSuccess: async () => {
                        const prevProfileData = queryClient.getQueryData([QueryKeys.profile]) as UserProfileDto | undefined;
                        queryClient.setQueryData([QueryKeys.profile], {
                            ...prevProfileData,
                            userRoles: [values.role]
                        });
                    },
                    onError: () => {
                        logger.trackEvent({ name: `profile role update error` });
                        return;
                    }
                }
            )
            await refreshTokenMutation.mutateAsync({ accessToken: auth.accessToken!, refreshToken: auth.refreshToken! }, {
                onSuccess: async (resp) => {
                    queryClient.setQueryData([QueryKeys.auth], {
                        ...auth,
                        accessToken: resp.accessToken,
                        refreshToken: resp.refreshToken,
                    });
                },
                onError: async () => {
                    return;
                }
            })
        }
        toastService.toastSuccess("Profile updated.");
        logger.trackEvent({ name: "[ProfileScreen] => Save Successfully", properties: { ...values } });
    }

    const keyTypeHeight = 50;
    const keyboardVerticalOffset = headerHeight + btnAboveKeyboardMargin + keyTypeHeight;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} keyboardVerticalOffset={keyboardVerticalOffset}>
            <Formik
                initialValues={{
                    fullName: [profileData?.firstName, profileData?.lastName].join(" ") || '',
                    email: profileData?.email || "",
                    phoneNumber: formatPhoneNumber(profileData?.phoneNumber) || "",
                    firstName: profileData?.firstName || "",
                    lastName: profileData?.lastName || "",
                    role: profileData?.userRoles![0] || "",
                    partnerName: auth.partnerName || "",
                    companyName: profileData?.inspectorCompanyName || "",
                }}
                onSubmit={values => handleSubmit(values)}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={validationProfile}
            >
                {({ dirty, errors, touched, setFieldTouched, handleChange, handleSubmit, values, setFieldValue }) => (
                    <>
                        <ScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                            <ProfilePhotoPicker profileData={profileData} />
                            <Input
                                autoCorrect={false}
                                setFieldValue={setFieldValue}
                                readOnly={true}
                                editable={false}
                                placeholder={values.email}
                                label={"Email"}
                                type={"email"}
                                handleChange={handleChange}
                                setFieldTouched={setFieldTouched}
                                errors={errors.email}
                                value={values.email}
                                touched={touched.email}
                                containerStyle={{ marginTop: 24 }}
                            />
                            <Input
                                spellCheck={false}
                                autoCorrect={false}
                                setFieldValue={setFieldValue}
                                autoCapitalize={"sentences"}
                                onSubmitEditing={() => inputFullName?.current?.focus()}
                                placeholder={"Full Name"}
                                label={"Full Name"}
                                type={"fullName"}
                                secureTextEntry={false}
                                handleChange={handleChange}
                                setFieldTouched={setFieldTouched}
                                errors={errors.fullName}
                                value={values.fullName}
                                touched={touched.fullName}
                                keyboardType={"default"}
                            />
                            <RNPickerSelectComponent
                                label='Role'
                                isHidePlaceholder={true}
                                type={"role"}
                                value={values.role}
                                touched={touched.role}
                                errors={errors.role}
                                handleChange={handleChange}
                                setFieldTouched={setFieldTouched}
                                items={roleTypes}
                            />
                            <Input
                                spellCheck={false}
                                autoCorrect={false}
                                setFieldValue={setFieldValue}
                                maxLength={14}
                                innerRef={inputPhoneNumber}
                                isPhoneInput={true}
                                placeholder={"Phone Number"}
                                label={"Phone Number"}
                                autoComplete="tel"
                                type={"phoneNumber"}
                                secureTextEntry={false}
                                handleChange={handleChange}
                                setFieldTouched={setFieldTouched}
                                errors={errors.phoneNumber}
                                value={values.phoneNumber}
                                touched={touched.phoneNumber}
                                keyboardType={"numeric"}
                            />
                            {profileData?.inspectorCompanyName ?
                                <>
                                    <Input
                                        isFlex={1}
                                        isDeleteField={true}
                                        setFieldValue={setFieldValue}
                                        onPressDeleteButton={handleRemoveInspectorCompany}
                                        readOnly={true}
                                        editable={false}
                                        placeholder={values.companyName}
                                        label={"Company Name"}
                                        type={"companyName"}
                                        handleChange={handleChange}
                                        setFieldTouched={setFieldTouched}
                                        errors={errors.companyName}
                                        value={values.companyName}
                                        touched={touched.companyName}
                                    />
                                </>
                                : <></>}
                            {auth.partnerName &&
                                <Input
                                    setFieldValue={setFieldValue}
                                    isFlex={1}
                                    isDeleteField={true}
                                    onPressDeleteButton={handleRemovePartner}
                                    readOnly={true}
                                    editable={false}
                                    placeholder={values.partnerName}
                                    label={"Partner Name"}
                                    type={"partnerName"}
                                    handleChange={handleChange}
                                    setFieldTouched={setFieldTouched}
                                    errors={errors.partnerName}
                                    value={values.partnerName}
                                    touched={touched.partnerName}
                                />}
                        </ScrollView>
                        <ButtonComponent
                            disabled={!dirty}
                            loading={updateProfileMutation.isPending || updateProfileRoleMutation.isPending}
                            title="Save"
                            onPress={handleSubmit}
                        />
                    </>
                )}
            </Formik >
        </KeyboardAvoidingView>
    )
}

export default ProfileForm;

