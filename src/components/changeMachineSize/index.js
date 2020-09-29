import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import {connect} from 'react-redux';
import {countFormat, navigateBack} from '../../../helpers';

import {t} from '../../../reducers/language';

import ListBase from '../mainMenu/listBase';

import {updateTiles} from '../../../reducers/user';
let borderId;
const MainMenu = ({
  navigation,
  t,
  componentId,
  updateTiles,
  user: {minimumTileSize},
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
        updateTiles(4);
        break;
      case 9: // 2 key
        updateTiles(3);
        break;
      case 10: // 3 key
        updateTiles(2);
        break;
      case 11: // 4 key
        updateTiles(1);
        break;
      case 16: // 9 key
        navigateBack(componentId);
        break;
      case 19: {
        // UP
        if (selectedKey === 0) {
          setSelectedKey(4);
        } else {
          setSelectedKey(selectedKey - 1);
        }

        break;
      }
      case 20: {
        // down
        if (selectedKey === 4) {
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
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 300);
    Dimensions.addEventListener('change', rerender);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const actions = [
    {
      name: t('extra_large', 'Extra large'),
      key: 1,
      current: minimumTileSize === 4,
      action: () => updateTiles(4),
    },
    {
      name: t('large', 'Large'),
      key: 2,
      current: minimumTileSize === 3,
      action: () => updateTiles(3),
    },
    {
      name: t('standard', 'Standard'),
      key: 3,
      current: minimumTileSize === 2,
      action: () => updateTiles(2),
    },
    {
      name: t('small', 'Small'),
      key: 4,
      current: minimumTileSize === 1,
      action: () => updateTiles(1),
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
        format,
        list: actions,
        selectedKey,
        isBorder,
        header: t('change_tile_size', 'Change minimum machine tile size'),
      }}
    />
  );
};

const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps, {t, updateTiles})(MainMenu);
