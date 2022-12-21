import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import FilesHeader from '../FilesHeader/FilesHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DeviceInfo from 'react-native-device-info';
import ManageApps from '../../../../utils/manageApps';
import bytes from 'bytes';

const Uploads = ({navigation}: {navigation: any}) => {
  const [freeDiskStorage, setFreeDiskSotrage] = useState<number>(0);
  const [totalDiskStorage, setTotalDiskStorage] = useState<number>(0);
  const [sdCardStats, setSdCardStats] = useState({
    present: false,
    fullSize: 0,
    availableSize: 0,
  });

  useEffect(() => {
    let totalStorage = 0;
    let isEmulator = DeviceInfo.isEmulator();
    // if (!isEmulator) {
    DeviceInfo.getTotalDiskCapacity().then(capacity => {
      totalStorage = capacity;
      setTotalDiskStorage(Number((capacity / Math.pow(1024, 3)).toFixed(2)));
    });
    DeviceInfo.getFreeDiskStorage().then(freeDiskStorage => {
      //  console.log(Number((freeDiskStorage / Math.pow(1024, 3)).toFixed(2)));
      setFreeDiskSotrage(
        Number((freeDiskStorage / Math.pow(1024, 3)).toFixed(2)),
      );
      //  console.log('total : ' + (freeDiskStorage / totalStorage) * 100);
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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.TopBody}>
          <View style={styles.row}>
            <AntDesign
              style={{marginLeft: 14}}
              name="clockcircleo"
              size={24}
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
              Recent files
            </Text>
          </View>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={styles.title}>Categories</Text>
        </View>
        <View style={styles.columnIcon}>
          <View style={styles.rowIcon}>
            <Pressable
              style={styles.icon}
              onPress={() => {
                navigation.navigate('Images');
              }}>
              <Feather name="image" size={24} color="#FF2960" />
              <Text style={styles.font}>Images</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Videos')}
              style={styles.icon}>
              <Feather name="video" size={24} color="#FF00E4" />
              <Text style={styles.font}>Videos</Text>
            </Pressable>
            <Pressable
              style={styles.icon}
              onPress={() => navigation.navigate('Audio')}>
              <MaterialIcons name="audiotrack" size={24} color="#FF00E4" />
              <Text style={styles.font}>Audio Files</Text>
            </Pressable>
          </View>
          <View style={styles.rowIcon}>
            <Pressable
              style={styles.icon}
              onPress={() => navigation.navigate('Documents')}>
              <Ionicons name="document-outline" size={24} color="#FF8700" />
              <Text style={styles.font}>Documents</Text>
            </Pressable>
            <Pressable
              style={styles.icon}
              onPress={() => navigation.navigate('Downloads')}>
              <Feather name="download" size={24} color="#0DD6C0" />
              <Text style={styles.font}>Downloads</Text>
            </Pressable>
            <Pressable
              style={styles.icon}
              onPress={() => navigation.navigate('Apks')}>
              <Text
                style={{
                  color: '#06FE19',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                APK
              </Text>
              <Text style={styles.font}>Installation Files</Text>
            </Pressable>
          </View>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={styles.title}>Storage</Text>
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
              marginLeft: 30,
              marginTop: 10,
            }}>
            Recycle Bin
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('RecycleBin')}>
            <View
              style={{
                ...styles.row,
                marginLeft: 20,
                marginBottom: 10,
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
    width: '100%',
  },

  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    marginRight: 50,
  },
  TopBody: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
  },
  BottomBody: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    padding: 2,
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

  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'grey',
    textAlign: 'left',
    marginLeft: 5,
    marginTop: 8,
  },

  rowIcon: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },

  columnIcon: {
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  icon: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 25,
    borderRadius: 10,
    width: '27%',
    paddingVertical: 20,
  },

  font: {
    fontSize: 10,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    marginTop: 4,
  },

  list: {
    marginRight: 20,
    marginLeft: 20,
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
    marginRight: 20,
    marginLeft: 20,
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

  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
    fontWeight: 'bold',
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
});

export default Uploads;
