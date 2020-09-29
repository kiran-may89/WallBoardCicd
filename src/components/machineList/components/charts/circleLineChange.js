import React from 'react';

import {Text, View} from 'react-native';
import LineChart from './lineChart';
import ProgressCircle from './circleChartChange';

import {convertTime} from '../../../../../helpers';

export default ({format, font, circleSize, Colors, item}) => {
  const {scale} = format;
  const sum = item.time.green + item.time.blue;
  const red = sum - item.cycle_time_vc;

  const formated = convertTime(item.cycle_time_vc);

  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <ProgressCircle
        {...{
          format,
          progress: item.time.green / item.cycle_time_vc,
          // progress: 0,
          // progressChange: 0,
          progressChange:
            red > 0
              ? (item.time.blue - red) / item.cycle_time_vc
              : item.time.blue / item.cycle_time_vc,
          secondColor: Colors('stoppedHeader'),
          progressColor: Colors('activeHeader'),
          redColor: Colors('warningLabel'),
          redValue: red > 0 ? red / item.cycle_time_vc : 0,
          // redValue: 0,
          backgroundColor: Colors('chartBackground'),
          circleSize,
        }}
      />
      <LineChart {...{format, circleSize, Colors, item}} />
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
        {formated.substring(0, formated.length - 2)}
        <Text style={{fontSize: scale(4, false)}}>
          {formated.substring(formated.length - 2, formated.length)}
        </Text>
      </Text>
    </View>
  );
};
