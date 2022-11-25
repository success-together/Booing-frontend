import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Logo } from "../../images/export";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

function Home({navigation} :{navigation: any}) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={Logo} />
      <View style={styles.containerButtons}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.text}>Login</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.text}>Get started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33a1f9",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    alignItems: "center",
    justifyContent: "center",
  },

  containerButtons: {
    // flex: 2,
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    // marginBottom: 36,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
  },

  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },

  // inputView: {
  //   backgroundColor: "#FFC0CB",
  //   borderRadius: 30,
  //   width: "70%",
  //   height: 45,
  //   marginBottom: 20,

  //   alignItems: "center",
  // },

  // TextInput: {
  //   height: 50,
  //   flex: 1,
  //   padding: 10,
  //   marginLeft: 20,
  // },

  // forgot_button: {
  //   height: 30,
  //   marginBottom: 30,
  // },

  // loginBtn: {
  //   width: "80%",
  //   borderRadius: 25,
  //   height: 50,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginTop: 40,
  //   backgroundColor: "#FF1493",
  // },
});

export default Home;
