/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {useNavigationComponentDidAppear} from 'react-native-navigation-hooks';
import {Navigation} from 'react-native-navigation';

import {countFormat, navigateBack, navigateTo} from '../../../helpers';
import ColorsWrapper from '../../../colors';

import KeyboardInput from './keyboardInput';
import {t} from '../../../reducers/language';

import {userLogin} from '../../../reducers/user';

const MainMenu = ({Colors, navigation, userLogin, t, componentId}) => {
  const [format, setFormat] = useState(countFormat());
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [step, setStep] = useState('email');
  const rerender = () => setFormat(countFormat());

  useNavigationComponentDidAppear(
    (e) => {
      setLoading(false);
      setStep('email');
      setUserData({
        email: '',
        password: '',
      });
    },
    {componentId},
  );

  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    return () => {
      console.log('destroy');
      setLoading(false);
      setStep('email');
      setUserData({
        email: '',
        password: '',
      });
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  return step === 'email' ? (
    <KeyboardInput
      {...{
        format,
        isLoading,
        header: t('activate_wallboard', 'Activate Wallboard'),
        navigation,
        name: t('email_capital', 'Email'),
        userData: userData.email,
        onBack: () => Navigation.popToRoot(componentId),
        onSubmit: (value) => {
          setUserData({
            ...userData,
            email: value,
          });
          setStep('password');
        },
      }}
      key="email"
    />
  ) : (
    <KeyboardInput
      {...{
        format,
        header: t('activate_wallboard', 'Activate Wallboard'),
        navigation,
        name: t('password', 'Password'),
        userData: userData.password,
        isLoading,
        onBack: () => {
          setStep('email');
        },
        onSubmit: async (value) => {
          setLoading(true);
          await userLogin(
            {
              email: userData.email,
              password: value,
            },
            () => navigateTo(componentId, 'App'),
            () => {
              setUserData({
                ...userData,
                password: value,
              });
              setLoading(false);
            },
          );
        },
      }}
      key="password"
    />
  );
};

export default connect(null, {t, userLogin})(ColorsWrapper(MainMenu));
