import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';

const CheckBox = ({checked, handleCheck, onCheck, onUncheck, style}: any) => {
  useEffect(() => {
    if (checked && onCheck) {
      onCheck();
    }
    if (!checked && onUncheck) {
      onUncheck();
    }
  }, [checked]);

  return (
    <TouchableOpacity
      onPress={handleCheck}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        borderStyle: 'solid',
        borderColor: '#C6D2E8',
        borderWidth: 2,
        ...style,
      }}>
      {checked && <Feather name="check" size={20} color={'#C6D2E8'} />}
    </TouchableOpacity>
  );
};

export default CheckBox;
