import React, { useState, useEffect } from "react";
import { TabBarView, TabBarViewContainer } from "./styled";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomMenuItem } from "../BottomMenuItem/BottomMenuItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TouchableOpacity, Dimensions, Animated, ViewStyle } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "src/constants/enums";
import useGetAuth from "src/services/queries/useGetAuth";

export const BOTTOM_TAB_BAR_HEIGHT = 60;


export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { userGuid } = useGetAuth();
    const [translateValue] = useState(new Animated.Value(0));
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;
    const { bottom } = useSafeAreaInsets()

    const { data: projectsListData } = useQuery<any[]>({
        queryKey: [QueryKeys.projectsList],
        enabled: false
    });

    const isUserHaveProject = projectsListData && projectsListData?.length > 0

    const animateSlider = (index: number) => {
        Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animateSlider(state.index);
    }, [state.index]);

    const lineView = {
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderColor: "#1D1D1D24",
    } as ViewStyle

    const circleView = {
        zIndex: 1,
        position: "absolute",
        top: -15,
        left: isUserHaveProject && userGuid ? 15 : 21,
        borderWidth: 1,
        borderColor: "#1D1D1D24",
        width: 80,
        height: 80,
        borderBottomWidth: 0,
        borderRadius: 1000,
        backgroundColor: "white",
    } as ViewStyle

    return (
        <TabBarView style={{ paddingBottom: bottom }}>
            <TabBarViewContainer
                style={{
                    shadowOffset: {
                        width: 0,
                        height: -1,
                    },
                    width: totalWidth,
                }}>
                <Animated.View style={lineView} />
                <Animated.View style={[circleView, { transform: [{ translateX: translateValue }], width: tabWidth / 1.6 }]} />
                <View style={{ flexDirection: "row", zIndex: 3 }}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }

                            animateSlider(index);
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: "tabLongPress",
                                target: route.key,
                            });
                        };

                        return (
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ flex: 1 }}
                                key={index}
                            >
                                <BottomMenuItem iconName={label.toString()} isCurrent={isFocused} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </TabBarViewContainer>
        </TabBarView>
    );
};