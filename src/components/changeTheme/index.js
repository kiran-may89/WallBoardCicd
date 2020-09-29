import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import {connect} from 'react-redux';
import {countFormat, navigateBack} from '../../../helpers';
import ColorsWrapper from '../../../colors';

import {t} from '../../../reducers/language';

import ListBase from '../mainMenu/listBase';
let borderId;
const MainMenu = ({
  Colors,
  navigation,
  t,
  ColorsData: {custom, updateCustom},
  componentId,
}) => {
  const [format, setFormat] = useState(countFormat());
  const [selectedKey, setSelectedKey] = useState(0);
  const rerender = () => setFormat(countFormat());
  const [isBorder, setShowBorder] = useState(false);

  const TVEventHandler = async (key) => {
    window.isTV = true;
    actions.forEach((item, index) => {
      if (item.key === Number(key) - 7) {
        setSelectedKey(index);
      }
    });

    const okay = () => {
      if (borderId) {
        clearInterval(borderId);
      }
      setShowBorder(true);

      const i = setTimeout(() => {
        setShowBorder(false);
      }, 300);
      borderId = i;

      if (actions[selectedKey] && actions[selectedKey].action) {
        actions[selectedKey].action();
      }
    };
    switch (Number(key)) {
      case 8: // 1 key
        updateCustom('system');
        break;
      case 9: // 2 key
        updateCustom('dark');
        break;
      case 10: // 3 key
        updateCustom('light');
        break;
      case 16: // 4 key
        navigateBack(componentId);
        break;
      case 19: {
        // UP
        if (selectedKey === 0) {
          setSelectedKey(3);
        } else {
          setSelectedKey(selectedKey - 1);
        }

        break;
      }
      case 20: {
        // down
        if (selectedKey === 3) {
          setSelectedKey(0);
        } else {
          setSelectedKey(selectedKey + 1);
        }
        break;
      }
      case 23: // okay
        okay();
        break;
      case 66: //KEYCODE_ENTER
        okay();
        break;
      case 111: //KEYCODE_ESCAPE
        navigateBack(componentId);
        break;
    }
  };
  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVEventHandler(keyEvent.keyCode);
  });
  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 300);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const actions = [
    {
      name: t('follow_system_theme', 'Follow system theme'),
      key: 1,
      current: custom === 'system' || !custom,
      action: () => updateCustom('system'),
    },
    {
      name: t('always_dark_theme', 'Always dark theme'),
      key: 2,
      current: custom === 'dark',
      action: () => updateCustom('dark'),
    },
    {
      name: t('always_light_theme', 'Always light theme'),
      key: 3,
      current: custom === 'light',
      action: () => updateCustom('light'),
    },
    {
      name: t('back', 'Back'),
      key: 9,
      action: () => navigateBack(componentId),
    },
  ];

  return (
    <ListBase
      {...{
        Colors,
        format,
        list: actions,
        selectedKey,
        isBorder,
        header: t('change_theme', 'Change dark/light theme'),
      }}
    />
  );
};

export default connect(null, {t})(ColorsWrapper(MainMenu));
