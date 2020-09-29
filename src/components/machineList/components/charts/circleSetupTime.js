import React from 'react';
import moment from 'moment';
import {Text, View} from 'react-native';

import ProgressCircle from './circleChart';
import {convertTime} from '../../../../../helpers';

export default ({format, font, circleSize, Colors, item, time}) => {
  const {scale} = format;

  const formated = convertTime(item.setupTime);
  const persentage = item.setupTime
    ? time.diff(moment.utc(item.ncActiveSince), 'seconds') / item.setupTime
    : 0;
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <ProgressCircle
        {...{
          format,
          progress: persentage / 100,
          progressColor: Colors('setupHeader'),
          backgroundColor: Colors('chartBackground'),
          circleSize,
        }}
      />
      <Text
        style={{
          marginTop: scale(-28),
          marginLeft: scale(4),
          height: scale(15),
          color: Colors('label'),
          fontSize: scale(12, false),
          letterSpacing: scale(0.2, false),
          ...font.medium,
        }}>
        {persentage.toFixed(0)}
        <Text
          style={{
            fontSize: scale(5, false),
            color: Colors('secondaryLabel'),
            ...font.medium,
          }}>
          %
        </Text>
      </Text>
      {item.setupTime ? (
        <Text
          style={{
            height: scale(15),
            color: Colors('secondaryLabel'),
            fontSize: scale(6, false),
            letterSpacing: scale(-0.2, false),
            marginTop: scale(-1),
            ...font.normal,
          }}>
          {formated.substring(0, formated.length - 2)}
          <Text style={{fontSize: scale(4, false)}}>
            {formated.substring(formated.length - 2, formated.length)}
          </Text>
        </Text>
      ) : (
        <Text
          style={{
            height: scale(15),
            color: Colors('secondaryLabel'),
            fontSize: scale(6, false),
            letterSpacing: scale(-0.2, false),
            marginTop: scale(-1),
            ...font.normal,
          }}
        />
      )}
    </View>
  );
};
