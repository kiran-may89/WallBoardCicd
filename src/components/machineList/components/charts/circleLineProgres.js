import React from 'react';

import {Text, View} from 'react-native';

import ProgressCircle from './circleChart';

export default ({format, font, circleSize, Colors, item: {quantityGraph}}) => {
  const {scale} = format;
  const fin = quantityGraph ? quantityGraph.finishedAmount : 0;
  const am = quantityGraph ? quantityGraph.productionOrderAmount : 0;
  return (
    <View>
      <ProgressCircle
        {...{
          format,
          progress: fin / am,
          progressColor: Colors('activeHeader'),
          backgroundColor: Colors('chartBackground'),
          circleSize,
        }}
      />
      <Text
        style={{
          color: Colors('label'),
          height: scale(14.26),
          fontSize: scale(12, false),
          textAlign: 'center',
          letterSpacing: scale(0.25, false),
          width: '100%',
          marginTop: scale(-28),
          ...font.medium,
        }}>
        {fin}
      </Text>
      <Text
        style={{
          color: Colors('secondaryLabel'),
          height: scale(15),
          fontSize: scale(6, false),
          textAlign: 'center',
          letterSpacing: scale(0.25, false),
          width: '100%',
          marginTop: scale(0),
          ...font.normal,
        }}>
        {am}
      </Text>
    </View>
  );
};
