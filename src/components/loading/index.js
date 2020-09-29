import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import ColorsWrapper from '../../../colors';

const Loading = ({Colors}) => {
  return (
    <View
      style={[styles.loadingBox, {backgroundColor: Colors('menuBackground')}]}>
      <ActivityIndicator size="large" color="#777777" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default ColorsWrapper(Loading);
