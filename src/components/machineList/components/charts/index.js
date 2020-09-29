import React from 'react';

import {Text, View} from 'react-native';
import {connect} from 'react-redux';

import CircleLine from './circleLine';
import CircleLineChange from './circleLineChange';
import CircleLineProgres from './circleLineProgres';
import CircleCountDown from './circleCountDown';
import SetupInfo from './setupInfo';
import CircleNoInfo from './circleNoInfo';
import CircleSetupTime from './circleSetupTime';

import {t} from '../../../../../reducers/language';

const Charts = ({
  format,
  font,
  oversize,
  fixOversize,
  circleSize,
  item,
  Colors,
  t,
  time,
}) => {
  const {scale} = format;
  const chartData = {format, font, circleSize, Colors, item, time};
  const renderChart = (status) => {
    switch (status) {
      case 'Active': {
        // if (item.noInfo) {
        //   return (
        //     <>
        //       <CircleLineChange {...chartData} />
        //       <CircleNoInfo {...chartData} />
        //       <CircleNoInfo {...chartData} />
        //     </>
        //   );
        // }
        return (
          <>
            {item.cycle_time_vc ? (
              <CircleLineChange {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
            {item.quantityGraph && item.quantityGraph.productionOrderAmount ? (
              <CircleLineProgres {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
            {item.delayedGraph && item.delayedGraph.days ? (
              <CircleCountDown {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
          </>
        );
      }
      case 'Change':
        return (
          <>
            {item.cycle_time_vc ? (
              <CircleLineChange {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
            {item.quantityGraph && item.quantityGraph.productionOrderAmount ? (
              <CircleLineProgres {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
            {item.delayedGraph && item.delayedGraph.days ? (
              <CircleCountDown {...chartData} />
            ) : (
              <CircleNoInfo {...chartData} />
            )}
          </>
        );
      case 'Setup':
        return (
          <>
            <CircleSetupTime {...chartData} />
            <SetupInfo {...chartData} />
            <CircleCountDown {...chartData} />
          </>
        );
      // default:
      //   return (
      //     <>
      //       <CircleLineChange {...chartData} />
      //       <CircleLineProgres {...chartData} />
      //       <CircleCountDown {...chartData} />
      //     </>
      //   );
    }
  };

  return (
    <View //Chart block
      style={{
        width: '100%',
        marginTop: oversize
          ? scale(item.noImg ? 10 : 11) - fixOversize.offsetCircle
          : scale(item.noImg ? 10 : 11),
        paddingLeft: scale(3),
        paddingRight: scale(3),
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          height: scale(circleSize),
        }}>
        {renderChart(item.status)}
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: scale(1.5),
        }}>
        <Text
          style={{
            color: Colors('secondaryLabel'),
            textAlign: 'center',
            width: scale(circleSize),
            fontSize: scale(5.6, false),
            letterSpacing: scale(-0.25, false),
            ...font.normal,
          }}>
          {t('cycle_time', 'cycle time')}
        </Text>
        <Text
          style={{
            color: Colors('secondaryLabel'),
            textAlign: 'center',
            width: scale(circleSize),
            fontSize: scale(5.6, false),
            letterSpacing: scale(-0.25, false),
            ...font.normal,
          }}>
          {item.status === 'Setup' ? ' ' : t('quantity', 'quantity')}
        </Text>
        <Text
          style={{
            color: Colors('secondaryLabel'),
            textAlign: 'center',
            width: scale(circleSize),
            fontSize: scale(5.6, false),
            letterSpacing: scale(-0.25, false),
            ...font.normal,
          }}>
          {item.delayedGraph && item.delayedGraph.days
            ? t('delayed_to', 'delayed to')
            : t('planning', 'planning')}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: scale(0.5),
          height: scale(8),
        }}>
        <Text
          style={{
            color: Colors('secondaryLabel'),
            textAlign: 'center',
            width: scale(circleSize),
            fontSize: scale(5.5, false),
            letterSpacing: scale(-0.25, false),
            ...font.normal,
          }}>
          {item.productionOrder}
        </Text>
        <Text
          style={{
            width: scale(circleSize),
          }}
        />
        <Text
          style={{
            color: Colors('secondaryLabel'),
            textAlign: 'center',
            width: scale(circleSize),
            fontSize: scale(5.5, false),
            letterSpacing: scale(-0.25, false),
            ...font.normal,
          }}>
          {item.delayedGraph && item.delayedGraph.days ? '13-sep 16:32' : ''}
        </Text>
      </View>
    </View>
  );
};

export default connect(null, {t})(Charts);
