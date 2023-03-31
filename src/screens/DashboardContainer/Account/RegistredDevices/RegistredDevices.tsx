import React, {useEffect, useState} from 'react';
import {Switch, Text, View, BackHandler} from 'react-native';
import {Pressable, StyleSheet} from 'react-native';
import {store} from '../../../../shared/index';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GetDevicesService} from '../../../../shared/slices/Devices/DevicesService';

const RegistredDevices = ({navigation}: {navigation: any}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [devices, setDevices] = useState<Array<{name: string; type: string}>>([
    {name: '', type: ''},
  ]);

  const getDevices = async () => {
    try {
      let user: any = store.getState().authentication.loggedInUser;
      if (user?._id)
        await GetDevicesService({user_id: user?._id}).then(res => {
          console.log(res);
          setDevices(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };
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
  useEffect(() => {
    getDevices();
  }, []);

  return (
    <View>
      {/* <View style={styles.containerHeader}>
        
      </View> */}
      <View style={styles.DashboardHeader}>
        <View style={styles.logoView}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="ios-caret-back-circle-outline"
            size={30}
            color="white"
          />
        </View>
      </View>
      <View style={styles.containerBody}>
        <Text style={styles.title}>Registered Devices</Text>
        <View style={styles.sectionView}>
          <View>
            {devices[0]?.name !== '' &&
              devices[0]?.type !== '' &&
              devices?.map((device,index) => {
                return (
                  <Pressable style={styles.button} key={index}>
                    <View style={{flexDirection: 'row'}}>
                      <Octicons
                        style={styles.icon}
                        name="device-mobile"
                        size={20}
                        color="#CED5D8"
                      />
                      <Text style={styles.text}>{device?.name}-{device?.device_ref}</Text>
                    </View>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  DashboardHeader: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33a1f9',
  },
  logoView: {
    position: 'absolute',
    top: 40,
    left: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerHeader: {
    backgroundColor: '#33a1f9',
    width: '100%',
    // flex: 0.5,
  },
  containerBody: {
    width: '100%',
    // flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  sectionView: {
    width: '100%',
    padding: 0,
  },
  syncronisationView: {
    flex: 0.5,
  },
  button: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    height: 54,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#8F9395',
    // marginTop: 5,
    marginBottom: 8,
    marginLeft: 8,
    // marginRight: 70,
    // textAlign: 'left',
  },
  text: {
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.20,
    color: 'black',
    marginLeft: 14,
  },
  icon: {
    marginLeft: 14,
  },
});

export default RegistredDevices;
