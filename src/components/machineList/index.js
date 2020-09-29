/* eslint-disable no-lone-blocks */
import React, {useState, useEffect} from 'react';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import DoubleClick from '../doubleClick';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {Navigation} from 'react-native-navigation';
import IdleTimerManager from 'react-native-idle-timer';

import {
  countFormat,
  font,
  IPhoneXWrapper,
  trigerRotation,
} from '../../../helpers';

import KeyEvent from 'react-native-keyevent';

import ColorsWrapper from '../../../colors';

import Loading from '../loading';

import Header from './components/header';
import MachineCode from './components/machineCode';
import ImageTile from './components/image';
import Charts from './components/charts';
import ConnectorIssue from './components/connectorIsuue';
import BackHeader from './components/backHeader';

import MachineDetails from '../machineDetails';

import {
  getTiles,
  clearTiles,
  updateTilesInfo,
  negotiate,
  negotiateClose,
} from '../../../reducers/user';
import {t} from '../../../reducers/language';

import {
  statusIdObj,
  upId,
  downId,
  nextId,
  prevId,
  countOffset,
} from './listHelper';

const ItemWrapper = React.memo(
  ({
    setSelectedItem,
    time,
    Colors,
    item,
    format,
    fixOversize,
    oversize,
    selectedID,
  }) => {
    const {
      tileWidthRoundedDown,
      tileHeightRoundedDown,
      verticalInbetweenspacing,
      scale,
      circleSize,
    } = format;
    return (
      <PinchGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.scale > 1) {
            setSelectedItem(item.id);
          }
        }}>
        <View
          style={[
            {
              width: tileWidthRoundedDown,
              height: tileHeightRoundedDown,
              marginRight: verticalInbetweenspacing,
              backgroundColor: Colors('tileBackground'),
              borderRadius: scale(7),
              opacity: item.isEmpty ? 0 : 1,
            },
          ]}>
          <Header {...{format, font, item, Colors, time}} />
          {item.issue || item.issueWithOperator ? (
            <ConnectorIssue
              {...{
                format,
                item,
                font,
                fixOversize,
                time,
                Colors,
              }}
            />
          ) : (
            <View
              style={[
                {
                  justifyContent: 'space-between',
                  height: tileHeightRoundedDown - scale(27),
                  paddingBottom: scale(2),
                },
              ]}>
              <MachineCode {...{format, font, item, Colors}} />
              <ImageTile
                {...{
                  format,
                  oversize,
                  fixOversize,
                  item,
                  font,
                  Colors,
                }}
              />
              <Charts
                {...{
                  format,
                  font,
                  oversize,
                  fixOversize,
                  circleSize,
                  item,
                  Colors,
                  time,
                }}
              />
            </View>
          )}
        </View>
      </PinchGestureHandler>
    );
  },
  (prev, next) =>
    prev.format.scalingFactorTile === next.format.scalingFactorTile &&
    prev.time === next.time,
);

let borderId;
let intervalId;

const List = (props) => {
  const {
    Colors,
    navigation,
    getTiles,
    clearTiles,
    user: {machines, machinesLoaded, timeOffset, minimumTileSize},
    t,
    updateTilesInfo,
    componentId,
    demo = false,
    negotiate,
    negotiateClose,
  } = props;

  const isDemo = demo;

  const time = moment.utc().add(timeOffset, 'milliseconds');

  const [format, setFormat] = useState(countFormat());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showHeader, setShowHeader] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [counting, setCounting] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const rerender = (orientation = true) => {
    if (orientation) {
      setCounting(true);
    }
    setFormat(countFormat(minimumTileSize, machines.length));
    if (orientation) {
      setTimeout(() => {
        setCounting(false);
      }, 100);
    }
  };
  const [selectedID, setSelectedID] = useState(0);

  const {
    tileWidthRoundedDown,
    tileHeightRoundedDown,
    edgeSpacingLeft,
    edgeSpacingTop,
    verticalInbetweenspacing,
    tileCountWidth,
    tileCountHeight,
    scale,
    isTV,
    circleSize,
  } = format;

  const data = machines.map((item) => ({
    ...item,
    id: item.machineId,
    ownerName: item.employeeName,
    noImg: !item.blobLink,
    status: statusIdObj[item.statusId],
    issue: item.statusId === 4,
    ncFiles: item.ncFiles ? item.ncFiles : [],
  }));
  // console.log(data, 'data component');
  const sortedData = [];
  let indexSorting = 0;

  const realCountHeight =
    isTV || window.isTV
      ? Math.min(tileCountHeight, Math.ceil(data.length / tileCountWidth))
      : Math.ceil(data.length / tileCountWidth);

  for (let i = 0; i < realCountHeight; i++) {
    sortedData[i] = [];
    for (let y = 0; y < tileCountWidth; y++) {
      if (data[indexSorting]) {
        sortedData[i][y] = data[indexSorting];
      }
      indexSorting++;
    }
  }

  const toMain = () => {
    Navigation.popToRoot(componentId);
  };

  const TVFunction = (key) => {
    if (Number(key) === 14) {
      trigerRotation();
      return;
    }
    console.log('triger', key, moment().format('HH:mm:ss'));
    // if (!selectedID) {
    //   return;
    // }
    if (borderId) {
      clearInterval(borderId);
    }
    const i = setTimeout(() => {
      setShowBorder(false);
    }, 10000);
    borderId = i;
    switch (Number(key)) {
      case 22: {
        // rigth
        const i = nextId(selectedID, sortedData);
        setSelectedID(i);
        if (selectedItem) {
          setSelectedItem(i);
        }
        console.log('result', moment().format('HH:mm:ss'));
        break;
      }
      case 21: {
        // left
        const i = prevId(selectedID, sortedData);
        setSelectedID(i);
        if (selectedItem) {
          setSelectedItem(i);
        }
        break;
      }
      case 19: {
        // UP
        const i = upId(selectedID, sortedData);
        setSelectedID(i);
        if (selectedItem) {
          setSelectedItem(i);
        }
        break;
      }
      case 20: {
        // down
        const i = downId(selectedID, sortedData);
        setSelectedID(i);
        if (selectedItem) {
          setSelectedItem(i);
        }
        break;
      }
      case 23: // okay
        if (selectedItem) {
          setSelectedItem(null);
        } else {
          setSelectedItem(selectedID);
        }
        break;
      case 7: // 0 key
        if (selectedItem) {
          setSelectedItem(null);
        } else {
          toMain();
        }
        break;
      case 66: //KEYCODE_ENTER
        if (selectedItem) {
          setSelectedItem(null);
        } else {
          toMain();
        }
        break;
      case 4: //KEYCODE_BACK
        if (selectedItem) {
          setSelectedItem(null);
        } else {
          toMain();
        }
        break;
      case 111: //KEYCODE_ESCAPE
        if (selectedItem) {
          setSelectedItem(null);
        } else {
          toMain();
        }
        break;
    }
    setShowBorder(true);
  };

  KeyEvent.removeKeyUpListener();
  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVFunction(keyEvent.keyCode);
  });

  useEffect(() => {
    if (machines[0] && machines[0].machineId && selectedID === 0) {
      setSelectedID(machines[0].machineId);
    }
    rerender(false);
  }, [machines]);

  useEffect(() => {
    Dimensions.removeEventListener('change', rerender);
    Dimensions.addEventListener('change', rerender);
  }, [minimumTileSize, machines]);

  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    setTimeout(() => {
      KeyEvent.removeKeyUpListener();
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVFunction(keyEvent.keyCode);
      });
    }, 300);
    (async () => {
      await getTiles(componentId, isDemo);
      await negotiate();
    })();

    setTimeout(
      async () => {
        setInitialLoading(false);
        let SS = moment().format('ss');
        intervalId = setInterval(() => {
          if (SS !== moment().format('ss')) {
            SS = moment().format('ss');
            // forceUpdate();
            updateTilesInfo();
          }
        }, 1000);

        IdleTimerManager.setIdleTimerDisabled(true);
      },
      isTV || window.isTV ? (minimumTileSize === 1 ? 10000 : 7000) : 3000,
    );

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      console.log('destroy');
      backHandler.remove();
      clearTiles();
      negotiateClose();
      setSelectedItem(null);
      clearInterval(intervalId);
      IdleTimerManager.setIdleTimerDisabled(false);
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  if (!machinesLoaded || counting) {
    return <Loading />;
  }

  // const data = [
  //   {
  //     id: 54,
  //     status: 'Not Productive',
  //     machineName: 'Bridgeport GX-1600',
  //     issueWithOperator: true,
  //   },
  //   {
  //     id: 8,
  //     status: 'Not Productive',
  //     issue: true,
  //     machineName: 'Bridgeport GX-1600',
  //   },
  //   {
  //     id: 5,
  //     status: 'Not Productive',
  //     machineName: 'Bridgeport GX-1600',
  //     issueWithOperator: true,
  //     ownerName: 'Colin Davis',
  //   },
  //   {
  //     id: 6,
  //     status: 'Active',
  //     ownerName: 'Jim Riley',
  //     machineName: 'Hedelius T7-2600',
  //     noInfo: true,
  //   },
  // ];

  const {oversize, fixOversize} = countOffset(format);

  const findIY = (id) => {
    for (let i = 0; i < realCountHeight; i++) {
      for (let y = 0; y < tileCountWidth; y++) {
        if (id === sortedData[i][y].id) {
          return {i, y};
        }
      }
    }
  };

  const findItem = (id) => {
    for (let i = 0; i < realCountHeight; i++) {
      for (let y = 0; y < tileCountWidth; y++) {
        if (id === sortedData[i][y].id) {
          return sortedData[i][y];
        }
      }
    }
  };

  const detailsRight = () => {
    const {i, y} = findIY(selectedItem);

    if (sortedData[i][y + 1]) {
      setSelectedItem(sortedData[i][y + 1].id);
      return;
    }
    if (sortedData[i + 1] && sortedData[i + 1][0]) {
      setSelectedItem(sortedData[i + 1][0].id);
      return;
    }
    setSelectedItem(sortedData[0][0].id);
  };

  const detailsLeft = () => {
    const {i, y} = findIY(selectedItem);

    if (sortedData[i] && sortedData[i][y - 1]) {
      setSelectedItem({i, y: y - 1});
      setSelectedItem(sortedData[i][y - 1].id);
      return;
    }
    if (sortedData[i - 1] && sortedData[i - 1][sortedData[i - 1].length - 1]) {
      setSelectedItem(sortedData[i - 1][sortedData[i - 1].length - 1].id);

      return;
    }
    setSelectedItem(
      sortedData[sortedData.length - 1][
        sortedData[sortedData.length - 1].length - 1
      ].id,
    );
  };

  const showBack = () => {
    setShowHeader(!showHeader);
  };
  if (!machinesLoaded) {
    return <Loading />;
  }

  // if (machines.length === 0) {
  //   navigateTo(componentId, 'NoMachines');
  // }

  return [
    <TouchableWithoutFeedback
      onPress={() => {
        showBack();
      }}
      key="listWrapper">
      <IPhoneXWrapper bg={Colors('wallboardBackground')}>
        <TouchableWithoutFeedback
          onPress={() => {
            showBack();
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              paddingLeft: edgeSpacingLeft,
              paddingTop: edgeSpacingTop,
              backgroundColor: Colors('wallboardBackground'),
            }}>
            <ScrollView>
              {sortedData.map((lineItems, ind) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    showBack();
                  }}>
                  <View
                    style={[
                      styles.container,
                      {
                        marginBottom: verticalInbetweenspacing,
                        backgroundColor: Colors('wallboardBackground'),
                      },
                    ]}
                    key={`top-${ind}`}>
                    {lineItems.map((item, index) => [
                      !item ? (
                        <View key={`${index} -unknown`} />
                      ) : (
                        <DoubleClick
                          singleTap={() => {
                            showBack();
                          }}
                          doubleTap={() => {
                            setSelectedItem(item.id);
                          }}
                          delay={200}
                          key={`item-${index}`}>
                          <View
                            style={{
                              borderWidth: scale(
                                item.id === selectedID &&
                                  (isTV || window.isTV) &&
                                  showBorder
                                  ? 1.32597
                                  : 0,
                              ),
                              borderColor: '#006FF5',
                              width: tileWidthRoundedDown,
                              height: tileHeightRoundedDown,
                              borderRadius: scale(6),
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              zIndex: 100,
                              opacity: item.isEmpty ? 0 : 1,
                            }}
                          />
                          <ItemWrapper
                            {...{
                              setSelectedItem,
                              time,
                              Colors,
                              item,
                              format,
                              fixOversize,
                              oversize,
                              selectedID,
                            }}
                          />
                        </DoubleClick>
                      ),
                    ])}
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </IPhoneXWrapper>
    </TouchableWithoutFeedback>,
    selectedItem && (
      <View
        key="machineDetails"
        style={{
          position: 'absolute',
          zIndex: 100,
          width: '100%',
          height: '100%',
        }}>
        <MachineDetails
          {...{
            item: findItem(selectedItem),
            close: () => {
              setSelectedItem(null);
            },
            detailsRight,
            detailsLeft,
            time,
          }}
        />
      </View>
    ),
    <BackHeader {...{showHeader, toMain}} key="BackHeader" />,
    initialLoading && (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 1,
          zIndex: 1000,
          width: '100%',
          height: '100%',
        }}>
        <Loading />
      </View>
    ),
  ];
};
const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps, {
  getTiles,
  clearTiles,
  updateTilesInfo,
  negotiate,
  t,
  negotiateClose,
})(ColorsWrapper(List));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
