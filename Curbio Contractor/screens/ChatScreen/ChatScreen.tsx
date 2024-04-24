import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import ScreenView from '../../components/Common/ScreenView/ScreenView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { Text } from '@rneui/themed';
import ChatHeader from '../../components/Navigation/ChatHeader/ChatHeader';
import * as Names from '../../constants/screens';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import InfoIcon from '../../assets/Navigation/Info-Circle.svg';
import moment from 'moment';
import AttachmentIcon from '../../assets/Inputs/Attachment-Paperclip.svg';
import SendIcon from '../../assets/Inputs/Send-Arrow.svg';
import { isIosPlatform } from '../../constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPosts, postMessage } from '../../services/InboxService';
import {
  ActivityPost,
  PostMessageRequest
} from '../../services/InboxService/types';
import useMe from '../../services/queries/useMe';
import DisappearingNotification from '../../components/Alerts/DisappearingNotification/DisappearingNotification';
import AddAttachmentModal from '../../components/Modals/AddAttachmentModal/AddAttachmentModal';
import { AttachmentModalData } from '../../components/Modals/AddAttachmentModal/types';
import { Photo } from '../../hooks/useProfilePhotoPicker';
import { DocumentPickerResponse } from 'react-native-document-picker';
import ChatMediaModal from '../../components/Modals/ChatMediaModal/ChatMediaModal';
import useAzureUpload from '../../hooks/useAzureUpload';
import BlockingModal from '../../components/Modals/BlockingModal';
import { v4 as uuid } from 'uuid';
import { BLOB_SERVICE_URL, SAS_TOKEN } from '@env';
import ChatAttachmentList from '../../components/Lists/ChatAttachmentList/ChatAttachmentList';
import { regexToFilterLinks } from '../../utils/common';
import ChatPost from '../../components/Lists/ChatPost/ChatPost';
import ChatPostSeparators from '../../components/Lists/ChatPostSeparators/ChatPostSeparators';
import ReactNativeBlobUtil from 'react-native-blob-util';
import useRealtimeDB from '../../services/FirebaseService/useRealtimeDB';
import useMarkRead from '../../services/mutations/useMarkRead';
import { QueryKeys } from '../../services/queries/queryKeys';
import { hasDynamicIsland, hasNotch } from 'react-native-device-info';

// These values / calculations help avoid issues with keyboard-avoiding-view and eliminate the need for an extra library
const screenHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar?.currentHeight;
const headerHeight = hasNotch() || hasDynamicIsland() ? 120 : 70;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const listRef = useRef(null);
  const azureUpload = useAzureUpload();
  const [attachmentModal, setAttachmentModal] = useState<boolean>(false);
  const [attachmentData, setAttachmentData] =
    useState<AttachmentModalData | null>(null);
  const [chatPhotoModal, setChatPhotoModal] = useState(false);
  const [chatPhotoModalData, setChatPhotoModalData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [message, setMessage] = useState('');
  const me = useMe();
  const unreadCountRef = useRef(0);
  const markReadMutation = useMarkRead();
  const postMessageMutation = useMutation(postMessage);
  const [inputHeight, setInputHeight] = useState(0);
  const [chatHeight, setChatHeight] = useState(0);
  const posts = useQuery({
    queryKey: [QueryKeys.Posts, params?.projectJobId],
    queryFn: () => getPosts(params?.projectJobId)
  });
  const snapshot = useRealtimeDB({
    ref: `ProjectJob/Post/${params?.projectJobId}`,
    onChildAdded: () => {
      posts.refetch();
      markReadMutation.mutate(params?.projectJobId);
    },
    onChildChanged: () => {
      posts.refetch();
      markReadMutation.mutate(params?.projectJobId);
    }
  });

  useEffect(() => {
    setTimeout(() => markReadMutation.mutate(params?.projectJobId), 3000);
  }, []);

  useEffect(() => {
    toggleChatHeight();
  }, [attachmentData]);

  useEffect(() => {
    posts?.data?.data &&
      listRef.current?.scrollToIndex({ index: 0, animated: true });
  }, [posts?.data?.data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <ChatHeader
          title={`${params.projectJobName}`}
          subtitle={getParticipantCount}
          HeaderRight={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Names.CHAT_DETAILS_SCREEN, {
                  projectJobName: params?.projectJobName,
                  projectAddress: params?.projectAddress,
                  projectJobId: params?.projectJobId,
                  links: getArrayWithLinks()
                })
              }>
              <InfoIcon height={25} width={25} style={{ marginTop: 10 }} />
            </TouchableOpacity>
          }
        />
      )
    });
  }, [navigation, posts?.data?.data]);

  const filterLinksFromMessages = (item: ActivityPost) => {
    return regexToFilterLinks.test(item?.body);
  };

  const getArrayWithLinks = (): Array<string> => {
    const postsWithLinks = posts?.data?.data?.filter(filterLinksFromMessages);

    const linksArray = postsWithLinks?.map((obj: ActivityPost) => {
      const urlMatches = obj.body.match(regexToFilterLinks);
      return urlMatches ? urlMatches[0] : '';
    });

    return linksArray;
  };

  const toggleChatHeight = useCallback(() => {
    if (!attachmentData || Object.values(attachmentData).flat().length === 0) {
      setInputHeight(100);
      setChatHeight(screenHeight - (statusBarHeight + headerHeight + 100));
    } else {
      setInputHeight(150);
      setChatHeight(screenHeight - (statusBarHeight + headerHeight + 150));
    }
  }, [attachmentData]);

  const sendMessage = async () => {
    try {
      if (
        (message.trim() === '' && attachmentData === null) ||
        postMessageMutation.isLoading
      )
        return;

      setLoadingModal(true);

      let requestBlobs: string[] = [];

      if (attachmentData) {
        const attachmentsWithUrls =
          attachmentData &&
          Object.values(attachmentData)
            .flat()
            .map((item, i) => {
              const extension = item.hasOwnProperty('path')
                ? item.path.split('.').pop()
                : item.type.split('/').pop();
              const blobName = uuid() + '.' + extension;
              requestBlobs.push(blobName);
              const requestUrl = `${BLOB_SERVICE_URL}/activity/${blobName}${SAS_TOKEN}`;

              console.log('request URL #', i, requestUrl);
              return { item, requestUrl };
            });

        attachmentData && (await azureUpload.uploadMany(attachmentsWithUrls));
      }

      const newPost: PostMessageRequest = {
        projectJobId: params?.projectJobId,
        activityText: message,
        attachmentBlobs: requestBlobs
      };

      postMessageMutation.mutate(newPost, {
        onSuccess: () => {
          posts.refetch();
          setMessage('');
          setAttachmentData(null);
          setLoadingModal(false);
        },
        onError: () => {
          setLoadingModal(false);
        }
      });
    } catch (e) {
      setLoadingModal(false);
    }
  };

  const onSelectAttachment = (data: AttachmentModalData) => {
    setAttachmentData(data);
  };

  const onRemoveAttachment = (item: Photo | DocumentPickerResponse) => {
    if (item.hasOwnProperty('uri')) {
      setAttachmentData((prev) => ({
        photos: prev?.photos,
        documents: prev?.documents.filter((d) => d.uri !== item.uri)
      }));
    } else {
      setAttachmentData((prev) => ({
        photos: prev?.photos.filter((d) => d.path !== item.path),
        documents: prev?.documents
      }));
    }
  };

  const getParticipantCount = useMemo(() => {
    const participants = posts?.data?.data?.map((p) => p.author.id);
    const uniqueParticipants = [...new Set(participants)];
    return `${uniqueParticipants.length} members`;
  }, [posts?.data?.data]);

  const hasAttachments = (): boolean => {
    return attachmentData && Object.values(attachmentData).flat().length > 0;
  };

  const onFilePress = (file) => {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: file.extension
    })
      .fetch('GET', file.url)
      .then((res) => {
        isIosPlatform
          ? ReactNativeBlobUtil.ios.openDocument(res.data)
          : ReactNativeBlobUtil.android
              .actionViewIntent(res.path(), 'application/pdf')
              .catch((e) => alert('Android could\'nt render the pdf' + e));
      })
      .catch((e) => alert('Download Failed 2:' + e));
  };

  const _renderChatSeparators = (item: ActivityPost, index: number) => (
    <ChatPostSeparators
      previousCreatedDate={posts?.data?.data[index - 1]?.createdDate}
      unreadCount={item.body}
      incrementUnreadCount={() =>
        (unreadCountRef.current = unreadCountRef.current + 1)
      }
      willRenderDateSeparator={
        index < posts?.data?.data.length - 1 &&
        index > 0 &&
        moment(item.createdDate).format('d') !==
          moment(posts?.data?.data[index - 1]?.createdDate).format('d')
      }
      willRenderUnreadSeparator={
        moment(item.createdDate).isAfter(moment(params?.lastReadDate)) &&
        item.author.id !== me.data?.id
      }
    />
  );

  return (
    <ScreenView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIosPlatform ? 'position' : undefined}
        keyboardVerticalOffset={130}>
        <FlatList
          inverted
          ref={listRef}
          contentContainerStyle={styles.listContent}
          style={[styles.chatWrapper, { height: chatHeight }]}
          data={posts?.data?.data ?? []}
          renderItem={({ item, index }) => {
            return (
              <ChatPost
                post={item}
                index={index}
                isAuthor={item.author.id === me.data?.id}
                onMediaPress={() => {
                  setChatPhotoModal(true);
                  setChatPhotoModalData(item.files);
                }}
                onFilePress={(file) => onFilePress(file)}
                renderSeparator={() => _renderChatSeparators(item, index)}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.listEmptyWrapper}>
              <Text>No messages yet</Text>
            </View>
          }
        />

        <View style={[styles.inputWrapper, { height: inputHeight }]}>
          <TouchableOpacity
            onPress={() => setAttachmentModal(true)}
            style={styles.attachmentOpenBtn}>
            <AttachmentIcon height={25} width={25} />
          </TouchableOpacity>

          <View
            style={[
              styles.attachmentWrapper,
              {
                minHeight: hasAttachments() ? 110 : 50,
                maxHeight: hasAttachments() ? 130 : 70
              }
            ]}>
            <TextInput
              multiline
              style={styles.input}
              placeholder="Send a message..."
              value={message}
              onChangeText={setMessage}
            />

            {hasAttachments() && (
              <ChatAttachmentList
                attachments={Object.values(attachmentData).flat()}
                onRemove={onRemoveAttachment}
              />
            )}
          </View>

          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <SendIcon height={25} width={25} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <AddAttachmentModal
        visible={attachmentModal != false}
        onSelect={onSelectAttachment}
        onClose={() => setAttachmentModal(false)}
      />

      <ChatMediaModal
        visible={chatPhotoModal !== false}
        photos={chatPhotoModalData}
        onClose={() => setChatPhotoModal(false)}
      />

      <BlockingModal visible={loadingModal} message={azureUpload.message} />
    </ScreenView>
  );
};

export default ChatScreen;
