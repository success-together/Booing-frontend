import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';

interface CheckBoxProps {
  checked: boolean;
  handleCheck?: () => void;
  onCheck?: () => void;
  onUncheck?: () => void;
  style?: object;
}
const CheckBox = ({
  checked,
  handleCheck,
  onCheck,
  onUncheck,
  style,
}: CheckBoxProps) => {
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
