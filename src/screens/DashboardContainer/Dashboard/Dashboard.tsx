import React, {useEffect, useState, useCallback} from 'react';
import {
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ManageApps from '../../../utils/manageApps';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';
import {useIsFocused} from '@react-navigation/native';
import {userUsedStorage, checkAutoDeleteFile} from '../../../shared/slices/Fragmentation/FragmentationService';
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
  const [myCloud, setMyCloud] = useState<{
    used: number; 
    available: number; 
    usedPerGiga: number
  }>({
      used: 0,
      available: 1,
      usedPerGiga: 0
  })
  const [occupyCloud, setOccupyCloud] = useState<{
    used: number; 
    available: number; 
    usedPerGiga: number
  }>({
      used: 0,
      available: 1,
      usedPerGiga: 0
  })
  // const [usedStorage, setUsedStorage] = useState<number>(0);
  // const [availabledStorage, setAvailableStorage] = useState<number>(1);
  // const [usedStoragePerGiga, setUsedStoragePerGiga] = useState<number>(0);

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
  const [sdCardStats, setSdCardStats] = useState({
    present: false,
    fullSize: 0,
    availableSize: 0,
  });

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
    ManageApps.getSDcardStorageStats().then(
      (stats: (typeof sdCardStats & {present: boolean}) | null) => {
        if (stats) {
          return setSdCardStats({
            present: true,
            fullSize: stats.fullSize,
            availableSize: stats.availableSize,
          });
        }
      },
    );
    let deviceId: string;
    let system: string;
    let userData: any = store.getState().authentication.loggedInUser;

    DeviceInfo.getUniqueId().then(uniqueId => {
      deviceId = uniqueId;
      
      DeviceInfo.getDeviceName().then(deviceName => {
        system = DeviceInfo.getSystemName();
        console.log("deviceName: ", deviceName)
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

                console.log({
                  user_id: userData?._id,
                  device_ref: deviceId,
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                  name: deviceName,
                  type: system,
                });

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
          const data = res.data.data;
          console.log(res.data)
          if (res.data.myCloudTotal) {

            let available = bytesToSize(res.data.myCloudTotal*1000000000 - res.data.myCloud);
            let usedPerGiga = Number((res.data.myCloud / (res.data.myCloudTotal*1000000000)).toFixed(2));
            setMyCloud({
              used: res.data.myCloud,
              available,
              usedPerGiga
            })
          }
          if (res.data.occupyCloudTotal) {
            console.log(res.data.occupyCloudTotal*1000000000 , res.data.occupyCloudTotal*1000000000 - res.data.occupyCloud)
            available = bytesToSize(res.data.occupyCloudTotal*1000000000 - res.data.occupyCloud);
            usedPerGiga = Number((res.data.occupyCloud / (res.data.occupyCloudTotal*1000000000)).toFixed(2));
            setOccupyCloud({
              used: res.data.occupyCloud,
              available,
              usedPerGiga
            })
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const checkAutoDelete = async () => {
    try {
      let user: any = store.getState().authentication.loggedInUser;
      if (user?._id) checkAutoDeleteFile({user_id: user?._id});
    } catch (error) {
      console.log(error);
    }  
  }
  
  const bytesToSize = (bytes: number) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 MB';
    var i = Math.floor(Math.log(bytes) / Math.log(1000));
    if (i == 0) return bytes + ' ' + sizes[i];
    return Math.trunc((bytes / Math.pow(1000, i))*100)/100 + ' ' + sizes[i];
  };

  useEffect(() => {
    if (isFocused) {
      getUserUsedStorage();
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      checkAutoDelete();
      await ManageApps.checkNotificationPermission();
    })();
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
              <Text style={{color: 'white', fontSize: 10, marginTop: 8}}>
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
              <Text style={styles.cloudText}>MyCloud</Text>
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
                    {myCloud.available}
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
                    {bytesToSize(myCloud.used)}
                  </Text>
                </View>
                <Progress.Bar
                  progress={myCloud.usedPerGiga}
                  width={220}
                  height={14}
                  color="orange"
                  unfilledColor="#33a1f9"
                  style={{marginTop: 4}}
                />
              </View>
            </View>
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
              <Text style={styles.cloudText}>Occupy</Text>
              <Text style={styles.cloudText}>Cloud</Text>
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
                    {occupyCloud.available}
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
                    {bytesToSize(occupyCloud.used)}
                  </Text>
                </View>
                <Progress.Bar
                  progress={occupyCloud.usedPerGiga}
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
              <NoDataFound style={{marginBottom: 20}} />
            )}
          </View>

          <View>
            <Text style={styles.title}>
              Storage
            </Text>
          </View>
          <View style={styles.list1}>
            <View style={styles.Storage}>
              <View>
                <SimpleLineIcons
                  name="screen-smartphone"
                  size={24}
                  color="grey"
                  style={{marginRight: 10}}
                />
              </View>
              <View style={styles.Storage1}>
                <View>
                  <Text style={styles.Storage2}>Internal Storage</Text>
                </View>
                <View>
                  <Text style={styles.Storage3}>
                    {freeDiskStorage} GB / {totalDiskStorage} GB
                  </Text>
                </View>
              </View>
            </View>

            {/* <Hr lineColor="#eee" width={1} text="Dummy Text" textStyles={customStylesHere}/> */}
            <View
              style={{
                marginBottom: 10,
                marginTop: 10,
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
              }}
            />
            <View style={styles.Storage}>
              <View>
                <AntDesign
                  name="clockcircleo"
                  size={24}
                  color="grey"
                  style={{marginRight: 10}}
                />
              </View>
              <View style={styles.Storage1}>
                <View>
                  <Text style={styles.Storage2}>SD card</Text>
                </View>
                <View>
                  <Text style={styles.Storage3}>
                    {sdCardStats.present
                      ? `${bytes(sdCardStats.availableSize)}/${bytes(
                          sdCardStats.fullSize,
                        )}`
                      : 'No SD card'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontWeight: 'bold',
                letterSpacing: 0.25,
                color: 'grey',
                textAlign: 'left',
                marginLeft: 0,
                marginTop: 10,
              }}>
              Recycle Bin
            </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('RecycleBin')}>
              <View
                style={{
                  ...styles.row,
                  marginBottom: 40,
                  marginTop: 10,
                }}>
                <EvilIcons
                  style={{marginLeft: 14}}
                  name="trash"
                  size={30}
                  color="grey"
                />
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: 'black',
                    marginLeft: 14,
                  }}>
                  Recycle bin
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
    width: 60,
    height: 73,
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
  cloudText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: '#33a1f9',
  },
  usedSpace: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: 'orange',
  },
  Storage: {
    flexDirection: 'row',
  },
  Storage1: {
    flexDirection: 'column',
    marginTop: -7,
  },
  Storage2: {
    fontWeight: 'bold',
    color: 'black',
  },
  Storage3: {
    fontSize: 10,
    color: 'grey',
  },  

  list: {
    marginTop: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 80,
    flexDirection: 'row',
  },

  list1: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 120,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'grey',
    textAlign: 'left',
    marginTop: 8,
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    height: 60,
    borderRadius: 10,
  },  
});

export default Dashboard;
