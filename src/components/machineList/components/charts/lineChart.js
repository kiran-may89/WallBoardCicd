import React from 'react';

import {Text, View} from 'react-native';

export default ({format, circleSize, Colors, item}) => {
  const {scale} = format;
  const koef = 8.33 / item.cycle_time_vc;
  return (
    <View //Line shat box
      style={{
        width: scale(circleSize),
        height: scale(circleSize - 4),
        marginTop: scale(-circleSize + 2),
        borderRadius: scale(circleSize - 4) / 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
      <View
        style={{
          width: scale(circleSize),
          height: scale(8.33 + 0.3, false),
          backgroundColor: Colors('chartBackground'),
          // justifyContent: 'center',
          paddingRight: scale(7.5, false),
          paddingLeft: scale(7.5, false),
          flexDirection: 'row-reverse',
        }}>
        <View
          style={{
            width: scale(4),
            alignItems: 'center',
            justifyContent: 'flex-end',
            // position: 'relative',
          }}>
          <View
            style={{
              width: scale(2),
              backgroundColor: Colors('stoppedHeader'),
              height: scale(item.time.blue * koef),
            }}
          />
          <View
            style={{
              width: scale(2),
              height: scale(0.3),
            }}
          />
          <View
            style={{
              width: scale(2),
              backgroundColor: Colors('activeHeader'),
              height: scale(item.time.green * koef),
            }}
          />
        </View>
        {item.time.history.map((el, index) => (
          <View
            style={{
              width: scale(4),
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'relative',
            }}
            key={`line-${index}`}>
            <View
              style={{
                width: scale(2),
                backgroundColor: Colors('stoppedHeader'),
                height: scale(el.blue * koef),
              }}
            />
            <View
              style={{
                width: scale(2),
                height: scale(0.3, false),
              }}
            />
            <View
              style={{
                width: scale(2),
                backgroundColor: Colors('activeHeader'),
                height: scale(el.green * koef, false),
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          width: scale(20),
          height: 1,
          backgroundColor: Colors('tileBackground'),
        }}
      />
    </View>
  );
};
