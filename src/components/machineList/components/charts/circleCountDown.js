import React from 'react';

import {Text, View} from 'react-native';
import ProgressCircle from './circleChart';

export default ({format, font, circleSize, Colors, item}) => {
  const {scale} = format;

  const isRed = item.delayedGraph.direction === 'Anti-Clockwise';

  return (
    <View>
      <ProgressCircle
        {...{
          format,
          progress: item.delayedGraph.days / 12,
          progressColor: Colors(isRed ? 'warningLabel' : 'activeHeader'),
          backgroundColor: Colors('chartBackground'),
          circleSize,
          endAngle: isRed ? 0 : Math.PI * 2,
          startAngle: isRed ? Math.PI * 2 : 0,
        }}
      />
      <Text
        style={{
          color: Colors(
            item.delayedGraph.days === 0
              ? 'label'
              : isRed
              ? 'warningLabel'
              : 'activeHeader',
          ),
          height: scale(14.26),
          fontSize: scale(12, false),
          textAlign: 'center',
          letterSpacing: scale(0.25, false),
          width: '100%',
          marginTop: scale(-28),
          ...font.medium,
        }}>
        {item.delayedGraph.days}
      </Text>
      <Text
        style={{
          color: Colors('secondaryLabel'),
          height: scale(15),
          fontSize: scale(6, false),
          textAlign: 'center',
          letterSpacing: scale(0),
          width: '100%',
          ...font.normal,
        }}>
        days
      </Text>
    </View>
  );
};
