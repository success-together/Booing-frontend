import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {Logo} from '../../../images/export';
import {
  forgetPassword,
  mailVerification,
} from '../../../shared/slices/Auth/AuthService';

interface SegmentedAutoMovingInputProps {
  segments: number;
  onChange?: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle> | ((index: number) => StyleProp<TextStyle>);
}
export const SegmentedAutoMovingInput = ({
  segments,
  onChange,
  containerStyle,
  inputStyle,
}: SegmentedAutoMovingInputProps) => {
  const [segmentsString, setSegmentsString] = useState<string[]>([]);
  const refs: MutableRefObject<TextInput>[] = Array.from(
    {length: segments},
    () => useRef() as MutableRefObject<TextInput>,
  );

  const changeSegment = useCallback(
    (val: string, index: number) => {
      if (!/^\d$/.test(val)) {
        return Toast.show({
          type: 'error',
          text1: `${val} : must be of type number`,
        });
      }

      setSegmentsString(prev => {
        if (val !== '') {
          refs[index + 1] && refs[index + 1].current.focus();
        }

        prev[index] = val;
        return [...prev];
      });
    },
    [segments, refs],
  );

  useEffect(() => {
    if (onChange) {
      onChange(segmentsString.join(''));
    }
  }, [segmentsString]);

  return (
    <View style={containerStyle}>
      {Array.from({length: segments}, (_, index) => (
        <TextInput
          keyboardType="numeric"
          maxLength={1}
          key={index}
          ref={refs[index]}
          style={
            typeof inputStyle === 'object'
              ? inputStyle
              : typeof inputStyle === 'function'
              ? inputStyle(index)
              : undefined
          }
          placeholder={'0'}
          onChangeText={val => changeSegment(val, index)}
        />
      ))}
    </View>
  );
};

function VerificationCode({route, navigation}: {route: any; navigation: any}) {
  const [code, setCode] = useState<number>(0);
  const [userId, setUserId] = useState<any>(null);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  let [step, setStep] = useState<number>(0);

  const submit = async () => {
    if (code > 999 && userId) {
      // setRootLoading(true);
      await mailVerification({
        user_id: userId,
        code: code,
        isSignup: isSignup,
      }).then(res => {
        if (step === 1 && isSignup) navigation.navigate('Login');
        else if (step === 1 && !isSignup) setStep(++step);
      });
    }
  };

  const sendMail = async () => {
    if (email)
      await forgetPassword({email: email}).then(res => {
        console.log(res);

        if (res.success) {
          setStep(++step);
          setUserId(res.data._id);
          // setIsSignup(true);
        }
      });
  };

  useEffect(() => {
    const {user_id, isSignup} = route.params;
    console.log(user_id);
    setUserId(user_id);
    setIsSignup(isSignup);
  }, []);

  return (
    <View style={styles.container}>
      {!isSignup && step === 2 ? (
        <>
          <>
            <Toast />
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
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: '100%',
                paddingLeft: '2.15%',
                paddingRight: '2.15%',
                paddingTop: '4.97%',
                paddingBottom: '4.97%',
                flex: 1,
              }}>
              <View>
                <Text>Password :</Text>
                <TextInput
                  placeholder="Enter your new password"
                  autoComplete={'password'}
                  onChangeText={e => setPassword(e)}
                  secureTextEntry={true}
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: 8,
                    marginBottom: '3.24%',
                    marginTop: 4,
                  }}
                  placeholderTextColor="#716D6D"
                />
              </View>
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
                  }}>
                  <Text style={styles.text}>Update Password</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </>
        </>
      ) : step === 0 ? (
        <>
          <Toast />
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
              justifyContent: 'space-between',
              backgroundColor: 'white',
              width: '100%',
              paddingLeft: '2.15%',
              paddingRight: '2.15%',
              paddingTop: '4.97%',
              paddingBottom: '4.97%',
              flex: 1,
            }}>
            <View>
              <Text>Email :</Text>
              <TextInput
                placeholder="Enter Email Adress"
                autoComplete={'email'}
                onChangeText={e => setEmail(e)}
                style={{
                  backgroundColor: '#F8F8F8',
                  borderRadius: 8,
                  marginBottom: '3.24%',
                  marginTop: 4,
                }}
                placeholderTextColor="#716D6D"
              />
            </View>
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
                onPress={sendMail}>
                <Text style={styles.text}>Send Mail</Text>
              </Pressable>
            </LinearGradient>
          </View>
          {/* <Text
          style={styles.createAccount}
          onPress={() => navigation.navigate('Register')}>
          Create an account
        </Text> */}
        </>
      ) : (
        step === 1 && (
          <>
            <Toast />
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
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: '100%',
                paddingLeft: '2.15%',
                paddingRight: '2.15%',
                paddingTop: '12.85%',
                paddingBottom: '4.97%',
                flex: 1,
              }}>
              <View
                style={{width: '100%', display: 'flex', alignItems: 'stretch'}}>
                <Text style={{textAlign: 'center'}}>
                  A mail was send to your address
                </Text>
                <SegmentedAutoMovingInput
                  segments={4}
                  containerStyle={{
                    display: 'flex',
                    alignItems: 'stretch',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    marginTop: 16,
                    marginBottom: 16,
                  }}
                  inputStyle={index => ({
                    backgroundColor: '#F8F8F8',
                    borderRadius: 8,
                    flex: 1,
                    marginRight: index !== 3 ? 20 : undefined,
                    textAlign: 'center',
                  })}
                  onChange={val => setCode(Number(val))}
                />
                <Text style={{textAlign: 'center'}}>
                  Enter Verification Code
                </Text>
              </View>
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
                  <Text style={styles.text}>Verify</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#33a1f9',
    height: '100%',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '42.66%',
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
    fontSize: 20,
    lineHeight: 21,
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
