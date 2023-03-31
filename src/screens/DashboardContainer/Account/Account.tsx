import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, View, Image } from "react-native";
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
const Account = ({ navigation }: { navigation: any }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);


  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <AccountHeader />
      </View>
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
{/*            <Pressable style={styles.button}>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name="dots-square"
                  size={20}
                  color="#CED5D8"
                />
                <Text style={styles.text}>Smart sync</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#33a1f9" }}
                thumbColor={isEnabled ? "#33a1f9" : "#f4f3f4"}
                ios_backgroundColor="#33a1f9"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </Pressable>*/}
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
          <View style={styles.sectionView}>
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
          </View>
          <View style={styles.sectionView}>
            <Pressable style={[styles.button, {borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]} onPress={() => { Logout(navigation) }}>
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
});

export default Account;
