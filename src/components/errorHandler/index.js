import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text} from 'react-native';
import {countFormat} from '../../../helpers';
import {font} from '../../../helpers';
import {connect} from 'react-redux';

import {t} from '../../../reducers/language';

import Warning from '../../../ios/asset/icons/warningIcon.svg';

export default (Component) => {
  return (props) => {
    const {error, Colors, t} = props;
    const [format, setFormat] = useState(countFormat());
    const [text, setText] = useState({});
    const rerender = () => setFormat(countFormat());

    const {scale, forWidth, forHeight} = format;

    useEffect(() => {
      Dimensions.addEventListener('change', rerender);
      return () => {
        console.log('destroy');
        Dimensions.removeEventListener('change', rerender);
      };
    }, []);

    useEffect(() => {
      setText(getText(error.type));
    }, [error.type]);

    const getText = (type) => {
      if (type === 'noConnection') {
        return {
          header: t('unable_to_connect', 'Unable to connect to Smart Factory'),
          desc: t('please_exit', 'Please exit this app and try again.'),
        };
      }
      if (type === 'noInternet') {
        return {
          header: t('no_connection', 'No Internet Connection'),
          desc: t(
            'no_internet_connection',
            'Make sure W-Fi or cellular data is turned on, then try again.',
          ),
        };
      }
      return {};
    };
    return (
      <View style={{flex: 1}}>
        <Component {...props} />
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            position: 'absolute',
            zIndex: error && error.type ? 1000 : -10000,
            width: '100%',
            top: error && error.type ? 0 : -10000,
            height: error && error.type ? '100%' : 0,
            overflow: 'hidden',
          }}>
          <View
            style={[
              {
                height: scale(52),
                width: scale(320),
                borderRadius: scale(6.66),
                left: forWidth / 2 - scale(320) / 2,
                top: forHeight / 2 - scale(52) / 2,
                backgroundColor: Colors('warningLabel'),
                shadowColor: 'rgb(0, 0, 0)',
                shadowOpacity: 0.59,
                shadowRadius: scale(5),
                alignContent: 'center',
              },
            ]}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{marginTop: scale(9), marginRight: scale(3)}}>
                <Warning width={scale(14)} height={scale(13)} />
              </View>
              <Text
                style={{
                  ...font.normal,
                  color: Colors('headerLabel'),
                  fontSize: scale(12),
                  textAlign: 'center',
                  marginTop: scale(11),
                }}>
                {text.header}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  ...font.normal,
                  color: Colors('headerLabel'),
                  fontSize: scale(9),
                  textAlign: 'center',
                  marginTop: scale(5),
                }}>
                {text.desc}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
};
