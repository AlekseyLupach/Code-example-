import { useEffect, useState } from 'react'
import RNP, { PERMISSIONS, checkMultiple, request, requestMultiple } from 'react-native-permissions'
import { isAndroidPlatform } from '../constants';
import { Alert } from 'react-native';

export type PermissionStatus = 'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked';

export type MediaPermissionsConfig = {
  alertUser?: boolean // On hook mount, deploy system alert if any permissions are denied
}

const useMediaPermissions = (config?: MediaPermissionsConfig) => {
  // Note: these values default to true to not annoy user, and they update asynchronously
  const [cameraAllowed, setCameraAllowed] = useState<boolean>(true)
  const [galleryAllowed, setGalleryAllowed] = useState<boolean>(true)

  useEffect(() => {
    if (config?.alertUser) {
      checkBoth()
    }
  }, [])

  const checkCamera = async () => {
    try {
      let status: PermissionStatus = 'granted' // Assume they have it, let it be set false after checking, so as to not trip any UI alerts unnecessarily

      if (isAndroidPlatform) {
        status = await RNP.check(RNP.PERMISSIONS.ANDROID.CAMERA)
      } else {
        status = await RNP.check(RNP.PERMISSIONS.IOS.CAMERA)
      }

      const allowed = status === 'granted' || status === 'limited'

      setCameraAllowed(allowed)

      if (config?.alertUser && !allowed) return alertPerms('camera')
    } catch (e) {
      return alert("Remember to enable the gallery and camera permission from your device's settings!")
    }
  }

  const checkGallery = async () => {
    try {
      let status: PermissionStatus = 'granted'

      if (isAndroidPlatform) {
        status = await RNP.check(RNP.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      } else {
        status = await RNP.check(RNP.PERMISSIONS.IOS.PHOTO_LIBRARY)
      }

      const allowed = status === 'granted' || status === 'limited'

      setGalleryAllowed(allowed)

      if (config?.alertUser && !allowed) return alertPerms('photos')
    } catch (e) {
      return alert("Remember to enable the gallery and camera permission from your device's settings!")
    }
  }

  // Checks both perms, will alert if they dont exist, asynchronously returns the perm status regardless
  const checkBoth = async () => {
    const cameraPerm = isAndroidPlatform ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
    const photosPerm =  isAndroidPlatform ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY

    const checkResult = await checkMultiple([
      cameraPerm, 
      photosPerm
    ])

    const _cameraAllowed = checkResult[cameraPerm] === 'granted' || checkResult[cameraPerm] === 'limited'
    const _photosAllowed = checkResult[cameraPerm] === 'granted' || checkResult[cameraPerm] === 'limited'

    setGalleryAllowed(_photosAllowed)
    setCameraAllowed(_cameraAllowed)

    if (!_cameraAllowed || !_photosAllowed) {
      const requestResult = await requestMultiple([
        !_cameraAllowed && cameraPerm,
        !_photosAllowed && photosPerm
      ])

      const cameraRequest = requestResult[cameraPerm] === 'granted' || checkResult[cameraPerm] === 'limited'
      const photosRequest = requestResult[cameraPerm] === 'granted' || checkResult[cameraPerm] === 'limited'

      setGalleryAllowed(photosRequest)
      setCameraAllowed(cameraRequest)

      return {
        camera: {allowed: cameraRequest}, 
        gallery: {allowed: photosRequest}
      }
    }

    return {
      camera: {allowed: checkResult[cameraPerm]}, 
      gallery: {allowed: checkResult[photosPerm]}
    }
  }

  const alertPerms = (type: string) => {
    // 'camera' or 'photos'
    let onPress
    switch (type) {
      case "camera":
        onPress = async () => isAndroidPlatform ? await request(PERMISSIONS.ANDROID.CAMERA) : await request(PERMISSIONS.IOS.CAMERA)
        break
        case "photos":
        onPress = async () => isAndroidPlatform ? await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
        break
    }

    return Alert.alert(
      'Permissions Denied', 
      `To be able to use photo-related features, you need to enable ${type} permissions in your OS settings.`, [
      { 
        text: "Enable Now", 
        onPress: onPress
      }, 
      {
        text: "Later",
        onPress: () => {}
      }
    ])
  }

  return {
    checkBoth,
    camera: {
      allowed: cameraAllowed,
      check: checkCamera
    },
    gallery: {
     allowed:  galleryAllowed,
     check: checkGallery
    }
  }
}

export default useMediaPermissions