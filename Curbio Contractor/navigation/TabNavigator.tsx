import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { isAndroidPlatform, isIosPlatform } from '../constants';
import ProjectsIcon from '../assets/Navigation/Projects.svg';
import AccountIcon from '../assets/Navigation/Account.svg';
import ProjectsIconFocused from '../assets/Navigation/Projects-Focused.svg';
import AccountIconFocused from '../assets/Navigation/Account-Focused.svg';
import * as Names from '../constants/screens';
import AccountHeaderRight from '../components/Navigation/AccountHeaderRight/AccountHeaderRight';
import { colors, typography } from '../config/theme';
import * as Screens from '../screens';
import ScheduleIcon from '../assets/Navigation/Schedule.svg';
import ScheduleIconFocused from '../assets/Navigation/Schedule-Focused.svg';
import InboxIcon from '../assets/Navigation/Inbox.svg';
import InboxIconFocused from '../assets/Navigation/Inbox-Focused.svg';
import BidsIcon from '../assets/Navigation/OpenJobs.svg';
import BidsIconFocused from '../assets/Navigation/OpenJobs-Focused.svg';
import { SubcontractorEmployeeTypes } from '../constants/enums';
import useSubscribeUnreadChats from '../services/queries/useSubscribeUnreadChats';
import usePrefetchData from '../services/queries/usePrefetchData';
import { hasDynamicIsland, hasNotch } from 'react-native-device-info';
import { useNetInfo } from '@react-native-community/netinfo';

export type TabNavigatorParams = {
  Projects: undefined;
  Inbox: undefined;
  'Check Out': {
    projectId: number;
  };
  Account: undefined;
  Schedule: undefined;
};

type TabNavigatorProps = {
  subcontractorEmployeeTypeId?: number;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const TabNavigator: React.FC<TabNavigatorProps> = ({
  subcontractorEmployeeTypeId
}) => {
  usePrefetchData();
  const { isConnected } = useNetInfo();
  const unreadChats = useSubscribeUnreadChats();
  const offlineHeight = isIosPlatform ? 100 : 90;
  const offlineBottomPadding = isIosPlatform ? 50 : 40;

  const getInboxTabOptions = () => {
    return unreadChats?.data?.length > 0
      ? {
          headerTitleStyle: { ...typography.h2 },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) =>
            focused ? <InboxIconFocused /> : <InboxIcon />,
          tabBarBadge: true,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            minWidth: 15,
            height: 15
          }
        }
      : {
          headerTitleStyle: { ...typography.h2 },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) =>
            focused ? <InboxIconFocused /> : <InboxIcon />
        };
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabled,
        tabBarLabelStyle: { ...typography.fontBold },
        tabBarStyle: {
          height: !isConnected
            ? offlineHeight
            : isAndroidPlatform || !(hasDynamicIsland() || hasNotch())
            ? 65
            : 90,
          paddingBottom: !isConnected
            ? offlineBottomPadding
            : isAndroidPlatform || !(hasDynamicIsland() || hasNotch())
            ? 10
            : 35
        }
      }}>
      <Tab.Screen
        name={Names.PROJECTS_LISTS_SCREEN}
        component={Screens.ProjectsList}
        options={{
          headerShown: false,
          tabBarLabel: 'My Jobs',
          tabBarIcon: ({ focused }) =>
            focused ? <ProjectsIconFocused /> : <ProjectsIcon />
        }}
      />
      {subcontractorEmployeeTypeId === SubcontractorEmployeeTypes.Principal && (
        <Tab.Screen
          name={Names.BIDS_SCREEN}
          component={Screens.Bids}
          options={{
            tabBarLabel: 'Open Jobs',
            headerTitle: 'Open Jobs',
            headerTitleStyle: { ...typography.h2 },
            headerTitleAlign: 'left',
            headerShadowVisible: false,
            tabBarIcon: ({ focused }) =>
              focused ? <BidsIconFocused /> : <BidsIcon />
          }}
        />
      )}
      <Tab.Screen
        name={Names.SCHEDULE_TAB}
        component={Screens.Schedule}
        options={{
          headerTitle: 'Schedule',
          tabBarLabel: 'Schedule',
          headerTitleStyle: {
            ...typography.h2
          },
          headerStyle: {
            height: isAndroidPlatform ? 50 : 95
          },
          headerShown: false,
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) =>
            focused ? <ScheduleIconFocused /> : <ScheduleIcon />
        }}
      />
      <Tab.Screen
        name={Names.INBOX_SCREEN}
        component={Screens.Inbox}
        options={getInboxTabOptions()}
      />
      <Tab.Screen
        name={Names.ACCOUNT_SCREEN}
        component={Screens.Account}
        options={{
          headerTitle: 'My Account',
          headerTitleStyle: { ...typography.h2 },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerRight: (props) => <AccountHeaderRight {...props} />,
          tabBarIcon: ({ focused }) =>
            focused ? <AccountIconFocused /> : <AccountIcon />,
          headerRightContainerStyle: { paddingRight: 20 }
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
