import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  DashboardContainer,
  Home,
  Login,
  Register,
  VerificationCode,
} from './src/screens/exports';
import {useEffect, useState} from 'react';
import {Loader} from './src/Components/exports';
import {store} from './src/shared';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<any>(true);
  const [isLoading, setIsLoading] = useState<any>(false);

  useEffect(() => {
    setTimeout(() => {
      store.subscribe(() => {
        setIsLoading(store.getState().root.isLoading);
        setIsLoggedIn(store.getState().authentication.isLoggedIn);
      });
    }, 1000);
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Verification" component={VerificationCode} />
          <Stack.Screen
            name="DashboardContainer"
            component={DashboardContainer}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
