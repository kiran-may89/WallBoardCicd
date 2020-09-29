import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {countFormat} from '../../../helpers';
import ColorsWrapper from '../../../colors';
import {font} from '../../../helpers';

import Backspace from '../../../ios/asset/icons/backspace.svg';
import BackspaceWhite from '../../../ios/asset/icons/backspaceWhite.svg';
import Done from '../../../ios/asset/icons/checkmark.svg';
import DoneWhite from '../../../ios/asset/icons/checkmarkWhite.svg';

const NumPad = ({selectedKey, onSelect, Colors}) => {
  const [format, setFormat] = useState(countFormat());
  const rerender = () => setFormat(countFormat());
  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const {scale, isTV} = format;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0, 'done'];
  console.log(Colors.scheme, 'schema');
  const getKey = (item) => {
    if (typeof item === 'number') {
      return (
        <Text
          style={{
            color: Colors('label'),
            fontSize: scale(23),
            ...font.medium,
          }}>
          {item}
        </Text>
      );
    }

    if (item === 'back') {
      return Colors.scheme === 'dark' ? (
        <BackspaceWhite width={scale(20)} height={scale(20)} />
      ) : (
        <Backspace width={scale(20)} height={scale(20)} />
      );
    }
    if (item === 'done') {
      return Colors.scheme === 'dark' ? (
        <DoneWhite width={scale(20)} height={scale(20)} />
      ) : (
        <Done width={scale(20)} height={scale(20)} />
      );
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignContent: 'space-around',
      }}>
      {numbers.map((item) => (
        <TouchableWithoutFeedback onPress={() => onSelect(item)}>
          <View
            style={[
              {
                width: '32.5%',
                height: '23%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors('fieldBackground'),
              },
              selectedKey === item &&
                (isTV || window.isTV) && {
                borderColor: Colors('secondaryLabel'),
                borderWidth: scale(1, false),
              },
            ]}>
            {getKey(item)}
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

export default ColorsWrapper(NumPad);
