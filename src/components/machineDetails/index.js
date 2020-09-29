import React, {useState} from 'react';

import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import {isIphoneX} from 'react-native-device-detection';
import {connect} from 'react-redux';

import {t} from '../../../reducers/language';

import {countFormat, font, IPhoneXWrapper} from '../../../helpers';

import ColorsWrapper from '../../../colors';

import LeftArrow from '../../../ios/asset/icons/arrowLeft.svg';
import RightArrow from '../../../ios/asset/icons/arrowRight.svg';
import X from '../../../ios/asset/icons/x.svg';

import Header from '../machineList/components/header';
import MachineCode from '../machineList/components/machineCode';
import ImageTile from '../machineList/components/image';
import Charts from '../machineList/components/charts';
import ConnectorIssue from '../machineList/components/connectorIsuue';

import {countOffset} from '../machineList/listHelper';

const Details = ({item, close, detailsRight, detailsLeft, Colors, time, t}) => {
  const [formatOld, setFormat] = useState(countFormat());
  const rerender = () => setFormat(countFormat());
  useState(() => {
    Dimensions.addEventListener('change', rerender);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      console.log('destroy');
      backHandler.remove();
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const format = {
    ...formatOld,
    tileWidthRoundedDown: formatOld.tileWidthRoundedDown * 2,
    tileHeightRoundedDown: formatOld.tileHeightRoundedDown * 2,
    scaleOrig: (value) => formatOld.scale(value),
    scale: (value) => formatOld.scale(value * 2),
  };

  const {
    tileWidthRoundedDown,
    tileHeightRoundedDown,
    scale,
    scaleOrig,
    stretchDirectionTile,
    isTV,
    circleSize,
    isPortrail,
  } = format;

  const tileStyle = {
    width: tileWidthRoundedDown,
    height: tileHeightRoundedDown,
    backgroundColor: Colors('tileBackground'),
    borderRadius: scale(6.5),
    shadowColor: 'rgb(0, 0, 0)',
    shadowOpacity: 0.59,
    shadowRadius: scale(5),
  };

  const wrapper = {
    backgroundColor: 'rgba(0,0,0, 0.9)',
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scaleOrig(12),
    paddingRight: scaleOrig(12),
    filter: 'grayscale(1)',
  };

  const {oversize, fixOversize} = countOffset(format);

  return (
    <TouchableWithoutFeedback onPress={close}>
      <View style={wrapper}>
        <IPhoneXWrapper
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: scaleOrig(12) + (isIphoneX ? (isPortrail ? 36 : 0) : 0),
              right: scaleOrig(12) + (isIphoneX ? (isPortrail ? 36 : 0) : 0),
              alignItems: 'flex-end',
            }}>
            <TouchableWithoutFeedback onPress={close}>
              <View
                style={{
                  width: scaleOrig(28),
                  height: scaleOrig(28),
                  borderRadius: scaleOrig(28) / 2,
                  backgroundColor: Colors('bigNavigation'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <X width={scaleOrig(6)} height={scaleOrig(6)} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: scaleOrig(60),
                height: scaleOrig(18),
                backgroundColor: Colors('tileBackground'),
                marginTop: scaleOrig(8),
                borderRadius: scaleOrig(9.5),
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isTV || window.isTV ? 1 : 0,
              }}>
              <Text
                style={{
                  color: Colors('label'),
                  fontSize: scaleOrig(10, false),
                  ...font.medium,
                }}>
                {t('or_press_0', 'or press 0')}
              </Text>
            </View>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={detailsLeft}>
              <View
                style={{
                  width: scaleOrig(28),
                  height: scaleOrig(28),
                  borderRadius: scaleOrig(28) / 2,
                  backgroundColor: Colors('bigNavigation'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <LeftArrow width={scaleOrig(5.33)} height={scaleOrig(8.33)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={tileStyle}>
            <Header {...{format, font, item, Colors, time}} />
            {item.issue || item.issueWithOperator ? (
              <ConnectorIssue {...{format, item, font, fixOversize, Colors}} />
            ) : (
              <View
                style={[
                  {
                    justifyContent: 'space-between',
                    height: tileHeightRoundedDown - scale(27),
                    borderBottomRightRadius: scale(5),
                    borderBottomLeftRadius: scale(5),
                    paddingBottom: scale(2),
                  },
                ]}>
                <MachineCode {...{format, font, item, Colors}} />
                <ImageTile
                  {...{format, oversize, fixOversize, item, font, Colors}}
                />
                <Charts
                  {...{
                    format,
                    font,
                    oversize,
                    fixOversize,
                    circleSize,
                    item,
                    Colors,
                    time,
                  }}
                />
              </View>
            )}
          </View>
          <View>
            <TouchableWithoutFeedback onPress={detailsRight}>
              <View
                style={{
                  width: scaleOrig(28),
                  height: scaleOrig(28),
                  borderRadius: scaleOrig(28) / 2,
                  backgroundColor: Colors('bigNavigation'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <RightArrow width={scaleOrig(5.33)} height={scaleOrig(8.33)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </IPhoneXWrapper>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default connect(null, {t})(ColorsWrapper(Details));
