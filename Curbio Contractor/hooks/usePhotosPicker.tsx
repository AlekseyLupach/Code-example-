import React, { useCallback, useEffect, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { isAndroidPlatform } from '../constants';
import { ActionSheetIOS, Alert } from 'react-native';
import useMediaPermissions from './useMediaPermissions';
import { openSettings } from 'react-native-permissions';

export interface Photo {
  path: string;
  localIdentifier?: string;
  sourceURL?: string;
  filename?: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  data: string;
}

export type PickModalConfig = {
  callback: (photos: Photo[]) => void;
};

// This Hook differs from 'useProfilePhotoPicker' by allowing multiple photo selections without cropping

const usePhotosPicker = () => {
  const [pickedPhotos, setPickedPhotos] = useState<Photo[]>([]);
  const perms = useMediaPermissions()

  const showPickModal = useCallback(async (config: PickModalConfig) => {
    try {
      let images;

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
              images = await ImagePicker.openCamera({
                mediaType: 'photo',
                forceJpg: true,
                includeExif: true,
                compressImageQuality: 0.2,
                multiple: true
              });
              setPickedPhotos((prev) => [...prev, images]);
              config.callback([images]);
            }
          },
          {
            text: options[0],
            onPress: async () => {
              images = await ImagePicker.openPicker({
                width: 500,
                height: 500,
                mediaType: 'photo',
                forceJpg: true,
                cropping: true,
                cropperCircleOverlay: true,
                includeExif: true,
                compressImageQuality: 0.2,
                multiple: true
              });
              setPickedPhotos((prev) => [...prev, ...images]);
              config.callback(images);
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
                images = await ImagePicker.openPicker({
                  width: 500,
                  height: 500,
                  mediaType: 'photo',
                  forceJpg: true,
                  cropping: true,
                  cropperCircleOverlay: true,
                  includeExif: true,
                  compressImageQuality: 0.2,
                  multiple: true
                });
                setPickedPhotos((prev) => [...prev, ...images]);
                config.callback(images);

                break;
              case 1:
                images = await ImagePicker.openCamera({
                  mediaType: 'photo',
                  forceJpg: true,
                  includeExif: true,
                  compressImageQuality: 0.2
                });
                setPickedPhotos((prev) => [...prev, images]);
                config.callback([images]);

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
  }, [perms.camera, perms.gallery])

  const openPicker = useCallback(async (mediaType: 'any' | 'photo' | 'video' = 'photo') => {
    const requestResult = await perms.checkBoth()

    if (!requestResult.gallery.allowed) return Alert.alert(
      'No Permissions', 
      'Access to your photos is blocked. Please enable it in OS settings and try again.', [
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

    const images = await ImagePicker.openPicker({
      width: 500,
      height: 500,
      mediaType: mediaType,
      forceJpg: true,
      cropping: true,
      cropperCircleOverlay: true,
      includeExif: true,
      compressImageQuality: 0.2,
      multiple: true
    });
    setPickedPhotos((prev) => [...prev, ...images]);
  }, [perms.camera, perms.gallery])

  const openCapture = useCallback(async () => {
    const requestResult = await perms.checkBoth()

    if (!requestResult.camera.allowed) return Alert.alert(
      'No Permissions', 
      'Access to your camera is blocked. Please enable it in OS settings and try again.', [
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

    const image = await ImagePicker.openCamera({
      mediaType: 'photo',
      forceJpg: true,
      includeExif: true,
      compressImageQuality: 0.2,
      multiple: true
    });
    setPickedPhotos((prev) => [...prev, image]);
  }, [perms.camera, perms.gallery])

  const clearPicked = () => setPickedPhotos([]);

  return {
    pickedPhotos,
    showPickModal,
    openPicker,
    openCapture,
    clearPicked
  };
};

export default usePhotosPicker;
