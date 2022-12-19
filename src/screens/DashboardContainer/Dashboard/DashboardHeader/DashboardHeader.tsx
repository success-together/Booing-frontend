import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { small_logo } from "../../../../images/export";



const DashboardHeader = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.DashboardHeader}>
      <View style={styles.topBar}>
        <Image style={styles.image} source={small_logo} />
        <Text style={styles.BooingTitle}>BOING BALANCE</Text>
        <Ionicons name="search" size={24} color="white" />
      </View>
      <View style={styles.coins}>
        <Text style={styles.title}>12.003 Boo</Text>
        <Text style={styles.title}>12 | +E 56.03</Text>
      </View>
      <View style={styles.bottomBar}>
        <Pressable style={styles.column} onPress={()=> {navigation.navigate('BuySpace')}}>
          <Entypo name="plus" size={35} color="white" />
          <Text style={styles.txt}>Buy Space</Text>
        </Pressable>
        <Pressable style={styles.column} onPress={()=> {navigation.navigate('SellSpace')}}>
          <Entypo name="minus" size={35} color="white" />
          <Text style={styles.txt}>Sell Space</Text>
        </Pressable>
        <View style={styles.column}>
          <MaterialCommunityIcons name="offer" size={35} color="white" />
          <Text style={styles.txt}>Offer</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  DashboardHeader: {
    position: "absolute",
    top: 35,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 35,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 30,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    marginLeft: 70,
    marginRight: 70,
    textAlign: "center",
  },
  coins: {
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  txt: {
    marginTop: 0,
    color: "white",
    fontSize: 14,
    lineHeight: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
  BooingTitle: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    marginLeft: 70,
    marginRight: 70,
    textAlign: "center",
  },
});

export default DashboardHeader;
