import React, { useState, useEffect } from 'react';
import { isAndroidPlatform, isIosPlatform } from '../constants';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { openSetting } from '../utils/common';
import { Identify, identify } from '@amplitude/analytics-react-native';
import { AmplitudeUserProperties } from '../constants/enums';
import { onlineManager } from '@tanstack/react-query';

const useLocation = () => {
  const [position, setPosition] = useState<GeoPosition | null>(null);

  useEffect(() => {
    onlineManager.isOnline() && getPosition();
  }, []);

  const hasPermissionIOS = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'disabled' || status === 'denied') {
      Alert.alert(
        `Turn On Location Services to Allow “Curbio Contractor” to Determine Your Location`,
        '',
        [
          { text: 'Settings', onPress: openSetting },
          { text: 'Cancel', onPress: () => {} }
        ]
      );
    }

    return false;
  };

  const checkPermission = async () => {
    if (isIosPlatform) {
      console.log('[ GeoLocation using iOS ]');
      const hasPermission = await hasPermissionIOS();
      console.log('[ iOS has permission ]');
      return hasPermission;
    }

    if (isAndroidPlatform && Number(Platform.Version) < 23) {
      console.log('[ GeoLocation using Android < version 23 ]');
      return true;
    }

    console.log(`[ GeoLocation using ${Platform.OS} - ${Platform.Version} ]`);

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      console.log('[ Android has permission ]');
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('[ Android Location permission granted ]');
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG
      );
    }

    console.log('[ Geolocation Does Not Have Permission ]');
    return false;
  };

  const getPosition = async () => {
    const allowed = await checkPermission();

    const identifyObj = new Identify();
    identifyObj.set(AmplitudeUserProperties.LocationPermission, allowed);
    identify(identifyObj);

    if (!allowed) {
      console.log('[ Permission Not Allowed ]');
      return;
    }

    console.log('[ Permission Allowed - Getting Current Position ]');

    Geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        console.log(position);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setPosition(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best'
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true
      }
    );
  };

  return {
    lat: position?.coords.latitude,
    lng: position?.coords.longitude,

    getPosition
  };
};

export default useLocation;
