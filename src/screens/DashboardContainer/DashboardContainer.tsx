import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  Account,
  ClearData,
  Dashboard,
  Files,
  Images,
  Transactions,
  UpdatePassword,
  UpdateProfile,
  Uploads,
  Videos,
} from '../exports';
import {small_logo} from '../../images/export';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import RegistredDevices from './Account/RegistredDevices/RegistredDevices';
import {store} from '../../shared';
import {disconnect} from '../../shared/slices/Auth/AuthSlice';

const Stack = createBottomTabNavigator();

const DashboardContainer = () => {
  return (
    <>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let rn: string = route.name;
              switch (rn) {
                case 'Files':
                  iconName = focused ? 'folder' : 'folder-outline';
                  break;
                case 'Dashboard' || 'ClearData':
                  iconName = focused ? 'ios-home' : 'ios-home-outline';
                  break;
                case 'Account':
                  iconName = focused ? 'lock-closed' : 'lock-closed-outline';
                  break;
              }
              // You can return any component that you like here!
              if (iconName == 'Booingcoin') {
                return (
                  <Image
                    style={{width: 50, height: 50}}
                    source={{uri: small_logo}}
                  />
                );
              }
              return (
                <Ionicons name={iconName as any} size={size} color={color} />
              );
            },
            headerShown: false,
          })}
          tabBarOptions={{
            activeTintColor: 'white',
            inactiveTintColor: 'whitesmoke',
            inactiveBackgroundColor: '#33a1f9',
            activeBackgroundColor: '#33a1f9',
            labelStyle: {
              paddingBottom: 3,
              fontSize: 12,
            },
            style: {padding: 30, backgroundColor: '#33a1f9'},
          }}>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ClearData"
            component={ClearData}
            options={{tabBarItemStyle: {display: 'none'}}}
          />
          <Stack.Screen name="Files" component={Files} />
          <Stack.Screen
            name="Uploads"
            component={Uploads}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen name="Booingcoin" component={Transactions} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}></Stack.Screen>
          <Stack.Screen
            name="UpdatePassword"
            component={UpdatePassword}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}></Stack.Screen>
          <Stack.Screen
            name="Images"
            component={Images}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}></Stack.Screen>
          <Stack.Screen
            name="RegistredDevices"
            component={RegistredDevices}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}></Stack.Screen>
          <Stack.Screen
            name="Videos"
            component={Videos}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default DashboardContainer;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
