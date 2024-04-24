import {NavigationContainerRef} from '@react-navigation/native';
import {NavigationParamsList} from './types';

export let navigationRef: NavigationContainerRef<NavigationParamsList> = null!;

export let setNavigationRef = (
  value: NavigationContainerRef<NavigationParamsList>,
) => {
  navigationRef = value;
};

export function navigateIfPossible<
  RouteName extends keyof NavigationParamsList,
>(
  ...args: undefined extends NavigationParamsList[RouteName]
    ? [screen: RouteName]
    : [screen: RouteName, params: NavigationParamsList[RouteName]]
) {
  if (navigationRef?.isReady()) {
    let routeName = args[0];
    let params = args[1]!;
    navigationRef?.navigate<RouteName>(routeName, params);
  } else {
  }
}

export function resetIfPossible<RouteName extends keyof NavigationParamsList>(
  ...args: undefined extends NavigationParamsList[RouteName]
    ? [screen: RouteName]
    : [screen: RouteName, params: NavigationParamsList[RouteName]]
) {
  if (navigationRef?.isReady()) {
    let routeName = args[0];
    navigationRef?.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  }
}

export function resetIfPossibleArray(args: {name: string; params: object}[]) {
  if (navigationRef?.isReady()) {
    navigationRef?.reset({
      index: 0,
      routes: args,
    });
  }
}
