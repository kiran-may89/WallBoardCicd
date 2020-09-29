import React from 'react';
import {Dimensions, Platform, SafeAreaView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import DeviceInfo from 'react-native-device-info';
let brand = DeviceInfo.getBrand();
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

import {isIphoneX, isPhone, isTablet} from 'react-native-device-detection';

const history = {};
const baseWidth = 120;
const baseHeight = 165;
const targetSpacingUnscaled = 6;

const countTiles = ({width, height, userTileSize, machines}) => {
  const gcd = (a, b) => {
    return b == 0 ? a : gcd(b, a % b);
  };
  const r = gcd(width, height);
  const ratioo = (width / r / (height / r)).toFixed(2);
  if (!machines) {
    const ratio = (width / r / (height / r)).toFixed(2);
    const orientation = ratio >= 1 ? 'landscape' : 'portrait';
    const minimumTileSize = 2;
    const tileSpacingAspectRatio = (165 + 6) / (120 + 6);
    const aspectInLandscape = ratio > 1 ? ratio : 1 / ratio;
    const roundDelta = Math.min(aspectInLandscape - 1.05, 0.3);
    if (orientation === 'landscape') {
      const rows = Math.max(1, 4 - minimumTileSize);
      const colUnround = rows * aspectInLandscape * tileSpacingAspectRatio;
      const col = (colUnround + roundDelta).toFixed(0);
      return {col: Number(col), rows: Number(rows)};
    } else {
      const col = Math.max(1, 5 - minimumTileSize);
      const rowUnround = (col * aspectInLandscape) / tileSpacingAspectRatio;
      const rows = (rowUnround + roundDelta).toFixed(0);
      return {col: Number(col), rows: Number(rows)};
    }
  }

  // D8 - ratio
  // H8 - aspectInLandscape
  // F8 - tileSpacingAspectRatio
  // I8 - roundDelta
  // AI6 - rows
  // C7 - machines
  // W3 - minimumTileSize
  // B8 - userTileSize

  const preCounting = (minimumTileSize) => {
    const ratio = (width / r / (height / r)).toFixed(2);
    const orientation = ratio >= 1 ? 'landscape' : 'portrait';
    const tileSpacingAspectRatio = (165 + 6) / (120 + 6);
    const aspectInLandscape = ratio > 1 ? ratio : 1 / ratio;
    const roundDelta = Math.min(aspectInLandscape - 1.05, 0.3);

    let result;
    if (orientation === 'landscape') {
      const rows = Math.max(1, 4 - minimumTileSize);
      const colUnround = rows * aspectInLandscape * tileSpacingAspectRatio;
      const col = (colUnround + roundDelta).toFixed(0);
      result = {col: Number(col), rows: Number(rows)};
    } else {
      const col = Math.max(1, 5 - minimumTileSize);
      const rowUnround = (col * aspectInLandscape) / tileSpacingAspectRatio;
      const rows = (rowUnround + roundDelta).toFixed(0);
      result = {col: Number(col), rows: Number(rows)};
    }
    const totalTiles = result.col * result.rows;

    const sizeAllowed = minimumTileSize >= userTileSize;

    // const visible = Math.min(totalTiles, machines);
    const allVisible = totalTiles >= machines;
    return {
      sizeAllowed,
      minimumTileSize,
      allVisible,
      ...result,
    };
  };

  const eLarge = preCounting(4);
  const large = preCounting(3);
  const standart = preCounting(2);
  const small = preCounting(1);

  const secondCounting = (prewSizeAllowed, data) => {
    const {allVisible, minimumTileSize} = data;
    const smallerForbidden = !(prewSizeAllowed && minimumTileSize !== 1);
    const dontTrySmaller = smallerForbidden ? true : allVisible;
    return {
      ...data,
      smallerForbidden,
      dontTrySmaller,
    };
  };

  const eLargeS = secondCounting(large.sizeAllowed, eLarge);
  const largeS = secondCounting(standart.sizeAllowed, large);
  const standartS = secondCounting(small.sizeAllowed, standart);
  const smallS = secondCounting(false, small);

  const thirdCounting = (largerNotTrueNext, useNext, data) => {
    const {sizeAllowed, dontTrySmaller} = data;
    const largerNotTrue = largerNotTrueNext && !useNext;
    const use = sizeAllowed && dontTrySmaller && largerNotTrue;
    return {
      ...data,
      largerNotTrue,
      use,
    };
  };

  const eLargeT = thirdCounting(true, false, eLargeS);
  const largeT = thirdCounting(eLargeT.largerNotTrue, eLargeT.use, largeS);
  const standartT = thirdCounting(largeT.largerNotTrue, largeT.use, standartS);
  const smallT = thirdCounting(standartT.largerNotTrue, standartT.use, smallS);

  const results = [eLargeT, largeT, standartT, smallT];
  const forUse = results.find((item) => item.use);

  return forUse;
};
// A - width
// B - height
// W - baseWidth
// H - baseHeight
// X - tileCountWidth
// Y - tileCountHeight
// S - scalingFactorInbetween
// I - targetSpacingUnscaled
// Stretched_height - tileHeightRoundedDown
export const countFormat = (minimumTileSize = 2, machines) => {
  let width = Dimensions.get(brand === 'google' ? 'screen' : 'window').width;
  let height = Dimensions.get(brand === 'google' ? 'screen' : 'window').height;

  const gcd = (a, b) => {
    return b == 0 ? a : gcd(b, a % b);
  };
  const r = gcd(width, height);

  const ratio = (width / r / (height / r)).toFixed(2);

  const keyCode = `${width}-${height}-${ratio}-${minimumTileSize}-${machines}`;
  if (history[keyCode]) {
    return history[keyCode];
  }

  const orientation = ratio >= 1 ? 'landscape' : 'portrait';

  if (isIphoneX) {
    if (orientation === 'portrait') {
      height = height - 78;
    } else {
      width = width - 88;
      height = height - 24;
    }
  }
  // const width = 1080;
  // const height = 810;
  const {col: tileCountWidth, rows: tileCountHeight} = countTiles({
    width,
    height,
    userTileSize: minimumTileSize,
    machines,
  });

  const scalingFactorInbetween = width > height ? width / 640 : width / 360;

  const tileWidthUnrounded =
    (width -
      (tileCountWidth + 1) * scalingFactorInbetween * targetSpacingUnscaled) /
    tileCountWidth;

  const tileWidthRoundedDown = Math.floor(tileWidthUnrounded);

  const horizontalUnroundedSpacing =
    (width - tileCountWidth * tileWidthRoundedDown) / (tileCountWidth + 1);
  const horizontalRoundedDownSpacing = Math.floor(horizontalUnroundedSpacing);
  const horizontalRemainingPixels = Math.round(
    (tileCountWidth + 1) *
      (horizontalUnroundedSpacing - horizontalRoundedDownSpacing),
  );

  const edgeSpacingLeft =
    horizontalRoundedDownSpacing + horizontalRemainingPixels / 2;
  const edgeSpacingRight =
    width -
    tileCountWidth * tileWidthRoundedDown -
    (tileCountWidth - 1) * horizontalRoundedDownSpacing -
    edgeSpacingLeft;

  const horizontalInbetweenSpacing = horizontalRoundedDownSpacing;

  const tileHeightRoundedDown = Math.floor(
    (height - (tileCountHeight + 1) * horizontalRoundedDownSpacing) /
      tileCountHeight,
  );

  const verticalUnroundedSpacing =
    (height - tileCountHeight * tileHeightRoundedDown) / (tileCountHeight + 1);

  const verticalRoundedDownSpacing = Math.floor(verticalUnroundedSpacing);

  const verticalRemainingPixels =
    (tileCountHeight + 1) *
    (verticalUnroundedSpacing - verticalRoundedDownSpacing);

  const edgeSpacingTop = Math.floor(
    verticalRoundedDownSpacing + verticalRemainingPixels / 2,
  );
  const edgeSpacingBottom =
    height -
    tileCountHeight * tileHeightRoundedDown -
    (tileCountHeight - 1) * verticalRoundedDownSpacing -
    edgeSpacingTop;
  const verticalInbetweenspacing = verticalRoundedDownSpacing;

  const scalingFactorTile = Math.min(
    tileWidthRoundedDown / baseWidth,
    tileHeightRoundedDown / baseHeight,
  ).toFixed(2);

  const stretchDirectionTile =
    tileWidthRoundedDown / tileHeightRoundedDown < baseWidth / baseHeight
      ? 'vertical'
      : 'horizontal';

  //   K  - tileWidthRoundedDown
  //   S  - tileHeightRoundedDown
  //   C  - baseWidth
  //   D  - baseHeight
  const lastPersentage = Math.round(
    (tileWidthRoundedDown / tileHeightRoundedDown < baseWidth / baseHeight
      ? tileHeightRoundedDown /
          ((baseHeight / baseWidth) * tileWidthRoundedDown) -
        1
      : tileWidthRoundedDown /
          ((baseWidth / baseHeight) * tileHeightRoundedDown) -
        1) * 100,
  );

  const formatScale = (value) => {
    const part = value - Math.floor(value);

    if (part < 0.5) {
      return Math.floor(value);
    }
    if (part >= 0.5) {
      return Math.floor(value) + 1;
    }
  };

  const scale = (value, round = true) =>
    round ? formatScale(value * scalingFactorTile) : value * scalingFactorTile;

  const info = {
    lastPersentage,
    stretchDirectionTile,
    scalingFactorTile,
    verticalInbetweenspacing,
    edgeSpacingBottom,
    edgeSpacingTop,
    tileWidthRoundedDown,
    tileHeightRoundedDown,
    edgeSpacingLeft,
    edgeSpacingRight,
    horizontalInbetweenSpacing,
    tileCountWidth,
    tileCountHeight,
    scale,
    forWidth: width,
    forHeight: height,
    isIOS: Platform.OS === 'ios',
    isTV: Platform.isTV,
    circleSize: 36,
    isPortrail: orientation === 'portrait',
  };

  history[keyCode] = info;

  return info;
};

export const font = {
  bold: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  normal: {
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'Roboto-Light',
    fontWeight: '300',
  },
  black: {
    fontFamily: 'Roboto-Black',
    fontWeight: '900',
  },
};

export const IPhoneXWrapper = (props) => {
  return isIphoneX ? (
    <SafeAreaView
      style={[
        {backgroundColor: props.bg, flex: 1},
        props.style ? props.style : {},
      ]}>
      {props.children}
    </SafeAreaView>
  ) : (
    props.children
  );
};

export const serialize = (obj) => {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
};

export const convertTime = (time) => {
  if (!time) {
    return '00:00:00';
  }
  const hors = Math.floor(time / 60 / 60);
  let min = Math.floor((time - hors * 60 * 60) / 60);
  let sec = time - hors * 60 * 60 - min * 60;
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${hors}:${min}:${sec}`;
};

export const convertTimeLetter = (time) => {
  if (!time) {
    return {h: '0', m: '00', s: '00'};
  }
  const hors = Math.floor(time / 60 / 60);
  let min = Math.floor((time - hors * 60 * 60) / 60);
  let sec = time - hors * 60 * 60 - min * 60;
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }

  return {h: hors, m: min, s: sec};
};

export const formatHours = (time) => {
  if (time[0] === '0') {
    return time.slice(1);
  }
  return time;
};

export const todayDateFormat = (date) => {
  if (!date) {
    return 'unknown';
  }

  const isToday = moment.utc(date).isSame(moment.utc(), 'day');
  if (isToday) {
    return `today ${moment.utc(date).local().format('HH:mm')}`;
  }
  const isYesterday = moment
    .utc(date)
    .isSame(moment.utc().subtract(1, 'day'), 'day');

  if (isYesterday) {
    return `yesterday ${moment.utc(date).local().format('HH:mm')}`;
  }

  return `${moment.utc(date).local().format('DD.MM HH:mm')}`;
};

export const navigateBack = (componentId) => {
  Navigation.pop(componentId);
};

const navBar =
  Platform.OS === 'ios'
    ? {}
    : {
        navigationBar: {
          visible: false,
        },
      };

export const navigateTo = (componentId, r, params, duration = 300) => {
  Navigation.push(componentId, {
    component: {
      name: r,
      options: {
        ...navBar,
        statusBar: {
          visible: false,
        },
        animations: {
          push: {
            waitForRender: true,
            content: {
              translationX: {
                from: require('react-native').Dimensions.get('window').width,
                to: 0,
                duration: duration,
              },
            },
          },
          pop: {
            content: {
              translationX: {
                to: require('react-native').Dimensions.get('window').width,
                from: 0,
                duration: 300,
              },
            },
          },
        },
        topBar: {
          visible: false,
          height: 0,
          _height: 0,
          drawBehind: true,
          animate: false,
        },
      },
      passProps: params,
    },
  });
};

var initial = Orientation.getInitialOrientation();

const orNames = {
  'LANDSCAPE-RIGHT': 0,
  PORTRAIT: 1,
  'LANDSCAPE-LEFT': 2,
  'PORTRAIT-UPSIDEDOWN': 3,
};

let currentOrientation = orNames[initial];

const orientationSteps = {
  0: Orientation.lockToLandscapeRight,
  1: Orientation.lockToPortrait,
  2: Orientation.lockToLandscapeLeft,
  3: Orientation.lockToPortraitUpsideDown,
};

const orientationStepsTV = {
  0: Orientation.lockToLandscapeRight, // portrail
  1: Orientation.lockToPortrait, //right-left
  2: Orientation.lockToLandscapeLeft, // portrail
  3: Orientation.lockToPortraitUpsideDown, //left-right
};

export const trigerRotation = () => {
  let newOrientation = currentOrientation === 3 ? 0 : currentOrientation + 1;
  if (newOrientation === 2 && Platform.isTV) {
    newOrientation += 1;
  }
  Platform.isTV
    ? orientationStepsTV[newOrientation]()
    : orientationSteps[newOrientation]();

  console.log(newOrientation, 'newOrientation');
  currentOrientation = newOrientation;
};
