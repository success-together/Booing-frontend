import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, View, Image, Dimensions, TouchableOpacity, Modal } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import { store } from "../../../shared";
import AccountHeader from "./AccountHeader/AcountHeader";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign"
import { Logout } from "../../Authentication/Logout/Logout";
import { securityPng, userGroupPng } from "../../../images/export";
import {SmartSyncService} from '../../../shared/slices/Devices/DevicesService';
import ManageApps from '../../../utils/manageApps';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
import useSocket from '../../../shared/socket';
import PushNotification from 'react-native-push-notification';

let stop = false;
const Account = ({ navigation }: { navigation: any }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProcess, setSyncProcess] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const user_id = store.getState().authentication.userId;
  const WIDTH = Dimensions.get('window').width;
  const {createOffer}  = useSocket();


  const smartSync = () => {
    console.log('smartSync')

    console.log('smartSync', user_id)
    setSyncProcess('');
    setSyncing(true);
    stop = false;
    SmartSyncService(user_id).then(async (res)=> {
      const fragments = res.data;
      const total = fragments.length;
      if (total) {
        setSyncProcess(`Your device have ${total} fragments.`);
        const missedFragments = [];
        for (let i = 0; i < fragments.length; i++) {
          const filename = `${fragments[i]['fragmentID']}-${fragments[i]['uid']}-${fragments[i]['user_id']}.json`
          const exist = await ManageApps.isFileExist(filename);
          if (!exist) missedFragments.push(fragments[i]);
          setSyncProcess(`fetching fragments in your device. ${i+1}/${total}`);
          if (stop) {console.log('stop'); setSyncing(false); return ;}
          // console.log('fetchButton')
        }
        for (let i = 0; i < missedFragments.length; i++) {
          setSyncProcess(`fetching missed fragments. ${i+1}/${missedFragments.length}`);
          const filename = `${missedFragments[i]['fragmentID']}-${missedFragments[i]['uid']}-${missedFragments[i]['user_id']}.json`
          let buffer = "";
          for (let j = 0; j < missedFragments[i]['devices'].length; j++) {
            const success = new Promise((resolve, reject) => {
              const device_id = missedFragments[i]['devices'][j]['device_id'];
              createOffer(device_id, filename, missedFragments[i]['fragmentID'], function(res) {
                if (res === false) {
                  resolve(false);
                } else {
                  buffer += res;
                  resolve(true);
                }
              })
            })
            state = await success;
            console.log('--------------------------------', state, '--------------------------------')
            if (state) {
              await ManageApps.saveFile(filename, buffer);
              break;
            } else {
              console.log( 'failed', filename)
            }
            if (stop) {
              setSyncProcess('');
              setSyncing(false);
              return ;
            }
          }
        }
        Toast.show({
          type: 'success',
          text1: `Your device have ${total} fragments.`
        })
        setSyncing(false);
      } else {
        setSyncing(false);
      }
    }).catch(err=> {
      console.log(err)
    })
  }

  const handleLogout = () => {
    setModalVisible(true)
  }

  const handleConfirm = () => {
    Logout(navigation)
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <AccountHeader />
      </View>
      {syncing?(
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
        }}>
          <Progress.Circle size={WIDTH/5} borderWidth={5} indeterminate={true} />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: 'black',
              fontWeight: '500',
            }}>
            {syncProcess}
          </Text>
          <TouchableOpacity
            style={{
              width: 82,
              height: 49,
              backgroundColor: '#33a1f9',
              color: '#FFFFFF',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
            onPress={() => stop = true}>
            <Text style={{color: '#FFFFFF', fontWeight: '500'}}>Abort</Text>
          </TouchableOpacity>            
        </View>
      ):(
        <ScrollView style={styles.scrollView}>
          <View style={styles.containerBody}>
            <View style={styles.sectionView}>
              <Text style={styles.title}>Personal</Text>
              <View>
                <Pressable
                  style={[styles.button, {borderTopLeftRadius: 10, borderTopRightRadius: 10}]}
                  onPress={() => navigation.navigate("UpdateProfile")}
                >
                  <View style={{ flexDirection: "row" }}>
                    <AntDesign
                      style={styles.icon}
                      name="user"
                      size={20}
                      color="#CED5D8"
                    />
                    <Text style={styles.text}>Profile</Text>
                  </View>

                  <MaterialIcons
                    style={{ marginRight: 8 }}
                    name="arrow-forward-ios"
                    size={20}
                    color="#CED5D8"
                  />
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => navigation.navigate("UpdatePassword")}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image 
                      source={securityPng} 
                      style={styles.icon} 
                      size={20}
                      color="#CED5D8"
                    />
                    <Text style={styles.text}>Security</Text>
                  </View>

                  <MaterialIcons
                    style={{ marginRight: 8 }}
                    name="arrow-forward-ios"
                    size={20}
                    color="#CED5D8"
                  />
                </Pressable>
                <Pressable
                  style={[styles.button, {borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}
                  onPress={() => navigation.navigate("InviteFriends")}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image 
                      source={userGroupPng} 
                      style={styles.icon} 
                      size={20}
                      color="#CED5D8"
                    />
                    <Text style={styles.text}>Invite Friends</Text>
                  </View>

                  <MaterialIcons
                    style={{ marginRight: 8 }}
                    name="arrow-forward-ios"
                    size={20}
                    color="#CED5D8"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.sectionView}>
              <Text style={styles.title}>Synchronization</Text>
              <Pressable style={styles.button} onPress={smartSync}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="dots-square"
                    size={20}
                    color="#CED5D8"
                  />
                  <Text style={styles.text}>Smart sync</Text>
                </View>
           {/*     <Switch
                             trackColor={{ false: "#767577", true: "#33a1f9" }}
                             thumbColor={isEnabled ? "#33a1f9" : "#f4f3f4"}
                             ios_backgroundColor="#33a1f9"
                             onValueChange={toggleSwitch}
                             value={isEnabled}
                           />*/}
              </Pressable>
              <Pressable style={[styles.button, {borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]} onPress={() => navigation.navigate("RegistredDevices")}>
                <View style={{ flexDirection: "row" }}>
                  <Octicons
                    style={styles.icon}
                    name="device-mobile"
                    size={20}
                    color="#CED5D8"
                  />
                  <Text style={styles.text}>Registered devices</Text>
                </View>
                {/* <Text
                  style={{
                    marginRight: 10,
                fontFamily: 'Rubik-Bold', fontSize: 16,
                    color: "#CED5D8",
                  }}
                >
                
                </Text> */}
              </Pressable>
              {/* <Pressable style={styles.button}>
                <View style={{ flexDirection: "row" }}>
                  <Entypo
                    style={styles.icon}
                    name="icloud"
                    size={20}
                    color="#CED5D8"
                  />
                  <Text style={styles.text}>Backups</Text>
                </View>

                <MaterialIcons
                  style={{ marginRight: 8 }}
                  name="arrow-forward-ios"
                  size={20}
                  color="#CED5D8"
                />
              </Pressable> */}
            </View>
            {/*<View style={styles.sectionView}>
              <Text style={styles.title}>Account information</Text>
              <Pressable style={[styles.button, {borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]} onPress={() => navigation.navigate("Booingcoin")}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    style={styles.icon}
                    name="compare-arrows"
                    size={20}
                    color="#CED5D8"
                  />
                  <Text style={styles.text}>History</Text>
                </View>

                <MaterialIcons
                  style={{ marginRight: 8 }}
                  name="arrow-forward-ios"
                  size={20}
                  color="#CED5D8"
                />
              </Pressable>
            </View>*/}
            <View style={styles.sectionView}>
              <Pressable style={[styles.button, {borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]} onPress={() => { handleLogout()}}>
                <View style={{ flexDirection: "row" }}>
                  <AntDesign
                    style={styles.icon}
                    name="logout"
                    size={20}
                    color="#CED5D8"
                  />
                  <Text style={styles.text}>Logout</Text>
                </View>

              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to</Text>
            <Text style={styles.modalText}>log out?</Text>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Pressable
                style={[styles.modalbutton, styles.buttonCancel]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={[styles.textStyle, {color: '#2196F3'}]}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.modalbutton, styles.buttonOk]}
                onPress={() => handleConfirm()}>
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7F8",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerHeader: {
    backgroundColor: "#33a1f9",
    width: "100%",
    // flex: 0.5,
  },
  containerBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    marginTop: 10
  },
  sectionView: {
    width: "100%",
    padding: 8,
  },
  syncronisationView: {
    flex: 0.5,
  },
  button: {
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: 54,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#9F9EB3",
    // marginTop: 5,
    marginBottom: 8,
    marginLeft: 8,
    // marginRight: 70,
    textAlign: "left",
  },
  text: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "black",
    marginLeft: 14,
  },
  icon: {
    marginLeft: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalbutton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: 80
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonCancel: {
    borderWidth: 1, 
    borderColor: '#2196F3',
    backgroundColor: '#fff',
  },
  buttonOk: {
    backgroundColor: '#2196F3',
    marginLeft: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 20,
  },  
});

export default Account;
