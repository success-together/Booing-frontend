import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {Logo} from '../../../images/export';
import {login} from '../../../shared/slices/Auth/AuthService';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import SocialMediaAuth from '../../../Components/SocialMediaAuth/SocialMediaAuth';
import LinearGradient from 'react-native-linear-gradient';

const Login = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submit = async () => {
    if (email && password)
      await login({email, password}).then(res => {
        if (res.success) navigation.navigate('DashboardContainer');
      }).catch(err => {
        console.log(err.response?.data?.user_id)
        if (err.response?.data?.user_id) {
          navigation.navigate('Verification', {
            user_id: err.response?.data?.user_id,
            isSignup: true,
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#33A1F9', '#6DBDFE']}
        style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </LinearGradient>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          backgroundColor: 'white',
          paddingLeft: '3.15%',
          paddingRight: '3.15%',
          paddingTop: '5.18%',
          paddingBottom: '5.18%',
          flex: 1,
        }}>
        <Text style={styles.title}>Email </Text>
        <TextInput
          placeholder="Email"
          autoComplete={'email'}
          onChangeText={e => setEmail(e)}
          style={{
            color: '#B6B0B0',
            backgroundColor: '#F8F8F8',
            borderRadius: 8,
            paddingLeft: 15,
            marginBottom: '5.18%',
            marginTop: 4,
          }}
          placeholderTextColor="#716D6D"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>Password </Text>
          <Text
            style={{color: '#33A1F9', fontFamily: 'Rubik-Regular',
    fontSize: 14}}
            onPress={() =>
              navigation.navigate('Verification', {
                isSignup: false,
              })
            }>
            Forget password?
          </Text>
        </View>
        <TextInput
          placeholder="Password"
          autoComplete={'password'}
          secureTextEntry={true}
          onChangeText={e => setPassword(e)}
          style={{
            color: '#B6B0B0',
            backgroundColor: '#F8F8F8',
            borderRadius: 8,
            paddingLeft: 15,
            marginBottom: '5.18%',
            marginTop: 4,
          }}
          placeholderTextColor="#716D6D"
        />
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
            }}
            onPress={submit}>
            <Text style={styles.text}>Login</Text>
          </Pressable>
        </LinearGradient>
        <Text
          style={styles.createAccount}
          onPress={() => navigation.navigate('Register')}>
          Create an account
        </Text>
        <SocialMediaAuth navigation={navigation} />
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
  },
  containerImage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '42.66%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    resizeMode: "contain"
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
    fontFamily: 'Rubik-Regular',
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  title: {
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#716D6D',

    // marginLeft: 70,
    // marginRight: 70,
  },
  createAccount: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    letterSpacing: 0.25,
    marginBottom: '4.32%',
    color: '#716D6D',
    marginTop: 8,
    textAlign: 'center',
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  password: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgetPassword: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#33a1f9',
  },
});

export default Login;
