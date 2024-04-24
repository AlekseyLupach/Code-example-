import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { ButtonComponent } from 'src/components/Button/Button';
import { activeOpacity, blue, whiteColor } from 'src/constants';
import { AbsoluteLoader } from 'src/screens/EmailSingInScreen/EmailSingInScreen';
import { ModalView, ShareOptionButton, ShareOptionButtonText, ShareOptionTitle, ShareOptionTitleView } from './styled';

type useConfirmModalProps = {
  title: string,
  renderItems: {
    action: (setLoading: (isLoading: boolean) => void) => Promise<void>;
    actionName: string;
    testID: string;
    actionTextColor?: string,
  }[]
}

export const useActionModal = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<useConfirmModalProps | undefined>(undefined);

  const openModal = (obj: useConfirmModalProps) => {
    setModalData(obj);
    setVisible(true);
  }

  const closeModal = () => {
    setVisible(false);
    setModalData(undefined);
  }

  const _renderItem = (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={500}
      onBackdropPress={closeModal}
      testID={'modal'}
      isVisible={visible}
      onSwipeComplete={closeModal}
      swipeDirection={['down']}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-end',
        margin: 0,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
      }}>
      <ModalView>
        {isLoading && <AbsoluteLoader color={blue} />}
        {modalData?.title && (
          <ShareOptionTitleView>
            <ShareOptionTitle testID="ShareTitle">
              {modalData.title}
            </ShareOptionTitle>
          </ShareOptionTitleView>
        )}
        {modalData?.renderItems.map((item, index) => (
          <ShareOptionButton
            testID={item.testID}
            key={index}
            activeOpacity={activeOpacity}
            onPress={() => {
              item.action(setLoading);
            }}>
            <ShareOptionButtonText
              style={{
                color: item.actionTextColor ? item.actionTextColor : blue,
              }}>
              {item.actionName}
            </ShareOptionButtonText>
          </ShareOptionButton>
        ))}
      </ModalView>
      <ButtonComponent
        testID="CancelBtn"
        onPress={closeModal}
        titleStyle={{
          color: blue,
        }}
        buttonStyle={{ backgroundColor: whiteColor }}
        containerStyle={{ marginTop: 8, justifyContent: 'flex-end' }}
        title="Cancel"
      />
    </Modal>
  )

  return { openModal, closeModal, _renderItem };
};


