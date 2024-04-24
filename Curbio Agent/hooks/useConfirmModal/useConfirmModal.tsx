import React, { useState } from "react";
import { Modal, View } from "react-native";
import { ButtonComponent } from "src/components/Button/Button";
import CloseButton from "src/components/CloseButton/CloseButton";
import { BackgroundView, CloseButtonView, InnerView, SubTitle, Title } from "./styled";

type useConfirmModalProps = {
    icon: JSX.Element,
    title: string,
    subTitle: string,
    action: (setLoading: (isLoading: boolean) => void) => void,
    cancelAction?: () => void | undefined,
    onPressCloseLog?: any,
    onPressNoLog?: any,
}

export const useConfirmModal = () => {
    const [confirmModalData, setConfirmModalData] = useState<useConfirmModalProps>();
    const [visible, setVisible] = useState(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const openConfirmModal = (obj: useConfirmModalProps) => {
        setConfirmModalData(obj);
        setVisible(true);
    }

    const closeConfirmModal = () => {
        confirmModalData?.onPressCloseLog;
        setVisible(false);
    }

    const handleOnPressNo = () => {
        confirmModalData?.onPressNoLog;
        closeConfirmModal();
    }

    const confirmModalComponent = (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={closeConfirmModal}>
            <BackgroundView activeOpacity={1} onPress={closeConfirmModal}>
                <InnerView>
                    <CloseButtonView>
                        <CloseButton onPress={closeConfirmModal} />
                    </CloseButtonView>
                    <View style={{ marginBottom: 20 }}>
                        {confirmModalData?.icon}
                    </View>
                    {confirmModalData?.title ? <Title>{confirmModalData?.title}</Title> : null}
                    {confirmModalData?.subTitle ? <SubTitle>{confirmModalData?.subTitle}</SubTitle> : null}
                    <ButtonComponent loading={isLoading} title={"Yes"} onPress={() => confirmModalData?.action(setLoading)} />
                    <ButtonComponent buttonStyle={{ marginTop: 20 }} transparent={true} title={"No"} onPress={confirmModalData?.cancelAction ? confirmModalData?.cancelAction : handleOnPressNo} />
                </InnerView>
            </BackgroundView>
        </Modal>
    )

    return { openConfirmModal, confirmModalComponent, closeConfirmModal };
};




