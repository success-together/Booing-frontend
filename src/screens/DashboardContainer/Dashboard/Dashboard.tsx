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
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
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
import {setFreeStorage, setOccupy} from '../../../shared/slices/Devices/DevicesSlice';
import {
  getDirectories,
  getRecentFiles,
} from '../../../shared/slices/Directories/DirectoriesService';
import {getWallet} from '../../../shared/slices/wallet/walletService';
import {Wallet} from '../../../models/Wallet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const formatRecentFolderName = (name: string) => {
  return name.length <= 8 ? name : name.slice(0, 8) + '...';
};
const DirectoireView = ({file, navigation}) => {
  return <TouchableOpacity

    onPress={() =>
      navigation.navigate('Folder', {
        id: file._id,
        historyStack: [file._id],
      })
    }>
    <FolderIcon />
    <Text style={styles.folderText}>
      {formatRecentFolderName(file.updates[0].fileName)}
    </Text>
  </TouchableOpacity>    
}
const FileView = ({file, navigation}) => {
  return <TouchableOpacity style={{alignItems: 'center'}}>
    {file.category === 'image' &&
      <FastImage
        source={{uri: file.thumbnail}}
        resizeMode="cover"
        style={{
          height: 45,
          width: 51,
        }}
      />
    }
    {file.category === 'video' && 
      (file.thumbnail?
        <FastImage
          source={{uri: file.thumbnail}}
          resizeMode="cover"
          style={{
            height: 45,
            width: 51,
          }}
        />:
        <MaterialCommunityIcons
          name="file-video-outline"
          size={50}
          color='grey'
        />
      )
    }
    {file.category === 'music' &&
      <MaterialCommunityIcons
        name="music-box-outline"
        size={50}
        color='grey'
      />
    }
    
    <Text style={styles.folderText}>
      {formatRecentFolderName(file.updates[0].fileName)}
    </Text>
  </TouchableOpacity>    
}
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
  const [recentFiles, setRecentFiles] = useState<
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
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [storageDetail, setStorageDetail] = useState<{
    media: number, 
    cache: number, 
    other: number
  }>({
    media: 0,
    cache: 0,
    other: 0
  });
  const isFocused = useIsFocused();
  const user_id = store.getState().authentication.userId;
  const storage = store.getState().authentication.storage;
  const [sdCardStats, setSdCardStats] = useState({
    present: false,
    fullSize: 0,
    availableSize: 0,
  });
  const { height, width } = Dimensions.get("window");
  useEffect(() => {
    if (isFocused) {
      (async () => {
        if (!user_id) {
          return Toast.show({
            type: 'error',
            text1: 'cannot get recent folders, you are not logged in !',
          });
        }
        await getWallet({user_id}).then(res => {
          if (res.success) setWalletAmount(res.data?.amount);
        });
        await getRecentFiles({user_id: user_id})
          .then(response => {
            if (response.success) {
              setRecentFiles(response.data);
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
    addDevice(data).then(() => {
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
      const freeDiskStorageGiga = Number((freeDiskStorage / Math.pow(1024, 3)).toFixed(2));
      console.log(freeDiskStorageGiga)
      store.dispatch(setFreeStorage(freeDiskStorage))
      setFreeDiskSotrage(freeDiskStorageGiga);

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
    console.log(DeviceInfo.getDeviceId())
    DeviceInfo.getUniqueId().then(uniqueId => {
      deviceId = uniqueId;
      // console.log(DeviceInfo.getDeviceId())
      // console.log(DeviceInfo.getModel())

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
            available = bytesToSize(res.data.occupyCloudTotal*1000000000 - res.data.occupyCloud);
            usedPerGiga = Number((res.data.occupyCloud / (res.data.occupyCloudTotal*1000000000)).toFixed(2));
            store.dispatch(setOccupy(res.data.occupyCloudTotal))
            
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
  useEffect(() => {
    if (storage && totalDiskStorage) {
      let media =  storage.media?(storage.media / Math.pow(1024, 3))/(totalDiskStorage):0;
      media = Math.ceil(media*100)/100;
      let cache =  storage.cache?(storage.cache / Math.pow(1024, 3))/(totalDiskStorage):0;
      cache = Math.ceil(cache*100)/100;
      const other =  100 - freeSpacePerCent - media - cache;
      console.log('storage detail: ', media, cache, other);
      setStorageDetail({media: media, cache: cache, other: other})
    } else {
      setStorageDetail({media: 0, cache: 0, other: freeSpacePerCent});
    }
  }, [storage, totalDiskStorage]);
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.containerImage}
        colors={['#33A1F9', '#6DBDFE']}>
        <DashboardHeader navigation={navigation} amount={walletAmount} />
      </LinearGradient>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.secondScreenContainer}>
            <SegmentedRoundCircle
              size={80}
              strokeWidth={12}
              margin={0.003125}
              stats={[
                {
                  color: '#33A1F9',
                  percent: freeSpacePerCent,
                  label: 'free space',
                },
                {color: '#FFC700', percent: storageDetail.media, label: 'media'},
                {color: '#4CE364', percent: storageDetail.cache, label: 'cache'},
                {color: '#22215B', percent: storageDetail.other, label: 'other'},
              ]}
              globalPercent={freeSpacePerCent}
              globalPercentStyles={{
                color: '#33a1f9',
                fontFamily: 'Rubik-Bold', fontSize: 18,
                letterSpacing: -1,
              }}
            />
            <View style={styles.storageInfoContainer}>
              <Text style={styles.txtStorage}>Space details</Text>
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
              <Text style={{color: 'white', fontFamily: 'Rubik-Regular', fontSize: 12, marginLeft: 5}}>
                Scan & Clean
              </Text>
            </Pressable>
          </View>
          <View style={styles.thirdScreenContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                borderRightWidth: 2,
                borderColor: '#EFF4F0',
                padding: 20
              }}>
              <FontAwesome5 name="cloud" size={25} color="#33a1f9" />
              <Text style={styles.cloudText}>My Cloud</Text>
            </View>
            <View style={styles.availbleStorage}>
              <View style={{padding: 4}}>
                <Progress.Bar
                  progress={myCloud.usedPerGiga}
                  width={width*0.8}
                  height={14}
                  color='#6DBDFE'
                  unfilledColor="#eeeeee"
                  style={{marginTop: 4, borderRadius: 30}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                    width: width*0.8
                  }}>
                  <Text style={styles.usedSpace}>{bytesToSize(myCloud.used)} USED</Text>
                  <Text style={styles.available}>{myCloud.available} AVAILABLE</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.thirdScreenContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                borderRightWidth: 2,
                borderColor: '#EFF4F0',
                padding: 20
              }}>
              <FontAwesome5 name="cloud" size={25} color="#33a1f9" />
              <Text style={styles.cloudText}>Occupy Cloud</Text>
            </View>
            <View style={styles.availbleStorage}>
              <View style={{padding: 4}}>
                <Progress.Bar
                  progress={myCloud.usedPerGiga}
                  width={width*0.8}
                  height={14}
                  color='#6DBDFE'
                  unfilledColor="#eeeeee"
                  style={{marginTop: 4, borderRadius: 30}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                    width: width*0.8
                  }}>
                  <Text style={styles.usedSpace}>{bytesToSize(occupyCloud.used)} USED</Text>
                  <Text style={styles.available}>{occupyCloud.available} AVAILABLE</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={{
                fontFamily: 'Rubik-Bold', fontSize: 18,
                lineHeight: 21,
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
            {recentFiles.length !== 0 ? (
              <View style={styles.recentFilesContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    paddingBottom: 20,
                  }}>
                  {recentFiles.map((file, ind) => {
                    return <View key={ind} style={{
                        alignItems: 'center',
                        padding: 25,
                        borderRadius: 25,
                        width: '33%',
                        height: 100,
                      }}>
                      {file.isDirectory?(<DirectoireView file={file} navigation={navigation} />):(<FileView file={file} navigation={navigation} />)}
                      </View>
                  })}
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
                fontFamily: 'Rubik-Bold', fontSize: 16,
                lineHeight: 21,
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
                    fontFamily: 'Rubik-Bold', fontSize: 16,
                    lineHeight: 21,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'space-between',
    width: 120,
    height: 40,
    position: 'absolute',
    right: 9,
    paddingHorizontal: 10,
    bottom: 10,
  },
  secondScreenContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 25,
    paddingBottom: 45,
  },
  storageInfoContainer: {
    marginLeft: 10,
    paddingRight: 70,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  txtStorage: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.15,
    color: '#33a1f9',
  },
  available: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.25,

    color: '#C6C6C6',
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
    // flex: 0.6,
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
    fontFamily: 'Rubik-Bold', 
    fontSize: 16,
    letterSpacing: 0.25,
    color: 'white',
  },
  createAccount: {
    fontFamily: 'Rubik-Regular', 
    fontSize: 16,
    letterSpacing: 0.25,
    color: '#BDB8BF',
  },
  folderText: {
    fontFamily: 'Rubik-Regular', 
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
    backgroundColor: 'white',
    borderRadius: 20,
  },
  thirdScreenContainer: {
    // flexDirection: 'row',
    backgroundColor: 'white',
    width: '99%',
    borderRadius: 20,
    marginTop: 10,
  },
  availbleStorage: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 20,
  },
  cloudText: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#33a1f9',
    marginLeft: 10
  },
  usedSpace: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#6DBDFE',
  },
  Storage: {
    flexDirection: 'row',
  },
  Storage1: {
    flexDirection: 'column',
    marginTop: -7,
  },
  Storage2: {
    fontFamily: 'Rubik-Bold',
    color: 'black',
  },
  Storage3: {
    fontFamily: 'Rubik-Regular', fontSize: 10,
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
    fontFamily: 'Rubik-Bold', fontSize: 16,
    lineHeight: 21,
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
