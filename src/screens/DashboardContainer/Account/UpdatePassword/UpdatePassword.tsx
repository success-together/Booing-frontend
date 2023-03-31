import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, BackHandler} from 'react-native';
import {Input} from 'react-native-elements';
import {updatePassword} from '../../../../shared/slices/Auth/AuthService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {store} from '../../../../shared';
import AccountHeader from '../AccountHeader/AcountHeader';
import Toast from 'react-native-toast-message';

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
  const [isValidPasswordForm, setIsValidPasswordForm] =
    useState<boolean>(false);
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
  const changePassword = async () => {
    console.log(updatePasswordForm);
    console.log(loggedInUser?._id);

    if (
      updatePasswordForm.confirmPassword !== '' &&
      updatePasswordForm.currentPassword !== '' &&
      updatePasswordForm.newPassword !== '' &&
      loggedInUser?._id
    ) {
      if (updatePasswordForm.confirmPassword !== updatePasswordForm.newPassword) {
        Toast.show({
          type: 'error',
          text1: "new password doesn't match."
        })
      } else if (updatePasswordForm.currentPassword.length < 6) {
        Toast.show({
          type: 'error',
          text1: "password mininumn lenght is 6 letters"
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
          navigation.navigate('Account');
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

  const onChnagePasswordForm = (value: string, type: string) => {
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
    if (
      updatePasswordForm.confirmPassword !== '' &&
      updatePasswordForm.currentPassword !== '' &&
      updatePasswordForm.newPassword !== ''
    )
      setIsValidPasswordForm(true);
    else setIsValidPasswordForm(false);
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
      <View style={styles.Body}>
        <Input
          placeholder="Enter your current Password"
          autoCompleteType={'password'}
          secureTextEntry={true}
          defaultValue=""
          onChangeText={e => onChnagePasswordForm(e, 'currentPassword')}
        />
        <Input
          placeholder="Enter new Password"
          autoCompleteType={'password'}
          secureTextEntry={true}
          defaultValue=""
          onChangeText={e => onChnagePasswordForm(e, 'newPassword')}
        />
        <Input
          placeholder="Confirm Password"
          autoCompleteType={'password'}
          secureTextEntry={true}
          defaultValue=""
          onChangeText={e => onChnagePasswordForm(e, 'confirmPassword')}
        />
        <Pressable
          style={styles.button}
          onPress={changePassword}>
          <Text style={styles.text}>Update Password</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 20,
    padding: 20
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
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "black",
    marginTop: 5,
    // marginLeft: 70,
    // marginRight: 70,

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
});

export default UpdatePassword;
