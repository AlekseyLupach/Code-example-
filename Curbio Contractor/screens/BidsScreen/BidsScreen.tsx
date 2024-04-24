import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from '@rneui/themed';
import { FlatList, TouchableOpacity, View } from 'react-native';
import ScreenView from '../../components/Common/ScreenView/ScreenView';
import EmptyBidsList from '../../components/Lists/EmptyBidsList/EmptyBidsList';
import { styles } from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Names from '../../constants/screens';
import BidCard from '../../components/Cards/BidCard/BidCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getOpenJobs, postSkipJob, putDeclineSoleSource } from '../../services/BidService';
import { ProjectJob } from '../../services/ProjectJobsService/types';
import { BidStatus } from '../../services/BidService/types';
import { BidFilters, BidModals } from './types';
import BidFilterModal from '../../components/Modals/BidFilterModal/BidFilterModal';
import BidAvailabilityModal from '../../components/Modals/BidAvailabilityModal/BidAvailabilityModal';
import { StorageKeys } from '../../constants/storage';
import { getValue } from '../../utils/common';
import BidEntryModal from '../../components/Modals/BidEntryModal/BidEntryModal';
import { BidViewType } from '../BidDetailsScreen/types';
import { QueryKeys } from '../../services/queries/queryKeys';
import SkipReasonModal from '../../components/Modals/SkipReasonModal/SkipReasonModal';
import BidsFetching from '../../components/Lists/BidsFetching/BidsFetching';
import DialogModal from '../../components/Modals/Dialog/DialogModal';
import { DialogTypes } from '../../constants/enums';
import keyExtractor from '../../utils/keyExtractor';

const BidsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedJob, setSelectedJob] = useState<ProjectJob | null>(null);
  const [bidEntryModal, setBidEntryModal] = useState<string>(
    BidViewType.Closed
  );
  const [dialogModal, setDialogModal] = useState<number>(BidModals.None);
  const [bidFilter, setBidFilter] = useState<string>(BidFilters.All);
  const skipJobMutation = useMutation(postSkipJob);
  const declineJobMutation = useMutation(putDeclineSoleSource);

  const openJobs = useQuery({
    queryKey: [QueryKeys.OpenJobs],
    queryFn: () => getOpenJobs()
  });

  useEffect(() => {
    const checkAndUpdateLandingScreenStatus = async () => {
      const storedValue = await getValue(StorageKeys.hideBidLandingScreen);

      if (storedValue !== 'true') navigation.navigate(Names.BID_LANDING_SCREEN);
    };

    checkAndUpdateLandingScreenStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      openJobs.refetch();
    }, [])
  );

  const onSkip = (skipReason: string, item: ProjectJob) => {
    skipJobMutation.mutate(
      {
        projectJobId: item.id,
        notes: skipReason
      },
      {
        onSuccess: () => setDialogModal(BidModals.SkipSuccess)
      }
    );
  };

  const onSkipModal = (item: ProjectJob) => {
    setSelectedJob(item);
    setDialogModal(BidModals.SkipReason);
  };

  const onView = (item) => {
    navigation.navigate(Names.BID_DETAILS_SCREEN, { projectJobId: item.id });
  };

  const onUpdateBid = (item: ProjectJob) => {
    setBidEntryModal(BidViewType.FullScreen);
    setSelectedJob(item);
  };

  const onDecline = (job: ProjectJob) => {
    declineJobMutation.mutate(
      {
        code: job?.subcontractorBidCode
      },
      {
        onSuccess: () => openJobs.refetch()
      }
    );
  }

  const onAvailability = (job: ProjectJob) => {
    setDialogModal(BidModals.BidAvailability);
    setSelectedJob(job);
  };

  const getSortedBids = useMemo(() => {
    openJobs?.data?.sort((a, b) => {
      let aDate = new Date(a.createdDate);
      let bDate = new Date(b.createdDate);

      return bDate.getTime() - aDate.getTime();
    });

    const skipped = [];
    return openJobs?.data
      ?.filter((bid) => {
        bid.contractorAppApplicationStatusName === BidStatus.Skipped &&
          skipped.push(bid);
        return bid.contractorAppApplicationStatusName !== BidStatus.Skipped;
      })
      .concat(skipped);
  }, [openJobs?.data]);

  const sortAndFilterBids = useMemo(() => {
    const bids = getSortedBids?.filter(
      (bid) =>
        bid.contractorAppApplicationStatusName === bidFilter ||
        bidFilter === BidFilters.All
    );
    return bids;
  }, [openJobs?.data, bidFilter]);

  if (openJobs.isFetching) return <BidsFetching />;

  return (
    <ScreenView style={styles.container}>
      <View style={styles.filterWrapper}>
        <TouchableOpacity
          onPress={() => setDialogModal(BidModals.BidFilter)}
          style={[
            styles.filterBtn,
            bidFilter !== BidFilters.All && styles.activeFilterBtn
          ]}>
          <Text style={bidFilter !== BidFilters.All && styles.activeFilterText}>
            {bidFilter}
          </Text>
        </TouchableOpacity>

        <Text>{sortAndFilterBids?.length} Jobs</Text>
      </View>

      <FlatList
        data={sortAndFilterBids}
        refreshing={openJobs.isFetching}
        onRefresh={() => openJobs.refetch()}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <BidCard
            job={item}
            index={index}
            onSkip={() => onSkipModal(item)}
            onView={onView}
            onDecline={() => onDecline(item)}
            onUpdateAmount={onUpdateBid}
            onUpdateNotes={onUpdateBid}
            onAvailability={onAvailability}
            showCTAs={true}
            showLabels={true}
          />
        )}
        ListEmptyComponent={EmptyBidsList}
      />

      <BidFilterModal
        visible={dialogModal === BidModals.BidFilter}
        activeFilter={bidFilter}
        onClose={() => setDialogModal(BidModals.None)}
        onSelect={(filterEnum) => setBidFilter(filterEnum)}
      />

      <BidAvailabilityModal
        visible={dialogModal === BidModals.BidAvailability}
        onClose={() => setDialogModal(BidModals.None)}
        openJob={selectedJob}
      />

      <BidEntryModal
        viewType={bidEntryModal}
        job={selectedJob}
        onClose={() => {
          setBidEntryModal(BidViewType.Closed);
          setSelectedJob(null);
          openJobs.refetch();
        }}
        toggleMinify={() => setBidEntryModal(BidViewType.Closed)}
      />

      <SkipReasonModal
        visible={dialogModal === BidModals.SkipReason}
        onClose={() => setDialogModal(BidModals.None)}
        selectedJob={selectedJob}
        onSubmit={onSkip}
      />

      <DialogModal
        type={DialogTypes.Success}
        visible={dialogModal === BidModals.SkipSuccess}
        setVisible={() => setDialogModal(BidModals.None)}
        heading="Skipped"
        body={`You've successfully skipped the "${selectedJob?.name}" job. It will be moved to the end of the Open Jobs list.`}
        primaryButtonTitle="Got It"
        onSubmit={() => {
          setDialogModal(BidModals.None);
          openJobs.refetch();
        }}
      />
    </ScreenView>
  );
};

export default BidsScreen;
