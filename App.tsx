import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Linking, NativeEventEmitter, NativeModules} from 'react-native';
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
import {store, persistor} from './src/shared';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider } from '@stripe/stripe-react-native';
import {Settings} from 'react-native-fbsdk-next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// const { BackgroundTask } = NativeModules;

// async function runBackgroundTask() {
//   console.log('adfasdfasdfasdfsdf')
//     BackgroundTask.finish();
// }

// BackgroundTask.define(async () => {
//   await runBackgroundTask();
// });

// BackgroundTask.schedule({
//   period: 60 * 5, // Run every 5 minutes
// });

// import BackgroundTimer from 'react-native-background-timer';

// const timer = 0;
// // Start a timer that runs continuous after X milliseconds
// const intervalId = BackgroundTimer.setInterval(() => {
//     // this will be executed every 200 ms
//     // even when app is the the background
//     console.log('tic', timer);
//     if (timer === 10) BackgroundTimer.clearInterval(intervalId);
// }, 2000);

// Setting the facebook app id using setAppID
// Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
Settings.setAppID('727628018866085');
Settings.initializeSDK();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleNotificationClick = (event) => {
    // Get the notification extra data
    const extraData = event?.notification?.data;
    console.log(extraData)
    // Check if the extra data contains the "stackName" key and its value is "ClearData"
    // if (extraData?.stackName === 'ClearData') {
    //   // Navigate to the "ClearData" page using React Navigation
    //   const navigation = useNavigation();
    //   navigation.navigate('ClearData');
    // }
  };
  
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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>    
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
        </PersistGate>
      </Provider>
    </>
  );
}
