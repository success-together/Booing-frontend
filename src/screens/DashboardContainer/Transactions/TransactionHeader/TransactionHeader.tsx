import React from "react";
import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import { small_logo } from "../../../../images/export";
import { Input } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import  Feather from "react-native-vector-icons/Feather";
import  Ionicons from "react-native-vector-icons/Ionicons";
import  MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import   MaterialIcons from "react-native-vector-icons/MaterialIcons";

const TransactionsHeader = () => {
  return (
    <View style={styles.TransactionsHeader}>
      <View style={styles.topBar}>
        <Image style={styles.image} source={small_logo} />
        <Text style={styles.title}>TRANSACTIONS</Text>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.row}>
          <Feather
            name="search"
            size={20}
            color="white"
            style={{ marginLeft: 1 }}
          />
          <TextInput style={styles.input} placeholder="Search" />
          <MaterialIcons name="filter-list" size={24} color="white" />
          <MaterialIcons name="arrow-downward" size={24} color="white" />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    width: 250,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "white",
    backgroundColor: "white",
    marginRight: 50,
  },
  TransactionsHeader: {
    position: "absolute",
    top: 10,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 35,
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  image: {
    width: 35,
    height: 20,
    marginRight: 75,
    marginLeft: 20,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    justifyContent: "space-evenly",
    textAlign: "center",
  },
  coins: {
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  txt: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
});

export default TransactionsHeader;
