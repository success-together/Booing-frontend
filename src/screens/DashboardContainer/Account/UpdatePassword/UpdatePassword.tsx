import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View, BackHandler, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {Input} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {store} from '../../../../shared';
import AccountHeader from '../AccountHeader/AcountHeader';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  mailVerification,
  updatePassword,
  resendCode
} from '../../../../shared/slices/Auth/AuthService';
import PasswordInput from '../../../../Components/PasswordInput/PasswordInput';

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
          
          onChangeText={val => changeSegment(val, index)}
        />
      ))}
    </View>
  );
};


const UpdatePassword = ({navigation}: {navigation: any}) => {
  const [updatePasswordForm, setUpdatePasswordForm] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [strongCond, setStrongCond] = useState({length: false, digit: false, lower: false, upper: false, special: false, include: 0});  
  const [isValidPasswordForm, setIsValidPasswordForm] = useState<boolean>(false);
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [code, setCode] = useState<number>(0);
  const [verifyCode, setVerifyCode] = useState<boolean>(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);    
  const [loggedInUser, setLoggedUser] = useState<
    | {
        name: string;
        email: string;
        phone: string;
        accountVerified?: true;
        code?: 0;
        created_at?: string;
        last_login?: string;
        password?: string;
        __v?: number;
        _id?: string;
      }
    | undefined
  >(undefined);
  useEffect(() => {
    const backAction = (e) => {
      console.log('backAction')
      navigation.navigate("Account");
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);  

  const handleResend = async () => {
    console.log(loggedInUser?._id)
    await resendCode({
      user_id: loggedInUser?._id,
    })   
  }

  const submitCode = async () => {
    if (code > 999 && loggedInUser?._id) {
      // setRootLoading(true);
      await mailVerification({
        user_id: loggedInUser?._id,
        code: code,
        isSignup: true,
      }).then(res => {
        setVerifyCode(false);
        navigation.navigate('Account');
      });
    }
  };

  const changePassword = async () => {

    if (
      updatePasswordForm.confirmPassword !== '' &&
      updatePasswordForm.currentPassword !== '' &&
      updatePasswordForm.newPassword !== '' &&
      loggedInUser?._id
    ) {
      if (updatePasswordForm.confirmPassword !== updatePasswordForm.newPassword) {
        Toast.show({
          type: 'error',
          text1: "Confirm password doesn't match."
        })
      } else if (!strongCond.length) {
        Toast.show({
          type: 'error',
          text1: "New password length must be between 9 and 18 characters."
        })
      } else if ( strongCond.include < 2 ) {
        Toast.show({
          type: 'error',
          text1: "Please check the new password condition."
        })
      } else {
        updatePassword({
          currentPassword: updatePasswordForm.currentPassword,
          newPassword: updatePasswordForm.newPassword,
          user_id: loggedInUser?._id,
          isForgotPassword: false,
        }).then(() => {
          setUpdatePasswordForm({
            confirmPassword: '',
            currentPassword: '',
            newPassword: '',
          });
          setVerifyCode(true);
        
        }).catch((err: any) => {
          Toast.show({
            type:'error',
            text1: err?.response?.data?.msg
          })
        })
      }
    } else {
      Toast.show({
        type: 'error', 
        text1: 'Please fill all input.'
      })
    }
  };
  const handlePassword = (val) => {
    const patterndigits = /\d/;
    const patternlower = /[a-z]/;
    const patternupper = /[A-Z]/;
    const patternnonWords = /\W/;
    let requireCond = {length: false, digit: false, lower: false, upper: false, special: false, include: 0};
    if (val.length > 8 && val.length < 19) requireCond.length = true;
    if (patterndigits.test(val)) {requireCond.digit = true; requireCond.include += 1};
    if (patternlower.test(val)) {requireCond.lower = true; requireCond.include += 1};
    if (patternupper.test(val)) {requireCond.upper = true; requireCond.include += 1};
    if (patternnonWords.test(val)) {requireCond.special = true; requireCond.include += 1};
    setUpdatePasswordForm({...updatePasswordForm, newPassword: val});
    setStrongCond(requireCond);
  }
  const onChnagePasswordForm = (value: string, type: string) => {
    console.log(value, type)
    switch (type) {
      case 'newPassword':
        setUpdatePasswordForm({
          ...updatePasswordForm,
          newPassword: value,
        });
        break;
      case 'currentPassword':
        setUpdatePasswordForm({
          ...updatePasswordForm,
          currentPassword: value,
        });
        break;
      case 'confirmPassword':
        setUpdatePasswordForm({
          ...updatePasswordForm,
          confirmPassword: value,
        });
        break;
    }
  };

  const getUserData = () => {
    setLoggedUser(store.getState().authentication.loggedInUser);
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);
setCode
handleResend
submitCode
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <AccountHeader/>
        {/* <View style={styles.logoView}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="ios-caret-back-circle-outline"
            size={30}
            color="white"
          />
        </View> */}
      </View>
      {verifyCode ? (
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
                <Text style={{textAlign: 'center'}}>
                  Enter Verification Code
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
                    color: 'black',
                    backgroundColor: '#F8F8F8',
                    borderRadius: 8,
                    flex: 1,
                    marginRight: index !== 3 ? 20 : undefined,
                    textAlign: 'center',
                  })}
                  onChange={val => setCode(Number(val))}
                />
                <Pressable onPress={handleResend} style={{width: '100%', alignItems: 'flex-end', marginTop: 10, marginBottom: 30}}>
                  <Text style={{ color: "#33a1f9"}}>Resend verification code.</Text>
                </Pressable>
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
                  onPress={submitCode}>
                  <Text style={styles.text}>Verify</Text>
                </Pressable>
              </LinearGradient>
            </View>
      ) : (
        <ScrollView style={styles.scrollView}>      
          <View style={styles.Body}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={styles.title}>Create your password </Text>
            </View>
            <PasswordInput 
              placeholder="Enter your current password"
              setPassword={onChnagePasswordForm} 
              password={updatePasswordForm.currentPassword}
              type="currentPassword"
            />


            <Text style={styles.title}>Create your password </Text>
            <PasswordInput 
              setPassword={handlePassword} 
              password={updatePasswordForm.newPassword} 
              placeholder="Enter new password"
            />
            <View style={{marginTop: 15, marginBottom: 25, marginLeft: 10}}>
              <Text style={[styles.title]}>New password must:</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.length?styles.active:styles.error):{}]}>● Be between 9 and 18 characters</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.include>1?styles.active:styles.error):{}]}>● Include at least two of the following:</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.upper?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • An uppercase character</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.lower?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A lowercase character</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.digit?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A number</Text>
              <Text style={[styles.normaltext, updatePasswordForm.newPassword.length>0?(strongCond.special?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A special character</Text>
            </View>        

            <Text style={styles.title}>Confirm your password </Text>
            <PasswordInput 
              setPassword={onChnagePasswordForm} 
              password={updatePasswordForm.confirmPassword} 
              type="confirmPassword"
              placeholder="Confirm your new password"
              error={updatePasswordForm.newPassword!==updatePasswordForm.confirmPassword&&updatePasswordForm.confirmPassword}
            />

            <Pressable
              style={styles.button}
              onPress={changePassword}>
              <Text style={styles.text}>Update Password</Text>
            </Pressable>
          </View>
        </ScrollView>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F6F7",   
    width: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerHeader: {
    backgroundColor: "#33a1f9",
    width: "100%",
    // flex: 0.6,
  },
  Body: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  DashboardHeader: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33a1f9",
  },
  logoView: {
    position: "absolute",
    top: 40,
    left: 40,
  },
  profileImage: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 20,
  },
  title: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#716D6D",
    marginTop: 5,
    // marginLeft: 70,
    // marginRight: 70,

  },
  normaltext: {
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
  },  
  text: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#ffffff",
    marginTop: 5,
    maxWidth: "100%",
  },
  button: {
    // flexDirection:  'row',
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    // paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    // borderRadius: 4,
    // elevation: 3,
    backgroundColor: "#33a1f9",
  },
  disabled: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    // paddingHorizontal: 140,
    borderRadius: 4,
    elevation: 4,
    backgroundColor: "white",
  },
  active: {
    color: 'green',
  },
  error: {
    color: 'red'
  },  
});

export default UpdatePassword;
