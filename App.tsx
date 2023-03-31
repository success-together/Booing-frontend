import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  DashboardContainer,
  Home,
  Login,
  Register,
  Splash,
  CounterDown,
  VerificationCode,
} from './src/screens/exports';
import {useEffect, useState} from 'react';
import {Loader} from './src/Components/exports';
import {store} from './src/shared';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider } from '@stripe/stripe-react-native';
import {Settings} from 'react-native-fbsdk-next';

// Setting the facebook app id using setAppID
// Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
Settings.setAppID('727628018866085');
Settings.initializeSDK();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkForToken = async () => {
      setIsLoading(true);

      let token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkForToken();
  }, []);

  useEffect(() => {
    // if (!isLoggedIn) AsyncStorage.removeItem('token');
    setTimeout(() => {
      store.subscribe(() => {
        setIsLoading(store.getState().root.isLoading);
        setIsLoggedIn(store.getState().authentication.isLoggedIn);
        let userData: any = store.getState().authentication.loggedInUser;
        if (
          store.getState().authentication.isLoggedIn &&
          store.getState().authentication.loggedInUser !== undefined &&
          userData
        ) {
          // checkForDownloads({
          //   user_id: userData._id,
          // });
          // checkForUploads({user_id: userData._id});
        }
      });
    }, 500);
  }, [
    store.getState().root.isLoading,
    store.getState().authentication.isLoggedIn,
  ]);

  return (
    <>
        <Loader isLoading={isLoading} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Home">
            {!isLoggedIn ? (
              <Stack.Group>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="CounterDown" component={CounterDown} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Verification" component={VerificationCode} />
              </Stack.Group>
            ) : (
              <Stack.Group>
                <Stack.Screen
                  name="DashboardContainer"
                  component={DashboardContainer}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
    </>
  );
}
