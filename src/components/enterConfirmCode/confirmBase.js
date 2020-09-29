import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  BackHandler,
} from 'react-native';
import ColorsWrapper from '../../../colors';
import {connect} from 'react-redux';
import KeyEvent from 'react-native-keyevent';
import {useNavigationComponentDidAppear} from 'react-native-navigation-hooks';
import {isIphoneX} from 'react-native-device-detection';

import {font, navigateTo, navigateBack, trigerRotation} from '../../../helpers';

import NumPad from './numPad';

import Logo from '../../../ios/asset/icons/logo.svg';
import {t} from '../../../reducers/language';
import {enterConfirmCode, initConfirmCode} from '../../../reducers/user';

let borderId;

const ListBase = ({
  Colors,
  t,
  format,
  header,
  navigation,
  enterConfirmCode,
  initConfirmCode,
  componentId,
}) => {
  const {scale, isTV, isPortrail, isIOS} = format;
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedNumKey, setSelectedNumKey] = useState(' ');
  const [selectedNumPosition, setSelectedNumPosition] = useState({x: 0, y: 0});
  const [selectedKey, setSelectedKey] = useState(0);
  const [selectedArea, setSelectedArea] = useState('number');
  const [codes, setCodes] = useState(['', '', '', '', '', '', '', '', '']);
  const [isBorder, setShowBorder] = useState(false);

  const numPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['back', 0, 'done'],
  ];

  useEffect(() => {
    (async () => {
      await initConfirmCode();
    })();
  }, []);

  useEffect(() => {
    setSelectedNumKey(numPad[selectedNumPosition.x][selectedNumPosition.y]);
  }, [selectedNumPosition]);

  const [selectedCode, setSelectedCode] = useState(0);

  const actions = [
    {
      name: t('main_menu', 'Main menu'),
      key: 0,
      action: () => navigateBack(componentId),
    },
    {
      name: t(
        'change_language',
        'Change language / Sprache wechseln / Verander taal',
      ),
      key: 6,
      action: () => navigateTo(componentId, 'ChangeLanguage'),
    },
  ];

  if (isTV || window.isTV) {
    actions.push({
      name: t('rotate_screen', 'Rotate screen'),
      key: 7,
      action: () => trigerRotation(),
    });
  }

  const backendRequest = async (newCode) => {
    await enterConfirmCode(newCode.join(''), componentId, setCodes);
  };

  const trigerKey = (c) => {
    const newCode = [...codes];
    newCode[selectedCode] = c;
    setCodes(newCode);
    if (selectedCode === codes.length - 1) {
      backendRequest(newCode);
      setSelectedArea('nav');
      setSelectedCode(null);
    } else {
      setSelectedCode(selectedCode + 1);
    }
  };

  const enterCode = (code) => {
    const newCode = [...codes];
    newCode[selectedCode] = code;
    setCodes(newCode);
    if (selectedCode === codes.length - 1) {
      backendRequest(newCode);
      setShowKeyboard(false);
      setSelectedArea('nav');
      setSelectedCode(null);
    } else {
      setSelectedCode(selectedCode + 1);
    }
  };
  const removeCode = () => {
    const newCode = [...codes];
    newCode[selectedCode] = '';
    setCodes(newCode);
    if (selectedCode !== 0) {
      setSelectedCode(selectedCode - 1);
    }
  };

  const initKeyboard = () => {
    setSelectedArea('key');
    setSelectedNumKey(1);
    setShowKeyboard(true);
    setSelectedNumPosition({x: 0, y: 0});
  };

  const trigerNumPad = (key) => {
    if (typeof key === 'number') {
      enterCode(key);
      return;
    }
    if (key === 'back') {
      removeCode();
      return;
    }
    if (key === 'done') {
      setSelectedArea('number');
      setShowKeyboard(false);
      return;
    }
  };
  const TVEventHandler = async (key) => {
    const okay = () => {
      if (borderId) {
        clearInterval(borderId);
      }
      setShowBorder(true);

      const i = setTimeout(() => {
        setShowBorder(false);
      }, 300);
      borderId = i;

      if (showKeyboard) {
        trigerNumPad(selectedNumKey);
        return;
      }
      if (selectedArea === 'number') {
        initKeyboard();
        return;
      }
      if (actions[selectedKey] && actions[selectedKey].action) {
        actions[selectedKey].action();
      }
    };

    window.isTV = true;
    actions.forEach((item, index) => {
      if (item.key === Number(key) - 7) {
        setSelectedKey(index);
      }
    });
    if (showKeyboard && key >= 7 && key <= 16) {
      trigerKey(key - 7);
      return;
    }
    switch (Number(key)) {
      //  add right left nav + add 0,6,7 number and also add number to confirm code page
      case 7: // 0 back key
        navigateBack(componentId);
        break;
      case 8: // 1 back key
        trigerKey(1);
        break;
      case 9: // 2 back key
        trigerKey(2);
        break;
      case 10: // 3 back key
        trigerKey(3);
        break;
      case 11: // 4 back key
        trigerKey(4);
        break;
      case 12: // 5 back key
        trigerKey(5);
        break;
      case 15: // 8 back key
        trigerKey(8);
        break;
      case 16: // 9 back key
        trigerKey(9);
        break;
      case 13: // 6 key
        navigateTo(componentId, 'ChangeLanguage');
        break;
      case 14: // 7 key
        trigerRotation();
        break;
      case 21: // left
        if (showKeyboard) {
          if (selectedNumPosition.y !== 0) {
            setSelectedNumPosition({
              ...selectedNumPosition,
              y: selectedNumPosition.y - 1,
            });
          } else {
            setSelectedNumPosition({
              ...selectedNumPosition,
              y: 2,
            });
          }
          return;
        }
        if (selectedArea !== 'number' || selectedCode === 0) {
          return;
        }
        setSelectedCode(selectedCode - 1);
        return;
      case 22: // rigth
        if (showKeyboard) {
          if (selectedNumPosition.y !== 2) {
            setSelectedNumPosition({
              ...selectedNumPosition,
              y: selectedNumPosition.y + 1,
            });
          } else {
            setSelectedNumPosition({
              ...selectedNumPosition,
              y: 0,
            });
          }
          return;
        }

        if (selectedArea !== 'number' || selectedCode === 8) {
          return;
        }
        if (codes[selectedCode] !== '') {
          setSelectedCode(selectedCode + 1);
        }

        return;
      case 19: {
        if (showKeyboard) {
          if (selectedNumPosition.x === 0) {
            setSelectedArea('number');
            setSelectedNumKey(' ');
            setShowKeyboard(false);
            return;
          } else {
            setSelectedNumPosition({
              ...selectedNumPosition,
              x: selectedNumPosition.x - 1,
            });
            return;
          }
        }
        // UP
        if (selectedArea === 'number') {
          return;
        }
        if (selectedKey === 0) {
          setSelectedArea('number');
          setSelectedCode(0);
          return;
        } else {
          setSelectedKey(selectedKey - 1);
          return;
        }
      }
      case 20: {
        // down
        if (showKeyboard) {
          if (selectedNumPosition.x !== 3) {
            setSelectedNumPosition({
              ...selectedNumPosition,
              x: selectedNumPosition.x + 1,
            });
          }
          return;
        }

        if (selectedArea === 'nav' && selectedKey === actions.length - 1) {
          return;
        }
        if (selectedArea === 'number') {
          setSelectedArea('nav');
          setSelectedKey(0);
          return;
        }
        setSelectedKey(selectedKey + 1);
        return;
      }
      case 23: // okay
        okay();
        break;
      case 66: //KEYCODE_ENTER
        okay();
        break;
      case 4: //KEYCODE_BACK
        navigateBack(componentId);
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

  useNavigationComponentDidAppear(
    (e) => {
      setTimeout(() => {
        KeyEvent.onKeyUpListener((keyEvent) => {
          console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
          TVEventHandler(keyEvent.keyCode);
        });
      }, 300);
    },
    {componentId},
  );
  useEffect(() => {
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 1000);
    KeyEvent.onKeyUpListener((keyEvent) => {
      console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
      TVEventHandler(keyEvent.keyCode);
    });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      backHandler.remove();
    };
  }, []);
  const selectCode = (index) => {
    initKeyboard();
    setSelectedCode(index);
  };

  const lineText = {
    color: Colors('label'),
    fontSize: scale(12, false),
    letterSpacing: scale(0.1, false),
    ...font.medium,
  };

  return (
    <View
      style={{
        backgroundColor: Colors('menuBackground'),
        flex: 1,
        paddingTop: scale(isPortrail ? 0 : 21),
        flexDirection: 'column',
      }}>
      <View
        style={{
          position: 'absolute',
          top: scale(isIphoneX && isPortrail ? 80 : 20),
          left: scale(isIphoneX && !isPortrail ? 80 : 20),
        }}>
        <Logo width={scale(52)} height={scale(18)} />
      </View>
      <View
        style={{
          height: '100%',
          justifyContent: 'space-between',
          //   justifyContent: isPortrail ? 'center' : 'flex-start',
        }}>
        <View
          style={{
            justifyContent: isPortrail ? 'center' : 'flex-start',
            height: isPortrail ? '70%' : '57.5%',
            paddingLeft: scale(isPortrail ? 30 : 20),
          }}>
          <Text
            style={{
              color: Colors('label'),
              fontSize: scale(18.8, false),
              textTransform: 'uppercase',
              letterSpacing: scale(0.7, false),
              marginLeft: isPortrail ? 0 : '15.5%',
              ...font.black,
            }}>
            {header}
          </Text>
          <View
            style={{
              //   height: '100%',
              marginLeft: isPortrail ? 0 : '15%',
              marginTop: scale(isPortrail ? 21 : isTV ? 10 : 19),
              paddingLeft: scale(2),
            }}>
            <Text style={{...lineText}}>
              {t(
                'use_anouther_activated',
                '1. Use another device that is already activated',
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: scale(isPortrail ? 20 : isTV ? 10 : 15),
                alignItems: 'center',
              }}>
              <Text style={{...lineText}}>
                {t(
                  'on_other_go_to_settings',
                  '2. On this other device, go to Settings and click',
                )}
              </Text>
              <View
                style={{
                  backgroundColor: Colors('label'),
                  width: scale(50),
                  height: scale(15),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: scale(7.5),
                  marginLeft: scale(8),
                }}>
                <Text
                  style={{
                    color: Colors('invertedLabel'),
                    fontSize: scale(6),
                    ...font.medium,
                  }}>
                  {t('add_device', 'Add device')}
                </Text>
              </View>
            </View>
            <Text
              style={{
                ...lineText,
                marginTop: scale(isPortrail ? 20 : isTV ? 10 : 13),
              }}>
              {t(
                'enter_code_other_device',
                '3. Enter the code that is visible on this other device:',
              )}
            </Text>
            <View style={{marginTop: scale(13)}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: scale(315),
                  height: scale(31),
                }}>
                {codes.map((item, index) => (
                  <TouchableWithoutFeedback onPress={() => selectCode(index)}>
                    <View
                      style={[
                        {
                          backgroundColor: Colors('fieldBackground'),
                          width: scale(30),
                          height: scale(30),
                          marginRight: scale(3.7, false),
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                        (index + 1) % 3 === 0 && {
                          marginRight: scale(12, false),
                        },
                        selectedCode === index &&
                          selectedArea !== 'nav' && {
                            borderBottomColor: Colors('secondaryLabel'),
                            borderBottomWidth: scale(1.4, false),
                          },
                      ]}>
                      <Text
                        style={{
                          color: Colors('label'),
                          fontSize: scale(24),
                          paddingTop: scale(1.4, false),
                          ...font.normal,
                        }}>
                        {item}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </View>
            <View
              style={{
                marginLeft: scale(68),
                marginTop: scale(10),
              }}
            />
            <Text style={{...lineText, marginTop: scale(5)}}>
              4. {t('ready', 'Ready')}!
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors('otheroptionsBackground'),
            borderTopWidth: scale(0.5),
            borderTopColor: Colors('Hairline'),
            width: '100%',
            paddingBottom: scale(showKeyboard ? 0 : 20),
            height: isPortrail ? '30%' : isIOS ? '42.5%' : '41%',
            paddingLeft: isPortrail ? 0 : '15.5%',
            paddingRight: isPortrail ? 0 : '15.5%',
          }}>
          {showKeyboard ? (
            <NumPad selectedKey={selectedNumKey} onSelect={trigerNumPad} />
          ) : (
            <View
              style={{
                paddingLeft: scale(isPortrail ? 30 : 12),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: scale(4),
                  marginTop: scale(14),
                  marginBottom: scale(9),
                }}>
                <Text
                  style={{
                    color: Colors('label'),
                    fontSize: scale(14),
                    letterSpacing: scale(0.7, false),
                    ...font.bold,
                  }}>
                  {t('other_options', 'Other options')}
                </Text>
                <Text
                  style={{
                    color: Colors('secondaryLabel'),
                    fontSize: scale(10),
                    marginLeft: scale(6),
                    ...font.normal,
                  }}>
                  (
                  {t(
                    'use_remote_tv',
                    'you can use the remote of your Smart TV',
                  )}
                  )
                </Text>
              </View>
              {console.log(isTV || window.isTV, 'isTV || window.isTV')}
              {actions.map((item, index) => (
                <TouchableWithoutFeedback
                  key={`menu-item-${item.key}`}
                  onPress={() => {
                    if (item.action) {
                      item.action();
                    }
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: scale(1.5, false),
                      paddingBottom: scale(5, false),
                      paddingTop: scale(5, false),
                      paddingLeft: scale(5, false),
                      width: scale(350),
                      opacity:
                        isBorder &&
                        index === selectedKey &&
                        (isTV || window.isTV) &&
                        selectedArea === 'nav'
                          ? 0.5
                          : 1,
                      backgroundColor:
                        index === selectedKey &&
                        (isTV || window.isTV) &&
                        selectedArea === 'nav'
                          ? Colors('Hairline')
                          : Colors('otheroptionsBackground'),
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors('secondaryLabel'),
                        width: scale(20),
                        height: scale(20),
                        borderRadius: scale(20) / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#4A4A4A',
                        shadowOffset: {
                          width: 0,
                          height: scale(2),
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: scale(1),
                        elevation: 2,
                        marginRight: scale(8, false),
                      }}>
                      <Text
                        style={{
                          color: Colors('invertedLabel'),
                          fontSize: scale(12, false),
                          ...font.normal,
                        }}>
                        {item.key}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: Colors('label'),
                        fontSize: scale(10, false),
                        letterSpacing: scale(0.55, false),
                        ...font.medium,
                      }}>
                      {item.name}{' '}
                      {item.current && (
                        <Text
                          style={{
                            color: Colors('secondaryLabel'),
                            fontSize: scale(8),
                            ...font.normal,
                          }}>
                          ({t('currently_selected', 'Currently selected')})
                        </Text>
                      )}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default connect(null, {t, enterConfirmCode, initConfirmCode})(
  ColorsWrapper(ListBase),
);
