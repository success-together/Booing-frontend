import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DashboardHeader} from '../../exports';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {AXIOS_ERROR, BaseUrl, store} from '../../../shared';
import {
  addDevice,
  updateGeoLocation,
} from '../../../shared/slices/Devices/DevicesService';
import SegmentedRoundCircle from '../../../Components/SegmentedRoundCircle/SegmentedRoundCircle';
import ScanIcon from '../../../Components/ScanIcon/ScanIcon';
import FolderIcon from '../../../Components/FolderIcon/FolderIcon';
import LinearGradient from 'react-native-linear-gradient';
import {setRootLoading} from '../../../shared/slices/rootSlice';
import Toast from 'react-native-toast-message';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';
import {useIsFocused} from '@react-navigation/native';
import {userUsedStorage} from '../../../shared/slices/Fragmentation/FragmentationService';
import {
  getDirectories,
  getRecentDirectories,
} from '../../../shared/slices/Directories/DirectoriesService';
import {getWallet} from '../../../shared/slices/wallet/walletService';
import {Wallet} from '../../../models/Wallet';

const formatRecentFolderName = (name: string) => {
  return name.length <= 10 ? name : name.slice(0, 10) + '...';
};

const Dashboard = ({navigation}: {navigation: any}) => {
  const [freeDiskStorage, setFreeDiskSotrage] = useState<number>(0);
  const [totalDiskStorage, setTotalDiskStorage] = useState<number>(0);
  const [freeSpacePerCent, setFreeSpacePerCent] = useState<number>(0);
  const [usedStorage, setUsedStorage] = useState<number>(0);
  const [availabledStorage, setAvailableStorage] = useState<number>(1);
  const [usedStoragePerGiga, setUsedStoragePerGiga] = useState<number>(0);
  const [position, setPosition] = useState<{lat: number; lon: number}>();
  const [recentFolders, setRecentFolders] = useState<
    {name: string; id: string}[]
  >([]);
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
  const [wallet, setWallet] = useState<Wallet>();
  const isFocused = useIsFocused();
  const user_id = store.getState().authentication.userId;

  useEffect(() => {
    if (isFocused) {
      (async () => {
        if (!user_id) {
          store.dispatch(setRootLoading(false));
          return Toast.show({
            type: 'error',
            text1: 'cannot get recent folders, you are not logged in !',
          });
        }
        await getWallet({user_id}).then(res => {
          console.log(res);
          if (res.success) setWallet(res.data);
        });
        await getDirectories({user_id});
        await getRecentDirectories({user_id: user_id})
          .then(response => {
            if (response.success) {
              setRecentFolders(response.data);
            }
          })
          .catch(e => {
            if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
              return Toast.show({
                type: 'error',
                text1: e.response?.data?.message,
              });
            }
          });
      })();
    }
  }, [user_id, isFocused]);

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
    await addDevice(data).then(async () => {
      if (position?.lat && position?.lon)
        await updateGeoLocation({
          device_ref: data.device_ref,
          lat: position?.lat,
          lon: position?.lon,
        });
    });
  };

  useEffect(() => {
    try {
      getLocation();
      getUserData();
    } catch (error) {
      console.log(error);
    }

    let totalStorage = 0;
    // let isEmulator = DeviceInfo.isEmulator();
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

      DeviceInfo.getDeviceName().then(deviceName => {
        system = DeviceInfo.getSystemName();

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

  const getUserUsedStorage = async () => {
    try {
      let user: any = store.getState().authentication.loggedInUser;
      if (user?._id)
        await userUsedStorage({user_id: user?._id}).then(res => {
          if (res?.data[0]?.total) {
            console.log(res?.data[0]?.total);
            setUsedStorage(res?.data[0]?.total);
            setAvailableStorage(
              Number(((1000000000 - res.data[0].total) / 1000000).toFixed(1)),
            );
            setUsedStoragePerGiga(
              Number((res.data[0].total / Math.pow(10, 9)).toFixed(2)),
            );
            console.log(usedStoragePerGiga);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const bytesToSize = (bytes: number) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 MB';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  useEffect(() => {
    getUserUsedStorage();
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
      <LinearGradient
        style={styles.containerImage}
        colors={['#33A1F9', '#6DBDFE']}>
        <DashboardHeader navigation={navigation} />
      </LinearGradient>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.secondScreenContainer}>
            <SegmentedRoundCircle
              size={100}
              strokeWidth={14}
              margin={0.03125}
              stats={[
                {
                  color: '#33A1F9',
                  percent: freeSpacePerCent,
                  label: 'free space',
                },
                {color: '#FFC700', percent: 10, label: 'media'},
                {color: '#4CE364', percent: 0, label: 'cache'},
                {color: '#22215B', percent: 14, label: 'other'},
              ]}
              globalPercent={freeSpacePerCent}
              globalPercentStyles={{
                color: '#33a1f9',
                fontWeight: 'bold',
                fontSize: 20,
                letterSpacing: -1,
              }}
            />
            <View style={styles.storageInfoContainer}>
              <Text style={styles.txtStorage}>Storage Details</Text>
              <Text style={styles.createAccount}>
                {freeDiskStorage} GB of {totalDiskStorage} GB
              </Text>
            </View>
            <Pressable
              style={styles.scanContainer}
              onPress={() =>
                navigation.navigate('ClearData', {freeDiskStorage})
              }>
              <ScanIcon />
              <Text style={{color: 'white', fontSize: 10, marginTop: 10}}>
                Scan
              </Text>
            </Pressable>
          </View>
          <View style={styles.thirdScreenContainer}>
            <View
              style={{
                backgroundColor: '#33a1f9',
                height: '100%',
                width: '6%',
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
              }}></View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '25%',
                borderRightWidth: 2,
                borderColor: '#EFF4F0',
              }}>
              <FontAwesome5 name="cloud" size={40} color="#33a1f9" />
            </View>
            <View style={styles.availbleStorage}>
              <View style={{padding: 4}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.available}>AVAILABLE</Text>
                  <Text style={styles.available}>
                    {' '}
                    {availabledStorage} {availabledStorage == 1 ? 'GB' : 'MB'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                  }}>
                  <Text style={styles.usedSpace}>USED</Text>
                  <Text style={styles.usedSpace}>
                    {' '}
                    {bytesToSize(usedStorage)}
                  </Text>
                </View>
                <Progress.Bar
                  progress={usedStoragePerGiga}
                  width={220}
                  height={14}
                  color="orange"
                  unfilledColor="#33a1f9"
                  style={{marginTop: 4}}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 21,
                fontWeight: 'bold',
                letterSpacing: 0.25,
                color: 'black',
                marginBottom: 10,
              }}>
              Recent
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {recentFolders.length !== 0 ? (
              <View style={styles.recentFilesContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center',
                    flex: 1,
                    marginBottom: 20,
                  }}>
                  {recentFolders[0].name && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        alignItems: 'center',
                        padding: 25,
                        borderRadius: 25,
                        width: '38.55%',
                        marginRight: recentFolders[1]?.name
                          ? '8.88%'
                          : undefined,
                      }}
                      onPress={() =>
                        navigation.navigate('Folder', {
                          id: recentFolders[0].id,
                          historyStack: [recentFolders[0].id],
                        })
                      }>
                      <FolderIcon />
                      <Text style={styles.folderText}>
                        {formatRecentFolderName(recentFolders[0].name)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recentFolders[1]?.name && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        alignItems: 'center',
                        padding: 25,
                        borderRadius: 25,
                        width: '38.55%',
                      }}
                      onPress={() =>
                        navigation.navigate('Folder', {
                          id: recentFolders[1].id,
                          historyStack: [recentFolders[1].id],
                        })
                      }>
                      <FolderIcon />
                      <Text style={styles.folderText}>
                        {formatRecentFolderName(recentFolders[1].name)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  {recentFolders[2]?.name && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        alignItems: 'center',
                        padding: 25,
                        borderRadius: 25,
                        width: '38.55%',
                        marginRight: recentFolders[3]?.name
                          ? '8.88%'
                          : undefined,
                      }}
                      onPress={() =>
                        navigation.navigate('Folder', {
                          id: recentFolders[2].id,
                          historyStack: [recentFolders[2].id],
                        })
                      }>
                      <FolderIcon />
                      <Text style={styles.folderText}>
                        {formatRecentFolderName(recentFolders[2].name)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recentFolders[3]?.name && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        alignItems: 'center',
                        padding: 25,
                        borderRadius: 25,
                        width: '38.55%',
                      }}
                      onPress={() =>
                        navigation.navigate('Folder', {
                          id: recentFolders[3].id,
                          historyStack: [recentFolders[3].id],
                        })
                      }>
                      <FolderIcon />
                      <Text style={styles.folderText}>
                        {formatRecentFolderName(recentFolders[3]?.name)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <NoDataFound style={{marginBottom: 50}} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  body: {
    flex: 1,
    width: '100%',
  },
  scanContainer: {
    backgroundColor: '#6DBDFE',
    flexDirection: 'column',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    width: 65,
    height: 83,
    position: 'absolute',
    right: 9,
    top: -6,
  },
  secondScreenContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 25,
    paddingBottom: 25,
  },
  storageInfoContainer: {
    marginLeft: 10,
    paddingRight: 70,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  txtStorage: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: '#33a1f9',
  },
  available: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: '#33a1f9',
  },
  container: {
    backgroundColor: '#F6F7FB',
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
    flex: 0.6,
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
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  createAccount: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: '#BDB8BF',
  },
  folderText: {
    fontSize: 13,
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  recentFilesContainer: {
    flexDirection: 'column',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
    flex: 1,
  },
  thirdScreenContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '99%',
    borderRadius: 20,
    marginTop: 10,
  },
  availbleStorage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  usedSpace: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: 'orange',
  },
});

export default Dashboard;
