import React, {useEffect, useState} from 'react';
import {
  NativeModules,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DashboardHeader} from '../../exports';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {
  addDevice,
  updateGeoLocation,
} from '../../../shared/slices/Devices/DevicesService';
import {store} from '../../../shared';
import bytes from 'bytes';

const Dashboard = ({navigation}: {navigation: any}) => {
  const [freeDiskStorage, setFreeDiskSotrage] = useState<number>(0);
  const [totalDiskStorage, setTotalDiskStorage] = useState<number>(0);
  const [freeSpacePerCent, setFreeSpacePerCent] = useState<number>(0);
  const [position, setPosition] = useState<{lat: number; lon: number}>();
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
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceName: string;
    deviceId: string;
    system: string;
  }>({
    deviceId: '',
    deviceName: '',
    system: '',
  });

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          // buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // console.log('granted', granted);
      if (granted === 'granted') {
        // console.log('You can use Geolocation');
        return true;
      } else {
        // console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      // console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log(position);
            setPosition({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          error => {
            // See error code charts below.
            // console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  const getUserData = () => {
    setLoggedUser(store.getState().authentication.loggedInUser);
  };

  const addNewDevice = async (data: any) => {
    // console.log(data);

    // await addDevice(data).then(async () => {
    //   // console.log('**************' + position);
    //   if (position?.lat && position?.lon)
    //     await updateGeoLocation({
    //       device_ref: data.device_ref,
    //       lat: position?.lat,
    //       lon: position?.lon,
    //     });
    // });
  };

  useEffect(() => {
    try {
      getLocation();
      getUserData();
    } catch (error) {
      console.log(error);
    }

    let totalStorage = 0;
    let isEmulator = DeviceInfo.isEmulator();
    // if (!isEmulator) {
    DeviceInfo.getTotalDiskCapacity().then(capacity => {
      totalStorage = capacity;
      setTotalDiskStorage(Number((capacity / Math.pow(1024, 3)).toFixed(2)));
    });
    DeviceInfo.getFreeDiskStorage().then(freeDiskStorage => {
      setFreeDiskSotrage(
        Number((freeDiskStorage / Math.pow(1024, 3)).toFixed(2)),
      );

      setFreeSpacePerCent(
        Number(((freeDiskStorage / totalStorage) * 100).toFixed(0)),
      );
    });

    let deviceId: string;
    let system: string;
    let userData: any = store.getState().authentication.loggedInUser;

    DeviceInfo.getUniqueId().then(uniqueId => {
      deviceId = uniqueId;
      setDeviceInfo({...deviceInfo, deviceId: uniqueId});

      DeviceInfo.getDeviceName().then(deviceName => {
        system = DeviceInfo.getSystemName();
        setDeviceInfo({...deviceInfo, deviceName: deviceName});
        setDeviceInfo({...deviceInfo, system: DeviceInfo.getSystemName()});

        const result = requestLocationPermission();
        result.then(res => {
          // console.log('res is:', res);
          if (res) {
            Geolocation.getCurrentPosition(
              position => {
                // console.log(position);
                setPosition({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                });

                // console.log({
                //   user_id: userData?._id,
                //   device_ref: deviceId,
                //   lat: position.coords.latitude,
                //   lon: position.coords.longitude,
                //   name: deviceName,
                //   type: system,
                // });

                addNewDevice({
                  user_id: userData?._id,
                  device_ref: deviceId,
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                  name: deviceName,
                  type: system,
                });
              },
              error => {
                // See error code charts below.
                // console.log(error.code, error.message);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
      });
    });
  }, []);

  // useEffect(() => {
  //   console.log(Device.brand);
  //   if (Device.isDevice && Device.brand) {
  //     getFreeDiskStorageAsync().then(freeDiskStorage => {
  //       setFreeDiskSotrage(
  //         Number((freeDiskStorage / Math.pow(1024, 3)).toFixed(2)),
  //       );
  //     });
  //     getTotalDiskCapacityAsync().then(totalDiskStorage => {
  //       setTotalDiskStorage(
  //         Number((totalDiskStorage / Math.pow(1024, 3)).toFixed(2)),
  //       );
  //       setFreeSpacePerCent(
  //         Number(((freeDiskStorage / totalDiskStorage) * 100).toFixed(0)),
  //       );
  //     });
  //   }
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <DashboardHeader />
      </View>
      <View style={{flex: 0.1}} />
      <>
        <View style={styles.secondScreenContainer}>
          <>
            <AnimatedCircularProgress
              size={80}
              width={10}
              fill={freeSpacePerCent}
              tintColor="#33a1f9"
              backgroundColor="gray">
              {fill => (
                <Text style={{color: '#33a1f9'}}>{freeSpacePerCent}%</Text>
              )}
            </AnimatedCircularProgress>
          </>
          <View style={styles.storageInfoContainer}>
            <Text style={styles.txtStorage}>Storage Details</Text>
            <Text style={styles.createAccount}>
              {freeDiskStorage} GB of {totalDiskStorage} GB
            </Text>
          </View>
          <Pressable
            style={styles.scanContainer}
            onPress={() => navigation.navigate('ClearData', {freeDiskStorage})}>
            <MaterialIcons name="cleaning-services" size={24} color="white" />
            <Text style={{color: 'white'}}>Scan</Text>
          </Pressable>
        </View>

        <View style={styles.recentFilesContainer}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: 70,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                padding: 25,
                borderRadius: 10,
              }}>
              <Entypo name="folder" size={70} color="#ffde6c" />
              <Text style={styles.createAccount}>Images</Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                padding: 25,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <Entypo name="folder" size={70} color="#ffde6c" />
              <Text style={styles.createAccount}>Music</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                padding: 25,
                borderRadius: 10,
              }}>
              <Entypo name="folder" size={70} color="#ffde6c" />
              <Text style={styles.createAccount}>Documents</Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                padding: 25,
                marginTop: 10,
                borderRadius: 10,
              }}>
              <Entypo name="folder" size={70} color="#ffde6c" />
              <Text style={styles.createAccount}>Downloads</Text>
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  scanContainer: {
    backgroundColor: '#33a1f9',
    flexDirection: 'column',
    marginLeft: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  secondScreenContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    borderRadius: 30,
  },
  storageInfoContainer: {
    justifyContent: 'space-evenly',
    marginLeft: 20,
  },
  txtStorage: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: '#33a1f9',
  },
  container: {
    flex: 0.95,
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
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  recentFilesContainer: {
    flexDirection: 'row',
    marginTop: 60,
  },
});

export default Dashboard;
