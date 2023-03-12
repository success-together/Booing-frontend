import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {
  Account,
  Apks,
  ClearData,
  Dashboard,
  Files,
  Images,
  Transactions,
  UpdatePassword,
  UpdateProfile,
  Uploads,
  Videos,
  Audio,
  Documents,
  Downloads,
  BuySpace,
  SellSpace,
  Offer,
  InviteFriends,
  StripePay,
} from '../exports';
import {small_logo} from '../../images/export';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import RegistredDevices from './Account/RegistredDevices/RegistredDevices';
import {store} from '../../shared';
import RecycleBin from './Files/RecycleBin/RecycleBin';
import {
  checkForDownloads,
  checkForUploads,
} from '../../shared/slices/Fragmentation/FragmentationService';
import FolderPage from './Files/FolderPage/FolderPage';
import useSocket from '../../shared/socket';
const Stack = createBottomTabNavigator();
const DashboardContainer =  () => {
  const {initSocket, createOffer} = useSocket();
  const device = store.getState().devices;
  const user_id = store.getState().authentication.userId;
  useEffect(() => {
    console.log("_!______________!______________!_!______________!______________!_")
    initSocket();
  }, [])
 
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
              if (rn == 'Booingcoin') {
                return (
                  <Image style={{width: 35, height: 20}} source={small_logo} />
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
          <Stack.Screen
            name="BuySpace"
            component={BuySpace}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="SellSpace"
            component={SellSpace}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Offer"
            component={Offer}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen name="Files" component={Uploads} />
          <Stack.Screen 
            name="Others" 
            component={Files} 
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
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
            }}
          />
          <Stack.Screen
            name="UpdatePassword"
            component={UpdatePassword}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Folder"
            component={FolderPage}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="InviteFriends"
            component={InviteFriends}
            options={{
              // headerShown: false,
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Images"
            component={Images}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="RegistredDevices"
            component={RegistredDevices}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Videos"
            component={Videos}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Audio"
            component={Audio}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Documents"
            component={Documents}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Downloads"
            component={Downloads}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="Apks"
            component={Apks}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="RecycleBin"
            component={RecycleBin}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
          <Stack.Screen
            name="StripePay"
            component={StripePay}
            options={{
              tabBarItemStyle: {display: 'none'},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default DashboardContainer;
