import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NoDataFound = ({style}: {style?: object}) => {
  return (
    <View
      style={{
        width: '100%',
        borderWidth: 2,
        borderColor: '#C6D2E8',
        borderStyle: 'dashed',
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        ...style,
      }}>
      <Text
        style={{
          color: '#9F9EB3',
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: 15,
        }}>
        No Data Found
      </Text>
      <FontAwesome name="folder-open-o" size={50} color="#C6D2E8" />
    </View>
  );
};

export default NoDataFound;
