import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { Input } from "react-native-elements";
import { Logo } from "../../../images/export";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { login } from "../../../shared/slices/Auth/AuthService";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { SocialMediaAuth } from "../../../Components/exports";



const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  

  // useEffect(() => {
  //   initAsync();
  // });

  // const androidClientId =
  //   "88763342486-sft6g189hap7tq40nudsnakmtmpojuac.apps.googleusercontent.com";
  // const iosClientId =
  //   "88763342486-m40eis09co1ee1mptdi6vkbqhndsfigr.apps.googleusercontent.com";

  // const initAsync = async () => {
  //   try {
  //     await GoogleSignIn.initAsync({
  //       clientId: Platform.OS === "android" ? androidClientId : iosClientId,
  //     });
  //     getUserDetails();
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  // const getUserDetails = async () => {
  //  const user = await GoogleSignIn.signInSilentlyAsync();
  //   console.log(user);
  // }

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await GoogleSignIn.askForPlayServicesAsync();
  //     const {type , user } = await GoogleSignIn.signInAsync();
  //     if (type === "success") {
  //       getUserDetails();
  //     }else {
  //       console.log('Google sign in canceled');
  //     }
  //   } catch (error) {
      
  //   }
  // }

  // const handleGoogleSignIn = () => {
  //   const config = {androidClientId: '931842948015-er4cppa2rqr5u3ab73siadifbs3vhlnh.apps.googleusercontent.com',
  // scopes: ['profile', 'email']}
  // Google.logInAsync
  // }

  const submit = async () => {
    if (email && password)
      await login({ email, password }).then((res) => {
        console.log(res);
        navigation.navigate("DashboardContainer");
      });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </View>
      <View style={{ flex: 0.1 }} />
      <Input
        placeholder="Enter Email Adress"
        autoCompleteType={"email"}
        onChangeText={(e) => setEmail(e)}
      />
      <Input
        placeholder="Enter Password"
        autoCompleteType={"password"}
        secureTextEntry={true}
        onChangeText={(e) => setPassword(e)}
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
      <Text
        style={styles.createAccount}
        onPress={() => navigation.navigate("Register")}
      >
        Create an account
      </Text>
      <SocialMediaAuth navigation = {navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: "center",
    color: "#33a1f9",
    justifyContent: "center",
    height: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerImage: {
    backgroundColor: "#33a1f9",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#33a1f9",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginBottom: 50,
  },
  containerSocialMedia: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Login;
