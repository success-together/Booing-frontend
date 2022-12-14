import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {Input} from 'react-native-elements';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {Logo} from '../../../images/export';
import {
  forgetPassword,
  mailVerification,
} from '../../../shared/slices/Auth/AuthService';
import {setRootLoading} from '../../../shared/slices/rootSlice';

function VerificationCode({route, navigation}: {route: any; navigation: any}) {
  const [code, setCode] = useState<number>(0);
  const [userId, setUserId] = useState<any>(null);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const submit = async () => {
    if (code > 999 && userId) {
      // setRootLoading(true);
      await mailVerification({
        user_id: userId,
        code: code,
        isSignup: isSignup,
      }).then(res => {
        navigation.navigate('Login');
      });
    }
  };

  const sendMail = async () => {
    console.log(email);
    await forgetPassword({email: email}).then(res => {
      if (res.data.success) {
        setIsSignup(false);
      }
    });
  };

  useEffect(() => {
    const {user_id, isSignup} = route.params;
    setUserId(user_id);
    setIsSignup(isSignup);
  }, []);

  return (
    <View style={styles.container}>
      {isSignup ? (
        <>
          <Toast />
          <View style={styles.containerImage}>
            <Image style={styles.image} source={Logo} />
          </View>
          <View style={{flex: 0.1}} />
          <Input
            placeholder="Enter Email Adress"
            autoCompleteType={'email'}
            onChangeText={e => setEmail(e)}
          />
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.text} onPress={sendMail}>
              Send Mail
            </Text>
          </Pressable>
          {/* <Text
          style={styles.createAccount}
          onPress={() => navigation.navigate('Register')}>
          Create an account
        </Text> */}
        </>
      ) : (
        <>
          <View style={styles.containerImage}>
            <Image style={styles.image} source={Logo} />
          </View>
          <View style={{flex: 0.4}} />
          <Text style={styles.createAccount}>
            A mail was send to your adress
          </Text>
          <Input
            placeholder="Enter verification code"
            autoCompleteType={'password'}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={e => setCode(Number(e))}
          />
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.text}>Verify</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 40,
    marginBottom: 30,
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginBottom: 50,
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  forgetPassword: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginBottom: 35,
    color: '#8F9395',
  },
});

export default VerificationCode;
