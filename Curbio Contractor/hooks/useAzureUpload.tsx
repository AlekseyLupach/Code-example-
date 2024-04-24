import React, { useState } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Photo } from './useProfilePhotoPicker';
import { DocumentPickerResponse } from 'react-native-document-picker';

const useAzureUpload = () => {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const uploadOne = async (img: Photo, requestUrl: string) => {
    try {
      setUploading(true);
      setSuccess(false);
      setError(false);
      setMessage(null);

      const headers = {
        'Content-Type': 'image/jpeg',
        'x-ms-blob-type': 'BlockBlob'
      };

      return ReactNativeBlobUtil.fetch(
        'PUT',
        requestUrl,
        headers,
        ReactNativeBlobUtil.wrap(img.path)
      )
        .then((res) => {
          setMessage(`Photo uploaded successfully.`);
          setSuccess(true);
          setUploading(false);
        })
        .catch((e) => {
          setMessage(`Photo upload failed: ${JSON.stringify(e)}`);
          setError(true);
          setUploading(false);
        });
    } catch (e) {
      setMessage('Upload Error: ' + JSON.stringify(e));
      setUploading(false);
      setError(true);
    }
  };

  const uploadMany = async (
    items: Array<{ item: Photo | DocumentPickerResponse; requestUrl: string }>
  ) => {
    try {
      setUploading(true);
      setSuccess(false);
      setError(false);
      setMessage(null);

      const headers = {
        'Content-Type': 'application/octet-stream',
        'x-ms-blob-type': 'BlockBlob'
      };

      for (let i = 0; i < items.length; i++) {
        setMessage(`Uploading item ${i + 1}/${items.length}`);

        const requestUrl = items[i].requestUrl;
        const path = items[i].item.hasOwnProperty('path')
          ? items[i].item.path
          : items[i].item.uri;

        try {
          await ReactNativeBlobUtil.fetch(
            'PUT',
            requestUrl,
            headers,
            ReactNativeBlobUtil.wrap(path)
          );
        } catch (e) {
          //  Handle in outer catch block
          throw { ...e, photoIndex: i + 1 };
        }
      }

      setMessage(`Upload success. Finishing up...`);
      setSuccess(true);
      setUploading(false);
    } catch (e) {
      const error = `An error occurred uploading item #${e.photoIndex}.`;

      setMessage(error);
      setUploading(false);
      setError(true);

      throw error;
    }
  };

  return { uploadOne, uploadMany, error, success, uploading, message };
};

export default useAzureUpload;
