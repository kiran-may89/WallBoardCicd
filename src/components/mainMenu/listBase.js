import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import ColorsWrapper from '../../../colors';
import {connect} from 'react-redux';
import {font} from '../../../helpers';
import {isIphoneX} from 'react-native-device-detection';

import Logo from '../../../ios/asset/icons/logo.svg';
import {t} from '../../../reducers/language';

const ListBase = ({Colors, t, format, list, header, selectedKey, isBorder}) => {
  const {scale, isTV, isPortrail} = format;
  return (
    <View
      style={{
        backgroundColor: Colors('menuBackground'),
        flex: 1,
        paddingTop: scale(isPortrail ? 0 : 21),
        paddingLeft: scale(isPortrail ? 30 : 20),
        flexDirection: 'column',
      }}>
      <View
        style={{
          position: 'absolute',
          top: scale(isIphoneX && isPortrail ? 80 : 20),
          left: scale(isIphoneX && !isPortrail ? 80 : 20),
        }}>
        <Logo width={scale(52)} height={scale(18)} />
      </View>
      <View
        style={{
          marginLeft: isPortrail ? 0 : '15.5%',
          height: '100%',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: Colors('label'),
            fontSize: scale(18.8, false),
            textTransform: 'uppercase',
            letterSpacing: scale(0.7, false),
            ...font.black,
          }}>
          {header}
        </Text>
        <View
          style={{
            marginTop: scale(16, false),
            marginLeft: scale(1, false),
          }}>
          {list.map((item, index) => (
            <TouchableWithoutFeedback
              key={`menu-item-${item.key}`}
              onPress={() => {
                if (item.action) {
                  item.action();
                }
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: scale(1.5, false),
                  paddingBottom: scale(5, false),
                  paddingTop: scale(5, false),
                  paddingLeft: scale(5, false),
                  width: scale(350),
                  opacity:
                    index === selectedKey && (isTV || window.isTV) && isBorder
                      ? 0.5
                      : 1,
                  backgroundColor:
                    index === selectedKey && (isTV || window.isTV)
                      ? Colors('Hairline')
                      : Colors('menuBackground'),
                }}>
                <View
                  style={{
                    backgroundColor: Colors('secondaryLabel'),
                    width: scale(20),
                    height: scale(20),
                    borderRadius: scale(20) / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#4A4A4A',
                    shadowOffset: {
                      width: 0,
                      height: scale(2),
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: scale(1),
                    elevation: 2,
                    marginRight: scale(8, false),
                  }}>
                  <Text
                    style={{
                      color: Colors('invertedLabel'),
                      fontSize: scale(12, false),
                      ...font.normal,
                    }}>
                    {item.key}
                  </Text>
                </View>
                <Text
                  style={{
                    color: Colors('label'),
                    fontSize: scale(10, false),
                    letterSpacing: scale(0.55, false),
                    ...font.medium,
                  }}>
                  {item.name}{' '}
                  {item.current && (
                    <Text
                      style={{
                        color: Colors('secondaryLabel'),
                        fontSize: scale(8),
                        ...font.normal,
                      }}>
                      ({t('currently_selected', 'Currently selected')})
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    </View>
  );
};

export default connect(null, {t})(ColorsWrapper(ListBase));
