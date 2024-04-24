import moment from "moment";
import Video from "react-native-video";
import { getExtension } from "src/Utils/utils";
import { screenHeight, screenWidth } from "src/constants";
import React, { useCallback, useRef, useState } from "react";
import { ZoomSliderModalImageProps } from "./useZoomSliderModal";
import { ZoomableViewEvent } from "@openspacelabs/react-native-zoomable-view";
import { FlatList, NativeSyntheticEvent, NativeScrollEvent, } from "react-native";
import { SkeletonFastImage } from "src/components/SkeletonFastImage/SkeletonFastImage";
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { BottomDesc, BottomView, FooterView, InnerView, MainView, PagItemView, PagText, PagView, TopLeftDate, TopLeftType, TopLeftView, TopView } from "./styled";

type SliderProps = {
    imageData: any
    setVisible: (value: boolean) => void,
    visible: boolean,
    currentImageEmitter: number,
    setCurrentImageEmitter?: (value: number) => void,
    onClose: () => void,
}

type SlideProps = {
    item: any
    setOnZoomonTransform?: (value: ZoomableViewEvent) => void
    setVisible: (value: boolean) => void,
    visible: boolean,
    onClose: () => void,
    imageData: any[],
    index: number,
}

type RenderItemProps = {
    item: any,
    onClose: () => void,
}

const Slide: React.FC<SlideProps> = React.memo(({ index, imageData, item, setOnZoomonTransform, setVisible, visible, onClose, }) => {
    const photoExtensions = ['jpg', 'png', 'jpeg'];
    const videoExtensions = ['mp4'];

    const pressingOutsidePhoto = (value: number) => {
        if (value! >= screenHeight * 0.25 || value! <= screenHeight * 0.75) {
            onClose();
        }
    }

    return (
        <>
            <MainView>
                <ReactNativeZoomableView
                    contentWidth={screenWidth}
                    contentHeight={screenHeight}
                    // onSingleTap={(e) => pressingOutsidePhoto(e.nativeEvent.locationY)}
                    maxZoom={5}
                    minZoom={1}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                >

                    {item?.url && photoExtensions?.includes(getExtension(item?.url)) ?
                        <SkeletonFastImage
                            headers={item?.headers}
                            hidenSkeletonLoader={true}
                            uri={item.url}
                            resizeMode="contain"
                            style={{ width: screenWidth, height: screenHeight }}
                        /> : null
                    }
                    {item?.url && videoExtensions?.includes(getExtension(item?.url)) ? <Video
                        controls={true}
                        repeat={false}
                        paused={true}
                        fullscreen={true}
                        style={{
                            backgroundColor: "#cecece",
                            borderRadius: 8,
                            height: screenHeight / 2,
                            width: screenWidth - 26
                        }}
                        source={{ uri: item.url }}
                    /> : null}
                    {item?.uri ?
                        <SkeletonFastImage
                            headers={item?.headers}
                            hidenSkeletonLoader={true}
                            uri={item.uri}
                            resizeMode="contain"
                            style={{ width: screenWidth, height: screenHeight }}
                        /> : null
                    }
                    {item?.uri && videoExtensions?.includes(getExtension(item?.uri)) ? <Video
                        controls={true}
                        repeat={false}
                        paused={true}
                        fullscreen={true}
                        style={{
                            backgroundColor: "#cecece",
                            borderRadius: 8,
                            height: screenHeight / 2,
                            width: screenWidth - 26
                        }}
                        source={{ uri: item.uri }}
                    /> : null}
                    {item?.mediaUrl && photoExtensions?.includes(getExtension(item?.mediaUrl)) ?
                        <SkeletonFastImage
                            headers={item?.headers}
                            hidenSkeletonLoader={true}
                            uri={item.mediaUrl}
                            resizeMode="contain"
                            style={{ width: screenWidth, height: screenHeight }}
                        /> : null
                    }
                    {item?.mediaUrl && videoExtensions?.includes(getExtension(item?.mediaUrl)) ? <Video
                        controls={true}
                        repeat={false}
                        paused={true}
                        fullscreen={true}
                        style={{
                            backgroundColor: "#cecece",
                            borderRadius: 8,
                            height: screenHeight / 2,
                            width: screenWidth - 26
                        }}
                        source={{ uri: item.mediaUrl }}
                    /> : null}
                </ReactNativeZoomableView>
            </MainView>
            <InnerView>
                <PagView>
                    <PagItemView>
                        <PagText>{index + 1}/{imageData.length}</PagText>
                    </PagItemView>
                </PagView>
                <FooterView style={{ width: screenWidth - 48 }}>
                    <TopView>
                        <TopLeftView>
                            <TopLeftDate>{moment(item.createdDate).format("MMM DD, h:mm A")}</TopLeftDate>
                            <TopLeftType>{item.projectJobName}</TopLeftType>
                        </TopLeftView>
                    </TopView>
                    <BottomView>
                        <BottomDesc>{item.activityText}</BottomDesc>
                    </BottomView>
                </FooterView>
            </InnerView>
        </>
    );
});

const Slider: React.FC<SliderProps> = ({ onClose, currentImageEmitter, imageData, setVisible, visible, setCurrentImageEmitter }) => {
    const [onZoomonTransform, setOnZoomonTransform] = useState<ZoomableViewEvent>({ offsetX: 0, offsetY: 0, originalHeight: 0, originalPageX: 0, originalPageY: 0, originalWidth: 0, zoomLevel: 1 })
    const [index, setIndex] = useState(currentImageEmitter);
    const indexRef = useRef(index);
    indexRef.current = index;
    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
            setCurrentImageEmitter ? setCurrentImageEmitter(roundIndex) : <></>
        }
    }, []);

    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 1,
        windowSize: 2,
        keyExtractor: useCallback((s: ZoomSliderModalImageProps, index: number) => String(index), []),
        getItemLayout: useCallback(
            (_: any, index: number) => ({
                index,
                length: screenWidth,
                offset: index * screenWidth,
            }),
            []
        ),
    };

    const renderItem: React.FC<RenderItemProps> = useCallback(function renderItem({ item }) {
        return <Slide
            imageData={imageData}
            index={index}
            onClose={onClose}
            item={item}
            setOnZoomonTransform={setOnZoomonTransform}
            visible={visible}
            setVisible={setVisible}
        />;
    }, [index]);

    return (
        <FlatList
            scrollEnabled={onZoomonTransform.zoomLevel > 1 ? false : true}
            data={imageData}
            renderItem={renderItem as any}
            initialScrollIndex={currentImageEmitter}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={onScroll}
            {...flatListOptimizationProps}
        />
    );
}

export default Slider;