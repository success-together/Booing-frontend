import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FontAwesoem from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from 'expo-web-browser'
import axios from 'axios';


GoogleSignin.configure({
  webClientId:
    '17871285593-8hiaii38s6kifagjg5dunc29bidvfj3u.apps.googleusercontent.com',
});

// WebBrowser.maybeCompleteAuthSession()

const SocialMediaAuth = ({navigation}: {navigation: any}) => {
  type User = {
    ID: number;
    firstName?: string;
    lastName?: string;
    email: string;
    savedProperties?: number[];
    allowsNotifications: boolean;
    pushToken?: string;
    sessionID?: string;
    accessToken: string;
    refreshToken: string;
  };

  //   const [_, googleResponse, googleAuth] = Google.useAuthRequest({
  //     clientId:
  //       '88763342486-q6gnqvme0kagt6n7go5o138n1jpquu5l.apps.googleusercontent.com',
  //     androidClientId:
  //       '88763342486-0ii3cdfcrv8huqn0savsab7li6ccfkcn.apps.googleusercontent.com',
  //   });

  //   const googleLoginOrRegister = async (accessToken: String) => {
  //     try {
  //       const {data} = await axios.post(
  //         'https://auth.expo.io/ala_bouziri/Boing',
  //         {
  //           accessToken,
  //         },
  //       );
  //       return data;
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //   };

  //   useEffect(() => {
  //     async function loginUserWithGoogle(access_Token: String) {
  //       try {
  //         const user = await googleLoginOrRegister(access_Token);
  //         handleSignInUser(user);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }

  //     if (googleResponse?.type === 'success') {
  //       const {access_Token} = googleResponse.params;
  //       debugger;
  //       loginUserWithGoogle(access_Token);
  //     }
  //   }, [googleResponse]);

  //   const handleSignInUser = (user?: User | null) => {
  //     console.log('user 2 :', user);
  //     navigation.navigate('DashboardContainer');
  //   };

  const loginWithGoogle = useCallback(async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('DashboardContainer');
    }catch(error: any) {
      console.log({error})
    }
  }, [navigation]);

  const loginWithTwitter = useCallback(() => {
    console.log('loginWithTwitter');
  }, []);

  const loginWithFacebook = useCallback(() => {
    console.log('loginWithFacebook');
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.containerSocialMedia}>
          <FontAwesoem style={{marginLeft: 37, ...styles.Icon}} name='google' size={38} color="#33A1F9" onPress={() => loginWithGoogle()}/>
          <FontAwesoem style={styles.Icon} name='twitter' size={38} color="#33A1F9" onPress={() => loginWithTwitter()} />
          <FontAwesoem style={styles.Icon} name='facebook' size={38} color="#33A1F9" onPress={() => loginWithFacebook()} />
      </View>
      <Text style={styles.createAccount}>Use Social Login</Text>
    </View>
  );
};

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
    color: "#8F9395",
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Icon: {
    marginRight: 37,
  }
});

export default SocialMediaAuth;
