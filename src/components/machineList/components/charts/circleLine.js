import React from 'react';

import {Text, View} from 'react-native';
import LineChart from './lineChart';
import ProgressCircle from './circleChart';

export default ({format, font, circleSize, Colors}) => {
  const {scale} = format;
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <ProgressCircle
        {...{
          format,
          progress: 0.9,
          progressColor: Colors('activeHeader'),
          backgroundColor: Colors('chartBackground'),
          circleSize,
        }}
      />
      <LineChart {...{format, circleSize, Colors}} />
      <Text
        style={{
          height: scale(15),
          position: 'relative',
          top: scale(-11.8),
          color: Colors('secondaryLabel'),
          fontSize: scale(6, false),
          letterSpacing: scale(-0.2, false),
          ...font.normal,
        }}>
        3:30<Text style={{fontSize: scale(4, false)}}>:00</Text>
      </Text>
    </View>
  );
};
