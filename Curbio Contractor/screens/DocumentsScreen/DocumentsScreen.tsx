import React, { useCallback } from 'react';
import { View } from 'react-native';
import ScreenView from '../../components/Common/ScreenView/ScreenView';
import DocumentsList from '../../components/Lists/DocumentsList/DocumentsList';
import { typography } from '../../config/theme';
import { Image, Text } from '@rneui/themed';
import { useRoute } from '@react-navigation/native';
import { ProjectJobDocument } from '../../services/ProjectJobsService/types';
import BlockingModal from '../../components/Modals/BlockingModal';
import { isIosPlatform } from '../../constants';
import DocumentIcon from '../../assets/Attachments/Document.svg';
import PdfIcon from '../../assets/Attachments/PdfLogo.svg';
import ExcelIcon from '../../assets/Attachments/ExcelLogo.svg';
import PowerpointIcon from '../../assets/Attachments/PowerPointLogo.svg';
import WordDocIcon from '../../assets/Attachments/WordLogo.svg';
import ReactNativeBlobUtil from 'react-native-blob-util';

const DocumentsScreen: React.FC = () => {
  const { params } = useRoute();
  const documentsList = params?.files

  const getAttachmentIcon = useCallback((ext) => {
    const defaultSize = 70;
    switch (ext.toLowerCase()) {
      case 'pdf':
        return <PdfIcon height={defaultSize} width={defaultSize} />;

      case 'doc':
      case 'docx':
      case 'txt':
        return <WordDocIcon height={defaultSize} width={defaultSize} />;

      case 'xls':
      case 'xlsx':
        return <ExcelIcon height={defaultSize} width={defaultSize} />;

      case 'ppt':
      case 'pptx':
        return <PowerpointIcon height={defaultSize} width={defaultSize} />;

      default:
        return <DocumentIcon height={defaultSize} width={defaultSize} />;
    }
  }, []);
  
  const renderItem = (item: ProjectJobDocument, index: number) => {
    const getImage = () => {
      const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
      if (documentExts.includes(item.extension.toLowerCase())) {
        return getAttachmentIcon(item.extension);
      }
      return (
        <Image
          source={{ uri: item?.url }}
          resizeMode="contain"
          style={{
            height: 70,
            width: 70,
            borderRadius: 10
          }}
        />
      )
    }

    return (
      <>
        {getImage()}
        <View
          style={{
            justifyContent: 'center',
            height: 70,
            marginStart: 10,
            width: '80%'
          }}>
          <Text
            style={[typography.b1, { marginBottom: 5, width: '90%' }]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item?.name}
          </Text>
          <Text style={[typography.h4]}>{`${getDocumentType(
            item?.url
          )} file`}</Text>
        </View>
      </>
    )
  }

  const onPressDocument = async (item: ProjectJobDocument) => {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: item.extension
    })
      .fetch('GET', item.url)
      .then((res) => {
        isIosPlatform
          ? ReactNativeBlobUtil.ios.openDocument(res.data)
          : ReactNativeBlobUtil.android
              .actionViewIntent(res.path(), 'application/pdf')
              .catch((e) => alert('Android couldn\'t open the pdf: ' + e));
      })
      .catch((e) => alert('Download Failed 2:' + e));
  };

  const getDocumentType = (url: string): string => {
    if (url) return url.split(/[#?]/)[0].split('.').pop().trim().toUpperCase();
    else return '';
  };

  return (
    <ScreenView>
      <DocumentsList
        list={documentsList}
        onPress={onPressDocument}
        renderItem={renderItem}
      />
    </ScreenView>
  );
};

export default DocumentsScreen;
