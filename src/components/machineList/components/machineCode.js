import React from 'react';

import {Text, View} from 'react-native';

const Code = ({format, font, item, Colors}) => {
  const {scale} = format;
  const selectColor = (status) => {
    switch (status) {
      case 'Active':
        return Colors('activeHeader');
      case 'Change':
        return Colors('stoppedHeader');
      case 'Not Productive':
        return Colors('notproductiveHeader');
      case 'Setup':
        return Colors('setupHeader');
      default:
        return Colors('activeHeader');
    }
  };

  return (
    <View //Machine code block
      style={{
        marginTop: scale(1),
        paddingRight: scale(3),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        aliginContent: 'center',
        width: '100%',
        height: scale(10),
      }}>
      <Text
        style={{
          color: selectColor(item.status),
          fontSize: scale(5, false),
          letterSpacing: scale(-0.005, false),
          ...font.medium,
        }}>
        {item.ncFiles[0]}
      </Text>
      {item.ncFiles[1] ? (
        [
          <Text
            key="arrow"
            style={{
              color: Colors('secondaryLabel'),
              fontSize: scale(5, false),
              letterSpacing: scale(0),
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              marginTop: scale(-1),
              ...font.bold,
            }}>
            &nbsp;&nbsp;&nbsp;&rarr;&nbsp;
          </Text>,
          <Text
            key="desc"
            style={{
              color: Colors('secondaryLabel'),
              fontSize: scale(5, false),
              letterSpacing: scale(0),
              ...font.normal,
            }}>
            {item.ncFiles[1]}
          </Text>,
        ]
      ) : (
        <Text />
      )}
    </View>
  );
};

const compareProps = (prev, next) => {
  return (
    prev.item.ncFiles[0] === next.item.ncFiles[0] &&
    prev.item.ncFiles[1] === next.item.ncFiles[1] &&
    prev.Colors.scheme === next.Colors.scheme &&
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.item.status === next.item.status
  );
};

export default React.memo(Code, compareProps);
