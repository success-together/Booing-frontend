import React from "react";
import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import { small_logo } from "../../../../images/export";
import { Input } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
            color="grey"
            style={{ marginLeft: 1 }}
          />
          <TextInput style={styles.input} placeholder="Search" placeholderTextColor="grey" backgroundColor="white" />
        </View>
        <MaterialIcons name="filter-list" size={24} color="white" />
        <MaterialIcons name="arrow-downward" size={24} color="white" />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    borderColor: "white",
    marginRight: 50,
    width: "58%",
    height: 60
  },
  TransactionsHeader: {
    position: "absolute",
    top: 35,
    flex:1
  },
  topBar: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 35,
    height: 20,
    marginLeft: 8
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    marginLeft: 60,
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
    backgroundColor: "white",
    borderRadius: 10,
    width: "75%",
    height: 60,
  },
  bottomBar: {
    justifyContent: "space-between",
    alignItems: "center",
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
