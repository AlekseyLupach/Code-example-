import Slider from "./Slider";
import { Modal } from "react-native";
import React, { useState } from "react";
import { HeaderWrapper } from "src/styled";
import { BgView, HeaderView, } from "./styled";
import Header from "src/components/Header/Header";
import GoBackButton from "src/components/GoBackButton/GoBackButton";

export type ZoomSliderModalImageProps = {
    uri: string,
    headers: {
        Authorization: string
    }
}

export type ZoomSliderData = {
    currentImageEmitter: number,
    images: ZoomSliderModalImageProps[]
}

export type ZoomSliderModalProps = {
    zoomSliderData: ZoomSliderData
}

export const useZoomSliderModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalData, setModalData] = useState<ZoomSliderData | undefined>(undefined);

    const closeModal = () => {
        setVisible(false);
    };

    const openModal = (obj: ZoomSliderData) => {
        setModalData(obj);
        setVisible(true);
    };

    const _renderItem = (
        <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={closeModal}>
            <BgView>
                <HeaderView>
                    <Header headerLeft={
                        <HeaderWrapper>
                            <GoBackButton showShadow={true} onPress={closeModal} />
                        </HeaderWrapper>} />
                </HeaderView>
                <Slider
                    imageData={modalData?.images}
                    currentImageEmitter={modalData?.currentImageEmitter!}
                    onClose={closeModal}
                    setVisible={() => { }}
                    visible={true}
                />
            </BgView >
        </Modal>
    );

    return { closeModal, openModal, _renderItem }
};

export default useZoomSliderModal;