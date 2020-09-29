import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import {connect} from 'react-redux';
import {countFormat} from '../../../helpers';
import {Navigation} from 'react-native-navigation';

import {t} from '../../../reducers/language';

import ListBase from './listBase';

import {updateTiles} from '../../../reducers/user';

let borderId;

const MainMenu = ({
  navigation,
  t,
  updateTiles,
  componentId,
  user: {minimumTileSize},
}) => {
  const [format, setFormat] = useState(countFormat());
  const [selectedKey, setSelectedKey] = useState(0);
  const rerender = () => setFormat(countFormat());
  const [isBorder, setShowBorder] = useState(false);

  const TVEventHandler = async (key) => {
    window.isTV = true;

    const okay = () => {
      if (borderId) {
        clearInterval(borderId);
      }
      setShowBorder(true);

      const i = setTimeout(() => {
        setShowBorder(false);
      }, 300);
      borderId = i;
      Navigation.popToRoot(componentId);
    };

    switch (Number(key)) {
      case 7: // 1 key
        okay();
        break;
      case 23: // okay
        okay();

        break;
      case 111: //KEYCODE_ESCAPE
        okay();
        break;
      case 66: //KEYCODE_ENTER
        okay();

        break;
    }
  };

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

  useEffect(() => {
    KeyEvent.onKeyUpListener((keyEvent) => {
      console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
      TVEventHandler(keyEvent.keyCode);
    });
  }, [selectedKey]);

  const actions = [
    {
      name: t('main_manu', 'Main menu'),
      key: 0,
      action: () => Navigation.popToRoot(componentId),
    },
  ];

  return (
    <ListBase
      {...{
        format,
        list: actions,
        selectedKey,
        header: t('no_machines_setup', 'No machines setup yet'),
        isBorder,
      }}
    />
  );
};

const mapStateToProps = ({user}) => ({user});

export default connect(mapStateToProps, {t, updateTiles})(MainMenu);
