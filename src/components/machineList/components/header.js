import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';

import {t} from '../../../../reducers/language';

import {formatHours} from '../../../../helpers';

const compareName = (prev, next) => {
  return (
    prev.item.machineName === next.item.machineName &&
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.Colors.scheme === next.Colors.scheme
  );
};

const formatedName = (name) => {
  return `${name.slice(0, 8)}...${name.slice(name.length - 8)}`;
};

const MachineName = React.memo(({font, Colors, scale, isIOS, item}) => {
  return (
    <View //HeaderName Block
      style={{
        height: scale(11.6),
        width: '100%',
        marginTop: scale(isIOS ? 3.5 : 3),
        paddingLeft: scale(4),
        paddingRight: scale(4),
      }}>
      <Text
        style={{
          fontSize: scale(9, false),
          textAlign: 'center',
          letterSpacing: scale(0.35, false),
          color: Colors('headerLabel'),
          overflow: 'visible',
          ...font.bold,
        }}>
        {item.machineName.length > 18
          ? formatedName(item.machineName)
          : item.machineName}
      </Text>
    </View>
  );
}, compareName);

const compareOwnerName = (prev, next) => {
  return (
    prev.item.ownerName === next.item.ownerName &&
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.Colors.scheme === next.Colors.scheme
  );
};

const OwnerName = React.memo(({font, Colors, scale, item}) => {
  return (
    <Text //User name
      style={{
        fontSize: scale(6, false),
        letterSpacing: scale(0),
        color: Colors('headerLabel'),
        ...font.normal,
      }}>
      {item.ownerName}
    </Text>
  );
}, compareOwnerName);

const Header = ({format, font, t, item, Colors, time}) => {
  const {scale, tileWidthRoundedDown, isIOS} = format;
  const lastModified = moment(time.diff(moment.utc(item.lastModified)))
    .utc()
    .format('HH:mm:ss');
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

  const showStatusTime = (status) => {
    switch (status) {
      case 'Active':
        return true;
      case 'Change':
        return true;
      case 'Not Productive':
        return false;
      case 'Setup':
        return true;
      default:
        return true;
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'Active':
        return t('status_id_1', 'Active');
      case 'Change':
        return t('status_id_2', 'Change');
      case 'Not Productive':
        return t('status_id_4', 'Not Productive');
      case 'Setup':
        return t('status_id_3', 'Setup');
    }
  };

  const formated = formatHours(lastModified);
  return (
    <View //Header block
      style={{
        height: scale(27),
        backgroundColor: selectColor(item.status),
        borderTopRightRadius: scale(6),
        borderTopLeftRadius: scale(6),
        width: '100%',
      }}>
      <MachineName {...{font, Colors, scale, isIOS, item, format}} />
      <View
        style={{
          height: scale(7),
          marginTop: scale(2.4),
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: scale(3),
          marginRight: scale(3),
          alignItems: 'center',
        }}>
        <OwnerName {...{font, Colors, scale, isIOS, item, format}} />
        <Text //Status block
          style={{
            fontSize: scale(6, false),
            letterSpacing: scale(0),
            color: Colors('headerLabel'),
            ...font.normal,
          }}>
          {getStatusName(item.status)}{' '}
          {showStatusTime(item.status) && (
            <Text>
              • {formated.substring(0, formated.length - 2)}
              <Text style={{fontSize: scale(5, false)}}>
                {formated.substring(formated.length - 2, formated.length)}
              </Text>
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const compareProps = (prev, next) => {
  return (
    prev.time === next.time &&
    prev.item.status === next.item.status &&
    prev.item.machineName === next.item.machineName &&
    prev.item.ownerName === next.item.ownerName &&
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.Colors.scheme === next.Colors.scheme
  );
};

export default connect(null, {t})(React.memo(Header, compareProps));
