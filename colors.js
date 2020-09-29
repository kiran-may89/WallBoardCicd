import React, {useState} from 'react';
import {useColorScheme, AsyncStorage, Platform} from 'react-native';

const colors = [
  {name: 'label [light]', value: '#333333'},
  {name: 'secondaryLabel [light]', value: '#484848'},
  {name: 'Hairline [light]', value: '#B2B2B2'},
  {name: 'wallboardBackground [light]', value: '#E2E3E4'},
  {name: 'menuBackground [light]', value: '#E2E3E4'},
  {name: 'invertedLabel [light]', value: '#FFFFFF'},
  {name: 'tileBackground [light]', value: '#FFFFFF'},
  {name: 'fieldBackground [light]', value: '#FFFFFF'},
  {name: 'warningLabel [light]', value: '#FF3B30'},
  {name: 'activeHeader [light]', value: '#34C759'},
  {name: 'stoppedHeader [light]', value: '#0071A4'},
  {name: 'setupHeader [light]', value: '#AF52DE'},
  {name: 'notproductiveHeader [light]', value: '#323232'},
  {name: 'wallboardBackground [dark]', value: '#000000'},
  {name: 'label [dark]', value: '#FFFFFF'},
  {name: 'secondaryLabel [dark]', value: '#CACACA'},
  {name: 'bigNavigation [light]', value: '#CACACA'},
  {name: 'bigNavigation [dark]', value: '#CACACA'},
  {name: 'Hairline [dark]', value: '#363636'},
  {name: 'invertedLabel [dark]', value: '#000000'},
  {name: 'fieldBackground [dark]', value: '#3C3C3C'},
  {name: 'warningLabel [dark]', value: '#FF4544'},
  {name: 'activeHeader [dark]', value: '#458746'},
  {name: 'stoppedHeader [dark]', value: '#5AC8FA'},
  {name: 'setupHeader [dark]', value: '#BF5AF2'},
  {name: 'notproductiveHeader [dark]', value: '#505050'},
  {name: 'tileBackground [dark]', value: '#2D2D2D'},
  {name: 'headerLabel [light]', value: '#FFFFFF'},
  {name: 'headerLabel [dark]', value: '#FFFFFF'},
  {name: 'chartBackground [light]', value: '#EEEEEE'},
  {name: 'chartBackground [dark]', value: '#505050'},
  {name: 'tilenotproductiveBackground [light]', value: '#C2C2C2'},
  {name: 'tilenotproductiveBackground [dark]', value: '#1B1B1B'},
  {name: 'warningBackground [light]', value: '#CCFF3B30'},
  {name: 'warningBackground [dark]', value: '#B2FF4544'},
  {name: 'tertiaryLabel [light]', value: '#4C3C3C43'},
  {name: 'tertiaryLabel [dark]', value: '#26FFFFFF'},
  {name: 'menuBackground [dark]', value: '#141414'},
  {name: 'otheroptionsBackground [light]', value: '#D8D9DA'},
  {name: 'otheroptionsBackground [dark]', value: '#000000'},
];

const convertedColors = {};

colors.forEach((item) => {
  convertedColors[item.name] = item.value;
});

let isCustom = false;
(async () => {
  isCustom = await AsyncStorage.getItem('scheme');
})();

export default (OriginalComponent) => {
  return (props) => {
    const scheme = useColorScheme();
    const [custom, setCustome] = useState(isCustom);
    (async () => {
      const c = await AsyncStorage.getItem('scheme');
      setCustome(c);
    })();
    const updateCustom = async (value) => {
      await AsyncStorage.setItem('scheme', value);
      setCustome(value);
      isCustom = value;
    };

    const currentScheme =
      custom !== 'system' && custom
        ? custom
        : scheme === null || Platform.isTV
        ? 'dark'
        : scheme;

    const Colors = (name) => {
      return hexToRgba(convertedColors[`${name} [${currentScheme}]`]);
    };
    Colors.scheme = currentScheme;

    return (
      <OriginalComponent
        {...{
          ...props,
          Colors,
          ColorsData: {updateCustom, custom},
        }}
      />
    );
  };
};

var hexToRgba = function (hex) {
  var r, g, b, a;
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
  } else if (hex.length === 4) {
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
    a = hex.charAt(3);
  } else if (hex.length === 6) {
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
  } else if (hex.length === 8) {
    a = hex.substring(0, 2);
    r = hex.substring(2, 4);
    g = hex.substring(4, 6);
    b = hex.substring(6, 8);
  } else {
    return '';
  }
  if (typeof a === 'undefined') {
    a = 'ff';
  }
  if (r.length === 1) {
    r += r;
  }
  if (g.length === 1) {
    g += g;
  }
  if (b.length === 1) {
    b += b;
  }
  if (a.length === 1) {
    a += a;
  }
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  a = (parseInt(a, 16) / 255).toFixed(2);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};
