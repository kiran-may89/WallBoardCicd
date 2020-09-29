import React, {useState} from 'react';

import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {isIphoneX, isPhone} from 'react-native-device-detection';
import {connect} from 'react-redux';

import {t} from '../../../../reducers/language';

import {countFormat, font, IPhoneXWrapper} from '../../../../helpers';

import ColorsWrapper from '../../../../colors';

import LeftArrow from '../../../../ios/asset/icons/arrowLeft.svg';

const BackHeader = ({showHeader, toMain, Colors, t}) => {
  const [format, setFormat] = useState(countFormat());
  const rerender = () => setFormat(countFormat());
  useState(() => {
    Dimensions.addEventListener('change', rerender);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const {scale, isPortrail, edgeSpacingLeft} = format;

  return (
    <View
      key="machineDetailsHeader"
      style={{
        position: 'absolute',
        zIndex: 50,
        width: '100%',
        height: scale(isIphoneX && isPortrail ? 100 : isPhone ? 50 : 30),
        top: scale(
          showHeader ? 0 : isIphoneX && isPortrail ? -100 : isPhone ? -50 : -30,
        ),
        backgroundColor: Colors('invertedLabel'),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        // paddingLeft: edgeSpacingLeft,
        paddingRight: edgeSpacingLeft,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors('invertedLabel'),
      }}>
      <IPhoneXWrapper
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback onPress={toMain}>
          <View
            style={{
              justifyContent: 'center',
              height: scale(isIphoneX && isPortrail ? 100 : isPhone ? 50 : 30),
              width: scale(100),
              paddingLeft: edgeSpacingLeft,
            }}>
            <LeftArrow
              width={scale(isPhone ? 12 : 8)}
              height={scale(isPhone ? 18 : 10)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            width: scale(200),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors('label'),
              fontSize: scale(isPhone ? 15 : 8, false),
              ...font.normal,
            }}>
            {t('machine_details', 'Machine Details')}
          </Text>
        </View>
        <View style={{width: scale(100)}} />
      </IPhoneXWrapper>
    </View>
  );
};

export default connect(null, {t})(ColorsWrapper(BackHeader));
