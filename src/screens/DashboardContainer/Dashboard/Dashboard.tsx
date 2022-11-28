import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Image, Input} from 'react-native-elements';
import {DashboardHeader} from '../../exports';
import {
  getFreeDiskStorageAsync,
  getTotalDiskCapacityAsync,
} from 'expo-file-system';
import * as Device from 'expo-device';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getFSInfo} from 'react-native-fs';
import bytes from 'bytes';



const Dashboard = ({navigation}: {navigation: any}) => {
  const [freeDiskStorage, setFreeDiskSotrage] = useState<number>(0);
  const [totalDiskStorage, setTotalDiskStorage] = useState<number>(0);
  const [freeSpacePerCent, setFreeSpacePerCent] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const {freeSpace, totalSpace} = await getFSInfo();
      setFreeDiskSotrage(freeSpace);
      setTotalDiskStorage(totalSpace);
      setFreeSpacePerCent(freeSpace * 100 / totalSpace);
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
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="green">
              {fill => (
                <Text>{fill.toFixed(2) + '%'}</Text>
              )}
            </AnimatedCircularProgress>
          </>
          <View style={styles.storageInfoContainer}>
            <Text style={styles.txtStorage}>Storage Details</Text>
            <Text style={styles.createAccount}>
              {bytes(freeDiskStorage)} of {bytes(totalDiskStorage)}
            </Text>
          </View>
          <Pressable
            style={styles.scanContainer}
            onPress={() => navigation.navigate("ClearData", {freeDiskStorage})}
          >
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
