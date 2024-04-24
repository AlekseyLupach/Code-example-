import type {
  NavigatorScreenParams,
  CompositeScreenProps
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SubcontractorEmployee } from '../components/Common/CrewDropdown/CrewDropdown';
import {
  Media,
  ProjectTask,
  ProjectTeam,
  ActivityEventResponse
} from '../services/ProjectJobsService/types';
import * as Names from '../constants/screens';

export type MainNavigatorParams = {
  [Names.TEAM_MEMBER_ADD_SCREEN]: {
    subcontractorId: number;
  };
  Authenticated: undefined;
  'Bid Entry': { projectJobId: number };
  [Names.CHECK_IN_CREW_SCREEN]: {
    totalNumberOfPeople: string;
    projectId: number;
  };
  [Names.CHECK_IN_PEOPLE_SCREEN]: {
    jobs: { id: number; name: string }[];
    projectId: number;
  };
  [Names.CHECK_IN_OUT_PHOTO_SCREEN]: {
    projectId: number;
    projectJobId: number;
    checkedProposalTasks: ProjectTask[];
    checkOutEvents: ActivityEventResponse[];
  };
  [Names.CREW_APPROVAL_SCREEN]: {
    subcontractorId: number;
  };
  [Names.COMPANY_SEARCH_SCREEN]: undefined;
  [Names.TEAM_MEMBER_EDIT_SCREEN]: { member: any };
  [Names.GET_STARTED_SCREEN]: undefined;
  [Names.HOME_SCREEN]: NavigatorScreenParams<TabNavigatorParams>;
  [Names.HOME_NAVIGATOR]: undefined;
  [Names.LANDING_SCREEN]: undefined;
  Login: undefined;
  [Names.MSA_SCREEN]: undefined;
  [Names.BIDS_SCREEN]: undefined;
  [Names.PRIVACY_POLICY_SCREEN]: undefined;
  [Names.PROJECTS_LISTS_SCREEN]: undefined;
  [Names.REGISTER_CODE_SCREEN]: {
    phoneNumber: string;
  };
  [Names.REGISTER_NUMBER_SCREEN]: undefined;
  [Names.REGISTER_NAME_SCREEN]: undefined;
  [Names.REGISTER_PHOTO_SCREEN]: undefined;
  [Names.REGISTER_CREW_LEAD_SCREEN]: undefined;
  [Names.REGISTER_COMPANY_SCREEN]: {
    companies: [];
    phoneNumber: string;
    hasMultiplePrincipalSubcontractors: boolean;
  };
  [Names.ACCOUNT_SETTINGS_SCREEN]: undefined;
  [Names.TEAM_MEMBER_DETAILS_SCREEN]: {
    member?: SubcontractorEmployee | null;
    allowEdit: boolean | undefined;
  };
  [Names.TERMS_CONDITIONS_SCREEN]: undefined;
  [Names.WEBVIEW_SCREEN]: {
    url: string;
  };
  [Names.PAYMENTS_SCREEN]: {
    projectJobId: number;
  };
  [Names.SCOPE_OF_WORK_SCREEN]: {
    projectJobId: number;
    isCheckoutFlow: boolean;
  };
  [Names.BID_DETAILS_SCREEN]: {
    projectJobId: number;
  };
  [Names.BID_LANDING_SCREEN]: undefined;
  [Names.JOB_DETAILS_SCREEN]: {
    projectJobId: number;
  };
  [Names.CHAT_SCREEN]: {
    projectJobId: number;
    projectJobName: string;
    projectAddress: string;
    lastReadDate: string;
  };
  [Names.CHAT_DETAILS_SCREEN]: undefined;
  [Names.LINKS_SCREEN]: undefined;
  [Names.SCHEDULE_SCREEN]: {
    projectJobId: number;
  };
  [Names.PHOTOS_SCREEN]: {
    projectJobId: number;
  };
  [Names.PHOTOS_PREVIEW_SCREEN]: {
    photos: Array<Media>;
    index: number;
  };
  [Names.DOCUMENTS_SCREEN]: {
    projectJobId: number;
  };
  [Names.PROJECT_TEAM_SCREEN]: {
    projectTeam: Array<ProjectTeam>;
  };
};

export type TabNavigatorParams = {
  [Names.PROJECTS_LISTS_SCREEN]: undefined;
  [Names.INBOX_SCREEN]: undefined;
  [Names.ACCOUNT_SCREEN]: undefined;
};

export type RootStackScreenProps<T extends keyof MainNavigatorParams> =
  NativeStackScreenProps<MainNavigatorParams, T>;

export type HomeTabScreenProps<T extends keyof TabNavigatorParams> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParams, T>,
    RootStackScreenProps<keyof MainNavigatorParams>
  >;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainNavigatorParams { }
  }
}
