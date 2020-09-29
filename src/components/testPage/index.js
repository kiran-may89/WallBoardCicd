import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, Dimensions} from 'react-native';
import {countFormat, navigateBack} from '../../../helpers';

export default ({componentId}) => {
  const [format, setFormat] = useState(countFormat());

  const rerender = () => setFormat(countFormat());

  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: 'grey',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity onPress={() => navigateBack(componentId)}>
          <View
            style={{
              height: 50,
              width: 100,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text>Back</Text>
          </View>
        </TouchableOpacity>
        <View style={{width: '50%'}}>
          <Text>{JSON.stringify(format)}</Text>
        </View>
      </View>
    </View>
  );
};
