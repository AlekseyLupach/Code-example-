import React from "react";
import { primaryColor } from "src/constants";
import { Text, View } from "react-native";
import { PNMedium, PNRegular } from "src/constants/fonts";
import { ACCOUNT_TAB, HOME_TAB, INBOX_TAB, PROJECTS_TAB, SCHEDULE_TAB, } from "src/constants/navTabItems";

import AccountIcon from "@assets/TabBar/Account.svg";
import HomeIcon from "@assets/TabBar/Home.svg";

import ProjectsIcon from "@assets/TabBar/Projects.svg";
import ActiveAccountIcon from "@assets/TabBar/ActiveAccount.svg";
import ActiveHomeIcon from "@assets/TabBar/ActiveHome.svg";
import ActiveProjectsIcon from "@assets/TabBar/ActiveProjects.svg";

import ScheduleActiveIcon from "@assets/TabBar/ScheduleActive.svg";
import ScheduleIcon from "@assets/TabBar/Schedule.svg";

import InboxIcon from "@assets/TabBar/Inbox.svg";
import ActiveInboxIcon from "@assets/TabBar/ActiveInbox.svg";
import AnimatableView from "src/components/AnimatableView/Animateble";

type Props = {
    iconName: string;
    isCurrent?: boolean;
};

export const BottomMenuItem = ({ iconName, isCurrent, }: Props) => {

    const renderSvgIcon = () => {
        switch (iconName) {
            case HOME_TAB: {
                return isCurrent ? <ActiveHomeIcon /> : <HomeIcon />
            }
            case PROJECTS_TAB: {
                return isCurrent ? <ActiveProjectsIcon /> : <ProjectsIcon />
            }
            case SCHEDULE_TAB: {
                return isCurrent ? <ScheduleActiveIcon /> : <ScheduleIcon />
            }
            case ACCOUNT_TAB: {
                return isCurrent ? <ActiveAccountIcon /> : <AccountIcon />
            }
            case INBOX_TAB: {
                return isCurrent ? <ActiveInboxIcon /> : <InboxIcon />
            }
        }
    }

    return (
        <AnimatableView animation={"bounceInUp"} duration={1000} style={{ flex: 0 }}>
            <View
                style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {renderSvgIcon()}
                <Text style={{ marginTop: 5, fontFamily: isCurrent ? PNMedium : PNRegular, fontSize: 10, color: isCurrent ? primaryColor : "#1D1D1D80", }}>{iconName}</Text>
            </View>
        </AnimatableView>
    );
};