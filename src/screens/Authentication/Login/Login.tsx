import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform, ScrollView,
  TextInput,
} from 'react-native';
import {Logo} from '../../../images/export';
import {login} from '../../../shared/slices/Auth/AuthService';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import SocialMediaAuth from '../../../Components/SocialMediaAuth/SocialMediaAuth';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from 'react-native-elements';

const Login = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submit = async () => {
    if (email && password)
      await login({email, password}).then(res => {
        if (res.success) navigation.navigate('DashboardContainer');
      });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.containerImage}>
      <Image style={styles.image} source={Logo} />
      </View>
      <ScrollView style={styles.ScrollView}>
      <Text style={styles.title}>Enter Email Adress</Text>
      <Input
        placeholder="Enter Email Adress"
        autoCompleteType={'email'}
        onChangeText={e => setEmail(e)}
      />
      <View style={styles.password}>
      <Text style={styles.title}>Enter Password</Text>
       <Text
        style={styles.forgetPassword}
        onPress={() =>
          navigation.navigate('Verification', {
            isSignup: false,
          })
        }>
        Forget password ?
      </Text>
      </View>
      <Input
        placeholder="Enter Password"
        autoCompleteType={'password'}
        secureTextEntry={true}
        onChangeText={e => setPassword(e)}
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
      <Text
        style={styles.createAccount}
        onPress={() => navigation.navigate('Register')}>
        Create an account
      </Text>
      <SocialMediaAuth navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    flex:1,
    padding:10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: '42.66%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#33a1f9',
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
   
  },
  title: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color:'#797D7F',
   
    // marginLeft: 70,
    // marginRight: 70,

  },
  createAccount: {
    fontSize: 17,
    lineHeight: 21, 
    letterSpacing: 0.25,
    color:'#797D7F',
    textAlign:'center'
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  password: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  forgetPassword: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#33a1f9',
    
  },
});

export default Login;
