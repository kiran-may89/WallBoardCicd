import React from 'react';
import moment from 'moment';

import {Text, View} from 'react-native';

import {todayDateFormat} from '../../../../../helpers';

export default ({format, font, Colors, item}) => {
  const {scale, tileHeightRoundedDown} = format;
  const textStyle = {
    color: Colors('headerLabel'),
    fontSize: scale(7, false),
    textAlign: 'center',
    marginBottom: scale(2.8),
    letterSpacing: scale(0),
    ...font.medium,
  };

  const formated = todayDateFormat(item.lastModified);

  return (
    <View
      style={{
        height: tileHeightRoundedDown - scale(27),
        backgroundColor: Colors('tilenotproductiveBackground'),
        borderBottomLeftRadius: scale(4.5),
        borderBottomRightRadius: scale(4.5),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: Colors('warningBackground'),
          marginTop: scale(2),
          height: scale(47),
          width: scale(114),
          borderRadius: scale(3),
          justifyContent: 'center',
        }}>
        <Text style={textStyle}>no connection with</Text>
        <Text style={textStyle}>Smart Factory Connector</Text>
        <Text style={textStyle}>{formated}</Text>
      </View>
    </View>
  );
};
