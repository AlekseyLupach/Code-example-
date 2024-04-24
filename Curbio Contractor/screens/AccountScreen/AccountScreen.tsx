import 'react-native-get-random-values';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ScreenView from '../../components/Common/ScreenView/ScreenView';
import ProfilePhotoPicker from '../../components/Media/ProfilePhotoPicker/ProfilePhotoPicker';
import { Text } from '@rneui/themed';
import { styles } from './styles';
import CrewDropdown, {
  SubcontractorEmployee
} from '../../components/Common/CrewDropdown/CrewDropdown';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Names from '../../constants/screens';
import useProfilePhotoPicker, {
  Photo
} from '../../hooks/useProfilePhotoPicker';
import useAzureUpload from '../../hooks/useAzureUpload';
import DisappearingNotification from '../../components/Alerts/DisappearingNotification/DisappearingNotification';
import { useQuery, useMutation } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import useStatus from '../../hooks/useStatus';
import { BLOB_SERVICE_URL, SAS_TOKEN } from '@env';
import { postThumbnailBlobName } from '../../services/ProfileService';
import { queryClient } from '../../services/queryClient';
import { getSubcontractorCrew } from '../../services/CrewService';
import { SubcontractorEmployeeTypes } from '../../constants/enums';
import useMe from '../../services/queries/useMe';
import { QueryKeys } from '../../services/queries/queryKeys';

const AccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const { photo, onPickHandler } = useProfilePhotoPicker();
  const azureUpload = useAzureUpload();
  const profileThumbnailMutation = useMutation(postThumbnailBlobName);
  const status = useStatus();
  const isFocused = useIsFocused();
  const me = useMe();
  const crewQuery = useQuery({
    queryKey: [QueryKeys.Crew],
    queryFn: () => getSubcontractorCrew(me.data?.subcontractorId),
    enabled: false // disabled initially, because were using refetch in isfocused-based useEffect, this prevents duplicate request
  });
  const isEmployee =
    me.data?.subcontractorEmployeeTypeId === SubcontractorEmployeeTypes.Worker;

  useEffect(() => {
    if (photo) {
      submitProfilePhoto(photo);
    }
  }, [photo]);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        crewQuery.refetch();
        me.refetch();
      }, 1000);
    }
  }, [isFocused]);

  const submitProfilePhoto = async (_photo: Photo) => {
    try {
      status.setError(false);
      status.setMessage(null);

      const userId = me.data?.id;
      const blobName = uuid() + '.jpg';
      const requestUrl = `${BLOB_SERVICE_URL}/userthumbnail/${blobName}${SAS_TOKEN}`;

      console.log('submitProfilePhoto - requestURL:', requestUrl);

      await azureUpload.uploadOne(_photo, requestUrl);

      profileThumbnailMutation.mutate(
        { blobName, userId },
        {
          onSuccess: (data) => {
            queryClient.setQueryData(['user'], data);
          }
        }
      );
    } catch (e) {
      status.setError(true);
      status.setMessage(JSON.stringify(e));
    }
  };

  const onCrewMemberTap = (item: SubcontractorEmployee) => {
    if (item.userId === me.data.id) {
      navigation.navigate(Names.TEAM_MEMBER_EDIT_SCREEN, {
        member: item.name === me.data.name ? me.data : item
      });
    } else {
      navigation.navigate(Names.TEAM_MEMBER_DETAILS_SCREEN, {
        member: item.name === me.data.name ? me.data : item,
        allowEdit: !isEmployee || item.userId === me.data.id
      });
    }
  };

  const onAddCrew = () => {
    navigation.navigate(Names.TEAM_MEMBER_ADD_SCREEN, {
      subcontractorId: me.data?.subcontractorId
    });
  };

  return (
    <ScreenView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <ProfilePhotoPicker
          onPick={onPickHandler}
          photoPath={me.data?.img ? me.data?.img : photo?.path}
        />
        <Text h1 style={styles.name}>
          {me.data?.name}
        </Text>
        <Text style={styles.company}>
          {isEmployee ? me.data?.subcontractorName : me.data?.orgName}
        </Text>
        <CrewDropdown
          label="My Crew"
          onSelect={onCrewMemberTap}
          onAddCrew={onAddCrew}
          data={crewQuery.data?.sort(
            (a, b) =>
              b.subcontractorEmployeeTypeId - a.subcontractorEmployeeTypeId
          )}
          me={me.data}
          hasPrincipalPermission={me.data?.isSubcontractorPrincipal}
        />
      </ScrollView>

      <DisappearingNotification
        seconds={7}
        isError={azureUpload.error || status.error}
        message={status.message || azureUpload.message}
        visible={azureUpload.success || azureUpload.error || status.error}
      />
    </ScreenView>
  );
};

export default AccountScreen;
