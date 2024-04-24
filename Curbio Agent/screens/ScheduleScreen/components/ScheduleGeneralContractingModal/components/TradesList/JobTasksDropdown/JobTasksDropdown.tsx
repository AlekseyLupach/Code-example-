import React from 'react';
import { useState } from 'react';
import { activeOpacity } from 'src/constants';
import { ShowMoreBtn, ShowMoreText } from './styled';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { JobItemName, JobItemView } from '../styled';

import ChevronUpIcon from '@assets/ScheduleScreen/ChevronUpIcon.svg';
import ChevronDownIcon from '@assets/ScheduleScreen/ChevronDownIcon.svg';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  tradesList: {
    code: string,
    cost: number,
    eventTemplates: null,
    extendedName: string,
    id: number,
    isActive: boolean,
    isLabor: boolean,
    isNew: boolean,
    itemId: null,
    laborCost: number,
    marketIds: [],
    materialsCost: null,
    name: string,
    notes: null,
    phaseId: number,
    phaseName: null,
    shortName: null,
    singleUnitOfMeasureName: string,
    skuMarketXrefs: [],
    totalCost: number,
    tradeId: number,
    tradeName: string,
    unitOfMeasure: number,
    unitOfMeasureId: number,
    unitOfMeasureName: string
  }[]
}

const JobTasksDropdown: React.FC<Props> = ({ tradesList }) => {
  const hideThreshold = 5;
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const ShowHideButton = () => (
    <ShowMoreBtn onPress={toggleExpand} activeOpacity={activeOpacity}>
      <ShowMoreText>
        {expanded ? 'Hide' : 'Show More'}
      </ShowMoreText>
      {!expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </ShowMoreBtn>
  );

  const _renderTasks = () => {
    const _tasks =
      tradesList?.length > hideThreshold && !expanded
        ? tradesList?.slice(0, hideThreshold)
        : tradesList;

    return _tasks.map((projectTasks, i) => {
      return (
        <JobItemView key={i}>
          <JobItemName>{projectTasks.name}</JobItemName>
          {/* <JobItemDate>{moment(projectTasks.projectTaskSchedules[0]?.startDate).format("MMM D")} - {moment(projectTasks.projectTaskSchedules[0]?.endDate).format("MMM D")}</JobItemDate> */}
        </JobItemView>
      );
    });
  };

  return (
    <>
      {_renderTasks()}
      {tradesList.length > hideThreshold && <ShowHideButton />}
    </>
  );
};

export default JobTasksDropdown;
