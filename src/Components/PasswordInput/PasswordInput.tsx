import React, {useState} from 'react';
import {View, TextInput, Pressable} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const PasswordInput = ({setPassword, password, type, placeholder, error=false}) => {
  const [show, setShow] = useState(true);

  return (
    <View style={{justifyContent: 'center'}}>
      <TextInput
        placeholder={placeholder?placeholder:'Enter password'}
        autoComplete={'password'}
        secureTextEntry={show}
        value={password}
        onChangeText={e => setPassword(e, type)}
        style={{
          color: 'black',
          backgroundColor: error?'#ffdddd':'#F8F8F8',
          borderRadius: 8,
          paddingLeft: 15,
          marginBottom: 10,
          marginTop: 10,
        }}
        placeholderTextColor="#716D6D"
      />
      <Pressable
        style={{
          position: 'absolute',
          right: 10
        }}
       onPress={() => setShow(!show)}>
        <Entypo name={show?'eye-with-line':'eye'} size={25} color="grey" />
      </Pressable>
    </View>
  )
}

export default PasswordInput;