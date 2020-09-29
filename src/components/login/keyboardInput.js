import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import {connect} from 'react-redux';
import {isIphoneX} from 'react-native-device-detection';

import {font} from '../../../helpers';

import Logo from '../../../ios/asset/icons/logo.svg';

import ColorsWrapper from '../../../colors';
import {t} from '../../../reducers/language';

const KeyboardInput = ({
  Colors,
  format,
  name,
  header,
  onBack,
  onSubmit,
  userData,
  isLoading,
  navigation,
  t,
}) => {
  const {scale, isTV, isPortrail} = format;
  const [input, inputSet] = useState(userData);
  const [inputRef, setInputRef] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState('input');

  const _keyboardDidHide = () => {
    if (inputRef && isTV && window.isTV) {
      inputRef.blur();
    }
    setSelectedBtn('next');
  };

  const _keyboardDidShow = () => {
    setSelectedBtn('input');
  };

  const TVHandler = (key) => {
    switch (Number(key)) {
      case 19: // UP
        setSelectedBtn('input');
        break;
      case 20: // down
        setSelectedBtn('next');
        break;
      case 21: // left
        setSelectedBtn('back');
        break;
      case 22: // rigth
        setSelectedBtn('next');
        break;
      case 23: // okay
        switch (selectedBtn) {
          case 'input':
            inputRef.focus();
            break;
          case 'back':
            onBack();
            break;
          case 'next':
            onSubmit(input);
            break;
        }
        break;
      case 66: //KEYCODE_ENTER
        switch (selectedBtn) {
          case 'input':
            inputRef.focus();
            break;
          case 'back':
            if (inputRef && isTV && window.isTV) {
              inputRef.blur();
            }
            onBack();
            break;
          case 'next':
            onSubmit(input);
            break;
        }
        break;
      case 4: //KEYCODE_BACK
        if (inputRef && isTV && window.isTV) {
          console.log('blur');
          inputRef.blur();
        }
        onBack();
        break;
      case 111: //KEYCODE_ESCAPE
        if (inputRef && isTV && window.isTV) {
          console.log('blur');
          inputRef.blur();
        }
        onBack();
        break;
    }
  };
  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVHandler(keyEvent.keyCode);
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVHandler(keyEvent.keyCode);
      });
    }, 10);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      backHandler.remove();
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [selectedBtn, inputRef, input]);

  return (
    <View
      style={{
        backgroundColor: Colors('menuBackground'),
        flex: 1,
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          top: scale(isIphoneX && isPortrail ? 80 : 20),
          left: scale(isIphoneX && !isPortrail ? 80 : 20),
        }}>
        <Logo width={scale(52)} height={scale(18)} />
      </View>
      {isLoading ? (
        <View
          style={{
            flexDirection: 'row',
            height: '50%',
            width: scale(300),
            paddingTop: scale(20),
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#777777" />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            height: '100%',
            width: scale(300),
            paddingTop: scale(isPortrail ? 0 : 20),
            justifyContent: isPortrail ? 'center' : 'flex-start',
          }}>
          <View
            style={{
              marginTop: scale(isPortrail ? -50 : 0.5, false),
              justifyContent: isPortrail ? 'center' : 'flex-start',
            }}>
            <Text
              style={{
                color: Colors('label'),
                fontSize: scale(18.8, false),
                textTransform: 'uppercase',
                letterSpacing: scale(0.7, false),
                ...font.black,
              }}>
              {header}
            </Text>
            <View
              style={{
                marginTop: scale(16, false),
              }}>
              <Text
                style={{
                  color: Colors('secondaryLabel'),
                  fontSize: scale(11.66),
                  ...font.medium,
                }}>
                {name}
              </Text>
              <TextInput
                style={[
                  {
                    width: scale(300),
                    // height: 50,
                    paddingTop: scale(5),
                    paddingBottom: scale(5),
                    backgroundColor: Colors('fieldBackground'),
                    borderBottomColor: Colors('secondaryLabel'),
                    borderBottomWidth: scale(1),
                    color: Colors('label'),
                    borderColor: Colors('secondaryLabel'),
                    fontSize: scale(16),
                  },
                  (isTV || window.isTV) && {
                    borderWidth: selectedBtn === 'input' ? scale(1) : 0,
                    borderRadius: scale(3),
                  },
                ]}
                ref={(ref) => {
                  setInputRef(ref);
                }}
                onChangeText={(text) =>
                  name === t('password', 'Password')
                    ? inputSet(text)
                    : inputSet(text.replace(/\s/g, ''))
                }
                autoFocus={true}
                autoCapitalize="none"
                autoCompleteType={
                  name === t('password', 'Password') ? 'password' : 'username'
                }
                textContentType={
                  name === t('password', 'Password') ? 'password' : 'username'
                }
                onEndEditing={() => console.log('onEndEditing')}
                onSubmitEditing={() => onSubmit(input)}
                value={input}
                showSoftInputOnFocus={true}
                secureTextEntry={name === t('password', 'Password')}
                keyboardType={'default'}
              />
            </View>
            <View
              style={{
                marginTop: scale(20),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableWithoutFeedback onPress={onBack}>
                <View
                  style={[
                    {
                      width: scale(60),
                      height: scale(25),
                      backgroundColor: Colors('secondaryLabel'),
                      marginTop: scale(8),
                      borderRadius: scale(9.5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    (isTV || window.isTV) && {
                      opacity: selectedBtn === 'back' ? 1 : 0.6,
                    },
                  ]}>
                  <Text
                    style={{
                      color: Colors('invertedLabel'),
                      fontSize: scale(10, false),
                      ...font.medium,
                    }}>
                    {t('back', 'Back')}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => onSubmit(input)}>
                <View
                  style={[
                    {
                      width: scale(60),
                      height: scale(25),
                      backgroundColor: Colors('secondaryLabel'),
                      marginTop: scale(8),
                      borderRadius: scale(9.5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    (isTV || window.isTV) && {
                      opacity: selectedBtn === 'next' ? 1 : 0.6,
                    },
                  ]}>
                  <Text
                    style={{
                      color: Colors('invertedLabel'),
                      fontSize: scale(10, false),
                      ...font.medium,
                    }}>
                    {t('next', 'Next')}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default connect(null, {t})(ColorsWrapper(KeyboardInput));
