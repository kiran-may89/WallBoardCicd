import React, {useState, useEffect} from 'react';
import {Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';

import {countFormat} from '../../../helpers';
import ColorsWrapper from '../../../colors';
import Loading from '../loading';
import ConfirmBase from './confirmBase';
import {t, updateLanguage} from '../../../reducers/language';

const Language = ({navigation, t, componentId, enteringCode}) => {
  const [format, setFormat] = useState(countFormat());
  const [loading, setLoading] = useState(true);

  const rerender = () => setFormat(countFormat());
  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  if (loading || enteringCode) {
    return <Loading />;
  }

  return (
    <ConfirmBase
      {...{
        format,
        header: t('activate_wallboard', 'Activate Wallboard'),
        navigation,
        componentId,
      }}
    />
  );
};

const mapStateToProps = ({language, user: {enteringCode}}) => ({
  language,
  enteringCode,
});

export default connect(mapStateToProps, {t, updateLanguage})(
  ColorsWrapper(Language),
);
