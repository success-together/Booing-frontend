import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import FontAwesoem from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {store} from '../../shared';
import {socialMediaSignIn} from '../../shared/slices/Auth/AuthService';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';
import {NativeModules} from 'react-native';
import ManageApps from '../../utils/manageApps';
import {Dialog} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {isValidEmail} from '../../utils/util-functions';
import {setRootLoading} from '../../shared/slices/rootSlice';

const {RNTwitterSignIn} = NativeModules;

RNTwitterSignIn.init(
  'FZERgjOuUSS9RIpvw0kSvirTf',
  '7Lp3zL5lIIwgo7JxfUcLo3hB8Uw03dArZtyzWFWhUQ50HqChrT',
);

GoogleSignin.configure({
  webClientId: '1004306547703-4salgg6e7oqrc745madpvr2m9aqf5r5p.apps.googleusercontent.com',
  webClientSecret: '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',
});

const SocialMediaAuth = ({navigation}: {navigation: any}) => {
  const [loginWithTwitterDialog, setLoginWithTwitterDialog] = useState({
    show: false,
    email: '',
  });

  const loginWithGoogle = useCallback(async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      console.log('has play service')
      // Get the users ID token
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(idToken, user)
      await socialMediaSignIn({
        name: user.name || '',
        email: user.email,
        socialMedia_ID: user.id,
      });
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      navigation.navigate('DashboardContainer');
    } catch (error: any) {
      console.log(error.code, error.message)
      Toast.show({
        type: 'error',
        text1: 'there was an error with logging with google',
      });
    }
  }, [navigation]);

  const loginWithTwitter = useCallback(
    async (val = true): Promise<any> => {
      const data = await ManageApps.loginWithTwitter();

      if (typeof data === 'string') {
        if (data === 'The web operation was canceled by the user.' && val) {
          return await loginWithTwitter(false);
        }

        return Toast.show({
          type: 'error',
          text1: 'there was an error with logging with twitter',
          text2: data,
        });
      }

      try {
        const {name, id} = data as {
          name: string;
          id: string;
        };

        await socialMediaSignIn({
          name,
          email: loginWithTwitterDialog.email,
          socialMedia_ID: id,
        });
      } catch (e: any) {
        return Toast.show({
          type: 'error',
          text1: 'there was an error with logging with twitter',
          text2: e.message,
        });
      } finally {
        store.dispatch(setRootLoading(false));
      }
    },
    [loginWithTwitterDialog],
  );

  const loginWithFacebook = useCallback(async () => {
    try {
      LoginManager.logOut();

      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_friends',
      ]);

      if (result.isCancelled) {
        return console.log('User cancelled the login process');
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        return console.log('Something went wrong obtaining access token');
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const {
        user: {displayName: name, email, uid: socialMedia_ID},
      } = await auth().signInWithCredential(facebookCredential);

      if (name && email) {
        await socialMediaSignIn({
          name,
          email,
          socialMedia_ID,
        });
      }

      navigation.navigate('DashboardContainer');
    } catch (e: any) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'there was an error with logging with facebook',
        text2: e.message,
      });
    }
  }, [navigation]);

  const submitTwitterEmail = useCallback(async () => {
    if (
      loginWithTwitterDialog.email &&
      isValidEmail(loginWithTwitterDialog.email)
    ) {
      store.dispatch(setRootLoading(true));
      setLoginWithTwitterDialog(prev => ({...prev, show: false}));
      await loginWithTwitter();
    } else {
      Toast.show({
        type: 'error',
        text1: 'invalid email',
        position: 'top',
      });
    }
  }, [loginWithTwitterDialog, loginWithTwitter, setLoginWithTwitterDialog]);

  return (
    <View style={styles.container}>
      <Dialog isVisible={loginWithTwitterDialog.show}>
        <Dialog.Title
          title="please enter your email to continue logging with twitter"
          titleStyle={{color: 'black'}}
        />
        <TextInput
          placeholder="Enter Email Adress"
          autoComplete={'email'}
          onChangeText={val =>
            setLoginWithTwitterDialog(prev => ({...prev, email: val}))
          }
          style={{
            backgroundColor: '#F2F2F2',
            borderRadius: 8,
            marginBottom: '5.18%',
            marginTop: 4,
          }}
          placeholderTextColor="#716D6D"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <LinearGradient
            colors={['#33A1F9', '#6DBDFE']}
            style={{borderRadius: 8}}>
            <Pressable
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                width: 100,
              }}
              onPress={() =>
                setLoginWithTwitterDialog({show: false, email: ''})
              }>
              <Text style={styles.text}>Cancel</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            colors={['#33A1F9', '#6DBDFE']}
            style={{borderRadius: 8, marginLeft: 10}}>
            <Pressable
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                width: 100,
              }}
              onPress={submitTwitterEmail}>
              <Text style={styles.text}>Done</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Dialog>
      <View style={styles.containerSocialMedia}>
        <FontAwesoem
          style={{marginLeft: 37, ...styles.Icon}}
          name="google"
          size={38}
          color="#33A1F9"
          onPress={async () => await loginWithGoogle()}
        />
        <FontAwesoem
          style={styles.Icon}
          name="twitter"
          size={38}
          color="#33A1F9"
          onPress={() => setLoginWithTwitterDialog({show: true, email: ''})}
        />
        <FontAwesoem
          style={styles.Icon}
          name="facebook"
          size={38}
          color="#33A1F9"
          onPress={async () => await loginWithFacebook()}
        />
      </View>
      <Text style={styles.title}>Use Social Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
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
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  title: {
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    marginBottom: 30,
    letterSpacing: 0.25,
    color: '#797D7F',

    // marginLeft: 70,
    // marginRight: 70,
  },
  createAccount: {
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
    letterSpacing: 0.25,
    color: '#8F9395',
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Icon: {
    marginRight: 37,
  },
});

export default SocialMediaAuth;
