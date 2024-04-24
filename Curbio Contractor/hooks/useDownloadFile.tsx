import React, { useState } from 'react';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig
} from 'react-native-blob-util';
import { isAndroidPlatform, isIosPlatform } from '../constants';
import { Platform } from 'react-native';

const useDownloadFile = () => {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const downloadFile = async (fileUrl: string, fileExtension: string) => {
    try {
      setDownloading(true);
      setSuccess(false);
      setError(false);
      setMessage(null);

      const index = fileUrl.lastIndexOf('/');
      const fileName = fileUrl.substring(index + 1);

      const { dirs } = ReactNativeBlobUtil.fs;
      const dirToSave = isIosPlatform ? dirs.DocumentDir : dirs.DCIMDir;
      const blobUtilConfig: ReactNativeBlobUtilConfig = {
        fileCache: true,
        path: `${dirToSave}/${fileName}`
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: blobUtilConfig.fileCache,
          path: blobUtilConfig.path,
          appendExt: fileExtension
        },
        android: {
          ...blobUtilConfig,
          ...{
            appendExt: fileExtension,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              mediaScannable: true
            }
          }
        }
      });

      return (
        ReactNativeBlobUtil.config(configOptions!)
          .fetch('GET', fileUrl)
          // listen to download progress event, every 10%
          .progress({ count: 10 }, (received, total) => {
            setMessage(`Downloading ${(received / total) * 100} %`);
          })
          .then((res) => {
            if (isIosPlatform) {
              ReactNativeBlobUtil.fs.writeFile(
                blobUtilConfig.path!,
                res.data,
                'base64'
              );
              ReactNativeBlobUtil.ios.openDocument(blobUtilConfig.path!);
            } else {
              const { android } = ReactNativeBlobUtil;
              ReactNativeBlobUtil.fs.scanFile([{ path: res.path() }]);
              android.actionViewIntent(blobUtilConfig.path!, fileExtension);
            }
          })
          .then(() => {
            setMessage(`Download successful.`);
            setSuccess(true);
            setDownloading(false);
          })
          .catch((e) => {
            setMessage(`Download failed: ${JSON.stringify(e)}`);
            setError(true);
            setDownloading(false);
          })
      );
    } catch (e) {
      setMessage('Download Error: ' + JSON.stringify(e));
      setDownloading(false);
      setError(true);
    }
  };

  return { downloadFile, error, success, downloading, message };
};

export default useDownloadFile;
