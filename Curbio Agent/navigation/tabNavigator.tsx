import { TabBar } from "./components/TabBar/TabBar";
import HomeScreen from "src/screens/HomeScreen/HomeScreen";
import AccountScreen from "src/screens/AccountScreen/AccountScreen";
import ProjectsScreen from "src/screens/ProjectsScreen/ProjectsScreen";
import { ACCOUNT_TAB, HOME_TAB, INBOX_TAB, PROJECTS_TAB, SCHEDULE_TAB } from "src/constants/navTabItems";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScheduleScreen from "src/screens/ScheduleScreen/ScheduleScreen";
import InboxScreen from "src/screens/InboxScreen/InboxScreen";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "src/constants/enums";
import useGetAuth from "src/services/queries/useGetAuth";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { userGuid } = useGetAuth();

    const { data: projectsListData } = useQuery<any[]>({
        queryKey: [QueryKeys.projectsList],
        enabled: false
    });

    const isUserHaveProject = projectsListData && projectsListData?.length > 0

    return (
        <>
            <Tab.Navigator tabBar={(props: BottomTabBarProps) =>
                <TabBar  {...props} />}
                initialRouteName="Feed"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name={HOME_TAB}
                    component={HomeScreen}
                    options={{ unmountOnBlur: true }}
                />
                <Tab.Screen
                    name={PROJECTS_TAB}
                    component={ProjectsScreen}
                    options={{ unmountOnBlur: true }}
                />
                {isUserHaveProject && userGuid && <Tab.Screen
                    name={SCHEDULE_TAB}
                    component={ScheduleScreen}
                    options={{ unmountOnBlur: true }}
                />}
                {isUserHaveProject && userGuid && <Tab.Screen
                    name={INBOX_TAB}
                    component={InboxScreen}
                    options={{ unmountOnBlur: true }}
                />}
                <Tab.Screen
                    name={ACCOUNT_TAB}
                    component={AccountScreen}
                    options={{ unmountOnBlur: true }}
                />
            </Tab.Navigator >
        </>
    );
};

export default TabNavigator;