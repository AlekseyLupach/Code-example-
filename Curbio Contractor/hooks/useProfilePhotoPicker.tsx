import React, { useCallback, useEffect, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { isAndroidPlatform } from '../constants';
import { ActionSheetIOS, Alert } from 'react-native';
import useMediaPermissions from './useMediaPermissions';
import { PERMISSIONS, openSettings, request } from 'react-native-permissions';

export type Photo = {
  path: string;
  localIdentifier?: string;
  sourceURL?: string;
  filename?: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  data: string;
};

const useProfilePhotoPicker = () => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const perms = useMediaPermissions()

  const onPickHandler = async () => {
    try {
      let image;

      const requestResult = await perms.checkBoth()

      if (!requestResult.camera.allowed || !requestResult.gallery.allowed) return Alert.alert(
        'No Permissions', 
        'Access to your camera and/or photos is blocked. Please enable it in OS settings and try again.', [
          {
            text: "Open Settings",
            onPress: async () => openSettings()
          },
          {
            text: "Later",
            onPress: () => {}
          }
        ]
      )

      const options = ['Open Gallery', 'Take Picture', 'Cancel'];
      const destructiveButtonIndex = null;
      const cancelButtonIndex = 2;

      if (isAndroidPlatform) {
        Alert.alert('Select Photo Option', '', [
          { text: options[2], onPress: () => console.log('cancel Pressed') },
          {
            text: options[1],
            onPress: async () => {
              image = await ImagePicker.openCamera({
                mediaType: 'photo',
                forceJpg: true,
                includeExif: true,
                compressImageQuality: 0.2
              });
              setPhoto(image);
            }
          },
          {
            text: options[0],
            onPress: async () => {
              image = await ImagePicker.openPicker({
                width: 500,
                height: 500,
                mediaType: 'photo',
                forceJpg: true,
                cropping: true,
                cropperCircleOverlay: true,
                includeExif: true,
                compressImageQuality: 0.2
              });
              setPhoto(image);
            }
          }
        ]);
      } else {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            destructiveButtonIndex
          },
          async (selectedIndex: number) => {
            switch (selectedIndex) {
              case 0:
                image = await ImagePicker.openPicker({
                  width: 500,
                  height: 500,
                  mediaType: 'photo',
                  forceJpg: true,
                  cropping: true,
                  cropperCircleOverlay: true,
                  includeExif: true,
                  compressImageQuality: 0.2
                });
                setPhoto(image);
                break;
              case 1:
                image = await ImagePicker.openCamera({
                  mediaType: 'photo',
                  forceJpg: true,
                  includeExif: true,
                  compressImageQuality: 0.2
                });
                setPhoto(image);
                break;
              case cancelButtonIndex:
                break;
            }
          }
        );
      }
    } catch (e) {
      console.log('PHOTO PICKER ERROR:', e);
    }
  }

  return { photo, onPickHandler };
};

export default useProfilePhotoPicker;
