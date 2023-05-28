import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressBar = ({progress, text}: any) => {

  const WIDTH = Dimensions.get('window').width;
  return (
    <View style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    
      <Progress.Circle size={WIDTH/5} borderWidth={5} indeterminate={true} />

      <Text
        style={{
          textAlign: 'center',
          marginTop: 10,
          color: text === 'done !' ? 'green' : 'black',
          fontWeight: '500',
        }}>
        {text}
      </Text>
    </View>
  );
};

export default ProgressBar;
