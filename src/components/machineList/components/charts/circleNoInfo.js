import React from 'react';

import {Text, View} from 'react-native';

import ProgressCircle from './circleChart';

export default ({format, font, circleSize, Colors}) => {
  const {scale} = format;

  const textFormater = {
    color: Colors('secondaryLabel'),
    fontSize: scale(5, false),
    textAlign: 'center',
    letterSpacing: scale(0),
    width: '100%',
    ...font.normal,
  };
  return (
    <View>
      <ProgressCircle
        {...{
          format,
          progress: 0,
          progressColor: Colors('activeHeader'),
          backgroundColor: Colors('chartBackground'),
          circleSize,
        }}
      />
      <Text
        style={{
          marginTop: scale(-28),
          ...textFormater,
        }}>
        no
      </Text>
      <Text
        style={{
          ...textFormater,
        }}>
        information
      </Text>
      <Text
        style={{
          ...textFormater,
        }}>
        from ERP
      </Text>
    </View>
  );
};
