import React from 'react';

import {Text, View} from 'react-native';

import {convertTimeLetter} from '../../../../../helpers';

export default ({format, font, circleSize, item, Colors}) => {
  const {scale} = format;

  const textFormater = {
    textAlign: 'center',
    fontSize: scale(6),
    color: Colors('secondaryLabel'),
    ...font.normal,
  };

  const smallText = {
    fontSize: scale(4.07547, false),
  };

  const formated = convertTimeLetter(item.totalTime);

  const formatCustomer =
    item.customer.length > 10
      ? `${item.customer.substring(0, 9)}...`
      : item.customer;
  return (
    <View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(6, false),
            marginTop: scale(0.5),
          }}>
          {item.poCount}e
        </Text>
      </View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(4, false),
            marginTop: scale(-0.5),
          }}>
          PO of this part
        </Text>
      </View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(6, false),
            marginTop: scale(1.5),
          }}>
          {item.percentLinkedSales}%
        </Text>
      </View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(4, false),
            marginTop: scale(-0.5),
          }}>
          sales ({formatCustomer})
        </Text>
      </View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(6.11321, false),
            marginTop: scale(1.5),
            letterSpacing: scale(-0.1, false),
          }}>
          {formated.h}
          <Text style={smallText}>u</Text> {formated.m}
          <Text style={smallText}>m</Text>
        </Text>
      </View>
      <View>
        <Text
          style={{
            ...textFormater,
            fontSize: scale(4, false),
            marginTop: scale(-0.5),
          }}>
          total time
        </Text>
      </View>
    </View>
  );
};
